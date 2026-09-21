/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0B192C',
          darkBlue: '#1E3E62',
          blue: '#1D4ED8',
          lightBlue: '#EFF6FF',
          accent: '#F59E0B',
          amber: '#D97706',
          green: '#16A34A',
          emerald: '#059669',
          red: '#DC2626',
          surface: '#FFFFFF',
          background: '#F8FAFC',
          muted: '#64748B',
          border: '#E2E8F0',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        civic: '0 1px 3px 0 rgba(11, 25, 44, 0.08), 0 1px 2px -1px rgba(11, 25, 44, 0.08)',
        'civic-md': '0 4px 6px -1px rgba(11, 25, 44, 0.08), 0 2px 4px -2px rgba(11, 25, 44, 0.06)',
        'civic-lg': '0 10px 15px -3px rgba(11, 25, 44, 0.08), 0 4px 6px -4px rgba(11, 25, 44, 0.04)',
      },
    },
  },
  plugins: [],
}
