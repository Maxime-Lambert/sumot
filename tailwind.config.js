/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--background-foreground))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },

        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          border: "hsl(var(--secondary-border))",
        },

        error: {
          DEFAULT: "hsl(var(--error))",
          foreground: "hsl(var(--error-foreground))",
        },

        "primary-container": {
          DEFAULT: "hsl(var(--primary-container))",
          foreground: "hsl(var(--primary-container-foreground))",
          muted: "hsl(var(--primary-container-muted))",
          border: "hsl(var(--primary-container-border))",
          error: "hsl(var(--primary-container-error))",
        },

        "secondary-container": {
          DEFAULT: "hsl(var(--secondary-container))",
          foreground: "hsl(var(--secondary-container-foreground))",
          muted: "hsl(var(--secondary-container-muted))",
          border: "hsl(var(--secondary-container-border))",
        },

        cell: {
          background: {
            default: "hsl(var(--cell-background-default))",
            preview: "hsl(var(--cell-background-preview))",
            missing: "hsl(var(--cell-background-missing))",
            correct: "hsl(var(--cell-background-correct))",
            almost: "hsl(var(--cell-background-almost))",
          },
          foreground: {
            default: "hsl(var(--cell-foreground-default))",
            preview: "hsl(var(--cell-foreground-preview))",
            missing: "hsl(var(--cell-foreground-missing))",
            correct: "hsl(var(--cell-foreground-correct))",
            almost: "hsl(var(--cell-foreground-almost))",
          },
          border: {
            default: "hsl(var(--cell-border-default))",
            error: "hsl(var(--cell-border-error))",
            select: "hsl(var(--cell-border-select))",
          },
        },
      },

      borderRadius: {
        DEFAULT: "var(--radius)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-8px)" },
          "40%": { transform: "translateX(8px)" },
          "60%": { transform: "translateX(-6px)" },
          "80%": { transform: "translateX(6px)" },
        },
      },

      animation: {
        shake: "shake 0.5s ease",
      },
    },
  },
  plugins: [typography, require("tailwindcss-animate")],
  safelist: [
    "rotate-x-0",
    "rotate-x-180",
    "backface-hidden",
    "transform-style-preserve-3d",
    "perspective-1000",
  ],
};
