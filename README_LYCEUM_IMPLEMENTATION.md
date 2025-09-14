# Lyceum — 12-Path Wisdom Journey Implementation

## Overview

The Lyceum is a comprehensive philosophical learning system that transforms the existing Aristotle Academy into a structured 12-path journey through Aristotle's wisdom. This implementation provides a complete learning experience with AI-powered guidance, community features, and comprehensive progress tracking.

## Architecture

### Core Components

1. **Data Layer**
   - `lib/lyceum-data.ts` - TypeScript interfaces and data parsing
   - `data/lyceum_wisdom_journey_v1_1.json` - Source of truth for all curriculum data
   - Prisma schema with comprehensive models for all Lyceum entities

2. **Context & State Management**
   - `lib/lyceum-context.tsx` - React Context for global Lyceum state
   - `useLyceum` hook for accessing Lyceum data and functions

3. **UI Components**
   - `components/lyceum/` - Modular React components for each Lyceum feature
   - Responsive design with Tailwind CSS
   - Accessibility-focused implementation

4. **API Routes**
   - `app/api/lyceum/` - RESTful API endpoints for all Lyceum operations
   - Authentication and authorization
   - Error handling and validation

## Features

### 1. Learning Paths (12 Paths)
- **Path 1: The Nature of Wisdom** - Understanding what wisdom truly means
- **Path 2: The Pursuit of Knowledge** - How we acquire and validate knowledge
- **Path 3: The Art of Living Well** - Practical wisdom for daily life
- **Path 4: The Virtue of Character** - Building moral excellence
- **Path 5: The Power of Reason** - Logic and critical thinking
- **Path 6: The Beauty of Truth** - Aesthetics and the nature of beauty
- **Path 7: The Harmony of Justice** - Ethics and social responsibility
- **Path 8: The Strength of Courage** - Overcoming fear and building resilience
- **Path 9: The Balance of Temperance** - Self-control and moderation
- **Path 10: The Unity of Friendship** - Relationships and community
- **Path 11: The Wonder of Nature** - Understanding the natural world
- **Path 12: The Quest for Happiness** - Eudaimonia and the good life

### 2. Lessons (36 Total)
- 3 lessons per path
- Progressive difficulty
- Clear learning objectives
- Key terms and concepts
- Prerequisites and outcomes

### 3. Activities
- **Reflection** - Personal introspection and journaling
- **Quiz** - Knowledge assessment
- **Photo Capture** - Visual learning and application
- **Discussion** - Community engagement
- **Research** - Deep dive investigations

### 4. AI Integration
- **Tutor** - Personalized learning guidance
- **Evaluator** - Assessment and feedback
- **Coach** - Daily check-ins and habit tracking

### 5. Community Features (Agora)
- Share insights and reflections
- Ask questions and get help
- Engage in philosophical discussions
- Like and comment on posts
- Anonymous posting option

### 6. Progress Tracking
- Path completion status
- Lesson progress
- Activity responses
- Mastery domain scores
- Overall journey progress

### 7. Artifacts & Portfolio
- Collection of all user work
- Filterable by type, path, or lesson
- Detailed view with AI feedback
- Portfolio view with mastery tracking

### 8. Certificate System
- Requirements: 12 paths, 3.5+ mastery, 20+ artifacts
- Mastery domains: Theoretical, Practical, Reflective, Creative
- Verification system
- Progress tracking

### 9. Daily Check-in
- Telos (purpose) setting
- Mood, energy, and focus tracking
- Reflection and gratitude
- AI coaching and insights
- Streak tracking

### 10. Glossary
- Comprehensive philosophical terms
- Searchable and filterable
- Etymology and examples
- Related terms
- Path-specific context

### 11. Scholar Mode
- Deep-dive content for advanced learners
- Primary and secondary sources
- Critical thinking exercises
- Research projects
- Writing assignments
- Discussion questions

## Database Schema

### Core Models

