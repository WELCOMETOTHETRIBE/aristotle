'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, CheckCircle, Clock, TrendingUp, Heart, Brain, Calendar, Droplets, Smile, Zap, Trophy, Info, BookOpen, Timer, Hash, Camera, Mic, CheckSquare, FileText, Sliders, RotateCcw, Users, Star, Leaf, Shield, Scale, Sparkles, ArrowRight } from 'lucide-react';

import TimerCard from '@/components/widgets/TimerCard';
import CounterCard from '@/components/widgets/CounterCard';
import { HydrationWidget } from '@/components/ModuleWidgets';
import { BreathworkWidgetNew } from '@/components/BreathworkWidgetNew';
import { HedonicAwarenessWidget } from '@/components/HedonicAwarenessWidget';
import { getVirtueEmoji, getVirtueColor, getVirtueGradient } from '@/lib/virtue';
import { getAllFrameworks } from '@/lib/frameworks.config';
import MilestonesDropdown from '@/components/MilestonesDropdown';
import VirtueRadar from '@/components/VirtueRadar';
import { useOnboardingStatus } from '@/lib/hooks/useOnboardingStatus';

interface VirtueScores {
  wisdom: number;
  courage: number;
  justice: number;
  temperance: number;
}

interface HydrationData {
  current: number;
  target: number;
  percentage: number;
}

interface MoodData {
  mood: number | null;
  note: string | null;
  logged: boolean;
}

interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: string;
  streakCount: number;
  checkedToday: boolean;
  todayNote?: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  tag?: string;
  priority: string;
  dueAt?: string;
  completedAt?: string;
}

interface Goal {
  id: string;
  title: string;
  description?: string;
  category: string;
  status: string;
  createdAt: string;
}

interface WidgetInfo {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: string;
}

const WIDGET_INFO: WidgetInfo[] = [
  {
    id: 'breathwork_timer',
    title: 'Breathwork Practice',
    description: 'Master your breath with guided breathing patterns. Choose from Stoic, Spartan, or other framework-specific patterns.',
    icon: Zap,
    category: 'practice'
  },
  {
    id: 'hydration_tracker',
    title: 'Hydration Tracker',
    description: 'Track your daily water intake. Use the quick-add buttons to log your consumption throughout the day.',
    icon: Droplets,
    category: 'health'
  },
  {
    id: 'mood_tracker',
    title: 'Mood Tracker',
    description: 'Rate your daily mood on a 1-5 scale. Your mood data helps track patterns and emotional well-being.',
    icon: Smile,
    category: 'health'
  },
  {
    id: 'habit_manager',
    title: 'Habit Manager',
    description: 'Track your daily habits and build streaks. Check in daily to maintain momentum and see your progress.',
    icon: TrendingUp,
    category: 'productivity'
  },
  {
    id: 'task_manager',
    title: 'Task Manager',
    description: 'Organize and prioritize your daily tasks. Mark them complete to track your productivity and progress.',
    icon: Target,
    category: 'productivity'
  },
  {
    id: 'wisdom_spotlight',
    title: 'Wisdom Spotlight',
    description: 'Daily wisdom quotes from ancient philosophical traditions, personalized to your framework and enhanced with AI-generated reflections and insights.',
    icon: Brain,
    category: 'wisdom'
  },
  {
    id: 'voice_notes',
    title: 'Voice Notes',
    description: 'Record audio reflections and insights. Capture thoughts and ideas through voice.',
    icon: Mic,
    category: 'practice'
  }
];

