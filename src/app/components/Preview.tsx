"use client";

import Image from "next/image";
import { TimeRange, ShareType, Tab, PreviewTheme } from "types";
import { Artist, Track, Thumbnail } from "api_types";
import Vinyl from "app/components/Vinyl";

export const DOWNLOAD_TARGET_ID = "download-target";

const getTimeRangeString = (range: TimeRange) => {
  switch (range) {
    case TimeRange.SHORT: return "last month";
    case TimeRange.MEDIUM: return "last 6 months";
    case TimeRange.LONG: return "all time";
  }
}

interface PreviewConfig {
  tab: Tab;
  shareType: ShareType;
  timeRange: TimeRange;
  theme: PreviewTheme;
};

interface PreviewProps {
  items: Artist[] | Track[];
  config: PreviewConfig;
}

export default function Preview({ items, config }: PreviewProps) {
  if (items.length == 0) {
    return <div>NO ITEMS</div>
  }
  return (
    <div className="mx-auto w-auto h-screen sm:h-full aspect-[9/16] rounded-xl overflow-clip order-1 sm:order-2">
      <div className="h-full w-full" id={ DOWNLOAD_TARGET_ID } style={{ backgroundColor: config.theme.bgColor }}>
        { config.shareType === ShareType.TOP_ONE &&
          <TopPreview
            item={ items[0] }
            config={ config }
          />
        }
        { config.shareType === ShareType.TOP_THREE &&
          <TopNPreview
            items={ items.slice(0, 3) }
            config={ config }
          />
        }
        { config.shareType === ShareType.TOP_FIVE &&
          <>
            { /*
              // TODO: What happens if there are less than five artists?
            */ }
            <TopNPreview
              items={ items.slice(0, 5) }
              config={ config }
            />
          </>
        }
        { config.shareType === ShareType.COLLAGE &&
          <CollagePreview
            images={
              items.slice(0, 40).map(item => {
                // TODO: Figure out if this actually needs to be sorted or if
                // the API returns a sorted array by default. 
                // Get the lowest resolution image
                // TODO: Change this back to a.width - b.width
                return item.images.sort((a, b) => b.width - a.width)[0]
              })
            }
            config={ config }
          />
        }
      </div>
    </div>
  );
}

interface CollagePreviewProps {
  images: Thumbnail[],
  config: PreviewConfig,
}

// function customImageLoader({ src: string, width: number, quality }) {
//   return `${src}?w=${width}&q=${quality || 50}`;
// }

function CollagePreview({ images, config }: CollagePreviewProps) {
  return (
      <div className="w-full h-full flex flex-col">
        { images.length > 0 &&
          <div className="flex-shrink h-full grid grid-cols-5 grid-auto-rows">
            { images.map((image, i) => {
              return (
                <div key={ i } className="relative">
                  <img
                    className="cover aspect-square w-full"
                    src={ image.url }
                    alt=""
                  />
                  {/*
                  <Image
                    src={ image.url }
                    loader={ customImageLoader }
                    fill
                    alt=""
                    sizes="100%"
                    priority
                  />
                  */}
                </div>
              )
            })}
          </div>
        }
        <div className="h-full flex justify-between items-center px-4">
          <h6
            className="text-xs font-bold px-2 py-px rounded-full"
            style={{
              backgroundColor: config.theme.accentColor,
              color: config.theme.textColorOnAccent,
            }}
          >
            { `Top ${images.length} ${config.tab}`.toUpperCase() }
          </h6>
          <h6 className="text-xs font-bold opacity-40" style={{ color: config.theme.textColorOnBg }}>
            { getTimeRangeString(config.timeRange).toUpperCase() }
          </h6>
        </div>
      </div>
  );
}

interface TopPreviewProps {
  item: Artist | Track,
  config: PreviewConfig,
}

function TopPreview({ item, config }: TopPreviewProps) {
  return (
    <div
      className="relative w-full h-full grid grid-rows-3 grid-cols-1 grid-flow-row justify-center items-center"
      style={{
        backgroundImage: `url(${item.images[0].url})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="absolute top-0 left-0 h-full w-full bg-dark opacity-80 z-[1]"/>
      <div className="w-full overflow-hidden text-center px-8 z-[2]">
        <h4 className="w-full text-light overflow-hidden whitespace-nowrap text-ellipsis">
          TOP { config.tab === Tab.ARTISTS ? "ARTIST" : "SONG" }
        </h4>
        <p className="w-full text-xs text-grey-20 -mt-[4px] overflow-hidden whitespace-nowrap text-ellipsis">
          { getTimeRangeString(config.timeRange) }
        </p>
      </div>
      <div className="relative aspect-square w-full z-[2] flex justify-center items-center">
        <div className="w-1/2">
          <Vinyl item={ item } />
        </div>
        {/*
        <Image
          className="relative z-[2]"
          src={ item.images[0].url }
          fill
          alt=""
          sizes="100%"
          priority
        />
        <img
          className="cover"
          src={ image.url }
        />
        */}
      </div>
      <div className="w-full overflow-hidden text-center px-8 relative z-[2]">
        <h5 className="w-full text-light line-clamp-1">
          { item.name }
        </h5>
        { "artists" in item &&
          <p className="w-full text-xs text-grey-20 -mt-[4px] overflow-hidden whitespace-nowrap text-ellipsis">
            { item.artists.map(artist => artist.name).join(" • ") }
          </p>
        }
      </div>
    </div>
  );
}

interface TopNPreviewProps {
  items: Track[] | Artist[];
  config: PreviewConfig;
}

function TopNPreview({ items, config }: TopNPreviewProps) {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="text-light mx-auto my-6 text-center">
        <div className="relative">
          <h4
            className="relative z-[2] mx-px"
            style={{
              color: config.theme.secondaryTextColor,
            }}
          >
            { `My top ${config.tab === Tab.ARTISTS ? "artists" : "songs"}`.toUpperCase()}
          </h4>
          { /*
          <div className="w-full h-[7px] bg-spotify-green absolute top-[15px] z-1 bg-gradient-to-br from-pink to-yellow"/>
          */ }
        </div>
        <p
          className="text-light text-xs -mt-[4px] opacity-40"
          style={{
            color: config.theme.secondaryTextColor,
          }}
        >
          { `${getTimeRangeString(config.timeRange)}` }
        </p>
      </div>
      <div className="flex-grow grid grid-rows-auto grid-cols-1 row-start-2 row-end-3">
        { items.map((item, i) => {
          const bgStyle = {
            backgroundImage: `url(${item.images[0].url})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          };
          return (
            <div key={ i } className="relative px-4 flex justify-center" style={ bgStyle }>
              <div className="my-auto overflow-hidden relative z-[2] text-center">
                <h4 className="text-light overflow-hidden whitespace-nowrap text-ellipsis">{ item.name }</h4>
                { "artists" in item &&
                  <p className="text-xs text-light -mt-[4px] overflow-hidden whitespace-nowrap text-ellipsis">
                    { item.artists.map(artist => artist.name).join(" • ") }
                  </p>
                }
              </div>
              <div className="w-full h-full bg-dark opacity-40 absolute top-0 left-0 z-[1]" />
            </div>
          );
        })}
      </div>
    </div>
  )
}
