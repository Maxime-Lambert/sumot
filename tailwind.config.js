/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,***}"],
  theme: {
    extend: {
      colors: {
        primary: '#444',
        accent: '#999',
        background: '#111',
        surface: '#222',
        correct: '#4caf50',
        wrong: '#f44336',
        almost: '#ffc107',
      }
    },
  },
  plugins: [],
}


