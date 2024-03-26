enum AlbumType {
  ALBUM = "album",
  SINGLE = "single",
  COMPILATION = "compilation",
}

interface Album {
  id: string;
  name: string;
  uri: string;
  type: AlbumType;
}

interface Thumbnail {
  height: number;
  width: number;
  url: string;
}

interface SimplifiedArtist {
  id: string;
  name: string;
  uri: string;
}

interface Artist {
  id: string;
  name: string;
  uri: string;
  genres: string[];
  images: Thumbnail[];
}

interface Track {
  id: string;
  name: string;
  uri: string;
  album: Album;
  artists: SimplifiedArtist[];
  images: Thumbnail[];
}

export {
  AlbumType,
  type Album,
  type Thumbnail,
  type SimplifiedArtist,
  type Artist,
  type Track,
};
