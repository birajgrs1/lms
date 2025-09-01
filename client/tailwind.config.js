/** @type {import('tailwindcss').Config} */
export default {
  content: [
     "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing:{
        'section-height': '500px',
      },
      fontSize: {
        'course-courses-details-heading-small': ['26px', '36px'],

        'course-details-heading-large': ['36px', '44px'],
      },
    },
  },
  plugins: [],
}

