/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        neutral: {
          0: 'hsl(0, 0%, 100%)',
          200: 'hsl(250, 6%, 84%)',
          300: 'hsl(240, 6%, 70%)',
          600: 'hsl(243, 23%, 30%)',
          700: 'hsl(243, 23%, 24%)',
          800: 'hsl(243, 27%, 20%)',
          900: 'hsl(243, 96%, 9%)',
        },
        orange: {
          500: 'hsl(28, 100%, 52%)',
        },
        blue: {
          500: 'hsl(233, 67%, 56%)',
          700: 'hsl(248, 70%, 36%)',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Bricolage Grotesque"', '"DM Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'today-large': "url('/assets/images/bg-today-large.svg')",
        'today-small': "url('/assets/images/bg-today-small.svg')",
      },
    },
  },
  plugins: [],
}

