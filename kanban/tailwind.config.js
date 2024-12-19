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
          bg4: '#4e5156',
          bg0: '#131517',
          bg05: '#121415',
        },
      },
      fontFamily: {
        Inter: ['Inter', 'sans-serif'],
        Lobster: ['Lobster', 'sans-serif'],
        Monsterrat: ['Monsterrat', 'sans-serif']
      },
    },
    screens: {
      '2xl': {'max': '1535px'}, // => @media (max-width: 1535px) { ... }
      'xl': {'max': '1279px'}, // => @media (max-width: 1279px) { ... }
      'lg': {'max': '1023px'}, // => @media (max-width: 1023px) { ... }
      'md': {'max': '767px'}, // => @media (max-width: 767px) { ... }
      'sm': {'max': '639px'}, // => @media (max-width: 639px) { ... }
      'xlreverse': {'min': '1279px'},
    },
    display: ["group-hover"],
    
  },
  plugins: [],
}

