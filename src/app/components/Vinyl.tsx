import Image from "next/image";
import { Track, Artist } from "api_types";

interface VinylProps {
  item: Track | Artist;
};

export default function Vinyl({ item }: VinylProps) {
  return (
    <div className="w-full aspect-square flex flex-row relative">
      <Image
        src={ item.images[0].url }
        fill
        alt=""
        sizes="100%"
        priority
      />
    </div>
  );
}
