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
          yellow: '#a38c73',
          green: '#8a9973',
          blue: '#82a4ab',
          pink: '#e2b4bd',
          black: '#4a3827',
          white: '#fdfbf7',
          gray: '#c2b5a5'
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
        'brutal': '0 8px 30px rgba(74, 56, 39, 0.15)',
        'brutal-lg': '0 15px 40px rgba(74, 56, 39, 0.25)',
        'brutal-hover': '0 4px 15px rgba(74, 56, 39, 0.1)',
      }
    },
  },
  plugins: [],
}
