# 🧪 Widget Integrity & Consistency System

A comprehensive self-testing and auto-healing integrity system that guarantees all widgets are consistently configured and rendered across every framework page and the dashboard.

## 🎯 Overview

This system implements a **Widget Conformance Contract** with runtime validation, auto-healing capabilities, and comprehensive testing to ensure:

- ✅ All widgets have required fields (title, teaching, KPIs, virtue grants)
- ✅ Widget configurations are valid for their type
- ✅ Breath widgets are always present and positioned last
- ✅ Teaching chips are displayed consistently
- ✅ Complete buttons work correctly with proper KPIs and virtue XP
- ✅ Graceful fallbacks when widgets fail validation

## 🏗️ Architecture

### Core Components

1. **Widget Conformance Contract** (`lib/widget-integrity.ts`)
   - Strongly typed schemas for all widget kinds
   - Default tables for missing configurations
   - Validation and normalization functions

2. **Self-Test Harness** (`app/api/debug/widget-integrity/route.ts`)
   - Validates all frameworks and widgets
   - Generates comprehensive reports
   - Supports both JSON and pretty-printed output

3. **Runtime Guardrails** (`components/WidgetGuard.tsx`)
   - Wraps widget rendering with validation
   - Shows quarantine cards for broken widgets
   - Provides safe defaults when needed

4. **Developer Tools**
   - **Conformance Matrix** (`components/ConformanceMatrix.tsx`) - Visual framework × widget status
   - **Integrity Dashboard** (`components/IntegrityDashboard.tsx`) - Real-time telemetry
   - **Developer Toolbar** (`components/DeveloperToolbar.tsx`) - Quick access to tools

## 📋 Widget Conformance Contract

### Required Fields

Every widget must have:

```typescript
{
  id: string;                    // Unique identifier
  kind: WidgetKind;             // One of 11 supported types
  title: string;                // Non-empty display name
  config: Record<string, any>;  // Type-specific configuration
  virtueGrantPerCompletion: {   // At least one virtue
    wisdom?: number;            // 0-5 points
    justice?: number;           // 0-5 points
    courage?: number;           // 0-5 points
    temperance?: number;        // 0-5 points
  };
  teaching?: string;            // <= 140 chars, auto-generated if missing
  kpis?: string[];              // At least one KPI, auto-generated if missing
}
```

### Widget Types & Configs

| Type | Config Schema | Default KPIs |
|------|---------------|--------------|
| `TIMER` | `{ targetSec?, allowRPE? }` | `duration_sec, rpe, mood_pre, mood_post` |
| `COUNTER` | `{ targetReps?, step? }` | `reps_completed, target_reached, percentage` |
| `DRAG_BOARD` | `{ columns[], items[] }` | `items_moved, columns_used` |
| `CHECKLIST` | `{ items[] }` | `items_completed, total_items, completion_rate` |
| `JOURNAL` | `{ minWords?, aiCoaching?, prompt }` | `word_count, ai_coaching_used` |
| `AUDIO_NOTE` | `{ maxSec, transcribe? }` | `duration_sec, transcribed` |
| `PHOTO` | `{ tags? }` | `photos_taken, tags_used` |
| `BREATH` | `{ pattern, params }` | `cycles_completed, duration_sec, pattern_used` |
| `BALANCE_GYRO` | `{ targetSec? }` | `balance_sec, attempts` |
| `WHEEL` | `{ options[] }` | `selection_made, options_available` |
| `SLIDERS` | `{ virtues? }` | `virtues_assessed, slider_values` |

## 🔧 Auto-Healing Features

### Missing Field Detection & Repair

The system automatically detects and fixes:

1. **Missing Teaching**: Auto-generates context-appropriate teaching text
2. **Missing KPIs**: Adds default KPIs based on widget type
3. **Missing Virtue Grants**: Infers from framework's primary/secondary virtues
4. **Missing Config Values**: Applies sensible defaults for each widget type
5. **Missing Breath Widget**: Creates framework-appropriate breath widget
6. **Wrong Widget Order**: Ensures breath widget is always last

### Example Auto-Fixes

```typescript
// Before (broken widget)
{
  id: "my_timer",
  kind: "TIMER",
  title: "My Timer",
  config: { duration: 300 }, // Wrong field name
  virtueGrantPerCompletion: {} // Empty
}

// After (auto-healed)
{
  id: "my_timer",
  kind: "TIMER",
  title: "My Timer",
  config: { 
    targetSec: 300,  // Fixed field name
    allowRPE: true   // Added default
  },
  virtueGrantPerCompletion: { wisdom: 2 }, // Inferred from framework
  teaching: "Focus on the present moment", // Auto-generated
  kpis: ["duration_sec", "rpe", "mood_pre", "mood_post"] // Added defaults
}
```

## 🧪 Testing & Validation

### Running Tests

```bash
# Full integrity test
npm run test:integrity

# Or use the script directly
node scripts/run-widget-integrity-test.js

# API endpoint
curl "http://localhost:3000/api/debug/widget-integrity?format=pretty"

# Test specific framework
curl "http://localhost:3000/api/debug/widget-integrity?framework=spartan&format=pretty"
```

### Test Results

The system provides comprehensive reporting:

