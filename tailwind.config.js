/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bhh-bg': '#d2d8e2',
        'bhh-bg-light': '#d1d8e2',
        'bhh-bg-dark': '#d0d8e3',
        'bhh-white': '#fafbfd',
        // Add more from palette
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'], // Assume modern sans
      },
    },
  },
  plugins: [],
}