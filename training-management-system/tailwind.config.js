/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif']
      },
      colors: {
        ink: '#172033',
        fog: '#f4f7fb',
        brand: '#2563eb',
        mint: '#14b8a6',
        coral: '#f97316'
      },
      boxShadow: {
        glass: '0 24px 70px rgba(15, 23, 42, 0.12)'
      }
    }
  },
  plugins: []
};
