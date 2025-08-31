# Aristotle - Ancient Wisdom Wellness System

A comprehensive wellness system based on ancient philosophical wisdom and modern science.

## 🚀 Latest Update
- Framework pages now work without authentication
- Dashboard has compact widget view with interactive modals
- All pages accessible for development

## 🌟 Features

### 🎯 **Core Functionality**
- **Voice-First Design**: Natural conversations through voice input and output
- **Aristotle-Inspired Coaching**: AI coach based on ancient wisdom for modern flourishing
- **Real-Time Processing**: Instant voice transcription and AI responses
- **Evolving Memory**: AI that remembers your values and learns from interactions
- **Structured Plans**: Concrete, actionable steps for goal achievement
- **Hedonic Awareness**: Monitor patterns to break unhealthy habits

### 🧘 **Wellness Tools**
- **Breathwork Timer**: Guided breathing exercises with multiple patterns
- **Fasting Tracker**: Comprehensive fasting protocols with benefit analysis
- **Habit Tracking**: Build and maintain positive habits
- **Goal Management**: Set and track progress toward meaningful goals

### 🎨 **Modern UI/UX**
- **Glass Morphism Design**: Beautiful, modern interface
- **Responsive Layout**: Works seamlessly on all devices
- **Dark/Light Mode**: Adaptive theming
- **Smooth Animations**: Engaging user experience

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd aristotle
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.local.example .env.local
   ```
   
   Edit `.env.local` and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   DATABASE_URL="file:./dev.db"
   NEXT_PUBLIC_APP_NAME="Aion"
   NEXT_PUBLIC_DEFAULT_VOICE="alloy"
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Database Setup

The app uses PostgreSQL for data persistence. To set up the database:

1. **Set DATABASE_URL in Railway**
   - Go to your Railway project dashboard
   - Add environment variable: `DATABASE_URL`
   - Use the **external** PostgreSQL connection string (not the internal one)
   - Format: `postgresql://postgres:password@postgres-production-bc3a.up.railway.app:5432/railway`

2. **Deploy to Railway**
   - The database schema will be automatically created when the app starts
   - Tables will be created based on the Prisma schema
   - The app will work even if the database is not available (with fallback data)

3. **Local Development**
   ```bash
   # Set up local database
   npm run db:setup
   
   # Or manually
   npm run db:generate
   npm run db:push
   ```

**Note**: The app includes fallback handling for when the database is not available, so it will continue to function even if there are database connection issues.

### Audio File Generation

The breathwork feature uses pre-generated audio files for reliable performance. To regenerate these files:

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Generate audio files**
   ```bash
   npm run generate-breathwork-audio
   ```

This will create all necessary audio files for breathing instructions, counting, and session messages.

## 📁 Project Structure

```
aristotle/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── coach/         # AI coaching endpoint
│   │   ├── transcribe/    # Speech-to-text
│   │   ├── tts/          # Text-to-speech
│   │   └── ...
│   ├── breath/           # Breathwork page
│   ├── coach/            # Main coaching interface
│   ├── fasting/          # Fasting tracker
│   └── ...
├── components/            # Reusable UI components
├── lib/                   # Utility functions and configurations
├── prisma/               # Database schema and migrations
├── skills/               # AI skill definitions
└── public/               # Static assets
```

## 🎯 Key Pages

### **Coach** (`/coach`)
- Voice and text conversation with AI coach
- Automatic speech-to-text and text-to-speech
- Personalized action plans and habit suggestions
- Hedonic pattern analysis

### **Breathwork** (`/breath`)
- **Pre-Generated Audio**: Soft spoken directions and counting using pre-recorded TTS files
- **Multiple Patterns**: Box Breathing, 4-7-8, Wim Hof, Coherent, Triangle, Ocean Breath
- **Mobile-Optimized**: Collapsible pattern details for better mobile experience
- **Visual Timer**: Animated breath circle with progress indicators
- **Session Tracking**: Automatic logging of breathwork sessions
- **Reliable Audio**: Works consistently without depending on external TTS APIs
- Multiple breathing patterns (Box, 4-7-8, Wim Hof, etc.)
- Visual breathing timer with animations
- Pattern selection and benefits display
- Session tracking

### **Fasting** (`/fasting`)
- Multiple fasting protocols (16:8, 18:6, 24h, etc.)
- Real-time fasting timer
- Benefit tracking and analysis
- Session history

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push database schema
npm run db:studio    # Open Prisma Studio
npm test             # Run tests
```

### Database Management

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push

# Open database browser
npm run db:studio
```

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, CSS Modules
- **Database**: SQLite with Prisma ORM
- **AI**: OpenAI GPT-4, Whisper, TTS
- **UI Components**: Radix UI, Lucide Icons
- **State Management**: React Query (TanStack Query)
- **Testing**: Vitest

## 🔐 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Required
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL="file:./dev.db"

# Optional
NEXT_PUBLIC_APP_NAME="Aion"
NEXT_PUBLIC_DEFAULT_VOICE="alloy"
CRON_SECRET=your_cron_secret_here
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Heroku
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Aristotle** for the philosophical foundation
- **OpenAI** for the AI capabilities
- **Next.js** team for the amazing framework
- **Tailwind CSS** for the beautiful styling system

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

*"We are what we repeatedly do. Excellence, then, is not an act, but a habit." - Aristotle* # Trigger redeploy Sun Aug 31 06:41:17 PDT 2025
# Deployment test
