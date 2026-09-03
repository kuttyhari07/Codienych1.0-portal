/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        toxic: {
          50: '#e6fffa',
          100: '#b2f5ea',
          400: '#22c55e',
          500: '#10b981',
          600: '#059669',
          900: '#00ff66',
        },
        dark: {
          bg: '#050b07',
          card: '#0a140e',
          surface: '#0f1e14',
          border: '#1b3524',
          accent: '#0d2416',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        orbitron: ['Orbitron', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
        'lightning-flash': 'lightningFlash 4s infinite',
      },
      keyframes: {
        glowPulse: {
          '0%': { boxShadow: '0 0 10px rgba(0, 255, 102, 0.2)' },
          '100%': { boxShadow: '0 0 25px rgba(0, 255, 102, 0.6), 0 0 40px rgba(16, 185, 129, 0.4)' },
        },
        lightningFlash: {
          '0%, 90%, 100%': { opacity: '0.1' },
          '92%': { opacity: '0.9' },
          '93%': { opacity: '0.2' },
          '94%': { opacity: '1' },
          '96%': { opacity: '0.3' },
        },
      },
    },
  },
  plugins: [],
};
