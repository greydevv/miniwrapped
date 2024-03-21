"use client";

import html2canvas from "html2canvas";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useState, useEffect } from "react";
import { toJpeg, toBlob } from "html-to-image";
import FileSaver from "file-saver";

import Loading from "app/components/Loading";
import Client from "client.ts";
import { useSpotifyAuth, useSpotifyApi } from "hooks/spotifyApi.ts";
import { TopArtist, Thumbnail, Tab, TimeRange, ShareType, PreviewThemeOptions, previewTheme } from "types.ts";
import Navbar from "app/components/navigation";
import StatisticsTab from "app/components/StatisticsTab";
import ItemList from "app/components/ItemList";
import Dropdown, { DropdownOptions } from "app/components/Dropdown";
import Preview, { DOWNLOAD_TARGET_ID } from "app/components/Preview";

export default function Home() {
  const IMG_DIM = 50;
  const SCOPE = "user-read-private user-read-email user-top-read";
  const REDIRECT_URI = "http://localhost:3000";

  // Filters
  const [limit, setLimit] = useState<Number>(50);
  const [tab, setTab] = useState<Tab>(Tab.ARTISTS);
  const [range, setRange] = useState<TimeRange>(TimeRange.LONG);
  const [shareType, setShareType] = useState<ShareType>(ShareType.TOP_ONE);
  const [theme, setTheme] = useState<PreviewThemeOptions>(PreviewThemeOptions.DARK);

  // Spotify API Hooks
  const [spotifyAuthUri, accessToken, expiresAt, onLogout] = useSpotifyAuth(REDIRECT_URI, SCOPE);
  const [tracks, tracksError, tracksLoading, fetchTracks] = useSpotifyApi<([Artist] | [Track])>("me/top/tracks");
  const [artists, artistsError, artistsLoading, fetchArtists ] = useSpotifyApi<([Artist] | [Track])>("me/top/artists");
  const [items, setItems] = useState<[Artist | Track]>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [downloadLoading, setDownloadLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(artistsLoading || tracksLoading);
  }, [artistsLoading, tracksLoading]);

  useEffect(() => {
    switch (tab) {
      case Tab.ARTISTS: {
        if (artists) {
          setItems(artists);
        }
        break;
      }
      case Tab.TRACKS: {
        if (tracks) {
          setItems(tracks);
        }
        break;
      }
    }
  }, [tab, tracks, artists]);

  useEffect(() => {
    if (!accessToken) {
      return;
    }
    if (Date.now() > expiresAt) {
      onLogout();
      return;
    }
    switch (tab) {
      case Tab.ARTISTS: {
        fetchArtists({
          headers: {
            "Authorization": `Bearer ${accessToken}`
          },
          params: {
            "time_range": range,
            "limit": limit,
          },
        });
        break;
      }
      case Tab.TRACKS: {
        fetchTracks({
          headers: {
            "Authorization": `Bearer ${accessToken}`
          },
          params: {
            "time_range": range,
            "limit": limit,
          },
        });
        break;
      }
      default: {
        break;
      }
    }
  }, [limit, tab, range, accessToken]);

  const downloadClicked = () => {
    setDownloadLoading(true);
    toBlob(document.getElementById(DOWNLOAD_TARGET_ID))
      .then(function (blob) {
        if (window.saveAs) {
          window.saveAs(blob, 'my-node.png');
        } else {
         FileSaver.saveAs(blob, 'my-node.png');
       }
      })
      .then(function () {
        setDownloadLoading(false);
      });
  };


  const makePrettyShareType = (type: ShareType) => {
    let ty = "";
    switch (tab) {
      case Tab.ARTISTS: {
        ty = "artist";
        break;
      }
      case Tab.TRACKS: {
        ty = "track";
        break;
      }
    }
    switch (type) {
      case ShareType.TOP_ONE: return `Top ${ty}`;
      case ShareType.TOP_THREE: return `Top 3 ${ty}s`;
      case ShareType.TOP_FIVE: return `Top 5 ${ty}s`;
      case ShareType.COLLAGE: return "Collage";
    }
  };

  const makePrettyTimeRange = (range: TimeRange) => {
    switch (range) {
      case TimeRange.SHORT: return "last month";
      case TimeRange.MEDIUM: return "last 6 months";
      case TimeRange.LONG: return "all time";
    }
  };

  const makePrettyTab = (tab: Tab) => {
    switch (tab) {
      case Tab.ARTISTS: return "Artists";
      case Tab.TRACKS: return "Tracks";
    }
  }

  return (
    <div className="grid grid-cols-1 grid-rows-[auto_1fr] min-h-screen sm:h-screen w-screen bg-grey-10 text-dark relative">
      <Navbar
        showLogout={ !!accessToken }
        onLogoutClicked={ onLogout }
      />
      <div className="flex justify-center sm:overflow-hidden">
        <div className="px-4 sm:px-12 md:px-24 py-12 box-border max-w-6xl row-start-2 row-end-3 w-full">
          { !accessToken
            ? <Link className="font-medium text-dark bg-spotify-green rounded-full py-2 px-4 box-border" href={ spotifyAuthUri }>
                Login with Spotify
              </Link>
            : <div className="grid grid-cols-1 grid-rows-[auto_1fr] h-full gap-y-4 sm:gap-y-8">
                <div className="row-start-1 row-end-2 col-start-1 col-end-3 flex flex-col sm:flex-row gap-y-4 sm:gap-y-0 sm:justify-between">
                  <div className="grid grid-rows-2 sm:grid-rows-1 grid-cols-[repeat(2,_auto)] sm:grid-cols-[repeat(4,_auto)] gap-y-4 sm:gap-y-0 gap-x-4">
                    <Dropdown
                      label="Type"
                      value={ tab }
                      opts={ Object.values(Tab).map(e => ({ value: e, text: makePrettyTab(e) }))}
                      onChange={ newTab => setTab(newTab) }
                    />
                    <Dropdown
                      label="Image output"
                      value={ shareType }
                      opts={ Object.values(ShareType).map(e => ({ value: e, text: makePrettyShareType(e) })) }
                      onChange={ newShareType => setShareType(newShareType) }
                    />
                    <Dropdown
                      label="Time frame"
                      value={ range }
                      opts={ Object.values(TimeRange).map(e => ({ value: e, text: makePrettyTimeRange(e) })) }
                      onChange={ newTimeRange => setRange(newTimeRange) }
                    />
                    <Dropdown
                      label="Theme"
                      value={ theme }
                      opts={ Object.values(PreviewThemeOptions).map(e => ({ value: e, text: e })) }
                      onChange={ newTheme => setTheme(newTheme) }
                    />
                  </div>
                  <div className="flex gap-x-4 w-full">
                    { downloadLoading
                      ? <div className="ml-auto w-6 h-6 my-auto"><Loading /></div>
                      : <button
                          className="w-full sm:w-auto sm:mt-auto sm:ml-auto font-medium text-dark bg-spotify-green rounded-full py-2 px-4 box-border"
                          onClick={ downloadClicked }
                        >
                          Download
                        </button>
                    }
                  </div>
                </div>
                { loading
                  ? <div className="row-start-2 row-end-3 col-start-1 col-end-3 w-full h-full flex items-center justify-center">
                      <div className="w-16 h-16">
                        <Loading />
                      </div>
                    </div>
                  : <div className="flex flex-col sm:flex-row gap-y-4 sm:gap-y-0 sm:gap-x-4 overflow-hidden">
                      <div className="overflow-scroll flex-grow order-2 sm:order-1">
                        <ItemList items={ items || [] } />
                      </div>
                      { items &&
                        <Preview
                          items={ items }
                          config={{
                            tab: tab,
                            shareType: shareType,
                            timeRange: range,
                            theme: previewTheme[theme],
                          }}
                        />
                      }
                    </div>
                }
              </div>
          }
        </div>
      </div>
    </div>
  );
}