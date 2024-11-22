module.exports = {
  content: [
    './*.html',        
    './**/*.html',       
    './src/**/*.{js,jsx,ts,tsx}', 
    './src/**/*.{html,js}', 
    './public/index.html',
    './src/**/*.{html,js,jsx}',
    '!./node_modules/**/*',
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