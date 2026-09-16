/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Pirates of the Caribbean Palette
        pirate: {
          gold: '#e5c158',
          'gold-light': '#f5df88',
          'gold-dark': '#b8860b',
          'gold-deep': '#8a6d1b',
          'gold-glow': '#ffd700',
          ocean: '#00e5ff',
          'ocean-dark': '#062033',
          'ocean-deep': '#030b12',
          ruby: '#dc2626',
          'ruby-glow': '#ef4444',
          parchment: '#f4e6c3',
          'parchment-dark': '#cfb07a',
          'parchment-border': '#684d26',
          emerald: '#10b981',
          'emerald-glow': '#00ff88',
          copper: '#b87333',
          bronze: '#8c6239',
        },
        // Backwards compatibility mappings mapped to Pirate tones
        toxic: {
          50: '#fefce8',
          100: '#fef9c3',
          400: '#e5c158',
          500: '#d4af37',
          600: '#b8860b',
          900: '#ffd700',
        },
        dark: {
          bg: '#03070b',
          card: '#081119',
          surface: '#0d1d2b',
          border: '#2a2215',
          accent: '#18120a',
        },
      },
      fontFamily: {
        pirate: ['"Pirata One"', 'cursive'],
        caribbean: ['"Cinzel Decorative"', 'serif'],
        cinzel: ['Cinzel', 'serif'],
        gothic: ['"Grenze Gotisch"', 'serif'],
        medieval: ['MedievalSharp', 'cursive'],
        parchment: ['"Eagle Lake"', 'cursive'],
        fell: ['"IM Fell English SC"', 'serif'],
        sans: ['Cinzel', 'Rajdhani', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        orbitron: ['"Cinzel Decorative"', '"Pirata One"', 'Cinzel', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glowPulse 2.5s ease-in-out infinite alternate',
        'lightning-flash': 'lightningFlash 5s infinite',
        'fog-drift': 'fogDrift 20s linear infinite alternate',
        'compass-spin': 'compassSpin 30s linear infinite',
        'coin-shine': 'coinShine 3s ease-in-out infinite',
      },
      keyframes: {
        glowPulse: {
          '0%': { boxShadow: '0 0 10px rgba(229, 193, 88, 0.2)' },
          '100%': { boxShadow: '0 0 30px rgba(229, 193, 88, 0.7), 0 0 50px rgba(0, 229, 255, 0.4)' },
        },
        lightningFlash: {
          '0%, 88%, 100%': { opacity: '0.05' },
          '90%': { opacity: '0.85' },
          '91%': { opacity: '0.2' },
          '92%': { opacity: '0.95' },
          '95%': { opacity: '0.1' },
        },
        fogDrift: {
          '0%': { transform: 'translateX(-5%) translateY(0)' },
          '100%': { transform: 'translateX(5%) translateY(-2%)' },
        },
        compassSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        coinShine: {
          '0%, 100%': { filter: 'brightness(1) drop-shadow(0 0 5px rgba(229, 193, 88, 0.4))' },
          '50%': { filter: 'brightness(1.3) drop-shadow(0 0 20px rgba(255, 215, 0, 0.9))' },
        },
      },
    },
  },
  plugins: [],
};
