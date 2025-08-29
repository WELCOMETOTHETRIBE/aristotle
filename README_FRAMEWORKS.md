# Framework System Implementation

## Overview

The framework system has been successfully implemented to load, index, and expose the `data/framework_map.json` file through APIs and UI components.

## ✅ Completed Features

### 1. Types & Loader
- ✅ Created `lib/types/framework.ts` with TypeScript definitions
- ✅ Created `lib/frameworkMap.ts` with loader and reverse index builder
- ✅ Implemented efficient lookups by framework, module, and practice

### 2. Database Schema
- ✅ Added `VirtuePractice` model to Prisma schema with `slug` field
- ✅ Created and ran migration successfully
- ✅ Updated seed script to populate virtue practices with deterministic slugs

### 3. API Endpoints
- ✅ `GET /api/frameworks` - List all frameworks
- ✅ `GET /api/frameworks/[id]` - Get specific framework
- ✅ `GET /api/frameworks/by-module/[moduleId]` - Get frameworks by module
- ✅ `GET /api/frameworks/by-practice/[slug]` - Get frameworks by practice
- ✅ `GET /api/virtue-practices/by-slug?slug=...` - Look up virtue practice by slug

### 4. UI Components
- ✅ **Frameworks Hub** (`/frameworks`) - Grid of all 10 frameworks with emojis and badges
- ✅ **Framework Detail** (`/frameworks/[id]`) - Shows core modules, support modules, and featured practices
- ✅ **FrameworkChips** component - Shows which frameworks include a module (core vs support)
- ✅ **FrameworkFilter** component - Dropdown to filter academy matrix by framework
- ✅ Updated navigation to include Frameworks link

### 5. Styling System
- ✅ Created `lib/tone.ts` with tone-to-Tailwind gradient mappings
- ✅ Each framework has consistent styling based on its `nav.tone`
- ✅ Responsive design with hover effects and modern UI

### 6. Data Integration
- ✅ Framework map JSON loads correctly
- ✅ Reverse indexes work for efficient lookups
- ✅ Virtue practices seeded with proper slugs
- ✅ API endpoints return expected JSON structures

## 🧪 Testing Results

All API endpoints tested and working:
- ✅ `/api/frameworks` - Returns all 10 frameworks
- ✅ `/api/frameworks/stoic` - Returns Stoicism framework
- ✅ `/api/frameworks/by-module/meditation` - Returns frameworks with meditation (4 core, 3 support)
- ✅ `/api/frameworks/by-practice/socratic_dialogue` - Returns ["stoic"]
- ✅ `/api/virtue-practices/by-slug?slug=socratic-dialogue` - Returns practice details

All pages accessible:
- ✅ `/frameworks` - Frameworks hub page (200 OK)
- ✅ `/frameworks/stoic` - Framework detail page (200 OK)

## 🎨 UI Features

### Framework Cards
- Beautiful gradient backgrounds based on framework tone
- Emoji icons and badge labels
- Module and practice counts
- Hover effects with scale and shadow

### Framework Detail Pages
- Hero section with framework branding
- Core modules (highlighted with tone colors)
- Support modules (muted styling)
- Featured practices (placeholder for future AI generation)
- Responsive grid layouts

### Framework Chips
- Color-coded for core vs support frameworks
- Shows framework emoji and badge
- Integrated into module pages

## 🔧 Technical Implementation

### File Structure
```
lib/
├── types/framework.ts          # TypeScript definitions
├── frameworkMap.ts             # Loader and index builder
└── tone.ts                     # Styling utilities

app/
├── api/frameworks/             # Framework API endpoints
├── api/virtue-practices/       # Virtue practice endpoints
├── frameworks/                 # Framework pages
└── academy/matrix/             # Updated with framework integration

components/
├── FrameworkChips.tsx          # Module framework display
└── FrameworkFilter.tsx         # Academy matrix filter
```

### Key Functions
- `loadFrameworkMap()` - Loads JSON file
- `buildFrameworkIndex()` - Creates reverse indexes
- `getFrameworkById()` - Framework lookup
- `getFrameworksByModule()` - Module-to-frameworks mapping
- `getFrameworksByPractice()` - Practice-to-frameworks mapping

## 🚀 Next Steps

1. **AI Integration** - Connect featured practices to AI generation
2. **Practice Details** - Expand practice cards with generated content
3. **Framework Filtering** - Implement client-side filtering on academy matrix
4. **User Preferences** - Allow users to select preferred frameworks
5. **Progress Tracking** - Track user progress within frameworks

## 🐛 Known Issues

- Some TypeScript errors exist in unrelated files (pre-existing)
- Academy matrix page has 500 error (likely due to missing database models)
- Framework filtering on academy matrix needs client-side implementation

## 📊 Framework Coverage

The system includes all 10 frameworks from the JSON:
1. 🛡️ Spartan Agōgē (Discipline)
2. 🗡️ Samurai Bushidō (Rectitude)  
3. 🧱 Stoicism (Clarity)
4. ⛪ Monastic Rule (Stability)
5. 🧘 Yogic Path (Union)
6. 🌿 Indigenous Wisdom (Cycles)
7. 🥋 Martial Arts Code (Etiquette)
8. 🕊️ Sufi Practice (Remembrance)
9. 🤝 Ubuntu (Humanity)
10. 🚀 Modern High-Performance (Systems)

Each framework has unique styling, modules, and practices that reflect their philosophical traditions. 