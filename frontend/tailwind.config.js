/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FAFBF7',
          100: '#F4F5EE',
          200: '#ECEEE0',
        },
        brand: {
          brown: '#5C4B3C',
          darkbrown: '#4A3B2E',
          taupe: '#9E8573',
          lime: '#B8E348',
          limedark: '#9CC736',
          pink: '#F7D6D5',
          grey: '#B8B8B8',
        }
      },
      fontFamily: {
        sans: ['"Prompt"', '"Outfit"', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      }
    },
  },
  plugins: [],
}
