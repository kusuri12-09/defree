/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10b981', // Emerald 500
          light: '#34d399',
          dark: '#047857',
        },
        dark: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          dark: 'rgba(0, 0, 0, 0.3)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Pretendard', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh': 'radial-gradient(at 40% 20%, hsla(158,100%,74%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0px, transparent 50%)',
        'gradient-dark-mesh': 'radial-gradient(at 40% 20%, rgba(16, 185, 129, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(59, 130, 246, 0.15) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(139, 92, 246, 0.15) 0px, transparent 50%)',
      }
    },
  },
  plugins: [],
}
