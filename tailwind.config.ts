import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: { DEFAULT: "#f7f2ec", 2: "#fbf7f2", 3: "#efe7dd" },
        ink:   { DEFAULT: "#1d1715", 2: "#4a3f3a", 3: "#8a7d76" },
        rule:  { DEFAULT: "#d9cec3", 2: "#e6ddd2" },
        wine:  { DEFAULT: "#7a1d2e", 2: "#9a2a3d", soft: "#f3e0e3" },
        rose:  { DEFAULT: "#f1c9cf", ink: "#2a1a1d" },
        sidebar: "#1d1715",
        ok:   "#2f6b46",
        warn: "#a96a13",
        err:  "#b3322c",
      },
      fontFamily: {
        sans:  ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono:  ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        sm: "4px", md: "6px", lg: "10px",
      },
    },
  },
  plugins: [],
};

export default config;
