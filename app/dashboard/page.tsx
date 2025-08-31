'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, CheckCircle, Clock, TrendingUp, Heart, Brain, Calendar, Droplets, Smile, Zap, Trophy, Info, BookOpen, Timer, Hash, Camera, Mic, CheckSquare, FileText, Sliders, RotateCcw, Users, Star, Leaf, Shield, Scale, Settings, Moon, Dumbbell, Activity } from 'lucide-react';


import WidgetGallery from '@/components/WidgetGallery';
import WidgetRenderer from '@/components/WidgetRenderer';



interface WidgetInfo {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: string;
  color: string;
}

const WIDGET_INFO: WidgetInfo[] = [
  // Core Category - Essential daily management
  {
    id: 'virtue_progress',
    title: 'Virtue Progress',
    description: 'Track your daily virtue scores and see your 7-day averages. Monitor your growth in wisdom, courage, justice, and temperance.',
    icon: Trophy,
    category: 'core',
    color: 'text-blue-500'
  },
  {
    id: 'habit_manager',
    title: 'Habit Manager',
    description: 'Track your daily habits and build streaks. Check in daily to maintain momentum and see your progress over time.',
    icon: TrendingUp,
    category: 'core',
    color: 'text-orange-500'
  },
  {
    id: 'task_manager',
    title: 'Task Manager',
    description: 'Manage your daily tasks and priorities. Mark tasks complete and track your productivity throughout the day.',
    icon: Target,
    category: 'core',
    color: 'text-green-500'
  },
  {
    id: 'goal_tracker',
    title: 'Goal Tracker',
    description: 'Track your long-term goals and objectives. Monitor progress and stay focused on what matters most.',
    icon: Brain,
    category: 'core',
    color: 'text-purple-500'
  },

  // Practice Category - Active engagement and training
  {
    id: 'breathwork_timer',
    title: 'Breathwork Practice',
    description: 'Master your breath with guided breathing patterns. Choose from Stoic, Spartan, or other framework-specific patterns.',
    icon: Zap,
    category: 'practice',
    color: 'text-green-500'
  },
  {
    id: 'focus_timer',
    title: 'Focus Timer',
    description: 'Deep work sessions with customizable duration. Track your focus time and build concentration skills.',
    icon: Timer,
    category: 'practice',
    color: 'text-blue-500'
  },
  {
    id: 'meditation_timer',
    title: 'Meditation Timer',
    description: 'Guided meditation sessions with customizable duration. Build mindfulness and inner peace through regular practice.',
    icon: Leaf,
    category: 'practice',
    color: 'text-green-500'
  },
  {
    id: 'strength_counter',
    title: 'Strength Counter',
    description: 'Track physical exercises and repetitions. Build strength and discipline through consistent training.',
    icon: Shield,
    category: 'practice',
    color: 'text-orange-500'
  },
  {
    id: 'voice_notes',
    title: 'Voice Notes',
    description: 'Record audio reflections and insights. Capture thoughts and ideas through voice with AI-powered transcription.',
    icon: Mic,
    category: 'practice',
    color: 'text-purple-500'
  },
  {
    id: 'movement_widget',
    title: 'Movement & Posture',
    description: 'Track movement, posture correction exercises, and physical activity patterns for optimal health.',
    icon: Dumbbell,
    category: 'practice',
    color: 'text-orange-500'
  },

  // Health Category - Physical and mental well-being
  {
    id: 'hydration_tracker',
    title: 'Hydration Tracker',
    description: 'Track your daily water intake. Use the quick-add buttons to log your consumption throughout the day.',
    icon: Droplets,
    category: 'health',
    color: 'text-blue-500'
  },
  {
    id: 'mood_tracker',
    title: 'Mood Tracker',
    description: 'Rate your daily mood on a 1-5 scale. Your mood data helps track patterns and emotional well-being.',
    icon: Smile,
    category: 'health',
    color: 'text-yellow-500'
  },
  {
    id: 'hedonic_awareness',
    title: 'Hedonic Awareness',
    description: 'Monitor your patterns and triggers to break negative cycles and build healthier habits.',
    icon: Heart,
    category: 'health',
    color: 'text-purple-500'
  },
  {
    id: 'sleep_tracker',
    title: 'Sleep Tracker',
    description: 'Track your sleep patterns, quality, and circadian rhythm to optimize your rest and recovery.',
    icon: Moon,
    category: 'health',
    color: 'text-indigo-500'
  },

  // Wisdom Category - Philosophical and reflective practices
  {
    id: 'wisdom_spotlight',
    title: 'Wisdom Spotlight',
    description: 'Daily curated wisdom from ancient traditions. Reflect on timeless teachings and apply them to modern life.',
    icon: BookOpen,
    category: 'wisdom',
    color: 'text-purple-500'
  },
  {
    id: 'gratitude_journal',
    title: 'Gratitude Journal',
    description: 'Write daily gratitude entries with AI insights. Cultivate appreciation and positive mindset through regular practice.',
    icon: Heart,
    category: 'wisdom',
    color: 'text-red-500'
  },
  {
    id: 'reflection_journal',
    title: 'Reflection Journal',
    description: 'Daily reflection and self-examination with AI analysis. Process experiences and gain insights through writing.',
    icon: FileText,
    category: 'wisdom',
    color: 'text-gray-500'
  },
  {
    id: 'virtue_assessment',
    title: 'Virtue Assessment',
    description: 'Daily self-assessment of your virtues with AI insights. Use sliders to rate wisdom, courage, justice, and temperance.',
    icon: Sliders,
    category: 'wisdom',
    color: 'text-indigo-500'
  },
  {
    id: 'community_connection',
    title: 'Community Connection',
    description: 'Connect with others through shared practices. Build relationships and support networks with AI guidance.',
    icon: Users,
    category: 'wisdom',
    color: 'text-blue-500'
  },
  {
    id: 'boundary_setter',
    title: 'Boundary Setter',
    description: 'Set and maintain healthy boundaries with AI insights. Practice saying no and protecting your energy.',
    icon: CheckSquare,
    category: 'wisdom',
    color: 'text-red-500'
  },
  {
    id: 'nature_photo_log',
    title: 'Nature Photo Log',
    description: 'Capture and reflect on your connection with nature through photography and mindful observation.',
    icon: Camera,
    category: 'wisdom',
    color: 'text-green-500'
  },
  {
    id: 'philosophical_terminology',
    title: 'Philosophical Terminology',
    description: 'Learn and practice philosophical concepts and terminology from various traditions and wisdom traditions.',
    icon: BookOpen,
    category: 'wisdom',
    color: 'text-blue-500'
  }
];

