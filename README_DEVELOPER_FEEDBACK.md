# Developer Feedback System

A real-time feedback system that allows developers to comment on widgets, sections, and general aspects of the app while using it in development mode.

## Features

- **Widget Feedback**: Add comments to specific widgets with context
- **Section Feedback**: Comment on entire sections (Quest Deck, Breathwork, etc.)
- **General Feedback**: Provide overall page or app feedback
- **Priority Levels**: Mark feedback as Low, Medium, High, or Critical
- **Categories**: Categorize feedback as Bug, Feature, Improvement, Design, Performance, or Other
- **Status Tracking**: Track feedback status (Open, In Progress, Resolved, Won't Fix)
- **Export/Import**: Export feedback data for sharing or import existing feedback

## How to Use

### 1. Adding Feedback

1. **Start the app in development mode**:
   ```bash
   npm run dev
   ```

2. **Navigate to any framework page** (e.g., `/frameworks/stoic`)

3. **Look for feedback buttons**:
   - **Widget feedback**: Small blue message icon that appears when hovering over widgets
   - **Section feedback**: Available on major sections like Quest Deck, Breathwork Practice, etc.
   - **General feedback**: Blue message icon in the top-right corner of the page

4. **Click the feedback button** to open the feedback modal

5. **Fill out the feedback form**:
   - Select a category (Bug, Feature, Improvement, etc.)
   - Choose priority level
   - Write your comment
   - Submit with Cmd/Ctrl + Enter or click Submit

### 2. Viewing Feedback

#### Developer Toolbar
- Click the "Feedback" button in the developer toolbar (bottom-right)
- View all feedback with filtering options
- Update status or delete feedback items

#### API Endpoint
- **JSON format**: `GET /api/debug/developer-feedback`
- **Text format**: `GET /api/debug/developer-feedback?format=text`
- **Clear all**: `GET /api/debug/developer-feedback?clear=true`

#### Export Script
```bash
npm run feedback:export
```

This will:
- Display a summary of all feedback
- Show detailed feedback with color coding
- Save feedback to a JSON file
- Provide instructions for sharing

### 3. Sharing Feedback

After running the export script, you can share feedback with me by:

1. **Copy the JSON file content**:
   ```bash
   cat developer-feedback-2024-01-15.json
   ```

2. **Paste the content** in our conversation

3. **Or share the file directly** if you prefer

## Feedback Structure

Each feedback item includes:

```typescript
{
  id: string;
  timestamp: Date;
  type: 'widget' | 'section' | 'general';
  targetId: string; // widget ID, section ID, or 'general'
  frameworkSlug?: string; // for widget feedback
  location: string; // page path
  comment: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved' | 'wont-fix';
  category: 'bug' | 'feature' | 'improvement' | 'design' | 'performance' | 'other';
  metadata?: Record<string, any>; // additional context
}
```

## Examples

### Widget Feedback
```
Category: Bug (High Priority)
Type: widget
Target: cold_heat_timer
Framework: spartan
Location: /frameworks/spartan
Comment: Timer doesn't reset properly after completion. The countdown continues even after the session is done.
```

### Section Feedback
```
Category: Improvement (Medium Priority)
Type: section
Target: breathwork_practice
Location: /frameworks/stoic
Comment: The breathwork section could benefit from more visual guidance. Consider adding animated breathing patterns.
```

### General Feedback
```
Category: Feature (Low Priority)
Type: general
Target: framework_page
Location: /frameworks/stoic
Comment: Would be great to have a "favorite frameworks" feature to quickly access frequently used ones.
```

## Development Notes

- **Development Only**: Feedback system only appears in development mode (`NODE_ENV === 'development'`)
- **In-Memory Storage**: Feedback is stored in memory during development (not persisted to database)
- **Console Logging**: All feedback is logged to console for immediate visibility
- **No Production Impact**: The system has zero impact on production builds

## Integration with AI Assistant

When you share feedback with me, I can:

1. **Analyze patterns** in your feedback
2. **Prioritize fixes** based on your priority levels
3. **Implement improvements** directly based on your comments
4. **Reference specific feedback** when making changes
5. **Track progress** on feedback items

This creates a seamless feedback loop where you can provide real-time input while using the app, and I can act on that feedback immediately.

## Quick Commands

```bash
# Start development server
npm run dev

# Export feedback data
npm run feedback:export

# Clear all feedback
curl "http://localhost:3000/api/debug/developer-feedback?clear=true"

# Get feedback as JSON
curl "http://localhost:3000/api/debug/developer-feedback"

# Get feedback as text
curl "http://localhost:3000/api/debug/developer-feedback?format=text"
``` 