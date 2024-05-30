/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        'cerise-red': {
          50: '#fef1f7',
          100: '#fee5f0',
          200: '#fecce3',
          300: '#ffa2cb',
          400: '#fe68a7',
          500: '#f83c86',
          600: '#e91f64',
          700: '#ca0c47',
          800: '#a70d3b',
          900: '#8b1034',
          950: '#55021a'
        },
        'blue-chill': {
          50: '#f2f9f9',
          100: '#ddeff0',
          200: '#bfe0e2',
          300: '#92cace',
          400: '#5faab1',
          500: '#438e96',
          600: '#3b757f',
          700: '#356169',
          800: '#325158',
          900: '#2d464c',
          950: '#1a2c32'
        },
        'electric-violet': {
          50: '#fdf2ff',
          100: '#f9e3ff',
          200: '#f2c6ff',
          300: '#ed99ff',
          400: '#e35dff',
          500: '#d121ff',
          600: '#bf10ff',
          700: '#9c00cf',
          800: '#8100a9',
          900: '#6d0689',
          950: '#49005e'
        }
      }
    }
  },
  plugins: []
};