```
🧪 WIDGET INTEGRITY TEST - FULL REPORT
============================================================

OVERALL SUMMARY:
• Frameworks: 10/10 passed
• Widgets: 50/50 passed
• Total Fixes Applied: 101

📈 INTEGRITY SUMMARY:
• Framework Health: 100.0%
• Widget Health: 100.0%
• Overall Health: 100.0%

💡 RECOMMENDATIONS:
✅ EXCELLENT: Widget integrity is in excellent condition
```

## 🛡️ Runtime Guardrails

### WidgetGuard Component

Every widget is wrapped with validation:

```tsx
<WidgetGuard
  widget={widget}
  framework={framework}
  onComplete={handleWidgetComplete}
>
  {(normalizedWidget, onComplete) => (
    <TimerCard
      title={normalizedWidget.title}
      config={normalizedWidget.config}
      onComplete={onComplete}
      virtueGrantPerCompletion={normalizedWidget.virtueGrantPerCompletion}
    />
  )}
</WidgetGuard>
```

### Quarantine System

When validation fails, users see a **Quarantine Card** with:

- 🔍 Clear error explanation
- 💡 Suggested fixes
- 🛡️ Safe default configuration
- 🔄 Retry validation option

### Telemetry & Monitoring

The system tracks:

- `widget_validated` - Successful validations
- `widget_normalized` - Auto-fixes applied
- `widget_quarantined` - Validation failures
- `checkin_posted` - Widget completions
- `kpi_missing` - Missing KPI data
- `virtue_missing` - Missing virtue grants

## 🎛️ Developer Tools

### Conformance Matrix

Visual framework × widget status matrix showing:
- ✅ Pass (validated + mounted + completed)
- 🛠️ Fixed (normalized with warnings)
- ❌ Fail (blocking issues)

### Integrity Dashboard

Real-time telemetry dashboard with:
- Quarantine rate monitoring
- KPI compliance tracking
- Virtue compliance tracking
- Recent event logs
- Alert thresholds

### Developer Toolbar

Development-only toolbar with:
- **Test** - Open conformance matrix
- **Monitor** - Open integrity dashboard
- **Quick** - Run quick self-test

## 📊 Current Status

### Test Results Summary

```
📈 INTEGRITY SUMMARY:
• Total Frameworks: 10
• Passed Frameworks: 10
• Failed Frameworks: 0
• Total Widgets: 50
• Passed Widgets: 50
• Failed Widgets: 0
• Total Auto-Fixes: 101

🏥 HEALTH SCORES:
• Framework Health: 100.0%
• Widget Health: 100.0%
• Overall Health: 100.0%
```

### Auto-Fixes Applied

The system automatically applied 101 fixes across all frameworks:

- **Teaching Text**: 50 widgets received auto-generated teaching
- **KPI Definitions**: 50 widgets received default KPI arrays
- **Config Defaults**: Various missing config values were filled
- **Virtue Grants**: Empty virtue grants were inferred from frameworks

## 🚀 Usage

### For Developers

1. **Run Integrity Tests**:
   ```bash
   npm run test:integrity
   ```

2. **View Conformance Matrix**:
   - Open any framework page
   - Click the "DEV" toolbar at bottom-right
   - Click "Test" button

3. **Monitor Real-time Health**:
   - Click "Monitor" in developer toolbar
   - View telemetry and alerts

### For Users

The system is **completely transparent** to users:

- ✅ Widgets work normally when valid
- 🛡️ Broken widgets show helpful quarantine cards
- 🔄 Users can retry or use safe defaults
- 📊 No user-facing errors or crashes

## 🔮 Future Enhancements

### Planned Features

1. **Visual Smoke Tests**: Automated screenshot testing
2. **Accessibility Validation**: WCAG compliance checking
3. **Performance Monitoring**: Widget render time tracking
4. **A/B Testing Support**: Widget variant validation
5. **Internationalization**: Multi-language widget validation

### Integration Points

- **CI/CD Pipeline**: Automated integrity checks
- **Monitoring**: Alert integration for quarantine rates
- **Analytics**: Widget usage and completion tracking
- **Admin Panel**: Framework configuration management

## 📝 Configuration

### Environment Variables

```bash
# Development server URL for testing
APP_URL=http://localhost:3000

# Telemetry endpoint (future)
INTEGRITY_TELEMETRY_URL=https://telemetry.example.com
```

### Customization

To add new widget types:

1. Update `WidgetKindSchema` in `lib/widget-integrity.ts`
2. Add config schema to `WidgetConfigSchema`
3. Add defaults to `WIDGET_DEFAULTS`
4. Update widget components to handle new type

## 🤝 Contributing

When adding new widgets or frameworks:

1. **Run integrity tests** before and after changes
2. **Ensure all required fields** are present
3. **Test quarantine scenarios** with invalid configs
4. **Update documentation** for new widget types
5. **Add telemetry events** for new interactions

## 📚 Related Documentation

- [Framework Configuration Guide](../README_FRAMEWORKS.md)
- [Widget Development Guide](../docs/widgets.md)
- [API Reference](../docs/api.md)
- [Testing Guide](../docs/testing.md)

---

**Status**: ✅ **Production Ready** - All frameworks pass validation with auto-healing
**Last Updated**: December 2024
**Version**: 1.0.0 