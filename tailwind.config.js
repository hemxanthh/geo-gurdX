/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Professional, neutral palette
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        stone: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
        accent: {
          500: '#22c55e', // Muted green
          600: '#16a34a',
          orange: '#fb923c', // For alerts
          red: '#ef4444',
          blue: '#38bdf8', // For info
        },
        bg: {
          light: '#f8fafc',
          card: '#f1f5f9',
        },
        text: {
          main: '#1e293b',
          muted: '#64748b',
        },
      }
    },
  },
  plugins: [],
};
