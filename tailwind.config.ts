import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          forest: "#0a4a36",
          "forest-deep": "#063321",
          "forest-muted": "#0d5c44",
          gold: "#c5a059",
          "gold-muted": "#a68442",
          ivory: "#faf9f6",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-montserrat)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        brand: "0 4px 24px -4px rgba(6, 51, 33, 0.12)",
        "brand-lg": "0 12px 40px -8px rgba(6, 51, 33, 0.18)",
        gold: "0 0 0 1px rgba(197, 160, 89, 0.35), 0 8px 32px -8px rgba(197, 160, 89, 0.25)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
