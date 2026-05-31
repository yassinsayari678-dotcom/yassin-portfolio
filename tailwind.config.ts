import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#050403",
        espresso: "#160f0b",
        umber: "#2d1f17",
        champagne: "#f3eadb",
        gold: "#c9a45b"
      },
      fontFamily: {
        display: [
          "Didot",
          "Bodoni 72",
          "Bodoni MT",
          "Cormorant Garamond",
          "Georgia",
          "serif"
        ],
        sans: [
          "Inter",
          "Avenir Next",
          "Segoe UI",
          "Arial",
          "sans-serif"
        ]
      }
    }
  },
  plugins: []
};

export default config;