export default function DashboardPage() {
  const [virtueScores, setVirtueScores] = useState<VirtueScores>({ wisdom: 0, courage: 0, justice: 0, temperance: 0 });
  const [hydrationData, setHydrationData] = useState<HydrationData>({ current: 0, target: 2000, percentage: 0 });
  const [moodData, setMoodData] = useState<MoodData>({ mood: null, note: null, logged: false });
  const [habits, setHabits] = useState<Habit[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [hedonicScore, setHedonicScore] = useState(50);
  const [showWidgetInfo, setShowWidgetInfo] = useState<string | null>(null);
  const [frameworks, setFrameworks] = useState<any[]>([]);
  const { isComplete, shouldShowPrompt } = useOnboardingStatus();

  useEffect(() => {
    fetchDashboardData();
    setFrameworks(getAllFrameworks());
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [
        virtuesRes, 
        hydrationRes, 
        moodRes, 
        habitsRes, 
        tasksRes, 
        goalsRes
      ] = await Promise.all([
        fetch('/api/progress/virtues'),
        fetch('/api/hydration/current'),
        fetch('/api/mood/current'),
        fetch('/api/habits/today'),
        fetch('/api/tasks'),
        fetch('/api/goals'),
      ]);

      if (virtuesRes.ok) {
        const virtuesData = await virtuesRes.json();
        setVirtueScores(virtuesData.scores);
      }

      if (hydrationRes.ok) {
        const hydrationData = await hydrationRes.json();
        setHydrationData(hydrationData);
      }

      if (moodRes.ok) {
        const moodData = await moodRes.json();
        setMoodData(moodData);
      }

      if (habitsRes.ok) {
        const habitsData = await habitsRes.json();
        setHabits(habitsData.habits);
      }

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setTasks(tasksData);
      }

      if (goalsRes.ok) {
        const goalsData = await goalsRes.json();
        setGoals(goalsData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVirtueUpdate = async (virtue: keyof VirtueScores, value: number) => {
    try {
      const updatedScores = { ...virtueScores, [virtue]: value };
      const response = await fetch('/api/progress/virtues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedScores)
      });

      if (response.ok) {
        setVirtueScores(updatedScores);
      }
    } catch (error) {
      console.error('Error updating virtue scores:', error);
    }
  };

  const handleHydrationAdd = async (ml: number) => {
    try {
      const response = await fetch('/api/hydration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ml, source: 'manual' })
      });

      if (response.ok) {
        fetchDashboardData(); // Refresh hydration data
      }
    } catch (error) {
      console.error('Error adding hydration:', error);
    }
  };

  const handleMoodUpdate = async (mood: number, note?: string) => {
    try {
      const response = await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, note })
      });

      if (response.ok) {
        fetchDashboardData(); // Refresh mood data
      }
    } catch (error) {
      console.error('Error updating mood:', error);
    }
  };

  const handleHabitCheckin = async (habitId: string) => {
    try {
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habitId, done: true })
      });

      if (response.ok) {
        fetchDashboardData(); // Refresh habits data
      }
    } catch (error) {
      console.error('Error checking in habit:', error);
    }
  };

  const handleTaskComplete = async (taskId: string, completed: boolean) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, completed }),
      });

      if (response.ok) {
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const getHedonicColor = (score: number) => {
    if (score <= 30) return 'text-green-600 bg-green-100';
    if (score <= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getHedonicLabel = (score: number) => {
    if (score <= 30) return 'Low Risk';
    if (score <= 70) return 'Medium Risk';
    return 'High Risk';
  };

  const getMoodEmoji = (mood: number) => {
    if (mood >= 4) return '😊';
    if (mood >= 3) return '😐';
    if (mood >= 2) return '😕';
    return '😢';
  };

  const getWidgetInfo = (widgetId: string) => {
    return WIDGET_INFO.find(info => info.id === widgetId);
  };

  const dueTasks = tasks.filter(task => !task.completedAt && task.dueAt);
  const completedTasks = tasks.filter(task => task.completedAt);
  const activeGoals = goals.filter(goal => goal.status === 'active');
  const checkedHabits = habits.filter(habit => habit.checkedToday);

  // Daily wisdom quotes - will be replaced with AI-generated content
  const [todayWisdom, setTodayWisdom] = useState({
    quote: "The unexamined life is not worth living.",
    author: "Socrates",
    framework: "Stoic",
    reflection: "What aspect of your life needs deeper examination today?"
  });

  // Load dynamic daily wisdom
  useEffect(() => {
    const loadDailyWisdom = async () => {
      try {
        const frameworks = ['Stoic', 'Spartan', 'Samurai', 'Monastic', 'Yogic'];
        const randomFramework = frameworks[Math.floor(Math.random() * frameworks.length)];
        
        const response = await fetch('/api/generate/daily-wisdom', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            framework: randomFramework,
            date: new Date().toISOString().split('T')[0]
          }),
        });

        if (response.ok) {
          const wisdom = await response.json();
          setTodayWisdom(wisdom);
        }
      } catch (error) {
        console.error('Error loading daily wisdom:', error);
        // Keep the default wisdom if API fails
      }
    };

    loadDailyWisdom();
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Sleek Header with Integrated Virtue Visualization */}
          <div className="mb-8">
            <Card className="glass-effect bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20 overflow-hidden">
              <div className="p-6">
                {/* Top Row - Title and Milestones */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Your Dashboard</h1>
                    <p className="text-gray-300 text-sm">
                      Track your progress toward flourishing and intentional living
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Quick Stats */}
                    <div className="hidden md:flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="text-white font-semibold">{Object.values(virtueScores).reduce((a, b) => a + b, 0)}</div>
                        <div className="text-gray-400 text-xs">Total Virtue XP</div>
                      </div>
                      <div className="text-center">
                        <div className="text-white font-semibold">{Math.round(Object.values(virtueScores).reduce((a, b) => a + b, 0) / 4)}</div>
                        <div className="text-gray-400 text-xs">Avg Score</div>
                      </div>
                      <MilestonesDropdown virtueTotals={virtueScores} />
                    </div>

                  </div>
                </div>

                {/* Bottom Row - Virtue Visualization */}
                <div className="flex items-center justify-center">
                  <div className="w-full max-w-md">
                    <div className="flex items-center gap-3 mb-4">
                      <Trophy className="h-5 w-5 text-blue-400" />
                      <h3 className="text-lg font-semibold text-white">Your Virtue Balance</h3>
                    </div>
                    <VirtueRadar data={[
                      { virtue: 'Wisdom', score: virtueScores.wisdom },
                      { virtue: 'Courage', score: virtueScores.courage },
                      { virtue: 'Justice', score: virtueScores.justice },
                      { virtue: 'Temperance', score: virtueScores.temperance }
                    ]} />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Onboarding Call-to-Action */}
          {shouldShowPrompt && (
            <div className="mb-8">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-red-500/10 border border-amber-500/20 backdrop-blur-sm">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5 opacity-50"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-3xl transform translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-500/10 to-red-500/10 rounded-full blur-2xl transform -translate-x-12 translate-y-12"></div>
                
                <div className="relative p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                          <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white mb-2">Unlock Your Personalized Path</h3>
                        <p className="text-gray-300 text-base leading-relaxed max-w-md">
                          Complete a quick assessment to get matched with your ideal philosophical framework and practices tailored to your unique personality
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>3-5 minutes</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span>AI-powered matching</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                            <span>100% private</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <Button
                        onClick={() => window.location.href = '/onboarding'}
                        size="lg"
                        className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-4 text-base font-semibold shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300 transform hover:scale-105"
                      >
                        Start Assessment
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                      <p className="text-xs text-gray-400 text-center">
                        Get your personalized framework recommendation
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Wisdom Spotlight - Fully Mature & Interactive */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/20 via-blue-900/15 to-indigo-900/20 border border-purple-500/30 backdrop-blur-sm">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-30"></div>
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl transform translate-x-20 -translate-y-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 rounded-full blur-2xl transform -translate-x-16 translate-y-16 animate-pulse" style={{animationDelay: '1s'}}></div>
                
                <div className="relative p-8">
                  {/* Header with Interactive Elements */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                          <Brain className="w-6 h-6 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">Wisdom Spotlight</h2>
                        <p className="text-purple-300 text-sm">Daily insights from ancient traditions</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-purple-300 hover:text-white transition-colors rounded-lg hover:bg-purple-500/20">
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-purple-300 hover:text-white transition-colors rounded-lg hover:bg-purple-500/20">
                        <BookOpen className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Main Wisdom Content */}
                  <div className="space-y-6">
                    {/* Quote Section */}
                    <div className="relative">
                      <div className="absolute top-0 left-0 w-8 h-8 text-purple-400/30 text-4xl">"</div>
                      <div className="pl-8">
                        <blockquote className="text-xl md:text-2xl font-serif italic text-white leading-relaxed mb-4">
                          {todayWisdom.quote}
                        </blockquote>
                        <div className="flex items-center justify-between">
                          <cite className="text-purple-300 font-medium">— {todayWisdom.author}</cite>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-purple-400">Live</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Framework Badge & Reflection */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 text-sm font-medium border border-purple-500/30">
                          <Sparkles className="w-3 h-3 mr-1" />
                          {todayWisdom.framework} Tradition
                        </span>
                        <div className="flex items-center gap-1 text-yellow-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={12} className="fill-current" />
                          ))}
                        </div>
                      </div>
                      <div className="text-xs text-purple-400">
                        {new Date().toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>

                    {/* Reflection Section */}
                    {todayWisdom.reflection && (
                      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-4 border border-purple-500/20">
                        <h4 className="text-sm font-semibold text-purple-300 mb-2 flex items-center gap-2">
                          <Brain className="w-4 h-4" />
                          Reflection Prompt
                        </h4>
                        <p className="text-purple-200 text-sm leading-relaxed">
                          {todayWisdom.reflection}
                        </p>
                      </div>
                    )}

                    {/* Interactive Actions */}
                    <div className="grid grid-cols-2 gap-3">
                      <button className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 text-purple-300 rounded-lg border border-purple-500/30 transition-all duration-200 hover:scale-105">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-sm font-medium">Learn More</span>
                      </button>
                      <button className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30 text-blue-300 rounded-lg border border-blue-500/30 transition-all duration-200 hover:scale-105">
                        <Users className="w-4 h-4" />
                        <span className="text-sm font-medium">Share Wisdom</span>
                      </button>
                    </div>

                    {/* Wisdom Stats */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-purple-500/20">
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">247</div>
                        <div className="text-xs text-purple-400">Days of Wisdom</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">12</div>
                        <div className="text-xs text-purple-400">Traditions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">89%</div>
                        <div className="text-xs text-purple-400">Engagement</div>
                      </div>
                    </div>

                    {/* Related Wisdom Preview */}
                    <div className="bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-xl p-4 border border-purple-500/20">
                      <h4 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Related Wisdom
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-purple-300">"The only true wisdom is in knowing you know nothing."</span>
                          <span className="text-purple-400">Socrates</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-purple-300">"Wisdom begins in wonder."</span>
                          <span className="text-purple-400">Plato</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-purple-300">"Knowledge speaks, but wisdom listens."</span>
                          <span className="text-purple-400">Jimi Hendrix</span>
                        </div>
                      </div>
                    </div>

                    {/* Call to Action */}
                    <div className="text-center">
                      <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white rounded-lg font-semibold shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105">
                        <Brain className="w-4 h-4" />
                        Explore Wisdom Practices
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>



              {/* Today's Tasks */}
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Today's Actions
                    <button
                      onClick={() => setShowWidgetInfo(showWidgetInfo === 'task_manager' ? null : 'task_manager')}
                      className="ml-auto p-1 text-muted-foreground hover:text-white transition-colors"
                    >
                      <Info className="h-4 w-4" />
                    </button>
                  </CardTitle>
                  <CardDescription>
                    {dueTasks.length} tasks due today
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {showWidgetInfo === 'task_manager' && (
                    <div className="mb-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                      <p className="text-sm text-green-200">{getWidgetInfo('task_manager')?.description}</p>
                    </div>
                  )}
                  {dueTasks.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No tasks due today. Great job staying on top of things!
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {dueTasks.map((task) => (
                        <div key={task.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTaskComplete(task.id, true)}
                            className="h-6 w-6 p-0"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{task.title}</h4>
                            {task.description && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {task.description}
                              </p>
                            )}
                            <div className="flex gap-2 mt-2">
                              {task.tag && (
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                  {task.tag}
                                </span>
                              )}
                              <span className="text-xs bg-secondary px-2 py-1 rounded">
                                {task.priority}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Habits */}
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Habit Streaks
                    <button
                      onClick={() => setShowWidgetInfo(showWidgetInfo === 'habit_manager' ? null : 'habit_manager')}
                      className="ml-auto p-1 text-muted-foreground hover:text-white transition-colors"
                    >
                      <Info className="h-4 w-4" />
                    </button>
                  </CardTitle>
                  <CardDescription>
                    Keep building momentum with your daily habits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {showWidgetInfo === 'habit_manager' && (
                    <div className="mb-4 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                      <p className="text-sm text-orange-200">{getWidgetInfo('habit_manager')?.description}</p>
                    </div>
                  )}
                  {habits.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No habits set up yet. Start building positive routines!
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {habits.map((habit) => (
                        <div key={habit.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-sm">{habit.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {habit.streakCount} day streak
                            </p>
                          </div>
                          <Button
                            variant={habit.checkedToday ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleHabitCheckin(habit.id)}
                            disabled={habit.checkedToday}
                          >
                            {habit.checkedToday ? "✓ Done" : "Check In"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Active Goals */}
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    Active Goals
                    <button
                      onClick={() => setShowWidgetInfo(showWidgetInfo === 'goal_tracker' ? null : 'goal_tracker')}
                      className="ml-auto p-1 text-muted-foreground hover:text-white transition-colors"
                    >
                      <Info className="h-4 w-4" />
                    </button>
                  </CardTitle>
                  <CardDescription>
                    Your current objectives and aspirations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {showWidgetInfo === 'goal_tracker' && (
                    <div className="mb-4 p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                      <p className="text-sm text-indigo-200">{getWidgetInfo('goal_tracker')?.description}</p>
                    </div>
                  )}
                  {activeGoals.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No active goals. Set some meaningful objectives to work toward!
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {activeGoals.map((goal) => (
                        <div key={goal.id} className="p-3 bg-muted/50 rounded-lg">
                          <h4 className="font-medium text-sm">{goal.title}</h4>
                          {goal.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {goal.description}
                            </p>
                          )}
                          <div className="flex gap-2 mt-2">
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              {goal.category}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Additional Practice Widgets */}
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Practice Tools
                  </CardTitle>
                  <CardDescription>
                    Quick access to essential practice widgets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Focus Timer */}
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Timer className="h-4 w-4 text-blue-400" />
                        <h4 className="font-medium text-sm">Focus Timer</h4>
                        <button
                          onClick={() => setShowWidgetInfo(showWidgetInfo === 'focus_timer' ? null : 'focus_timer')}
                          className="ml-auto p-1 text-muted-foreground hover:text-white transition-colors"
                        >
                          <Info className="h-3 w-3" />
                        </button>
                      </div>
                      {showWidgetInfo === 'focus_timer' && (
                        <div className="mb-3 p-2 bg-blue-500/10 rounded border border-blue-500/20">
                          <p className="text-xs text-blue-200">{getWidgetInfo('focus_timer')?.description}</p>
                        </div>
                      )}
                      <TimerCard 
                        title="Deep Work Session"
                        config={{ duration: 1500, includeRPE: false, teaching: "Focus is the new superpower" }}
                        onComplete={() => console.log('Focus session completed')}
                        virtueGrantPerCompletion={{ wisdom: 2 }}
                      />
                    </div>

                    {/* Gratitude Journal */}
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Heart className="h-4 w-4 text-red-400" />
                        <h4 className="font-medium text-sm">Gratitude Journal</h4>
                        <button
                          onClick={() => setShowWidgetInfo(showWidgetInfo === 'gratitude_journal' ? null : 'gratitude_journal')}
                          className="ml-auto p-1 text-muted-foreground hover:text-white transition-colors"
                        >
                          <Info className="h-3 w-3" />
                        </button>
                      </div>
                      {showWidgetInfo === 'gratitude_journal' && (
                        <div className="mb-3 p-2 bg-red-500/10 rounded border border-red-500/20">
                          <p className="text-xs text-red-200">{getWidgetInfo('gratitude_journal')?.description}</p>
                        </div>
                      )}
                      <div className="space-y-3">
                        <textarea 
                          className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-sm"
                          placeholder="What are you grateful for today?"
                          rows={3}
                        />
                        <Button size="sm" className="w-full">Save Gratitude</Button>
                      </div>
                    </div>

                    {/* Meditation Timer */}
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Leaf className="h-4 w-4 text-green-400" />
                        <h4 className="font-medium text-sm">Meditation Timer</h4>
                        <button
                          onClick={() => setShowWidgetInfo(showWidgetInfo === 'meditation_timer' ? null : 'meditation_timer')}
                          className="ml-auto p-1 text-muted-foreground hover:text-white transition-colors"
                        >
                          <Info className="h-3 w-3" />
                        </button>
                      </div>
                      {showWidgetInfo === 'meditation_timer' && (
                        <div className="mb-3 p-2 bg-green-500/10 rounded border border-green-500/20">
                          <p className="text-xs text-green-200">{getWidgetInfo('meditation_timer')?.description}</p>
                        </div>
                      )}
                      <TimerCard 
                        title="Mindfulness Session"
                        config={{ duration: 600, includeRPE: false, teaching: "Stillness reveals the warrior within" }}
                        onComplete={() => console.log('Meditation completed')}
                        virtueGrantPerCompletion={{ wisdom: 1, temperance: 1 }}
                      />
                    </div>

                    {/* Strength Counter */}
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Shield className="h-4 w-4 text-orange-400" />
                        <h4 className="font-medium text-sm">Strength Counter</h4>
                        <button
                          onClick={() => setShowWidgetInfo(showWidgetInfo === 'strength_counter' ? null : 'strength_counter')}
                          className="ml-auto p-1 text-muted-foreground hover:text-white transition-colors"
                        >
                          <Info className="h-3 w-3" />
                        </button>
                      </div>
                      {showWidgetInfo === 'strength_counter' && (
                        <div className="mb-3 p-2 bg-orange-500/10 rounded border border-orange-500/20">
                          <p className="text-xs text-orange-200">{getWidgetInfo('strength_counter')?.description}</p>
                        </div>
                      )}
                      <CounterCard 
                        title="Push-ups"
                        config={{ target: 20, unit: "reps", exercises: ["push-ups", "squats", "pull-ups"], teaching: "Perfect practice makes perfect" }}
                        onComplete={() => console.log('Strength training completed')}
                        virtueGrantPerCompletion={{ courage: 2 }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Breathwork Timer - Special Widget */}
              <Card className="glass-effect bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-cyan-400" />
                    Breathwork Practice
                    <button
                      onClick={() => setShowWidgetInfo(showWidgetInfo === 'breathwork_timer' ? null : 'breathwork_timer')}
                      className="ml-auto p-1 text-muted-foreground hover:text-white transition-colors"
                    >
                      <Info className="h-4 w-4" />
                    </button>
                  </CardTitle>
                  <CardDescription>
                    Master your breath with guided patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {showWidgetInfo === 'breathwork_timer' && (
                    <div className="mb-4 p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                      <p className="text-sm text-cyan-200">{getWidgetInfo('breathwork_timer')?.description}</p>
                    </div>
                  )}
                  <BreathworkWidgetNew frameworkTone="stoic" />
                </CardContent>
              </Card>

              {/* Hydration Tracker */}
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-primary" />
                    Hydration
                    <button
                      onClick={() => setShowWidgetInfo(showWidgetInfo === 'hydration_tracker' ? null : 'hydration_tracker')}
                      className="ml-auto p-1 text-muted-foreground hover:text-white transition-colors"
                    >
                      <Info className="h-4 w-4" />
                    </button>
                  </CardTitle>
                  <CardDescription>
                    Track your daily water intake
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {showWidgetInfo === 'hydration_tracker' && (
                    <div className="mb-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <p className="text-sm text-blue-200">{getWidgetInfo('hydration_tracker')?.description}</p>
                    </div>
                  )}
                  <HydrationWidget frameworkTone="stoic" />
                </CardContent>
              </Card>

              {/* Mood Tracker */}
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smile className="h-5 w-5 text-primary" />
                    Today's Mood
                    <button
                      onClick={() => setShowWidgetInfo(showWidgetInfo === 'mood_tracker' ? null : 'mood_tracker')}
                      className="ml-auto p-1 text-muted-foreground hover:text-white transition-colors"
                    >
                      <Info className="h-4 w-4" />
                    </button>
                  </CardTitle>
                  <CardDescription>
                    How are you feeling today?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {showWidgetInfo === 'mood_tracker' && (
                    <div className="mb-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                      <p className="text-sm text-yellow-200">{getWidgetInfo('mood_tracker')?.description}</p>
                    </div>
                  )}
                  {moodData.logged ? (
                    <div className="text-center">
                      <div className="text-4xl mb-2">{getMoodEmoji(moodData.mood!)}</div>
                      <div className="text-lg font-medium mb-2">Mood: {moodData.mood}/5</div>
                      {moodData.note && (
                        <p className="text-sm text-muted-foreground">{moodData.note}</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground text-center">
                        Rate your mood today
                      </p>
                      <div className="grid grid-cols-5 gap-2">
                        {[1, 2, 3, 4, 5].map((mood) => (
                          <Button
                            key={mood}
                            variant="outline"
                            size="sm"
                            onClick={() => handleMoodUpdate(mood)}
                            className="flex flex-col items-center p-2"
                          >
                            <span className="text-lg">{getMoodEmoji(mood)}</span>
                            <span className="text-xs">{mood}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Hedonic Awareness */}
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Hedonic Awareness
                    <button
                      onClick={() => setShowWidgetInfo(showWidgetInfo === 'hedonic_awareness' ? null : 'hedonic_awareness')}
                      className="ml-auto p-1 text-muted-foreground hover:text-white transition-colors"
                    >
                      <Info className="h-4 w-4" />
                    </button>
                  </CardTitle>
                  <CardDescription>
                    Monitor your patterns and triggers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {showWidgetInfo === 'hedonic_awareness' && (
                    <div className="mb-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <p className="text-sm text-purple-200">Analyze your thoughts and activities to identify hedonic treadmill patterns. Get personalized insights and counter-moves to break negative cycles.</p>
                    </div>
                  )}
                  <HedonicAwarenessWidget frameworkTone="stoic" />
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tasks Completed</span>
                      <span className="font-medium">{completedTasks.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Active Goals</span>
                      <span className="font-medium">{activeGoals.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Habits Tracked</span>
                      <span className="font-medium">{habits.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Habits Done Today</span>
                      <span className="font-medium">{checkedHabits.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Streak Days</span>
                      <span className="font-medium">
                        {habits.reduce((sum, habit) => sum + habit.streakCount, 0)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href="/coach">
                        <Brain className="h-4 w-4 mr-2" />
                        Chat with Aion
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href="/breath">
                        <Calendar className="h-4 w-4 mr-2" />
                        Start Breathwork
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href="/frameworks">
                        <Trophy className="h-4 w-4 mr-2" />
                        Explore Frameworks
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 