/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./app/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'kite-orange': '#F37021',
        'kite-orange-hover': '#E66010',
        'kite-orange-light': '#FFF5EE',
        'kite-bg': '#FFFFFF',
        'kite-bg-secondary': '#F8F9FA',
        'kite-text-primary': '#444444',
        'kite-text-secondary': '#666666',
        'kite-border': '#EEEEEE',
        'kite-border-active': '#F37021',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
