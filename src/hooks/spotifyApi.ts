import { useState, useEffect, useCallback } from "react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { randomBytes } from "crypto";
import { Artist, Track } from "api_types";

const BASE_SPOTIFY_URL = "https://api.spotify.com/v1/"

type SpotifyDataHookResponse<T> = [T[], SpotifyApiError | null, boolean, (config: AxiosRequestConfig) => void];

interface SpotifyApiItem {
  type: string,
  name: string,
  id: string,
  uri: string,
  images: object[],
  genres?: string[],
  album?: {
    id: string,
    name: string,
    uri: string,
    album_type: string,
    images: object[]
  },
  artists?: {
    id: string,
    name: string,
    uri: string,
  }[],
}

interface SpotifyApiError {
  status: number,
  message: string,
}

type SpotifyApiResponse = {
  items: SpotifyApiItem[]
};

export function useSpotifyApi<T>(path: string): SpotifyDataHookResponse<T> {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<SpotifyApiError | null>(null);

  const fetchData = useCallback(async (opts?: AxiosRequestConfig) => {
    setIsLoading(true);
    try {
      const url = BASE_SPOTIFY_URL + path;
      const response: AxiosResponse<SpotifyApiResponse> = await axios.get(url, opts);
      setData(response.data.items.map(item => {
        if (item["type"] === "artist") {
          return {
            id: item["id"],
            name: item["name"],
            uri: item["uri"],
            genres: item["genres"],
            images: item["images"],
          } as T;
        } else if (item["type"] === "track") {
          return {
            id: item["id"],
            name: item["name"],
            uri: item["uri"],
            album: {
              id: item["album"]?.id,
              name: item["album"]?.name,
              uri: item["album"]?.uri,
              type: item["album"]?.album_type,
            },
            artists: item["artists"],
            images: item["album"]?.images
          } as T;
        }
      }) as T[]);
    } catch (error) {
      setError(error as SpotifyApiError);
    }
    setIsLoading(false);
  }, [path]);

  return [ data, error, isLoading, fetchData ];
};

export type SpotifyAuthResponse = [string, string, number, () => void];

export function useSpotifyAuth(redirect_uri: string, scope: string): SpotifyAuthResponse {
  const generateRandomState = (): string => randomBytes(8).toString('hex');

  const spotifyAuthUri = "https://accounts.spotify.com/authorize?" +
    `client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&` +
    `redirect_uri=${redirect_uri}&` +
    `scope=${scope}&` +
    "response_type=token&" +
    `state=${generateRandomState()}`;

  const [accessToken, setAccessToken] = useState<string>("");
  const [expiresAt, setExpiresAt] = useState<number>(-1);

  useEffect(() => {
    // Try getting existing token from local storage.
    // TODO: Check if existing token is expired and if so, overwrite it.
    let storedToken = window.localStorage.getItem("token");
    let expiry = window.localStorage.getItem("expires_at");
    if (storedToken && !accessToken) {
      // If token is available in local storage but not in state, update the
      // state with the value from local storage.
      setAccessToken(storedToken);
      setExpiresAt(Number(expiry));
    }

    // Get new access token from hash.
    const hash = window.location.hash;
    if (!storedToken && hash) {
      const hashPairs = hash.substring(1).split("&");
      let hashParams: Record<string, string | number> = {};
      hashPairs.forEach(kvPair => {
        let [k, v] = kvPair.split("=");
        if (k === "expires_in") {
          hashParams["expires_at"] = Date.now() + (Number(v) * 1000);
        } else {
          hashParams[k] = v;
        }
      });
      window.location.hash = "";
      window.localStorage.setItem("token", hashParams["access_token"] as string);
      window.localStorage.setItem("expires_at", hashParams["expires_at"] as string)
      setAccessToken(hashParams["access_token"] as string);
      setExpiresAt(hashParams["expires_at"] as number);
    }
  }, [accessToken]);

  const onLogout = useCallback(() => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("expires_at");
    setAccessToken("");
    setExpiresAt(-1);
  }, []);

  return [ spotifyAuthUri, accessToken, expiresAt, onLogout ]
}
