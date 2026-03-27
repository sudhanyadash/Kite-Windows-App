/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'kite-pane-bg': '#0F172A',
        'kite-pane-border': '#1E293B',
        'kite-pane-border-active': '#1A56DB',
        'kite-divider-rest': '#1E293B',
        'kite-divider-hover': '#1A56DB',
        'kite-bookmark-card-bg': '#1E293B',
        'kite-bookmark-card-hover': '#2D3748',
        'kite-text-primary': '#F1F5F9',
        'kite-text-secondary': '#94A3B8',
      }
    },
  },
  plugins: [],
}
