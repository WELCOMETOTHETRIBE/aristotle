# Ancient Wisdom Wellness System

A modern wellness OS that fuses Athenian minimalism with Zen flow, built on 2,400 years of philosophical wisdom and validated by contemporary science.

## 🎨 Design Philosophy

**Academy Aesthetic**: Serene, elevated design that combines:
- **Athenian minimalism**: Clean lines, thoughtful proportions, intellectual clarity
- **Zen flow**: Organic movement, natural rhythms, mindful interactions
- **Modern science**: Evidence-based practices, data-driven insights

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Variables (design tokens)
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: lucide-react

### Design Tokens
```css
--bg: #0b0f14;           /* Near-black blue background */
--surface: rgba(255,255,255,0.06);  /* Glass card surfaces */
--accent: #7ad7ff;       /* Ion/sky accent */
--accent-2: #a78bfa;     /* Soft purple */
--text: #e6eef7;         /* Primary text */
--muted: #9fb2c5;        /* Secondary text */
```

## 🧭 Information Architecture

### Core Routes
- `/` - **Command Center**: Personalized dashboard with 10 wellness widgets
- `/academy` - **System Overview**: Virtue framework explanation
- `/wisdom`, `/courage`, `/justice`, `/temperance` - **Pillar Pages**: Practice galleries
- `/routines` - **Ritual Builders**: Morning/Midday/Evening practices
- `/trackers` - **Widgets Hub**: All wellness tracking tools
- `/community` - **Wisdom Circles**: Mentors, events, connections
- `/library` - **Resources**: Books, research, teachers

## 🎯 Dashboard Widgets

The Command Center features 10 interactive widgets:

1. **Virtue Radar** - Weekly virtue balance visualization
2. **Morning Ritual** - Daily practice checklist with streaks
3. **Breathwork Timer** - Animated breath phase guidance
4. **Cold/Heat Exposure** - Safety-focused exposure tracking
5. **Fasting Tracker** - Intermittent fasting with countdown
6. **Mood & Reflection** - Quick mood logging with reflection prompts
7. **Circadian Sun Path** - Sleep cycle visualization
8. **Hydration Ring** - Daily water intake tracking
9. **Focus/Flow Block** - Deep work timer with ambient features
10. **Resource Spotlight** - Curated wisdom content

## 🧩 Core Components

### Design System
- `AuroraBackground` - Animated gradient background layer
- `GlassCard` - Frosted glass card wrapper
- `VirtueRadar` - Recharts radar visualization
- `RadialMeter` - Animated circular progress
- `BreathTimer` - Interactive breath guidance
- `SunPath` - Circadian rhythm visualization

### Navigation
- `VirtueNavigation` - Pillar dock with animated indicators
- Mobile-first responsive design
- Smooth page transitions

## 🎨 Visual Language

### Typography
- **UI**: Inter (clean, modern)
- **Headings**: Playfair Display (elegant, timeless)
- **Fluid scaling**: Responsive typography with `clamp()`

### Effects
- **Glassmorphism**: Backdrop blur, frosted borders, inner highlights
- **Aurora gradients**: Subtle animated background layers
- **Micro-interactions**: Spring animations, hover states, focus indicators

### Accessibility
- **WCAG AA compliance**: High contrast, semantic markup
- **Keyboard navigation**: Full tab support
- **Reduced motion**: Respects user preferences
- **Screen reader support**: Proper ARIA labels

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd aristotle

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run unit tests
npm run e2e          # Run end-to-end tests
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript checks
```

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run e2e
```

### Test Coverage
- **Components**: All core components tested
- **User flows**: Key navigation paths verified
- **Accessibility**: Screen reader and keyboard nav tested
- **Performance**: Lighthouse scores ≥95

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+
- **Large**: 1280px+

### Mobile Features
- Bottom navigation dock
- Touch-friendly interactions
- Optimized widget layouts
- Reduced motion support

## 🎯 Performance

### Optimization
- **Images**: Next.js Image optimization
- **Fonts**: Google Fonts with display=swap
- **Animations**: GPU-accelerated transforms
- **Code splitting**: Dynamic imports for heavy components

### Lighthouse Scores
- **Performance**: ≥95
- **Accessibility**: ≥95
- **Best Practices**: ≥95
- **SEO**: ≥95

## 🔧 Customization

### Adding New Widgets
1. Create component in `components/`
2. Add to dashboard grid in `app/page.tsx`
3. Update types in `lib/types.ts`
4. Add demo data in `lib/demo-state.ts`

### Styling
- Design tokens in `app/globals.css`
- Tailwind config in `tailwind.config.ts`
- Component-specific styles in component files

### Data
- Mock data in `lib/demo-state.ts`
- Types in `lib/types.ts`
- API routes in `app/api/`

## 🌟 Features

### Wellness Tracking
- **Virtue development**: Track progress in wisdom, courage, justice, temperance
- **Habit streaks**: Visual progress indicators
- **Data visualization**: Charts and graphs for insights
- **Local storage**: Persistent user preferences

### Ancient Wisdom Integration
- **Philosophical foundations**: Rooted in Aristotle's teachings
- **Cultural context**: Respectful integration of traditions
- **Scientific validation**: Evidence-based practices
- **Modern application**: Practical for contemporary life

### User Experience
- **Intuitive navigation**: Clear information hierarchy
- **Progressive disclosure**: Information revealed as needed
- **Personalization**: Adaptive content and recommendations
- **Community features**: Connection with fellow seekers

## 🤝 Contributing

### Development Guidelines
1. **TypeScript**: Strict typing required
2. **Accessibility**: WCAG AA compliance
3. **Performance**: Optimize for Core Web Vitals
4. **Testing**: Unit and E2E tests for new features
5. **Documentation**: Update README for significant changes

### Code Style
- **Prettier**: Automatic formatting
- **ESLint**: Code quality enforcement
- **Conventional commits**: Structured commit messages
- **Component structure**: Consistent file organization

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Ancient philosophers**: Aristotle, Socrates, Marcus Aurelius, and others
- **Modern researchers**: Scientific validation of ancient practices
- **Design inspiration**: Athenian architecture, Zen aesthetics
- **Open source community**: Tools and libraries that make this possible

---

*"We are what we repeatedly do. Excellence, then, is not an act, but a habit."* - Aristotle 