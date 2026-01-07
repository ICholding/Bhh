import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bhh-dark': '#212E3E',
        'bhh-blue1': '#2262AA',
        'bhh-blue2': '#2E6DB1',
        'bhh-blue': '#3496D3',
        'bhh-blue-light': '#56A8DB',
        'bhh-blue-lt': '#6BB6DA',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config