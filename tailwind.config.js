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
          100: '#313338',
          200: '#2b2d31',
          300: '#383a3f',
          400: '#404248',
          500: '#36373c',
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