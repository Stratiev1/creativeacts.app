/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          black: '#060612',
          white: '#FFFFFF',
          orange: '#FF6321',
          grey: '#F7F7F7'
        }
      }
    },
  },
  plugins: [],
};
