'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Target, CheckCircle, Clock, TrendingUp, Heart, Brain, Calendar, Droplets, 
  Smile, Zap, Trophy, Info, BookOpen, Timer, Hash, Camera, Mic, CheckSquare, 
  FileText, Sliders, RotateCcw, Users, Star, Leaf, Shield, Scale, Settings, 
  Moon, Dumbbell, Activity, Plus, Sparkles, Palette, Compass, BookOpen as BookOpenIcon,
  X
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
    color: 'text-justice'
  },
  {
    id: 'photo_journal',
    title: 'Photo Journal',
    description: 'Capture moments and memories through photography. Document your journey with visual storytelling.',
    icon: Camera,
    category: 'practice',
    color: 'text-temperance'
  },
  {
    id: 'gratitude_journal',
    title: 'Gratitude Journal',
    description: 'Practice gratitude and appreciation. Record daily moments of thankfulness and positive experiences.',
    icon: Heart,
    category: 'practice',
    color: 'text-[rgb(var(--wisdom))]'
  },
  {
    id: 'reflection_journal',
    title: 'Reflection Journal',
    description: 'Deep self-reflection and introspection. Explore your thoughts, feelings, and experiences through writing.',
    icon: FileText,
    category: 'practice',
    color: 'text-courage'
  },
  {
    id: 'checklist',
    title: 'Daily Checklist',
    description: 'Create and manage daily checklists. Track completion of important tasks and routines.',
    icon: CheckSquare,
    category: 'practice',
    color: 'text-justice'
  },
  {
    id: 'sliders',
    title: 'Mood Sliders',
    description: 'Track your emotional state and mood changes. Monitor patterns and triggers for better self-awareness.',
    icon: Sliders,
    category: 'practice',
    color: 'text-temperance'
  },
  {
    id: 'wheel',
    title: 'Life Balance Wheel',
    description: 'Assess and track balance across different life areas. Identify areas for improvement and growth.',
    icon: RotateCcw,
    category: 'practice',
    color: 'text-[rgb(var(--wisdom))]'
  },
  {
    id: 'balance_gyro',
    title: 'Balance Training',
    description: 'Physical balance and coordination exercises. Improve stability and body awareness.',
    icon: Activity,
    category: 'practice',
    color: 'text-courage'
  },

  // Wellness Category - Health and well-being
  {
    id: 'fasting_tracker',
    title: 'Fasting Tracker',
    description: 'Track fasting sessions and monitor health benefits. Support metabolic health and cellular repair.',
    icon: Clock,
    category: 'wellness',
    color: 'text-justice'
  },
  {
    id: 'hydration_tracker',
    title: 'Hydration Tracker',
    description: 'Monitor daily water intake and hydration levels. Maintain optimal health and performance.',
    icon: Droplets,
    category: 'wellness',
    color: 'text-temperance'
  },
  {
    id: 'mood_tracker',
    title: 'Mood Tracker',
    description: 'Track daily mood patterns and emotional well-being. Identify trends and improve mental health.',
    icon: Smile,
    category: 'wellness',
    color: 'text-[rgb(var(--wisdom))]'
  },
  {
    id: 'sleep_tracker',
    title: 'Sleep Tracker',
    description: 'Monitor sleep quality and duration. Optimize rest and recovery for better performance.',
    icon: Moon,
    category: 'wellness',
    color: 'text-courage'
  },
  {
    id: 'exercise_tracker',
    title: 'Exercise Tracker',
    description: 'Track physical activity and workouts. Build strength, endurance, and overall fitness.',
    icon: Dumbbell,
    category: 'wellness',
    color: 'text-justice'
  },

  // Community Category - Social and collaborative
  {
    id: 'community_chat',
    title: 'Community Chat',
    description: 'Connect with like-minded practitioners. Share experiences and support each other\'s growth.',
    icon: Users,
    category: 'community',
    color: 'text-temperance'
  },
  {
    id: 'mentorship',
    title: 'Mentorship',
    description: 'Find and connect with mentors. Learn from experienced practitioners and share your wisdom.',
    icon: Star,
    category: 'community',
    color: 'text-[rgb(var(--wisdom))]'
  },
  {
    id: 'challenges',
    title: 'Community Challenges',
    description: 'Participate in group challenges and competitions. Push your limits with community support.',
    icon: Trophy,
    category: 'community',
    color: 'text-courage'
  }
];

