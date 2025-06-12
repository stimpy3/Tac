/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        mobS: "320px",
        mobM: "375px",
        mobL: "430px",
        mobXL: "530px",
      },
      colors: {
        accent0: "#5c1db5",
        accent1: "#8b3cfa",//purpleViolet
        accent2: "#BAB3F9",//ligeter purrpleViolet
        accent3: "#bdb697",//ochre
        accent4: "#421482",//dark purple

      },
      fontFamily: {
        ubuntu: ['Ubuntu', 'sans-serif'],
        
      },
  
    },
  },
  safelist: [
    'border-r-[1.5px]',
    'border-r-pink-500',
    'border-r-blue-500',
    'border-r-green-500'
  ],
  plugins: [],
}
