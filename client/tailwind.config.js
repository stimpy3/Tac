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
        mainBlue: "#4E7FD6",
        bluePurple: "#8953ff",
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
