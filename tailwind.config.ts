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
        sm: '6px',
        lg: '12px',
        xl: 'var(--radius)',
        '2xl': '16px',
      },
      colors: {
        /* Core surfaces & text - WCAG AAA compliant */
        bg:        'rgb(8, 9, 12)',          // Darker background for better contrast
        surface:   'rgb(15, 17, 23)',        // Adjusted surface
        'surface-2':'rgb(22, 25, 33)',       // Adjusted surface-2
        text:      'rgb(255, 255, 255)',     // Pure white for maximum contrast
        muted:     'rgb(180, 190, 210)',     // Lighter muted for better contrast
        ring:      'rgb(171, 196, 255)',     // Focus Ring
        border:    'rgb(45, 50, 65)',        // Slightly lighter border

        /* Virtue accents (semantic) - WCAG AA compliant */
        primary:   'rgb(140, 200, 255)',     // Brighter Wisdom Blue
        courage:   'rgb(255, 160, 100)',     // Brighter Courage Ember
        justice:   'rgb(100, 230, 170)',     // Brighter Justice Verdant
        temperance:'rgb(200, 180, 255)',     // Brighter Temperance Plum
        
        /* Status colors - WCAG AA compliant */
        success:   'rgb(60, 210, 150)',      // Brighter Success
        warning:   'rgb(255, 190, 85)',      // Brighter Warning
        error:     'rgb(255, 120, 120)',     // Brighter Danger
        info:      'rgb(110, 170, 255)',     // Brighter Info

        /* Framework chips */
        fw: {
          spartan:    'rgb(255, 173, 68)',   // Spartan Ochre
          bushido:    'rgb(226, 76, 67)',    // Bushidō Vermilion
          stoic:      'rgb(103, 132, 173)',  // Stoic Slate
          monastic:   'rgb(196, 172, 136)',  // Monastic Parchment
          yogic:      'rgb(120, 210, 190)',  // Yogic Jade
          indigenous: 'rgb(157, 202, 82)',   // Indigenous Sage
          martial:    'rgb(119, 119, 119)',  // Martial Steel
          sufi:       'rgb(255, 196, 110)',  // Sufi Saffron
          ubuntu:     'rgb(102, 186, 255)',  // Ubuntu Sky
          highperf:   'rgb(255, 115, 179)',  // High-Performance Rose
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
        '1': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        '2': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        '3': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        '4': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      transitionTimingFunction: {
        soft: 'var(--ease-soft)',
        snap: 'var(--ease-snap)',
      },
      transitionDuration: {
        fast: 'var(--dur-fast)',
        med:  'var(--dur-med)',
        slow: 'var(--dur-slow)',
        '150': '150ms',
        '250': '250ms',
      },
      backgroundImage: {
        /* Virtue gradients for hero bars and buttons - Updated with brighter colors */
        'grad-wisdom':     'linear-gradient(135deg, rgb(140, 200, 255), rgba(140, 200, 255, 0.18))',
        'grad-courage':    'linear-gradient(135deg, rgb(255, 160, 100), rgba(255, 160, 100, 0.18))',
        'grad-justice':    'linear-gradient(135deg, rgb(100, 230, 170), rgba(100, 230, 170, 0.18))',
        'grad-temperance': 'linear-gradient(135deg, rgb(200, 180, 255), rgba(200, 180, 255, 0.18))',
      },
      fontFamily: {
        display: ['Spectral', 'Georgia', 'serif'],
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
      scrollbar: {
        thin: '4px',
        DEFAULT: '6px',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('tailwind-scrollbar'),
  ],
} satisfies Config 