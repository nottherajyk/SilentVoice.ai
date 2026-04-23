/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
        display: ['"Archivo Black"', 'sans-serif'],
      },
      colors: {
        brutal: {
          yellow: '#faff00',
          green: '#22c55e',
          blue: '#00b4ff',
          pink: '#ff00a0',
          black: '#000000',
          white: '#ffffff',
          gray: '#e5e7eb'
        }
      },
      borderWidth: {
        '4': '4px',
        '8': '8px',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px rgba(0,0,0,1)',
        'brutal-lg': '8px 8px 0px 0px rgba(0,0,0,1)',
        'brutal-hover': '2px 2px 0px 0px rgba(0,0,0,1)',
      }
    },
  },
  plugins: [],
}