```prisma
model LyceumPath {
  id                String   @id
  title             String
  description       String
  order             Int
  estimatedDuration String
  difficulty        Int
  prerequisites     String[]
  learningOutcomes  String[]
  tags              String[]
  lessons           LyceumLesson[]
  // ... relations
}

model LyceumLesson {
  id                String   @id
  pathId            String
  title             String
  description       String
  order             Int
  estimatedDuration String
  difficulty        Int
  objectives        String[]
  keyTerms          String[]
  prerequisites     String[]
  learningOutcomes  String[]
  tags              String[]
  scholarMode       String?  // JSON
  // ... relations
}

model LyceumActivity {
  id                String   @id
  lessonId          String
  title             String
  description       String
  type              String
  order             Int
  estimatedDuration String
  difficulty        Int
  instructions      String
  expectedOutcome   String
  masteryDomain     String
  tags              String[]
  // ... relations
}

model LyceumAssessment {
  id            String   @id
  lessonId      String
  title         String
  description   String
  criteria      String[]
  rubric        String[]
  passingScore  Int
  maxAttempts   Int
  timeLimit     Int?
  masteryDomain String
  tags          String[]
  // ... relations
}
```

### Progress Tracking

```prisma
model LyceumUserProgress {
  id                    String   @id @default(cuid())
  userId                String   @unique
  completedPaths        Int      @default(0)
  completedLessons      Int      @default(0)
  totalArtifacts        Int      @default(0)
  masteryTheoretical    Float    @default(0)
  masteryPractical      Float    @default(0)
  masteryReflective     Float    @default(0)
  masteryCreative       Float    @default(0)
  // ... relations
}

model LyceumPathProgress {
  id              String   @id @default(cuid())
  userId          String
  pathId          String
  completedLessons Int     @default(0)
  isCompleted     Boolean  @default(false)
  completedAt     DateTime?
  // ... relations
}

model LyceumLessonProgress {
  id              String   @id @default(cuid())
  userId          String
  lessonId        String
  isCompleted     Boolean  @default(false)
  completedAt     DateTime?
  // ... relations
}
```

### Community & Social

```prisma
model LyceumAgoraPost {
  id          String   @id @default(cuid())
  userId      String
  pathId      String?
  lessonId    String?
  title       String
  content     String
  type        String
  tags        String[]
  isAnonymous Boolean  @default(false)
  // ... relations
}

model LyceumAgoraComment {
  id          String   @id @default(cuid())
  userId      String
  postId      String
  content     String
  isAnonymous Boolean  @default(false)
  // ... relations
}

model LyceumAgoraLike {
  id     String @id @default(cuid())
  userId String
  postId String
  // ... relations
}
```

## API Endpoints

### Core Learning
- `GET /api/lyceum/paths` - Get all learning paths
- `GET /api/lyceum/paths/[id]` - Get specific path
- `GET /api/lyceum/lessons` - Get all lessons
- `GET /api/lyceum/lessons/[id]` - Get specific lesson
- `GET /api/lyceum/activities` - Get all activities
- `GET /api/lyceum/activities/[id]` - Get specific activity

### Progress Tracking
- `GET /api/lyceum/progress` - Get user progress
- `POST /api/lyceum/progress` - Update progress
- `GET /api/lyceum/progress/paths` - Get path progress
- `GET /api/lyceum/progress/lessons` - Get lesson progress

### Activities & Responses
- `POST /api/lyceum/activities/[id]/respond` - Submit activity response
- `GET /api/lyceum/activities/[id]/responses` - Get activity responses
- `PUT /api/lyceum/activities/[id]/responses/[responseId]` - Update response

### AI Integration
- `POST /api/lyceum/ai/tutor` - Get AI tutoring
- `POST /api/lyceum/ai/evaluate` - Get AI evaluation
- `POST /api/lyceum/ai/coach` - Get AI coaching

