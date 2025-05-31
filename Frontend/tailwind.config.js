import { color } from 'framer-motion';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        underline: 'underline 3s forwards',
      },
      keyframes: {
        underline: {
          '0%': {
            width: '0%',
          },
          '1%': {
            width: '1%',
            backgroundColor: '#ef4444',
          },
          '100%': {
            width: '100%',
            backgroundColor: '#ef4444',
          },
        },
      },
    },
  },
  plugins: [],
}

// @keyframes progress {
//   0% { transform: translateX(-100%); }
//   100% { transform: translateX(200%); }
// }
// .animate-progress {
//   animation: progress 1.5s ease-in-out infinite;
// }