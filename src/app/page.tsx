"use client";

import html2canvas from "html2canvas";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useState, useEffect } from "react";
import { toJpeg, toBlob } from "html-to-image";
import { saveAs } from "file-saver";

import Loading from "app/components/Loading";
import { useSpotifyAuth, useSpotifyApi } from "hooks/spotifyApi";
import { Thumbnail, Artist, Track } from "api_types";
import { Tab, TimeRange, ShareType, PreviewThemeOptions, previewTheme } from "types";
import Navbar from "app/components/navigation";
import StatisticsTab from "app/components/StatisticsTab";
import ItemList from "app/components/ItemList";
import Dropdown, { DropdownOption } from "app/components/Dropdown";
import Preview, { DOWNLOAD_TARGET_ID } from "app/components/Preview";

export default function Home() {
  const IMG_DIM = 50;
  const SCOPE = "user-read-private user-read-email user-top-read";
  const REDIRECT_URI = process.env.NEXT_PUBLIC_BASE_URL || "";

  // Filters
  const [limit, setLimit] = useState<Number>(50);
  const [tab, setTab] = useState<Tab>(Tab.ARTISTS);
  const [range, setRange] = useState<TimeRange>(TimeRange.LONG);
  const [shareType, setShareType] = useState<ShareType>(ShareType.TOP_ONE);
  const [theme, setTheme] = useState<PreviewThemeOptions>(PreviewThemeOptions.DARK);

  // Spotify API Hooks
  const [spotifyAuthUri, accessToken, expiresAt, onLogout] = useSpotifyAuth(REDIRECT_URI, SCOPE);
  const [tracks, tracksError, tracksLoading, fetchTracks] = useSpotifyApi<Track>("me/top/tracks");
  const [artists, artistsError, artistsLoading, fetchArtists ] = useSpotifyApi<Artist>("me/top/artists");
  const [items, setItems] = useState<Artist[] | Track[]>([]);
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
  }, [limit, tab, range, accessToken, expiresAt, fetchTracks, fetchArtists, onLogout]);

  const downloadClicked = () => {
    setDownloadLoading(true);
    const el = document.getElementById(DOWNLOAD_TARGET_ID);
    if (el) {
      const isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
      if (isSafari) {
        // This is a hacky workaround because the HTML doesn't download
        // properly on Safari. Really not sure how many times I should be
        // calling this, but two works.
        toBlob(el);
      }
      toBlob(el)
        .then(function (blob) {
          if ("saveAs" in window) {
            (window as any).saveAs(blob, 'my-node.png');
          } else {
            if (blob) {
              saveAs(blob, 'my-node.png');
            }
         }
        })
        .then(function () {
          setDownloadLoading(false);
        });
    }
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
                      opts={ Object.values(Tab).map((e): DropdownOption => ({ value: e, text: makePrettyTab(e) }))}
                      onChange={ newTab => setTab(newTab as Tab) }
                    />
                    <Dropdown
                      label="Image output"
                      value={ shareType }
                      opts={ Object.values(ShareType).map((e): DropdownOption => ({ value: e, text: makePrettyShareType(e) })) }
                      onChange={ newShareType => setShareType(newShareType as ShareType) }
                    />
                    <Dropdown
                      label="Time frame"
                      value={ range }
                      opts={ Object.values(TimeRange).map((e): DropdownOption => ({ value: e, text: makePrettyTimeRange(e) })) }
                      onChange={ newTimeRange => setRange(newTimeRange as TimeRange) }
                    />
                    <Dropdown
                      label="Theme"
                      value={ theme }
                      opts={ Object.values(PreviewThemeOptions).map((e): DropdownOption => ({ value: e, text: e })) }
                      onChange={ newTheme => setTheme(newTheme as PreviewThemeOptions) }
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
