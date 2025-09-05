# Framework Selection in User Settings

## Overview
This document outlines the implementation of framework selection functionality in the user settings page, allowing users to select multiple philosophical frameworks that resonate with them.

## ✅ Implementation Complete

### 1. Database Schema Updates
- **Added `frameworks` field** to `UserPreference` model
- **Migration created**: `20250905034705_add_frameworks_field`
- **Field type**: `String?` (stores JSON array of framework IDs)
- **Backward compatibility**: Maintains existing `framework` field for primary framework

### 2. New Components Created

#### FrameworkSelector Component
- **Location**: `components/FrameworkSelector.tsx`
- **Features**:
  - Multi-select framework interface
  - Visual framework cards with emojis and badges
  - Expandable/collapsible design
  - Real-time selection updates
  - Tone-based color coding for each framework
  - Selected frameworks preview

#### Key Features:
- **Visual Design**: Each framework displays with its emoji, name, and badge
- **Color Coding**: Frameworks are color-coded based on their tone (gritty, calm, honor, etc.)
- **Selection State**: Clear visual indication of selected frameworks
- **Responsive**: Works on both desktop and mobile devices

### 3. Settings Page Updates
- **Location**: `app/settings/page.tsx`
- **New Section**: "Frameworks" section added to settings
- **Integration**: FrameworkSelector component integrated into settings
- **State Management**: Proper handling of framework selection state
- **Persistence**: Framework selections saved to database and localStorage

### 4. API Updates
- **Location**: `app/api/prefs/route.ts`
- **Enhanced GET**: Returns both `framework` and `frameworks` fields
- **Enhanced POST**: Handles saving of multiple framework selections
- **Data Format**: Stores frameworks as JSON string in database
- **Backward Compatibility**: Maintains support for single framework selection

## Technical Implementation

### Database Schema
```sql
-- UserPreference model updated
model UserPreference {
  userId     Int     @id
  user       User    @relation(fields: [userId], references: [id])
  framework  String? // Primary framework (backward compatibility)
  frameworks String? // JSON array of selected framework IDs
  style      String?
  locale     String? @default("en")
  name       String?
  timezone   String?
  updatedAt  DateTime @default(now())
}
```

### Framework Data Structure
```typescript
interface Framework {
  id: string;
  name: string;
  nav: {
    tone: string;
    badge: string;
    emoji: string;
  };
  description?: string;
}
```

### API Response Format
```json
{
  "preferences": {
    "displayName": "User",
    "email": "user@example.com",
    "timezone": "UTC",
    "framework": "stoic", // Primary framework
    "frameworks": "[\"stoic\", \"spartan\", \"bushido\"]", // JSON string
    "selectedFrameworks": ["stoic", "spartan", "bushido"], // Parsed array
    "theme": "dark",
    "focusVirtue": "wisdom"
  }
}
```

## Available Frameworks

The system supports selection from 10 philosophical frameworks:

1. **Spartan Agōgē** 🛡️ - Discipline and resilience
2. **Samurai Bushidō** 🗡️ - Honor and rectitude  
3. **Stoicism** 🧱 - Clarity and rational thinking
4. **Monastic Rule** ⛪ - Contemplation and service
5. **Viking Berserker** ⚔️ - Courage and strength
6. **Celtic Druid** 🌿 - Nature and wisdom
7. **Tibetan Monk** 🧘 - Mindfulness and compassion
8. **Taoist Sage** ☯️ - Balance and flow
9. **Epicurean** 🍇 - Pleasure and moderation
10. **Aristotelian** 📚 - Virtue and flourishing

## User Experience

### Framework Selection Flow
1. **Navigate to Settings**: User goes to `/settings`
2. **Find Frameworks Section**: Located prominently in settings
3. **Expand Framework List**: Click to see all available frameworks
4. **Select Frameworks**: Click on framework cards to select/deselect
5. **Visual Feedback**: Selected frameworks show checkmarks and color coding
6. **Auto-Save**: Selections are automatically saved to database
7. **Preview**: Selected frameworks shown in collapsed view

### Visual Design Features
- **Tone-Based Colors**: Each framework has unique color scheme based on its tone
- **Emoji Icons**: Visual representation of each framework
- **Badge Display**: Shows the core virtue/badge of each framework
- **Selection Indicators**: Clear visual feedback for selected frameworks
- **Smooth Animations**: Framer Motion animations for smooth interactions

## Integration Points

### 1. Onboarding Integration
- Framework selection during onboarding flows into settings
- Primary framework set as first selected framework
- Secondary frameworks added to frameworks array

### 2. Daily Wisdom Integration
- Framework preferences influence AI-generated content
- Selected frameworks determine which philosophical perspectives to include
- Personalized wisdom based on user's framework selections

### 3. Academy Matrix Integration
- Framework selections filter available modules and practices
- Users see content relevant to their selected frameworks
- Framework-specific guidance and recommendations

## Testing

### Component Testing
- **FrameworkSelector.test.tsx**: Unit tests for framework selection component
- **Mock Data**: Test frameworks with proper structure
- **User Interactions**: Test selection, deselection, and expansion
- **API Integration**: Mock API responses for testing

### Integration Testing
- **Settings Page**: Full settings page with framework selection
- **API Endpoints**: Test framework saving and loading
- **Database**: Verify framework data persistence
- **Cross-Platform**: Test on desktop and mobile devices

## Future Enhancements

### 1. Advanced Framework Features
- **Framework Weights**: Allow users to weight their framework preferences
- **Framework Evolution**: Track how framework preferences change over time
- **Framework Recommendations**: Suggest new frameworks based on current selections

### 2. Enhanced UI/UX
- **Framework Descriptions**: Show detailed descriptions in selection interface
- **Framework Comparison**: Side-by-side comparison of frameworks
- **Framework Journey**: Visual representation of philosophical journey

### 3. Personalization
- **Framework-Specific Content**: Tailor all app content to selected frameworks
- **Framework Communities**: Connect users with similar framework preferences
- **Framework Challenges**: Framework-specific challenges and practices

## Conclusion

The framework selection system is now fully implemented and provides users with:

1. **Comprehensive Selection**: Choose from 10 philosophical frameworks
2. **Visual Interface**: Intuitive, color-coded selection interface
3. **Persistent Storage**: Framework selections saved to database
4. **Integration Ready**: Seamlessly integrates with existing app features
5. **Future-Proof**: Extensible design for additional frameworks and features

Users can now personalize their Aristotle experience by selecting the philosophical frameworks that resonate most with their personal growth journey.
