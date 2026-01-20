/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: {
          DEFAULT: '#f7f7f7',
          dark: '#333446', 
        },
        text: {
          DEFAULT: '#1f2937', 
          dark: '#f9fafb', 
        },
        primary: {
          DEFAULT: '#6EACDA', 
          dark: '#03346E', 
        },
        secondary: {
          DEFAULT: '#10b981', 
          dark: '#4ECDC4',  
        },
        accent: {
          DEFAULT: '#FF9898', 
          dark: '#A64D79',  
        },
      },
    },
  },
  plugins: [],
}
