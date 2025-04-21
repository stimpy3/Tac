/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens:{
        mobS:"320px",
        mobM:"375px",
        mobL:"430px",
        mobXL:"530px",
      },
      colors:{
        mainBlue:"#4E7FD6",
      },
      fontFamily: {
        ubuntu: ['Ubuntu', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

