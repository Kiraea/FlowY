/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:{
          bg2: '#282b30',
          highlight: '#e879f9',
          highlight2: '#8b5cf6',
          text: '#000000',
          contrast: '#f0abfc',
          bg1: '#1e2124',
          bg3: '#424549',
          bg0: '#131517',
        },
      },
      fontFamily: {
        Inter: ['Inter', 'sans-serif'],
        Lobster: ['Lobster', 'sans-serif'],
        Monsterrat: ['Monsterrat', 'sans-serif']
      },
    },
  },
  plugins: [],
}

