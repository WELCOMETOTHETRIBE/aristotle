# 🧘 Balance Widget

A fully functional motion-sensing balance widget that leverages the iPhone's accelerometer to detect even the slightest motion, helping users develop stillness and focus through interactive balance challenges.

## ✨ Features

### 🎯 Motion Detection
- **High-Precision Sensors**: Uses device accelerometer for real-time motion tracking
- **Three Sensitivity Levels**: 
  - **Low**: Forgiving - allows more movement (threshold: 0.5g)
  - **Medium**: Balanced - moderate stability required (threshold: 0.3g)
  - **High**: Precise - requires very stable balance (threshold: 0.15g)
- **Real-Time Feedback**: Visual indicators show balance status (🟢 stable, 🟡 acceptable, 🔴 unstable)

### 🏆 Progress Tracking
- **Balance Time**: Tracks how long you maintain stability
- **Streak System**: Builds consecutive stable moments
- **Best Streak**: Records your highest streak achievement
- **Progress Bar**: Visual representation of completion percentage

### 🎮 Interactive Controls
- **Start/Pause**: Begin or pause balance sessions
- **Reset**: Clear current session and start fresh
- **Complete**: Submit session results for virtue XP
- **Auto-Completion**: Automatically completes when target time is reached

### 🎨 Visual Design
- **Glass Card Interface**: Consistent with app's design system
- **Motion Indicators**: Large emoji-based status display
- **Progress Visualization**: Gradient progress bars and streak counters
- **Responsive Layout**: Works on all device sizes

## 🚀 Usage

### Basic Operation
1. **Hold Device**: Grip your phone/tablet firmly in both hands
2. **Find Balance**: Keep the device as still as possible
3. **Watch Indicators**: Green = stable, Yellow = acceptable, Red = too much motion
4. **Build Streaks**: Maintain stability to increase your score
5. **Complete Challenge**: Reach target time or manually complete

### Pro Tips
- Rest your elbows on a stable surface for better control
- Breathe slowly and steadily to reduce hand tremors
- Start with low sensitivity and work your way up
- Use both hands for maximum stability
- Find a comfortable, supported position

## 🔧 Technical Implementation

### Device Motion API
```typescript
// Request permission on iOS
if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
  (DeviceMotionEvent as any).requestPermission().then((permission: string) => {
    if (permission === 'granted') {
      window.addEventListener('devicemotion', handleMotion);
    }
  });
}
```

### Motion Processing
```typescript
const handleMotion = (event: DeviceMotionEvent) => {
  const { accelerationIncludingGravity } = event;
  const { x, y, z } = accelerationIncludingGravity;
  
  // Calculate motion magnitude
  const magnitude = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
  
  // Check if motion is within acceptable range
  const isBalanced = magnitude < threshold;
  
  if (isBalanced) {
    setCurrentStreak(prev => prev + 1);
  } else {
    setCurrentStreak(0);
  }
};
```

### Performance Optimization
- **RequestAnimationFrame**: Smooth 60fps balance time updates
- **Motion History**: Stores last 50 motion data points
- **Efficient State Updates**: Minimal re-renders during active sessions
- **Memory Management**: Proper cleanup of event listeners and timers

## 🏗️ Integration

### Widget System
The Balance widget is fully integrated into the app's widget system:

- **Widget Type**: `BALANCE_GYRO`
- **Configuration Schema**: Supports `targetSec`, `sensitivity`, and `teaching`
- **Virtue Integration**: Grants XP for temperance, wisdom, and courage
- **KPI Tracking**: Records balance time, attempts, best streak, and sensitivity level

### Framework Integration
Added to the Spartan framework as a core training widget:

```typescript
{
  id: 'spartan_balance',
  kind: 'BALANCE_GYRO',
  title: 'Spartan Balance',
  config: {
    targetSec: 90,
    sensitivity: 'medium',
    teaching: 'Hold steady like a Spartan warrior'
  },
  virtueGrantPerCompletion: { temperance: 2, courage: 1 }
}
```

### Available Locations
- **Widget Renderer**: Available via `balance_gyro` widget ID
- **Module Widgets**: Integrated into module system
- **Today Page**: Can be added to user's dashboard
- **Demo Page**: `/balance-demo` for testing and demonstration

## 📱 Device Compatibility

### Supported Devices
- **iPhone**: All models with motion sensors
- **iPad**: All models with motion sensors
- **Android**: Devices with accelerometer support
- **Desktop**: Graceful fallback for unsupported devices

### Permission Requirements
- **iOS**: Requires explicit permission for motion data
- **Android**: Motion data available by default
- **Web**: Uses standard DeviceMotionEvent API

### Fallback Behavior
When motion sensors are unavailable:
- Shows informative message about device requirements
- Maintains consistent UI structure
- Provides alternative balance exercises

## 🎯 Use Cases

### Personal Development
- **Mindfulness Training**: Develop focus and present-moment awareness
- **Physical Control**: Improve hand stability and coordination
- **Stress Reduction**: Use as a calming, centering practice
- **Concentration**: Build ability to maintain attention

### Framework Integration
- **Spartan Training**: Part of physical discipline regimen
- **Meditation Support**: Complements breathing and focus practices
- **Virtue Development**: Builds temperance through self-control
- **Progress Tracking**: Measurable improvement in stability

### Therapeutic Applications
- **Anxiety Management**: Calming focus exercise
- **ADHD Support**: Concentration and stillness training
- **Rehabilitation**: Fine motor control development
- **Aging Support**: Maintain balance and coordination

## 🔮 Future Enhancements

### Planned Features
- **Custom Patterns**: User-defined balance challenges
- **Social Features**: Share achievements and compete with friends
- **Advanced Analytics**: Detailed motion pattern analysis
- **Integration**: Connect with other wellness apps
- **Accessibility**: Voice feedback and haptic responses

### Technical Improvements
- **Machine Learning**: Adaptive sensitivity based on user performance
- **Sensor Fusion**: Combine accelerometer with gyroscope data
- **Offline Support**: Local data storage and sync
- **Performance**: Optimize for battery life and responsiveness

## 🧪 Testing

### Demo Page
Visit `/balance-demo` to test the widget with different configurations:
- **Beginner**: 30 seconds, low sensitivity
- **Intermediate**: 60 seconds, medium sensitivity  
- **Advanced**: 120 seconds, high sensitivity

### Testing Checklist
- [ ] Motion detection works on supported devices
- [ ] Permission requests function correctly on iOS
- [ ] All sensitivity levels respond appropriately
- [ ] Streak system counts correctly
- [ ] Progress tracking updates in real-time
- [ ] Completion flow works as expected
- [ ] Virtue XP is granted properly
- [ ] UI responds to different screen sizes
- [ ] Fallback behavior works on unsupported devices

## 📚 Related Documentation

- [Widget Integrity System](../README_WIDGET_INTEGRITY.md)
- [Framework System](../README_FRAMEWORKS.md)
- [Virtue System](../README_ANCIENT_WISDOM.md)
- [Component Library](../components/README.md)

---

The Balance widget represents a unique fusion of ancient wisdom (stillness and focus) with modern technology (motion sensors), providing users with a tangible way to develop the virtue of temperance through physical practice. 