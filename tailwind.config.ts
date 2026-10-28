import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
        sans: ['Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
        mono: ['Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      colors: {
        primary: "#F8FAFC",
        secondary: "#F59E0B",
        tertiary: "#FBBF24",
        oceanic: "#0F172A"
      }
    },
  },
  plugins: [],
}
export default config

