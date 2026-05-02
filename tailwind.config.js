/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        physics: '#3B82F6',
        chemistry: '#F59E0B',
        mathematics: '#8B5CF6',
        biology: '#10B981',
        computer: '#6366F1',
        history: '#EF4444',
        geography: '#14B8A6',
        english: '#EC4899',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
