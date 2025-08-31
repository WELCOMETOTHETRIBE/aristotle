'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Target, CheckCircle, Clock, TrendingUp, Heart, Brain, Calendar, Droplets, 
  Smile, Zap, Trophy, Info, BookOpen, Timer, Hash, Camera, Mic, CheckSquare, 
  FileText, Sliders, RotateCcw, Users, Star, Leaf, Shield, Scale, Sparkles, 
  ArrowRight, Settings, Activity, BarChart3, Target as TargetIcon, 
  Lightbulb, Compass, Award, ChevronRight, Play, Pause, SkipForward
} from 'lucide-react';

import TimerCard from '@/components/widgets/TimerCard';
import CounterCard from '@/components/widgets/CounterCard';
import { HydrationWidget } from '@/components/ModuleWidgets';
import { BreathworkWidgetNew } from '@/components/BreathworkWidgetNew';
import { HedonicAwarenessWidget } from '@/components/HedonicAwarenessWidget';
import { MoodTrackerWidget } from '@/components/MoodTrackerWidget';
import { getVirtueEmoji, getVirtueColor, getVirtueGradient } from '@/lib/virtue';
import { getAllFrameworks } from '@/lib/frameworks.config';
import MilestonesDropdown from '@/components/MilestonesDropdown';
import VirtueRadar from '@/components/VirtueRadar';
import { useOnboardingStatus } from '@/lib/hooks/useOnboardingStatus';
import Link from 'next/link';

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

