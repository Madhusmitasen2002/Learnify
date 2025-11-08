/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // important for class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // include all React files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
