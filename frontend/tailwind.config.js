/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        natural: {
          bg: '#FDFCF8',           // Light Natural White
          accent: '#FFB7B2',       // Pastel Coral Pink
          pink: '#FFB7B2',
          surface: '#FFFFFF',      // Pure White Card
          'surface-subtle': '#F7F6F2',
          'surface-elevated': '#FFFFFF',
          foreground: '#292524',   // Deep Stone Black Text
          muted: '#78716C',        // Muted Text
          border: '#EDE8E3',       // Clean Border
        },
        pink: {
          DEFAULT: '#FFB7B2',
          light: '#FFEBEA',
          dark: '#E08580',
          hover: '#FFA5A0',
        },
        charcoal: {
          DEFAULT: '#292524',
          deep: '#1C1917',
          elevated: '#44403C',
        },
        stone: {
          DEFAULT: '#78716C',
          50: '#FDFCF8',
          100: '#F7F6F2',
          200: '#EDE8E3',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
          950: '#0C0A09',
        }
      },
      fontFamily: {
        serif: ['"Newsreader"', 'Georgia', 'serif'],
        sans: ['"Instrument Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        'card': '24px',
        '3xl': '24px',
        '4xl': '32px',
        'full': '9999px',
      },
      transitionTimingFunction: {
        'brutalist': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '300': '300ms',
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'pink-glow': '0 4px 20px -2px rgba(255, 183, 178, 0.45)',
        'brutal': '0 4px 20px -2px rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'reveal': 'reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'gentle-pulse': 'gentlePulse 3s ease-in-out infinite',
      },
      keyframes: {
        reveal: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        gentlePulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      }
    }
  },
  plugins: [],
}
