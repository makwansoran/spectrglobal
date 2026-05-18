/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101820",
        muted: "#5c6b7a",
        line: "#d8e0ea",
        canvas: "#f7f9fc",
        surface: {
          DEFAULT: "#ffffff",
          soft: "#f7f9fc",
        },
        plt: {
          black: "#000000",
          nav: "#111111",
        },
        accent: {
          DEFAULT: "#1f6feb",
          glow: "#1158c7",
        },
        positive: "#0d8050",
        negative: "#c23030",
      },
      fontFamily: {
        sans: ["IBM Plex Sans", "system-ui", "sans-serif"],
        display: ["Syne", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-mono", "monospace"],
      },
      animation: {
        "fade-up": "fadeUp 0.55s ease forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
