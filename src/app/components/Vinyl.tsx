import Image from "next/image";
import { Track, Artist } from "api_types";

interface VinylProps {
  item: Track | Artist;
};

export default function Vinyl({ item }: VinylProps) {
  return (
    <div className="w-full aspect-square flex flex-row relative">
      <img
        className="w-full h-full"
        src={ item.images[0].url }
        alt=""
      />
    </div>
  );
}
