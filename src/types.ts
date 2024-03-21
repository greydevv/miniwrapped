enum TimeRange {
  SHORT = "short_term",
  MEDIUM = "medium_term",
  LONG = "long_term",
}

enum Tab {
  ARTISTS = "artists",
  TRACKS = "tracks",
}

enum ShareType {
  TOP_ONE = "top one",
  TOP_THREE = "top three",
  TOP_FIVE = "top five",
  COLLAGE = "collage",
}

enum PreviewThemeOptions {
  DARK = "dark",
  LIGHT = "light",
  PINK = "pink",
  BLUE = "blue",
  YELLOW = "yellow",
  SPOTIFY = "Spotify",
}

interface PreviewTheme {
  bgColor: string;
  accentColor: string;
  textColorOnBg: string;
  textColorOnAccent: string;
  secondaryTextColor: string;
}

const previewTheme: {
  [key: string]: PreviewTheme
} = {
  dark: {
    bgColor: "#1E1E1E",
    accentColor: "#1DB954",
    textColorOnBg: "#F9F9F9",
    textColorOnAccent: "#1E1E1E",
    secondaryTextColor: "#F9F9F9",
  },
  light: {
    bgColor: "#F9F9F9",
    accentColor: "#1DB954",
    textColorOnBg: "#1E1E1E",
    textColorOnAccent: "#1E1E1E",
    secondaryTextColor: "#1E1E1E",
  },
  pink: {
    bgColor: "#FF6392",
    accentColor: "#FF6392",
    textColorOnBg: "#1E1E1E",
    textColorOnAccent: "#1E1E1E",
    secondaryTextColor: "#F9F9F9",
  },
  blue: {
    bgColor: "#7FC8F8",
    accentColor: "#7FC8F8",
    textColorOnBg: "#1E1E1E",
    textColorOnAccent: "#1E1E1E",
    secondaryTextColor: "#F9F9F9",
  },
  yellow: {
    bgColor: "#FFE45E",
    accentColor: "#FFE45E",
    textColorOnBg: "#1E1E1E",
    textColorOnAccent: "#1E1E1E",
    secondaryTextColor: "#1E1E1E",
  },
  Spotify: {
    bgColor: "#1DB954",
    accentColor: "#1DB954",
    textColorOnBg: "#1E1E1E",
    textColorOnAccent: "#1E1E1E",
    secondaryTextColor: "#1E1E1E",
  },
};

export {
  Tab,
  TimeRange,
  ShareType,
  PreviewThemeOptions,
  type PreviewTheme,
  previewTheme,
};
