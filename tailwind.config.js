/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Deep space backgrounds
        void: '#05070d',
        abyss: '#0a0e1a',
        panel: '#0d1322',
        panel2: '#121a2e',
        edge: '#1d2740',
        // Accent is driven by CSS variables so the whole UI re-themes at runtime
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          soft: 'rgb(var(--accent) / 0.15)',
        },
        // Fixed status colors
        live: '#22c55e',
        busy: '#ef4444',
        reserved: '#f59e0b',
        maint: '#3b82f6',
      },
      fontFamily: {
        display: ['"Orbitron"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Rajdhani"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgb(var(--accent) / 0.45), 0 0 4px rgb(var(--accent) / 0.6)',
        'glow-sm': '0 0 12px rgb(var(--accent) / 0.35)',
        'glow-lg': '0 0 40px rgb(var(--accent) / 0.4)',
        card: '0 8px 40px rgba(0,0,0,0.45)',
        'inner-glow': 'inset 0 0 30px rgb(var(--accent) / 0.06)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.04)' },
        },
        gridmove: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '40px 40px' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        ping2: {
          '75%, 100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        scan: {
          '0%': { top: '-10%' },
          '100%': { top: '110%' },
        },
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.4s ease-in-out infinite',
        gridmove: 'gridmove 3s linear infinite',
        shimmer: 'shimmer 2s infinite',
        ping2: 'ping2 1.8s cubic-bezier(0,0,0.2,1) infinite',
        scan: 'scan 7s linear infinite',
      },
    },
  },
  plugins: [],
}
