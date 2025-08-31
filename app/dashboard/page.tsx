'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Target, CheckCircle, Clock, TrendingUp, Heart, Brain, Calendar, Droplets, 
  Smile, Zap, Trophy, Info, BookOpen, Timer, Hash, Camera, Mic, CheckSquare, 
  FileText, Sliders, RotateCcw, Users, Star, Leaf, Shield, Scale, Settings, 
  Moon, Dumbbell, Activity, Plus, Sparkles, Palette, Compass, BookOpen as BookOpenIcon
} from 'lucide-react';

import WidgetGallery from '@/components/WidgetGallery';
import WidgetRenderer from '@/components/WidgetRenderer';
import { AcademyCard, VirtueBadge } from '@/components/AcademyCard';

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
    color: 'text-[rgb(var(--wisdom))]'
  },
  {
    id: 'habit_manager',
    title: 'Habit Manager',
    description: 'Track your daily habits and build streaks. Check in daily to maintain momentum and see your progress over time.',
    icon: TrendingUp,
    category: 'core',
    color: 'text-courage'
  },
  {
    id: 'task_manager',
    title: 'Task Manager',
    description: 'Manage your daily tasks and priorities. Mark tasks complete and track your productivity throughout the day.',
    icon: Target,
    category: 'core',
    color: 'text-justice'
  },
  {
    id: 'goal_tracker',
    title: 'Goal Tracker',
    description: 'Track your long-term goals and objectives. Monitor progress and stay focused on what matters most.',
    icon: Brain,
    category: 'core',
    color: 'text-temperance'
  },

  // Practice Category - Active engagement and training
  {
    id: 'breathwork_timer',
    title: 'Breathwork Practice',
    description: 'Master your breath with guided breathing patterns. Choose from Stoic, Spartan, or other framework-specific patterns.',
    icon: Zap,
    category: 'practice',
    color: 'text-[rgb(var(--wisdom))]'
  },
  {
    id: 'focus_timer',
    title: 'Focus Timer',
    description: 'Deep work sessions with customizable duration. Track your focus time and build concentration skills.',
    icon: Timer,
    category: 'practice',
    color: 'text-courage'
  },
  {
    id: 'meditation_timer',
    title: 'Meditation Timer',
    description: 'Guided meditation sessions with customizable duration. Build mindfulness and inner peace through regular practice.',
    icon: Leaf,
    category: 'practice',
    color: 'text-temperance'
  },
  {
    id: 'strength_counter',
    title: 'Strength Counter',
    description: 'Track physical exercises and repetitions. Build strength and discipline through consistent training.',
    icon: Shield,
    category: 'practice',
    color: 'text-courage'
  },
  {
    id: 'voice_notes',
    title: 'Voice Notes',
    description: 'Record audio reflections and insights. Capture thoughts and ideas through voice with AI-powered transcription.',
    icon: Mic,
    category: 'practice',
    color: 'text-temperance'
  },
  {
    id: 'movement_widget',
    title: 'Movement & Posture',
    description: 'Track movement, posture correction exercises, and physical activity patterns for optimal health.',
    icon: Dumbbell,
    category: 'practice',
    color: 'text-courage'
  },

  // Health Category - Physical and mental well-being
  {
    id: 'hydration_tracker',
    title: 'Hydration Tracker',
    description: 'Track your daily water intake. Use the quick-add buttons to log your consumption throughout the day.',
    icon: Droplets,
    category: 'health',
    color: 'text-[rgb(var(--wisdom))]'
  },
  {
    id: 'mood_tracker',
    title: 'Mood Tracker',
    description: 'Rate your daily mood on a 1-5 scale. Your mood data helps track patterns and emotional well-being.',
    icon: Smile,
    category: 'health',
    color: 'text-justice'
  },
  {
    id: 'hedonic_awareness',
    title: 'Hedonic Awareness',
    description: 'Monitor your patterns and triggers to break negative cycles and build healthier habits.',
    icon: Heart,
    category: 'health',
    color: 'text-temperance'
  },
  {
    id: 'sleep_tracker',
    title: 'Sleep Tracker',
    description: 'Track your sleep patterns, quality, and circadian rhythm to optimize your rest and recovery.',
    icon: Moon,
    category: 'health',
    color: 'text-[rgb(var(--wisdom))]'
  },

  // Wisdom Category - Philosophical and reflective practices
  {
    id: 'wisdom_spotlight',
    title: 'Wisdom Spotlight',
    description: 'Daily curated wisdom from ancient traditions. Reflect on timeless teachings and apply them to modern life.',
    icon: BookOpen,
    category: 'wisdom',
    color: 'text-[rgb(var(--wisdom))]'
  },
  {
    id: 'gratitude_journal',
    title: 'Gratitude Journal',
    description: 'Write daily gratitude entries with AI insights. Cultivate appreciation and positive mindset through regular practice.',
    icon: Heart,
    category: 'wisdom',
    color: 'text-justice'
  },
  {
    id: 'reflection_journal',
    title: 'Reflection Journal',
    description: 'Daily reflection and self-examination with AI analysis. Process experiences and gain insights through writing.',
    icon: FileText,
    category: 'wisdom',
    color: 'text-temperance'
  },
  {
    id: 'virtue_assessment',
    title: 'Virtue Assessment',
    description: 'Daily self-assessment of your virtues with AI insights. Use sliders to rate wisdom, courage, justice, and temperance.',
    icon: Sliders,
    category: 'wisdom',
    color: 'text-[rgb(var(--wisdom))]'
  },
  {
    id: 'community_connection',
    title: 'Community Connection',
    description: 'Connect with others through shared practices. Build relationships and support networks with AI guidance.',
    icon: Users,
    category: 'wisdom',
    color: 'text-justice'
  },
  {
    id: 'boundary_setter',
    title: 'Boundary Setter',
    description: 'Set and maintain healthy boundaries with AI insights. Practice saying no and protecting your energy.',
    icon: CheckSquare,
    category: 'wisdom',
    color: 'text-courage'
  },
  {
    id: 'nature_photo_log',
    title: 'Nature Photo Log',
    description: 'Capture and reflect on your connection with nature through photography and mindful observation.',
    icon: Camera,
    category: 'wisdom',
    color: 'text-justice'
  },
  {
    id: 'philosophical_terminology',
    title: 'Philosophical Terminology',
    description: 'Learn and practice philosophical concepts and terminology from various traditions and wisdom traditions.',
    icon: BookOpenIcon,
    category: 'wisdom',
    color: 'text-[rgb(var(--wisdom))]'
  }
];