### Community (Agora)
- `GET /api/lyceum/agora` - Get community posts
- `POST /api/lyceum/agora` - Create new post
- `GET /api/lyceum/agora/[id]` - Get specific post
- `PUT /api/lyceum/agora/[id]` - Update post
- `DELETE /api/lyceum/agora/[id]` - Delete post
- `POST /api/lyceum/agora/[id]/like` - Like/unlike post
- `GET /api/lyceum/agora/[id]/comments` - Get post comments
- `POST /api/lyceum/agora/[id]/comments` - Add comment

### Daily Check-in
- `GET /api/lyceum/daily-checkin` - Get daily check-in
- `POST /api/lyceum/daily-checkin` - Create check-in
- `PUT /api/lyceum/daily-checkin` - Update check-in

### Certificate
- `GET /api/lyceum/certificate` - Check certificate eligibility
- `POST /api/lyceum/certificate` - Generate certificate

## Setup Instructions

### 1. Database Setup
```bash
# Run migrations
npx prisma migrate dev

# Seed the database
npx tsx scripts/seed-lyceum.ts
```

### 2. Environment Variables
```env
# Add to .env.local
DATABASE_URL="your_database_url"
NEXTAUTH_SECRET="your_auth_secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Dependencies
```bash
# Install required packages
npm install @prisma/client prisma
npm install framer-motion
npm install lucide-react
```

## Usage

### 1. Accessing the Lyceum
- Navigate to `/lyceum` in the application
- The Lyceum tab is available in the main navigation

### 2. Learning Journey
1. Start with the Overview to understand the system
2. Explore the 12 learning paths
3. Complete lessons and activities
4. Track progress and build artifacts
5. Engage with the community in the Agora
6. Use daily check-ins for reflection
7. Earn your certificate upon completion

### 3. Navigation
- **Overview** - System introduction and progress summary
- **Paths** - Browse and select learning paths
- **Progress** - Detailed progress tracking
- **Check-in** - Daily reflection and habit tracking
- **Glossary** - Philosophical terms and definitions
- **Artifacts** - Collection of your work
- **Portfolio** - Comprehensive view of achievements
- **Agora** - Community sharing and discussion

## Customization

### 1. Adding New Paths
1. Update `data/lyceum_wisdom_journey_v1_1.json`
2. Run the seeding script
3. The new path will appear in the UI

### 2. Modifying Activities
1. Edit the activity in the JSON data
2. Update the database schema if needed
3. Re-seed the database

### 3. Customizing AI Prompts
1. Modify prompts in `lib/lyceum-ai.ts`
2. Update the AI integration logic
3. Test with the AI endpoints

## Testing

### 1. Unit Tests
```bash
npm test
```

### 2. Integration Tests
```bash
npm run test:integration
```

### 3. E2E Tests
```bash
npm run test:e2e
```

## Performance Considerations

### 1. Database Optimization
- Indexes on frequently queried fields
- Efficient relationships and queries
- Pagination for large datasets

### 2. Caching
- React Query for API caching
- Static generation for content
- CDN for assets

### 3. Bundle Size
- Code splitting for components
- Lazy loading for heavy features
- Tree shaking for unused code

## Security

### 1. Authentication
- NextAuth.js integration
- Session management
- Protected routes

### 2. Authorization
- User-specific data access
- Role-based permissions
- Input validation

### 3. Data Protection
- SQL injection prevention
- XSS protection
- CSRF tokens

## Monitoring & Analytics

### 1. User Engagement
- Path completion rates
- Activity participation
- Community engagement

### 2. Learning Effectiveness
- Mastery domain progress
- Time to completion
- User feedback

### 3. System Performance
- API response times
- Database query performance
- Error rates

## Future Enhancements

### 1. Advanced Features
- Gamification elements
- Social learning features
- Mobile app
- Offline support

### 2. AI Improvements
- Personalized learning paths
- Adaptive difficulty
- Advanced analytics

### 3. Content Expansion
- Additional philosophical traditions
- Multimedia content
- Interactive simulations

## Support

For questions or issues with the Lyceum implementation:

1. Check the documentation
2. Review the code comments
3. Test with the provided examples
4. Contact the development team

## License

This implementation is part of the Aristotle Academy project and follows the same licensing terms.
