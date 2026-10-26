/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        ethiopic: ['"Noto Sans Ethiopic"', '"Nyala"', '"Abyssinica SIL"', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        display: ['"Cinzel"', '"Playfair Display"', 'serif'],
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        smoothPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.98)' },
        }
      },
      animation: {
        blink: 'blink 1s ease-in-out infinite',
        smoothPulse: 'smoothPulse 1.2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
