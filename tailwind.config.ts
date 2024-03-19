import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    fontFamily: {
      "poppins": ["Poppins", "sans-serif"],
    },
    colors: {
      "dark": "#1E1E1E",
      "light": "#F9F9F9",
      "grey-10": "#ECECEC",
      "grey": "#E2E2E2",
      "spotify-green": "#1DB954",
      "pink": "#FF6392",
      "yellow": "#FFE45E",
      "blue": "#7FC8F8",
    },
  },
  plugins: [],
}
export default config