export default function DashboardPage() {
  const [activeWidgets, setActiveWidgets] = useState<string[]>([]);
  const [showWidgetGallery, setShowWidgetGallery] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showWidgetInfo, setShowWidgetInfo] = useState<string | null>(null);

  useEffect(() => {
    fetchWidgetPreferences();
  }, []);

  const fetchWidgetPreferences = async () => {
    try {
      const response = await fetch('/api/widgets');
      if (response.ok) {
        const data = await response.json();
        setActiveWidgets(data.activeWidgets);
      }
    } catch (error) {
      console.error('Error fetching widget preferences:', error);
      // Set default widgets if API fails
      setActiveWidgets(['wisdom_spotlight', 'virtue_progress', 'breathwork_timer', 'sleep_tracker']);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWidget = async (widgetId: string) => {
    const newActiveWidgets = [...activeWidgets, widgetId];
    setActiveWidgets(newActiveWidgets);
    
    try {
      await fetch('/api/widgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activeWidgets: newActiveWidgets })
      });
    } catch (error) {
      console.error('Error updating widget preferences:', error);
    }
  };

  const handleRemoveWidget = async (widgetId: string) => {
    const newActiveWidgets = activeWidgets.filter(id => id !== widgetId);
    setActiveWidgets(newActiveWidgets);
    
    try {
      await fetch('/api/widgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activeWidgets: newActiveWidgets })
      });
    } catch (error) {
      console.error('Error updating widget preferences:', error);
    }
  };

  const getWidgetInfo = (widgetId: string) => {
    return WIDGET_INFO.find(info => info.id === widgetId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="waveform justify-center mb-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="waveform-bar w-1"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
            <p>Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold mb-3 font-display text-[rgb(var(--text))]">
                  Your Dashboard
                </h1>
                <p className="text-[rgb(var(--muted))] text-lg">
                  Customize your experience with the widgets that matter most to you
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button 
                  onClick={() => setShowWidgetGallery(true)}
                  variant="outline"
                  className="flex items-center gap-2 rounded-xl px-6 py-2 font-medium bg-[rgb(var(--surface))] border border-[rgb(var(--border))] text-[rgb(var(--text))] hover:bg-[rgb(var(--surface-2))] transition duration-fast ease-soft"
                >
                  <Settings className="h-4 w-4" />
                  Customize Widgets
                </Button>
              </div>
            </div>
          </div>

          {/* Widget Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeWidgets.map((widgetId) => {
              const widgetInfo = getWidgetInfo(widgetId);
              if (!widgetInfo) return null;

              return (
                <WidgetRenderer
                  key={widgetId}
                  widgetId={widgetId}
                  title={widgetInfo.title}
                  description={widgetInfo.description}
                  icon={widgetInfo.icon}
                  category={widgetInfo.category}
                  color={widgetInfo.color}
                  showInfo={showWidgetInfo === widgetId}
                  onInfoToggle={() => setShowWidgetInfo(showWidgetInfo === widgetId ? null : widgetId)}
                  frameworkTone="stoic"
                />
              );
            })}
          </div>

          {/* Empty State */}
          {activeWidgets.length === 0 && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="bg-[rgb(var(--surface-2))] border border-[rgb(var(--border))] rounded-2xl p-8 mb-6 shadow-card">
                  <Settings className="h-20 w-20 text-[rgb(var(--muted))] mx-auto mb-6 opacity-60" />
                  <h3 className="text-2xl font-semibold text-[rgb(var(--text))] mb-3">
                    No widgets selected
                  </h3>
                  <p className="text-[rgb(var(--muted))] mb-8 text-lg leading-relaxed">
                    Get started by adding some widgets to your dashboard
                  </p>
                  <Button 
                    onClick={() => setShowWidgetGallery(true)}
                    className="flex items-center gap-2 mx-auto rounded-xl px-8 py-3 font-medium text-lg bg-[rgb(var(--wisdom))] text-black hover:brightness-110 transition duration-fast ease-snap"
                  >
                    <Settings className="h-5 w-5" />
                    Choose Widgets
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Widget Gallery Modal */}
      {showWidgetGallery && (
        <WidgetGallery
          availableWidgets={WIDGET_INFO}
          activeWidgets={activeWidgets}
          onAddWidget={handleAddWidget}
          onRemoveWidget={handleRemoveWidget}
          onClose={() => setShowWidgetGallery(false)}
        />
      )}
    </div>
  );
}