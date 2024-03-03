/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#254B48',
        'base-400': '#4D4D4D',
      },
      screens: {
        phone: '450px',
        sm: '640px',
        // => @media (min-width: 640px) { ... }

        md: '768px',
        // => @media (min-width: 768px) { ... }

        lg: '1024px',
        // => @media (min-width: 1024px) { ... }

        xl: '1280px',
        // => @media (min-width: 1280px) { ... }

        '2xl': '1536px',
        // => @media (min-width: 1536px) { ... }
      },
    },
  },
  plugins: [require('daisyui')],

  daisyui: {
    themes: [
      'corporate',

      {
        mytheme: {
          primary: '#91D8E4',

          secondary: '#F000B8',

          accent: '#37CDBE',

          neutral: '#3D4451',

          'base-100': '#EAFDFC',
          'base-200': '#BFEAF5',
          'base-300': '#91D8E4',
          'base-400': '#82AAE3',

          info: '#3ABFF8',

          success: '#36D399',

          warning: '#FBBD23',

          error: '#F59090',
        },
      },
    ],
  },
}
