/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: { 50: '#f5f7ff', 500: '#5b6cff', 700: '#3e4dd1' },
      },
    },
  },
  plugins: [],
};
