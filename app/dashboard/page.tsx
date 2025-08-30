'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, CheckCircle, Clock, TrendingUp, Heart, Brain, Calendar, Droplets, Smile, Zap, Trophy, Info, BookOpen, Timer, Hash, Camera, Mic, CheckSquare, FileText, Sliders, RotateCcw, Users, Star, Leaf, Shield, Scale } from 'lucide-react';

import TimerCard from '@/components/widgets/TimerCard';
import CounterCard from '@/components/widgets/CounterCard';
import { HydrationWidget } from '@/components/ModuleWidgets';
import { BreathworkWidgetNew } from '@/components/BreathworkWidgetNew';
import { HedonicAwarenessWidget } from '@/components/HedonicAwarenessWidget';
import { MoodTrackerWidget } from '@/components/MoodTrackerWidget';
import { getVirtueEmoji, getVirtueColor, getVirtueGradient } from '@/lib/virtue';
import { getAllFrameworks } from '@/lib/frameworks.config';
import MilestonesDropdown from '@/components/MilestonesDropdown';

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
    id: 'virtue_progress',
    title: 'Virtue Progress',
    description: 'Track your daily virtue scores and see your 7-day averages. Click on the circles to update your scores.',
    icon: Trophy,
    category: 'core'
  },
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
    category: 'core'
  },
  {
    id: 'task_manager',
    title: 'Task Manager',
    description: 'Manage your daily tasks and priorities. Mark tasks complete and track your productivity.',
    icon: Target,
    category: 'core'
  },
  {
    id: 'goal_tracker',
    title: 'Goal Tracker',
    description: 'Track your long-term goals and objectives. Monitor progress and stay focused on what matters.',
    icon: Brain,
    category: 'core'
  },
  {
    id: 'wisdom_spotlight',
    title: 'Wisdom Spotlight',
    description: 'Daily curated wisdom from ancient traditions. Reflect on timeless teachings and apply them to modern life.',
    icon: BookOpen,
    category: 'wisdom'
  },
  {
    id: 'focus_timer',
    title: 'Focus Timer',
    description: 'Deep work sessions with customizable duration. Track your focus time and build concentration skills.',
    icon: Timer,
    category: 'practice'
  },
  {
    id: 'gratitude_journal',
    title: 'Gratitude Journal',
    description: 'Write daily gratitude entries. Cultivate appreciation and positive mindset through regular practice.',
    icon: Heart,
    category: 'wisdom'
  },
  {
    id: 'meditation_timer',
    title: 'Meditation Timer',
    description: 'Guided meditation sessions with customizable duration. Build mindfulness and inner peace.',
    icon: Leaf,
    category: 'practice'
  },
  {
    id: 'strength_counter',
    title: 'Strength Counter',
    description: 'Track physical exercises and repetitions. Build strength and discipline through consistent training.',
    icon: Shield,
    category: 'practice'
  },
  {
    id: 'virtue_assessment',
    title: 'Virtue Assessment',
    description: 'Daily self-assessment of your virtues. Use sliders to rate your wisdom, courage, justice, and temperance.',
    icon: Sliders,
    category: 'wisdom'
  },
  {
    id: 'community_connection',
    title: 'Community Connection',
    description: 'Connect with others through shared practices. Build relationships and support networks.',
    icon: Users,
    category: 'wisdom'
  },
  {
    id: 'reflection_journal',
    title: 'Reflection Journal',
    description: 'Daily reflection and self-examination. Process experiences and gain insights through writing.',
    icon: FileText,
    category: 'wisdom'
  },
  {
    id: 'boundary_setter',
    title: 'Boundary Setter',
    description: 'Set and maintain healthy boundaries. Practice saying no and protecting your energy.',
    icon: CheckSquare,
    category: 'wisdom'
  },
  {
    id: 'nature_connection',
    title: 'Nature Connection',
    description: 'Connect with the natural world. Take photos and reflect on your relationship with nature.',
    icon: Camera,
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
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">Your Dashboard</h1>
                <p className="text-muted-foreground">
                  Track your progress toward flourishing and intentional living
                </p>
              </div>
              <MilestonesDropdown virtueTotals={virtueScores} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Wisdom Spotlight - Special Widget */}
              <Card className="glass-effect bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-purple-400" />
                      Wisdom Spotlight
                      <button
                        onClick={() => setShowWidgetInfo(showWidgetInfo === 'wisdom_spotlight' ? null : 'wisdom_spotlight')}
                        className="ml-auto p-1 text-muted-foreground hover:text-white transition-colors"
                      >
                        <Info className="h-4 w-4" />
                      </button>
                    </CardTitle>
                    <CardDescription>
                      Daily wisdom from ancient traditions
                    </CardDescription>
                  </CardHeader>
                <CardContent>
                  {showWidgetInfo === 'wisdom_spotlight' && (
                    <div className="mb-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <p className="text-sm text-purple-200">{getWidgetInfo('wisdom_spotlight')?.description}</p>
                    </div>
                  )}
                  <div className="text-center space-y-4">
                    <div className="text-2xl font-serif italic text-purple-200 mb-4">
                      "{todayWisdom.quote}"
                    </div>
                    <div className="text-sm text-purple-300">
                      — {todayWisdom.author}
                    </div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs">
                      {todayWisdom.framework} Tradition
                    </div>
                    {todayWisdom.reflection && (
                      <div className="text-sm text-purple-300 italic">
                        {todayWisdom.reflection}
                      </div>
                    )}
                    <div className="pt-4">
                      <Button variant="outline" className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20">
                        Reflect on This Wisdom
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Virtue Progress */}
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Virtue Progress
                    <button
                      onClick={() => setShowWidgetInfo(showWidgetInfo === 'virtue_progress' ? null : 'virtue_progress')}
                      className="ml-auto p-1 text-muted-foreground hover:text-white transition-colors"
                    >
                      <Info className="h-4 w-4" />
                    </button>
                  </CardTitle>
                  <CardDescription>
                    7-day average scores for your core virtues
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {showWidgetInfo === 'virtue_progress' && (
                    <div className="mb-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <p className="text-sm text-blue-200">{getWidgetInfo('virtue_progress')?.description}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(virtueScores).map(([virtue, score]) => (
                      <div key={virtue} className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <span className="text-2xl">{getVirtueEmoji(virtue as keyof VirtueScores)}</span>
                          <span className={`text-sm font-medium ${getVirtueColor(virtue as keyof VirtueScores)}`}>
                            {virtue.charAt(0).toUpperCase() + virtue.slice(1)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div 
                            className={`h-2 rounded-full bg-gradient-to-r ${getVirtueGradient(virtue as keyof VirtueScores)}`}
                            style={{ width: `${Math.min(100, score)}%` }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">{score}/100</div>
                        <div className="flex gap-1 mt-2">
                          {[20, 40, 60, 80, 100].map((value) => (
                            <button
                              key={value}
                              onClick={() => handleVirtueUpdate(virtue as keyof VirtueScores, value)}
                              className={`w-4 h-4 rounded-full text-xs ${
                                score >= value ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                              }`}
                            >
                              {value}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

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
                    Track your emotional well-being and patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {showWidgetInfo === 'mood_tracker' && (
                    <div className="mb-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                      <p className="text-sm text-yellow-200">Track your daily mood with detailed notes, activity tags, and energy/stress levels. View patterns and trends over time to better understand your emotional well-being.</p>
                    </div>
                  )}
                  <MoodTrackerWidget frameworkTone="stoic" />
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