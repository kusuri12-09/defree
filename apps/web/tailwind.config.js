/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#16a34a', // Green 600
          light: '#f0fdf4', // Green 50
        },
        danger: '#ef4444', // Red 500
        warning: '#fb923c', // Orange 400
        neutral: {
          900: '#111827', // Gray 900
          500: '#6b7280', // Gray 500
          100: '#f3f4f6', // Gray 100
        },
        surface: '#ffffff', // White
      },
      fontFamily: {
        sans: ['Pretendard', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
