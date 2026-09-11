// ตำแหน่งที่แก้ไข: tailwind.config.js -> เปลี่ยนจาก module.exports เป็น export default

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./login.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        // Primitive Brand Colors
        brand: {
          blue: {
            10: '#f2f7ff',
            50: '#ced8e7',
            100: '#9eb1cf',
            400: '#0c3d88',
            500: '#103874',
            1000: '#041c43',
          },
          orange: {
            400: '#fa680a',
            500: '#cf5a0f',
          },
          grey: {
            50: '#fbfbfb',
            100: '#f4f4f4',
            300: '#f0f0f0',
            400: '#ececec',
            500: '#ced0da',
            600: '#9b9b9b',
            700: '#737373',
            800: '#4a4a4a',
            900: '#363636',
          },
        },
        // Mapped Semantic Tokens
        surface: {
          page: '#f0f0f0',
          default: '#ececec',
          highlight: '#f2f7ff',
          primary: '#0c3d88',
          hover: '#fa680a',
        },
        text: {
          heading: '#041c43',
          body: '#363636',
          muted: '#737373',
          placeholder: '#9b9b9b',
        },
        border: {
          default: '#ced0da',
          dark: '#fbfbfb',
        }
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        prompt: ['Prompt', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
