/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
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