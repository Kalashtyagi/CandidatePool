/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        // 'primary':'#fff',
        'primary':'#334155',
        'button':'#111827'
      },
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif']
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-custom': {
          'scrollbar-color': '#103f59', // thumb and track colors
          'scrollbar-width': 'thin', // auto, thin, none
        },
        '.scrollbar-custom::-webkit-scrollbar': {
          width: '8px', // width of the scrollbar
          height: '8px', // height of the scrollbar
        },
        '.scrollbar-custom::-webkit-scrollbar-thumb': {
          backgroundColor: '#103f59', // color of the scrollbar thumb
          borderRadius: '4px',
        },
        '.scrollbar-custom::-webkit-scrollbar-track': {
          backgroundColor: '#103f59', // color of the scrollbar track
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
}