export default function DashboardPage() {
  const [virtueScores, setVirtueScores] = useState<VirtueScores>({ wisdom: 0, courage: 0, justice: 0, temperance: 0 });
  const [hydrationData, setHydrationData] = useState<HydrationData>({ current: 0, target: 2000, percentage: 0 });
  const [moodData, setMoodData] = useState<MoodData>({ mood: null, note: null, logged: false });
  const [habits, setHabits] = useState<Habit[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayWisdom, setTodayWisdom] = useState({
    quote: "The unexamined life is not worth living.",
    author: "Socrates",
    framework: "Stoic",
    reflection: "What aspect of your life needs deeper examination today?"
  });
  const { isComplete, shouldShowPrompt } = useOnboardingStatus();

  useEffect(() => {
    fetchDashboardData();
    loadDailyWisdom();
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

  const loadDailyWisdom = async () => {
    try {
      const frameworks = ['Stoic', 'Spartan', 'Samurai', 'Monastic', 'Yogic'];
      const randomFramework = frameworks[Math.floor(Math.random() * frameworks.length)];
      
      const response = await fetch('/api/generate/daily-wisdom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    }
  };

  const dueTasks = tasks.filter(task => !task.completedAt && task.dueAt);
  const completedTasks = tasks.filter(task => task.completedAt);
  const activeGoals = goals.filter(goal => goal.status === 'active');
  const checkedHabits = habits.filter(habit => habit.checkedToday);
  const totalVirtueScore = Object.values(virtueScores).reduce((a, b) => a + b, 0);
  const averageVirtueScore = Math.round(totalVirtueScore / 4);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-7xl mx-auto">
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
            <p className="text-lg font-medium text-gray-300">Loading your journey...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Hero Section with Onboarding */}
          {shouldShowPrompt && (
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-red-500/10 border border-amber-500/20 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5 opacity-50"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-3xl transform translate-x-16 -translate-y-16"></div>
              
              <div className="relative p-8">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                      Begin Your Philosophical Journey
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
                      Discover your ideal philosophical framework and unlock personalized practices for intentional living
                    </p>
                    
                    <div className="flex flex-wrap gap-3 mb-6">
                      <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-sm text-green-700 dark:text-green-300 font-medium">3-5 minutes</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">AI-powered matching</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="text-sm text-purple-700 dark:text-purple-300 font-medium">100% private</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center gap-4 lg:items-end">
                    <Button
                      onClick={() => window.location.href = '/onboarding'}
                      size="lg"
                      className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-4 text-lg font-semibold shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300 transform hover:scale-105"
                    >
                      Start Assessment
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                      Get your personalized framework recommendation
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            
            {/* Left Column - Main Content */}
            <div className="xl:col-span-3 space-y-8">
              
              {/* Virtue Progress Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="card-base bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xl font-bold">Virtue Progress</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Your journey to excellence</div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Total Score</span>
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalVirtueScore}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Average</span>
                        <span className="text-xl font-semibold text-gray-900 dark:text-white">{averageVirtueScore}/25</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(averageVirtueScore / 25) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-base bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <Activity className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xl font-bold">Today's Progress</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Daily achievements</div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{completedTasks.length}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Tasks Done</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{checkedHabits.length}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Habits Checked</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{activeGoals.length}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Active Goals</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{habits.length}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Total Habits</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Daily Wisdom Spotlight */}
              <Card className="card-base bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-indigo-500/5 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xl font-bold">Daily Wisdom</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{todayWisdom.framework} tradition</div>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={loadDailyWisdom}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <blockquote className="text-xl md:text-2xl font-serif italic text-gray-900 dark:text-white leading-relaxed border-l-4 border-purple-500 pl-6">
                      "{todayWisdom.quote}"
                    </blockquote>
                    <div className="flex items-center justify-between">
                      <cite className="text-purple-600 dark:text-purple-400 font-medium">— {todayWisdom.author}</cite>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Live</span>
                      </div>
                    </div>
                    {todayWisdom.reflection && (
                      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-4 border border-purple-500/20">
                        <h4 className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4" />
                          Reflection Prompt
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                          {todayWisdom.reflection}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link href="/focus-timer">
                  <Card className="card-base hover-lift cursor-pointer bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-blue-500/20">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                          <Timer className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">Focus Timer</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Deep work sessions</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/task-manager">
                  <Card className="card-base hover-lift cursor-pointer bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">Task Manager</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Organize priorities</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/journal">
                  <Card className="card-base hover-lift cursor-pointer bg-gradient-to-br from-purple-500/5 to-violet-500/5 border-purple-500/20">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">Journal</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Reflect & grow</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/habit-tracker">
                  <Card className="card-base hover-lift cursor-pointer bg-gradient-to-br from-orange-500/5 to-red-500/5 border-orange-500/20">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">Habit Tracker</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Build consistency</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/community">
                  <Card className="card-base hover-lift cursor-pointer bg-gradient-to-br from-indigo-500/5 to-blue-500/5 border-indigo-500/20">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">Community</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Connect & learn</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/frameworks">
                  <Card className="card-base hover-lift cursor-pointer bg-gradient-to-br from-teal-500/5 to-cyan-500/5 border-teal-500/20">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
                          <Compass className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">Frameworks</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Explore wisdom</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>

              {/* Recent Activity */}
              <Card className="card-base">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                    <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xl font-bold">Recent Activity</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Your latest progress</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {completedTasks.length > 0 ? (
                      completedTasks.slice(0, 3).map((task) => (
                        <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">{task.title}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Task completed</p>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(task.completedAt!).toLocaleTimeString()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Target className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">No recent activity</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">Start your journey by completing your first task</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              
              {/* Virtue Radar Chart */}
              <Card className="card-base bg-gradient-to-br from-slate-500/5 to-gray-500/5 border-slate-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                    <div className="w-10 h-10 bg-gradient-to-r from-slate-500 to-gray-600 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold">Virtue Balance</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Your character strengths</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <VirtueRadar data={[
                      { virtue: 'Wisdom', score: virtueScores.wisdom },
                      { virtue: 'Courage', score: virtueScores.courage },
                      { virtue: 'Justice', score: virtueScores.justice },
                      { virtue: 'Temperance', score: virtueScores.temperance }
                    ]} />
                  </div>
                </CardContent>
              </Card>

              {/* Breathwork Widget */}
              <Card className="card-base bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold">Breathwork</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Master your breath</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BreathworkWidgetNew frameworkTone="stoic" />
                </CardContent>
              </Card>

              {/* Hydration Tracker */}
              <Card className="card-base bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <Droplets className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold">Hydration</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Stay hydrated</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <HydrationWidget frameworkTone="stoic" />
                </CardContent>
              </Card>

              {/* Mood Tracker */}
              <Card className="card-base bg-gradient-to-br from-pink-500/5 to-rose-500/5 border-pink-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
                      <Smile className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold">Mood</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Track your feelings</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MoodTrackerWidget frameworkTone="stoic" />
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="card-base">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Tasks Completed</span>
                      <span className="font-medium text-gray-900 dark:text-white">{completedTasks.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Active Goals</span>
                      <span className="font-medium text-gray-900 dark:text-white">{activeGoals.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Habits Tracked</span>
                      <span className="font-medium text-gray-900 dark:text-white">{habits.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Habits Done Today</span>
                      <span className="font-medium text-gray-900 dark:text-white">{checkedHabits.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Streak Days</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {habits.reduce((sum, habit) => sum + habit.streakCount, 0)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
