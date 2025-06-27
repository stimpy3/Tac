/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',//Yes.Tailwind has a built-in dark: feature. But by default, it's disabled, so you need to enable it.
  //This tells Tailwind to look for a class="dark"
  theme: {
    extend: {
      screens: {
        mobS: "320px",
        mobM: "375px",
        mobL: "430px",
        mobXL: "530px",
      },
      colors: {
        accent0: "#5c29a3",
        accent1: "#8b3cfa",//purpleViolet
        accent2: "#af91fa",//ligeter purrpleViolet
        accent3: "#bdb697",//ochre
        accent4: "#421482",//dark purple

        //lightmode
        daccent2:"#9177d1",
        accentS:"#ebebeb",
        accentS2:"#d6d6d6",
        accentS3:"#a8a8a8",
        accentM:"#ffffff",
        accentTxt:"#000000",
        accentTxt2: "#525252",
        accentBorder2:"#b5b5b5",

        //darkmode
        daccentS: "#141414",
        daccentS2: "#242424",
        daccentS3: "#969696",
        daccentM: "#000000",
        daccentTxt: "#ffffff",
        daccentBorder2: "#343434"
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
