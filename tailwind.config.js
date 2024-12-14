module.exports = {
  darkMode: 'class',   
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      colors: {
        'custom-gray': '#6e7891',
      },
    },
  },
  plugins: [],
};
