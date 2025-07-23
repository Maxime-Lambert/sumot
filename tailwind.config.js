/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#555",
        accent: "#999",
        background: "#111",
        surface: "#222",
        correct: "#4caf50",
        wrong: "#f44336",
        almost: "#ffc107",
        "colorblind-correct": "#2e7dba",
        "colorblind-wrong": "#b388eb",
        "colorblind-almost": "#f6b26b",
      },
    },
  },
  plugins: [typography],
  safelist: [
    "rotate-x-0",
    "rotate-x-180",
    "backface-hidden",
    "transform-style-preserve-3d",
    "perspective-1000",
  ],
};