export default function DashboardPage() {
  const [activeWidgets, setActiveWidgets] = useState<string[]>([]);
  const [showWidgetGallery, setShowWidgetGallery] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Load active widgets from localStorage
    const savedWidgets = localStorage.getItem('activeWidgets');
    if (savedWidgets) {
      try {
        setActiveWidgets(JSON.parse(savedWidgets));
      } catch (error) {
        console.error('Error loading widgets:', error);
        setActiveWidgets([]);
      }
    } else {
      // Default widgets for new users
      setActiveWidgets(['virtue_progress', 'habit_manager', 'task_manager']);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Save active widgets to localStorage
    localStorage.setItem('activeWidgets', JSON.stringify(activeWidgets));
  }, [activeWidgets]);

  const handleAddWidget = (widgetId: string) => {
    if (!activeWidgets.includes(widgetId)) {
      setActiveWidgets(prev => [...prev, widgetId]);
    }
  };

  const handleRemoveWidget = (widgetId: string) => {
    setActiveWidgets(prev => prev.filter(id => id !== widgetId));
  };

  const getWidgetInfo = (widgetId: string): WidgetInfo | undefined => {
    return WIDGET_INFO.find(widget => widget.id === widgetId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-[rgb(var(--muted))] font-medium">Loading your sacred space...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
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
            className="btn-primary flex items-center gap-3 mx-auto px-8 py-4 text-lg shadow-card hover-lift"
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
                className="btn-secondary flex items-center gap-2 px-4 py-2"
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
                  <div key={widgetId} className="relative group">
                    <WidgetRenderer
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
                    <button
                      onClick={() => handleRemoveWidget(widgetId)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
                      title="Remove widget"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
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
            />

            {/* Practice Tools */}
            <AcademyCard
              title="Practice Tools"
              subtitle="Active engagement and training"
              tone="courage"
              onExplore={() => setShowWidgetGallery(true)}
              exploreText="Explore Tools"
            />

            {/* Wellness Tracking */}
            <AcademyCard
              title="Wellness Tracking"
              subtitle="Health and well-being"
              tone="justice"
              onExplore={() => setShowWidgetGallery(true)}
              exploreText="Explore Health"
            />

            {/* Community */}
            <AcademyCard
              title="Community"
              subtitle="Social and collaborative"
              tone="temperance"
              onExplore={() => setShowWidgetGallery(true)}
              exploreText="Explore Community"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-[rgb(var(--text))] font-display mb-8 text-center">
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-[rgb(var(--text))]">
                  <BookOpen className="h-6 w-6 text-[rgb(var(--wisdom))]" />
                  Start Learning
                </CardTitle>
                <CardDescription className="text-[rgb(var(--muted))]">
                  Explore philosophical frameworks and wisdom traditions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-[rgb(var(--text))]">
                  <Compass className="h-6 w-6 text-courage" />
                  Find Your Path
                </CardTitle>
                <CardDescription className="text-[rgb(var(--muted))]">
                  Discover which philosophical framework resonates with you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  <Compass className="h-4 w-4 mr-2" />
                  Explore
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-[rgb(var(--text))]">
                  <Sparkles className="h-6 w-6 text-justice" />
                  Daily Wisdom
                </CardTitle>
                <CardDescription className="text-[rgb(var(--muted))]">
                  Receive personalized insights and guidance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Get Wisdom
                </Button>
              </CardContent>
            </Card>
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

        {/* Widget Detail Modal */}
        {selectedWidget && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    {(() => {
                      const widgetInfo = getWidgetInfo(selectedWidget);
                      const IconComponent = widgetInfo?.icon;
                      return (
                        <>
                          {IconComponent && <IconComponent className="h-6 w-6" />}
                          {widgetInfo?.title || selectedWidget}
                        </>
                      );
                    })()}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {getWidgetInfo(selectedWidget)?.description}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedWidget(null)}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <WidgetRenderer
                    widgetId={selectedWidget}
                    title={getWidgetInfo(selectedWidget)?.title || selectedWidget}
                    description={getWidgetInfo(selectedWidget)?.description || ''}
                    icon={getWidgetInfo(selectedWidget)?.icon || Activity}
                    category={getWidgetInfo(selectedWidget)?.category || 'core'}
                    color={getWidgetInfo(selectedWidget)?.color || 'text-primary'}
                  />
                </div>

                <div className="flex gap-3">
                  {!activeWidgets.includes(selectedWidget) ? (
                    <Button 
                      onClick={() => {
                        handleAddWidget(selectedWidget);
                        setSelectedWidget(null);
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add to Dashboard
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => {
                        handleRemoveWidget(selectedWidget);
                        setSelectedWidget(null);
                      }}
                      variant="outline"
                      className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove from Dashboard
                    </Button>
                  )}
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedWidget(null)}
                    className="px-6"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
