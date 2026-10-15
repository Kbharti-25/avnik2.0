/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0B0F19',
        surface: {
          DEFAULT: '#111827',
          50: '#1F2937',
          100: '#161F30',
          200: '#1E293B',
          300: '#334155',
        },
        primary: {
          DEFAULT: '#38BDF8', // Cyan 400
          hover: '#0ea5e9',
          glow: 'rgba(56, 189, 248, 0.15)',
        },
        danger: {
          DEFAULT: '#F43F5E', // Rose 500
          hover: '#E11D48',
          glow: 'rgba(244, 63, 94, 0.2)',
        },
        warning: {
          DEFAULT: '#F59E0B', // Amber 500
          hover: '#D97706',
          glow: 'rgba(245, 158, 11, 0.2)',
        },
        success: {
          DEFAULT: '#10B981', // Emerald 500
          hover: '#059669',
          glow: 'rgba(16, 185, 129, 0.2)',
        },
        accent: {
          purple: '#A855F7',
          indigo: '#6366F1',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(56, 189, 248, 0.3)',
        'glow-rose': '0 0 25px -5px rgba(244, 63, 94, 0.3)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.3)',
      }
    },
  },
  plugins: [],
}