export default function DashboardPage() {
  const [activeWidgets, setActiveWidgets] = useState<string[]>([]);
  const [showWidgetGallery, setShowWidgetGallery] = useState(false);
  const [loading, setLoading] = useState(true);

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
      // Start with minimal widgets
      setActiveWidgets(['wisdom_spotlight']);
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

  const getCategoryWidgets = (category: string) => {
    return WIDGET_INFO.filter(widget => widget.category === category).slice(0, 3);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[rgb(var(--bg))] flex items-center justify-center">
        <div className="text-center">
          <div className="waveform justify-center mb-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="waveform-bar w-1"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
          <p className="text-[rgb(var(--muted))] font-medium">Loading your sacred space...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <h1 className="text-5xl font-bold mb-4 font-display text-[rgb(var(--text))]">
                Your Sacred Space
              </h1>
              <p className="text-xl text-[rgb(var(--muted))] max-w-2xl mx-auto leading-relaxed">
                A contemplative sanctuary for your philosophical journey. 
                Customize your experience with wisdom, courage, justice, and temperance.
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-3 mb-8">
              <VirtueBadge virtue="wisdom">Wisdom</VirtueBadge>
              <VirtueBadge virtue="courage">Courage</VirtueBadge>
              <VirtueBadge virtue="justice">Justice</VirtueBadge>
              <VirtueBadge virtue="temperance">Temperance</VirtueBadge>
            </div>

            <Button 
              onClick={() => setShowWidgetGallery(true)}
              className="flex items-center gap-3 mx-auto rounded-2xl px-8 py-4 font-medium text-lg bg-[rgb(var(--wisdom))] text-black hover:brightness-110 transition duration-fast ease-snap shadow-card"
            >
              <Palette className="h-5 w-5" />
              Customize Your Space
            </Button>
          </div>

          {/* Active Widgets Section */}
          {activeWidgets.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold text-[rgb(var(--text))] font-display">
                  Your Active Practices
                </h2>
                <Button 
                  onClick={() => setShowWidgetGallery(true)}
                  variant="outline"
                  className="flex items-center gap-2 rounded-xl px-4 py-2 font-medium bg-[rgb(var(--surface))] border border-[rgb(var(--border))] text-[rgb(var(--text))] hover:bg-[rgb(var(--surface-2))] transition duration-fast ease-soft"
                >
                  <Settings className="h-4 w-4" />
                  Manage
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      showInfo={false}
                      onInfoToggle={() => {}}
                      frameworkTone="stoic"
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Widget Suggestions */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-[rgb(var(--text))] font-display mb-8 text-center">
              Discover New Practices
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Core Practices */}
              <AcademyCard
                title="Core Practices"
                subtitle="Essential daily management"
                tone="wisdom"
                onExplore={() => setShowWidgetGallery(true)}
                exploreText="Explore Core"
              >
                <div className="space-y-3">
                  {getCategoryWidgets('core').map((widget) => (
                    <div key={widget.id} className="flex items-center gap-3 p-3 rounded-xl bg-[rgb(var(--surface))] border border-[rgb(var(--border))]">
                      <widget.icon className={`h-5 w-5 ${widget.color}`} />
                      <span className="text-sm text-[rgb(var(--text))] font-medium">{widget.title}</span>
                    </div>
                  ))}
                </div>
              </AcademyCard>

              {/* Practice Tools */}
              <AcademyCard
                title="Practice Tools"
                subtitle="Active engagement & training"
                tone="courage"
                onExplore={() => setShowWidgetGallery(true)}
                exploreText="Explore Tools"
              >
                <div className="space-y-3">
                  {getCategoryWidgets('practice').map((widget) => (
                    <div key={widget.id} className="flex items-center gap-3 p-3 rounded-xl bg-[rgb(var(--surface))] border border-[rgb(var(--border))]">
                      <widget.icon className={`h-5 w-5 ${widget.color}`} />
                      <span className="text-sm text-[rgb(var(--text))] font-medium">{widget.title}</span>
                    </div>
                  ))}
                </div>
              </AcademyCard>

              {/* Health & Wellness */}
              <AcademyCard
                title="Health & Wellness"
                subtitle="Physical & mental well-being"
                tone="justice"
                onExplore={() => setShowWidgetGallery(true)}
                exploreText="Explore Health"
              >
                <div className="space-y-3">
                  {getCategoryWidgets('health').map((widget) => (
                    <div key={widget.id} className="flex items-center gap-3 p-3 rounded-xl bg-[rgb(var(--surface))] border border-[rgb(var(--border))]">
                      <widget.icon className={`h-5 w-5 ${widget.color}`} />
                      <span className="text-sm text-[rgb(var(--text))] font-medium">{widget.title}</span>
                    </div>
                  ))}
                </div>
              </AcademyCard>

              {/* Wisdom & Reflection */}
              <AcademyCard
                title="Wisdom & Reflection"
                subtitle="Philosophical & reflective practices"
                tone="temperance"
                onExplore={() => setShowWidgetGallery(true)}
                exploreText="Explore Wisdom"
              >
                <div className="space-y-3">
                  {getCategoryWidgets('wisdom').map((widget) => (
                    <div key={widget.id} className="flex items-center gap-3 p-3 rounded-xl bg-[rgb(var(--surface))] border border-[rgb(var(--border))]">
                      <widget.icon className={`h-5 w-5 ${widget.color}`} />
                      <span className="text-sm text-[rgb(var(--text))] font-medium">{widget.title}</span>
                    </div>
                  ))}
                </div>
              </AcademyCard>
            </div>
          </div>

          {/* Empty State - Beautiful and Encouraging */}
          {activeWidgets.length === 0 && (
            <div className="text-center py-20">
              <div className="max-w-2xl mx-auto">
                <div className="bg-[rgb(var(--surface-2))] border border-[rgb(var(--border))] rounded-3xl p-12 mb-8 shadow-card">
                  <div className="mb-8">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[rgb(var(--wisdom)/0.1)] flex items-center justify-center">
                      <Sparkles className="h-12 w-12 text-[rgb(var(--wisdom))]" />
                    </div>
                    <h3 className="text-3xl font-semibold text-[rgb(var(--text))] mb-4 font-display">
                      Begin Your Journey
                    </h3>
                    <p className="text-[rgb(var(--muted))] text-lg leading-relaxed mb-8">
                      Your sacred space awaits. Choose practices that resonate with your path and create a dashboard that reflects your philosophical journey.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      onClick={() => setShowWidgetGallery(true)}
                      className="flex items-center gap-3 rounded-2xl px-8 py-4 font-medium text-lg bg-[rgb(var(--wisdom))] text-black hover:brightness-110 transition duration-fast ease-snap"
                    >
                      <Compass className="h-5 w-5" />
                      Explore Practices
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex items-center gap-3 rounded-2xl px-8 py-4 font-medium text-lg bg-[rgb(var(--surface))] border border-[rgb(var(--border))] text-[rgb(var(--text))] hover:bg-[rgb(var(--surface-2))] transition duration-fast ease-soft"
                    >
                      <BookOpen className="h-5 w-5" />
                      Learn More
                    </Button>
                  </div>
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