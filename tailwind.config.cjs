/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette — values live in CSS variables (src/index.css, per
        // [data-season] and the fixed [data-lab] set); the names stay
        // winter-flavoured, the roles don't.
        abyss: 'rgb(var(--c-abyss) / <alpha-value>)',
        deep: 'rgb(var(--c-deep) / <alpha-value>)',
        ice: {
          50: 'rgb(var(--c-ice-50) / <alpha-value>)',
          100: 'rgb(var(--c-ice-100) / <alpha-value>)',
          200: 'rgb(var(--c-ice-200) / <alpha-value>)',
          300: 'rgb(var(--c-ice-300) / <alpha-value>)',
          400: 'rgb(var(--c-ice-400) / <alpha-value>)',
        },
        frost: 'rgb(var(--c-frost) / <alpha-value>)',
        glacier: 'rgb(var(--c-glacier) / <alpha-value>)',
        aurora: 'rgb(var(--c-aurora) / <alpha-value>)',
        mint: 'rgb(var(--c-mint) / <alpha-value>)',
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
