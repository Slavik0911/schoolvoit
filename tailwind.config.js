module.exports = {
  content: [
    './*.html',        
    './**/*.html',       
    './src/**/*.{js,jsx,ts,tsx}', 
    './src/**/*.{html,js}', // Включити всі HTML та JS файли в папці src
    './public/index.html',
  ],
  theme: {
    extend: {
      fontSize: {
        '128': '128px', 
      },
    },
  },
  plugins: [],
};