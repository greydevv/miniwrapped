import { useState, useEffect } from "react";
import axios, { AxiosRequestConfig, AxiosResponseConfig } from "axios";
import { generateRandomState } from "util.ts";

const BASE_SPOTIFY_URL = "https://api.spotify.com/v1/"

export function useSpotifyApi<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<number | null>(null);

  const fetchData = async (opts?: AxiosRequestConfig) => {
    setIsLoading(true);
    try {
      const url = BASE_SPOTIFY_URL + path;
      const response: AxiosResponse<T> = await axios.get(url, opts);
      setData(response.data.items.map(item => {
        if (item["type"] === "artist") {
          return {
            id: item["id"],
            name: item["name"],
            uri: item["uri"],
            genres: item["genres"],
            images: item["images"],
          };
        } else if (item["type"] === "track") {
          return {
            id: item["id"],
            name: item["name"],
            uri: item["uri"],
            album: {
              id: item["album"]["id"],
              name: item["album"]["name"],
              uri: item["album"]["uri"],
              type: item["album"]["album_type"]
            },
            artists: item["artists"],
            images: item["album"]["images"]
          };
        }
      }));
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  };

  return [ data, error, isLoading, fetchData ];
};

export function useSpotifyAuth(redirect_uri: string, scope: string) {
  const spotifyAuthUri = "https://accounts.spotify.com/authorize?" +
    `client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&` +
    `redirect_uri=${redirect_uri}&` +
    `scope=${scope}&` +
    "response_type=token&" +
    `state=${generateRandomState()}`;

  const [accessToken, setAccessToken] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);

  useEffect(() => {
    // Try getting existing token from local storage.
    // TODO: Check if existing token is expired and if so, overwrite it.
    let storedToken = window.localStorage.getItem("token");
    let expiry = window.localStorage.getItem("expires_at");
    if (storedToken && !accessToken) {
      // If token is available in local storage but not in state, update the
      // state with the value from local storage.
      setAccessToken(storedToken);
      setExpiresAt(expiry);
    }

    // Get new access token from hash.
    const hash = window.location.hash;
    if (!storedToken && hash) {
      const hashPairs = hash.substring(1).split("&");
      let hashParams = {};
      hashPairs.forEach(kvPair => {
        let [k, v] = kvPair.split("=");
        if (k === "expires_in") {
          hashParams["expires_at"] = Date.now() + (Number(v) * 1000);
        } else {
          hashParams[k] = v;
        }
      });
      window.location.hash = "";
      window.localStorage.setItem("token", hashParams["access_token"]);
      window.localStorage.setItem("expires_at", hashParams["expires_at"])
      setAccessToken(hashParams["access_token"]);
      setExpiresAt(hashParams["expires_at"]);
    }
  }, []);

  const onLogout = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("expires_at");
    setAccessToken(null);
    setExpiresAt(null);
  };

  return [ spotifyAuthUri, accessToken, expiresAt, onLogout ]
}
