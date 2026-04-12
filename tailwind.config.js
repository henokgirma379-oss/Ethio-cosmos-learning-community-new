/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'space-black': '#050a1a',
        'deep-navy': '#0a1628',
        navy: '#0d1f3c',
        teal: '#00c8c8',
        gold: '#f5c542',
        'cosmos-purple': '#7c5cbf',
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['"Exo 2"', 'sans-serif'],
        sans: ['"Exo 2"', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
      },
      boxShadow: {
        glow: '0 0 20px rgba(0, 200, 200, 0.3)',
      },
    },
  },
  plugins: [],
}
