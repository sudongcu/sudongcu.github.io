/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Legacy tokens (still used by /lab pages)
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        dark: {
          900: '#0a0a0a',
          800: '#141414',
          700: '#1e1e1e',
          600: '#282828',
        },
        // Glacier palette
        abyss: '#050b16',
        deep: '#081324',
        ice: {
          50: '#f4faff',
          100: '#e4f2ff',
          200: '#c9e6ff',
          300: '#a3d6ff',
          400: '#7cc4ff',
        },
        frost: '#7fe6ff',
        glacier: '#4cc9f0',
        aurora: '#8b9cff',
        mint: '#8ff5e0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.06em',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'aurora-1': 'aurora1 18s ease-in-out infinite alternate',
        'aurora-2': 'aurora2 22s ease-in-out infinite alternate',
        'aurora-3': 'aurora3 26s ease-in-out infinite alternate',
        'marquee': 'marquee 45s linear infinite',
        'shimmer': 'shimmer 8s ease-in-out infinite',
        'ping-slow': 'ping 2.4s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        aurora1: {
          '0%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '100%': { transform: 'translate3d(12vw, 10vh, 0) scale(1.25)' },
        },
        aurora2: {
          '0%': { transform: 'translate3d(0, 0, 0) scale(1.1)' },
          '100%': { transform: 'translate3d(-10vw, -8vh, 0) scale(0.9)' },
        },
        aurora3: {
          '0%': { transform: 'translate3d(0, 0, 0) scale(0.9)' },
          '100%': { transform: 'translate3d(8vw, -12vh, 0) scale(1.2)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}
