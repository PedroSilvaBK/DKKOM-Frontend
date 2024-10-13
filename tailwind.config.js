/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#242424',
          200: '#5b5b5b',
        },
        secondary: {
          50: '#f7f7f7',
          100: '#f6f6f6',
          200: '#d1d1d1',
          300: '#676767',
        },
      },
    },
  },
  plugins: [],
}