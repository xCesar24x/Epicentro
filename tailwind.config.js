/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cinzel', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
      },
      colors: {
        gold: {
          DEFAULT: '#FFD700',
          glow: 'rgba(255, 215, 0, 0.4)',
        },
        silver: '#C0C0C0',
        bronze: '#CD7F32',
        iron: '#808080',
        clay: '#B87333',
      }
    },
  },
  plugins: [],
}
