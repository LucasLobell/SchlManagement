import type { Config } from "tailwindcss";

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
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        llSky: "#C3EBFA",
        llSkyLight: "#EDF9FD",
        llPurple: "#CFCEFF",
        llPurpleLight: "#F1F0FF",
        llYellow: "#FAE27C",
        llYellowLight: "#FEFCE8",
      },
    },
  },
  plugins: [],
};
export default config;
