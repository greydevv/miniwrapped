import Image from "next/image";
import { Track, Artist } from "types.ts";

interface VinylProps {
  item: Track | Artist;
};

export default function Vinyl({ item }: VinylProps) {
  return (
    <div className="h-full w-full aspect-square flex flex-row">
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
