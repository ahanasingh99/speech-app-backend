/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    fontFamily: {
      sans: ['Roboto', 'sans-serif'],
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        darkBlue: '#2764AB',
        skyBlue: '#51A1FE',
        brightBlue: '#0077FF',
        lightSkyBlue: '#51A1FE30',
        lightGray: '#f2f2f2',
        darkGray: '#D9D9D9',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        typewriter: {
          from: { width: '0' },
          to: { width: '100%' },
        },
        blinkCursor: {
          'from, to': { boxShadow: 'none' },
          '50%': { boxShadow: '2px 0 0 0 currentColor' },
        },
        blinkCursor: {
          'from, to': { boxShadow: 'none' },
          '50%': { boxShadow: '2px 0 0 0 currentColor' },
        },
        slideInRightToLeft: {
          '0%': {
            transform: 'translateX(30%)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        slideInLeftToRight: {
          '0%': {
            transform: 'translateX(-50%)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        underline: {
          from: { width: '0' },
          to: { width: '100%' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        fadeIn: 'fadeIn 1s ease-out',
        typewriter: 'typewriter 4s steps(44) 1s normal both',
        blinkCursor: 'blinkCursor 500ms steps(44) infinite normal',
        'type-blink':
          'typewriter 4s steps(44) 1s forwards, blinkCursor 500ms steps(44) infinite',
        'slide-in-right-to-left': 'slideInRightToLeft 0.5s ease-out forwards',
        'slide-in-left-to-right': 'slideInLeftToRight 1s ease-out forwards',
        underline: 'underline 0.5s ease-in-out forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
