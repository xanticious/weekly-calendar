/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        chewy: ['Chewy', 'cursive'],
      },
      colors: {
        primary: {
          50: '#fef7ff',
          100: '#fdeeff',
          200: '#fcd9ff',
          300: '#fab8ff',
          400: '#f687ff',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
