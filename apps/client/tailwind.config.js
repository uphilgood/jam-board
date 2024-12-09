/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Include all files in /app
    "./components/**/*.{js,ts,jsx,tsx}", // Include components if used
  ],
  theme: {
    extend: {}, // Extend Tailwind’s default theme if needed
  },
  plugins: [],
};
