/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#0A192F', // Deep Navy
          600: '#071224',
          700: '#050c18',
          800: '#03060c',
          900: '#010204'
        },
        gold: {
          50:  '#fdf9f0',
          100: '#f9f0d6',
          200: '#f3e1ae',
          300: '#edd285',
          400: '#e7c35d',
          500: '#C5A059', // Metallic Gold
          600: '#a6874b',
          700: '#886f3d',
          800: '#6a5630',
          900: '#4c3e22'
        }
      },
    },
  },
  plugins: [],
}
