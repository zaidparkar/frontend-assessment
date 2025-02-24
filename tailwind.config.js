module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        custom: {
          black: '#322625',
          grey: '#ebebeb',
          blue: '#c0e3e5',
          yellow: '#fdc936',
          blueDark: '#a8d1d3',
          greyDark: '#d4d4d4',
        }
      },
      fontFamily: {
        'neutra': ['Neutra Text', 'sans-serif']
      }
    },
  },
  plugins: [],
} 