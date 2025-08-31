import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      borderRadius: {
        xl: 'var(--radius)',
        '2xl': `calc(var(--radius) + 8px)`,
      },
      colors: {
        bg:        'rgb(var(--bg))',
        surface:   'rgb(var(--surface))',
        'surface-2':'rgb(var(--surface-2))',
        text:      'rgb(var(--text))',
        muted:     'rgb(var(--muted))',
        ring:      'rgb(var(--ring))',
        border:    'rgb(var(--border))',

        /* Virtue tokens */
        primary:   'rgb(var(--wisdom))',     // default accent = Wisdom
        courage:   'rgb(var(--courage))',
        justice:   'rgb(var(--justice))',
        temperance:'rgb(var(--temperance))',

        /* Framework chips */
        fw: {
          spartan:    'rgb(var(--spartan))',
          bushido:    'rgb(var(--bushido))',
          stoic:      'rgb(var(--stoic))',
          monastic:   'rgb(var(--monastic))',
          yogic:      'rgb(var(--yogic))',
          indigenous: 'rgb(var(--indigenous))',
          martial:    'rgb(var(--martial))',
          sufi:       'rgb(var(--sufi))',
          ubuntu:     'rgb(var(--ubuntu))',
          highperf:   'rgb(var(--highperf))',
        },

        /* Legacy shadcn tokens for compatibility */
        input: "hsl(var(--input))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      boxShadow: {
        card: 'var(--shadow-1)',
        pop:  'var(--shadow-2)',
      },
      transitionTimingFunction: {
        soft: 'var(--ease-soft)',
        snap: 'var(--ease-snap)',
      },
      transitionDuration: {
        fast: 'var(--dur-fast)',
        med:  'var(--dur-med)',
        slow: 'var(--dur-slow)',
      },
      backgroundImage: {
        /* Virtue gradients for hero bars and buttons */
        'grad-wisdom':     'linear-gradient(135deg, rgba(var(--wisdom),1), rgba(126,180,255,.18))',
        'grad-courage':    'linear-gradient(135deg, rgba(var(--courage),1), rgba(255,145,92,.18))',
        'grad-justice':    'linear-gradient(135deg, rgba(var(--justice),1), rgba(90,214,161,.18))',
        'grad-temperance': 'linear-gradient(135deg, rgba(var(--temperance),1), rgba(180,160,255,.18))',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      fontSize: {
        'fluid-xs': ['clamp(0.75rem, 1vw, 0.875rem)', { lineHeight: '1.4' }],
        'fluid-sm': ['clamp(0.875rem, 1.2vw, 1rem)', { lineHeight: '1.5' }],
        'fluid-base': ['clamp(1rem, 1.5vw, 1.125rem)', { lineHeight: '1.6' }],
        'fluid-lg': ['clamp(1.125rem, 2vw, 1.25rem)', { lineHeight: '1.5' }],
        'fluid-xl': ['clamp(1.25rem, 2.5vw, 1.5rem)', { lineHeight: '1.4' }],
        'fluid-2xl': ['clamp(1.5rem, 3vw, 2rem)', { lineHeight: '1.3' }],
        'fluid-3xl': ['clamp(2rem, 4vw, 2.5rem)', { lineHeight: '1.2' }],
        'fluid-4xl': ['clamp(2.5rem, 5vw, 3.5rem)', { lineHeight: '1.1' }],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-from-bottom": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "aurora": {
          "0%, 100%": { 
            opacity: "0.3",
            transform: "translate(0, 0) rotate(0deg)"
          },
          "50%": { 
            opacity: "0.5",
            transform: "translate(-10px, -10px) rotate(1deg)"
          },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "breathe": {
          "0%, 100%": { 
            transform: "scale(1)",
            opacity: "0.7"
          },
          "50%": { 
            transform: "scale(1.1)",
            opacity: "1"
          },
        },
        "radial-sweep": {
          "0%": { strokeDashoffset: "100%" },
          "100%": { strokeDashoffset: "0%" },
        },
        "glow-pulse": {
          "0%, 100%": { 
            boxShadow: "0 0 40px rgb(var(--wisdom)/0.3)" 
          },
          "50%": { 
            boxShadow: "0 0 60px rgb(var(--wisdom)/0.5)" 
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-in-from-bottom": "slide-in-from-bottom 0.3s ease-out",
        "pulse-slow": "pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "aurora": "aurora 20s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
        "breathe": "breathe 4s ease-in-out infinite",
        "radial-sweep": "radial-sweep 1.1s ease-out",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config 