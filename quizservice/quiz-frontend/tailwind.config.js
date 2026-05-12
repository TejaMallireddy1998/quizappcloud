/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Geist"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: {
          50: '#f5f3ee',
          100: '#e8e4d9',
          900: '#1a1814',
          950: '#0f0e0b',
        },
        amber: { accent: '#e8a845' },
        coral: { accent: '#e85d45' },
      },
    },
  },
  plugins: [],
}