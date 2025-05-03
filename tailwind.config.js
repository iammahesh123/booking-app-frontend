/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#1a365d',
            dark: '#0f2942',
            light: '#2a4a76',
          },
          secondary: {
            DEFAULT: '#0d9488',
            dark: '#0b7a72',
            light: '#14b8a6',
          },
          accent: {
            DEFAULT: '#f97316',
            dark: '#ea580c',
            light: '#fb923c',
          },
          success: {
            DEFAULT: '#10b981',
            dark: '#059669',
            light: '#34d399',
          },
          warning: {
            DEFAULT: '#f59e0b',
            dark: '#d97706',
            light: '#fbbf24',
          },
          error: {
            DEFAULT: '#ef4444',
            dark: '#dc2626',
            light: '#f87171',
          },
        },
        boxShadow: {
          'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          'button': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
        animation: {
          'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'fadeIn': 'fadeIn 0.2s ease-out',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0', transform: 'scale(0.95)' },
            '100%': { opacity: '1', transform: 'scale(1)' },
          },
        },
      },
    },
    plugins: [],
  };