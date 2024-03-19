import React from "react";
import Image from "next/image";
import { Artist, Track } from "api_types.ts";

interface ItemListProps {
  items: ([Artist] | [Track]);
}

export default function ItemList({ items }) {
  return (
    <div className="grid grid-cols-[auto_50px_1fr] grid-rows-auto gap-y-4 gap-x-2 px-2">
      { items.map((item, i) => {
        return (
          <React.Fragment key={ i }>
            <h4 className="text-center my-auto">{ i + 1 }</h4>
            <div className="relative aspect-square">
              <Image
                src={ item.images[0].url }
                fill
                sizes="(width: 50px)"
                alt={ `Thumbnail for ${item.name}`}
                sizes="100%"
              />
            </div>
            { item.artists
              ? <div className="overflow-hidden">
                  <h4 className="text-left my-auto overflow-hidden whitespace-nowrap text-ellipsis">{ item.name }</h4>
                  <p className="text-dark text-sm opacity-40 -mt-[2px]">{ item.artists.map(artist => artist.name).join(" • ") }</p>
                </div>
              : <h4 className="text-left my-auto overflow-hidden whitespace-nowrap text-ellipsis">{ item.name }</h4>
            }
          </React.Fragment>
        );
      })}
    </div>
  );
}
