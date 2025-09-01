'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/nav/Header';
import { TabBar } from '@/components/nav/TabBar';
import { GuideFAB } from '@/components/ai/GuideFAB';
import { TaskCard } from '@/components/cards/TaskCard';
import { BreathworkWidgetNew } from '@/components/BreathworkWidgetNew';
import { useAuth } from '@/lib/auth-context';

import { StreakCard } from '@/components/cards/StreakCard';
import { MoodTrackerCard } from '@/components/cards/MoodTrackerCard';
import { HydrationTrackerCard } from '@/components/cards/HydrationTrackerCard';
import { FocusTimerCard } from '@/components/cards/FocusTimerCard';
import { SleepTrackerCard } from '@/components/cards/SleepTrackerCard';
import { HabitTrackerCard } from '@/components/cards/HabitTrackerCard';
import { JournalCard } from '@/components/cards/JournalCard';
import { GratitudeJournalCard } from '@/components/cards/GratitudeJournalCard';
import { GoalTrackerCard } from '@/components/cards/GoalTrackerCard';
import { WisdomSpotlightCard } from '@/components/cards/WisdomSpotlightCard';
import { TerminologyWidget } from '@/components/cards/TerminologyWidget';
import AcademyLogo from '@/components/AcademyLogo';
import VirtueRadar from '@/components/VirtueRadar';
import { Target, Heart, Brain, BookOpen, Grid3X3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'L' | 'M' | 'H';
  dueDate?: Date;
  completed: boolean;
}

interface Habit {
  id: string;
  title: string;
  streakCount: number;
  lastActivity: Date;
  checkedToday: boolean;
}

export default function TodayPage() {
  const { user, loading } = useAuth();
  const [focusVirtue, setFocusVirtue] = useState<'wisdom' | 'courage' | 'justice' | 'temperance'>('wisdom');
  const [mood, setMood] = useState<number | null>(null);
  const [intention, setIntention] = useState('');
  const [virtueData, setVirtueData] = useState<Array<{ virtue: string; score: number }>>([]);
  
  // Initialize empty arrays for authenticated users, mockup data for demo
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [userWidgets, setUserWidgets] = useState<string[]>([]);

  // No longer auto-loading demo data for unauthenticated users

  // Load user's added widgets
  useEffect(() => {
    if (loading) return; // Wait for auth to load

    if (user) {
      // Authenticated user - load their personal widgets
      const saved = localStorage.getItem(`userWidgets_${user.id}`);
      if (saved) {
        const parsedWidgets = JSON.parse(saved);
        const uniqueWidgets = Array.from(new Set(parsedWidgets)) as string[];
        console.log('Loading authenticated user widgets:', uniqueWidgets);
        setUserWidgets(uniqueWidgets);
      } else {
        // New authenticated user - start with empty widgets
        console.log('New authenticated user - starting with empty widgets');
        setUserWidgets([]);
      }
    } else {
      // Unauthenticated users start with empty widgets
      setUserWidgets([]);
    }
  }, [user, loading]);

  // Load virtue progress data
  useEffect(() => {
    const fetchVirtueData = async () => {
      try {
        const response = await fetch('/api/progress/virtues?days=7');
        if (response.ok) {
          const data = await response.json();
          if (data.scores) {
            const radarData = [
              { virtue: 'Wisdom', score: data.scores.wisdom || 0 },
              { virtue: 'Courage', score: data.scores.courage || 0 },
              { virtue: 'Justice', score: data.scores.justice || 0 },
              { virtue: 'Temperance', score: data.scores.temperance || 0 }
            ];
            setVirtueData(radarData);
          }
        }
      } catch (error) {
        console.error('Error fetching virtue data:', error);
        // Set default data if API fails
        setVirtueData([
          { virtue: 'Wisdom', score: 0 },
          { virtue: 'Courage', score: 0 },
          { virtue: 'Justice', score: 0 },
          { virtue: 'Temperance', score: 0 }
        ]);
      }
    };

    fetchVirtueData();
  }, []);

  // Save widget changes
  const saveUserWidgets = (widgets: string[]) => {
    if (user) {
      localStorage.setItem(`userWidgets_${user.id}`, JSON.stringify(widgets));
    }
    setUserWidgets(widgets);
  };

  const renderWidget = (widgetId: string) => {
    try {
      switch (widgetId) {
        case 'breathwork':
          return <BreathworkWidgetNew key={widgetId} />;
        case 'mood_tracker':
          return <MoodTrackerCard key={widgetId} />;
        case 'hydration':
          return <HydrationTrackerCard key={widgetId} />;
        case 'focus_timer':
          return <FocusTimerCard key={widgetId} />;
        case 'sleep_tracker':
          return <SleepTrackerCard key={widgetId} />;
        case 'habit_tracker':
          return <HabitTrackerCard key={widgetId} />;
        case 'journal':
          return <JournalCard key={widgetId} />;
        case 'gratitude_journal':
          return <GratitudeJournalCard key={widgetId} />;
        case 'goal_tracker':
          return <GoalTrackerCard key={widgetId} />;
        case 'wisdom_spotlight':
          return <WisdomSpotlightCard key={widgetId} />;
        case 'terminology':
          return <TerminologyWidget key={widgetId} />;
        default:
          console.warn(`Unknown widget ID: ${widgetId}`);
          return null;
      }
    } catch (error) {
      console.error(`Error rendering widget ${widgetId}:`, error);
      return (
        <div key={widgetId} className="bg-surface border border-border rounded-xl p-4">
          <div className="text-center text-muted">
            <p>Widget "{widgetId}" failed to load</p>
            <button 
              onClick={() => {
                const updatedWidgets = userWidgets.filter(id => id !== widgetId);
                saveUserWidgets(updatedWidgets);
              }}
              className="mt-2 px-3 py-1 bg-error/20 text-error rounded-lg text-sm"
            >
              Remove Widget
            </button>
          </div>
        </div>
      );
    }
  };

  const currentHour = new Date().getHours();
  const isMorning = currentHour < 12;
  const isEvening = currentHour >= 18;

  const handleTaskToggle = (taskId: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const handleHabitToggle = (habitId: string) => {
    setHabits(prev => 
      prev.map(habit => 
        habit.id === habitId 
          ? { ...habit, checkedToday: !habit.checkedToday }
          : habit
      )
    );
  };



  const topTasks = tasks.filter(task => !task.completed).slice(0, 3);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="min-h-screen bg-bg pb-20">
      <Header focusVirtue={focusVirtue} />
      
      <main className="px-4 py-6 space-y-6">
        {/* Enhanced Hero Section */}
        <div className="bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-courage rounded-full blur-2xl"></div>
          </div>
          
          <div className="relative z-10">
            {/* Header Row */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/30 to-primary/10 rounded-2xl flex items-center justify-center shadow-lg p-2">
                    <AcademyLogo className="w-full h-full text-primary" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-courage/20 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-courage rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-text mb-1">
                    {isMorning ? 'Good morning' : isEvening ? 'Good evening' : 'Good afternoon'}
                    {user?.displayName && `, ${user.displayName.split(' ')[0]}`}
                  </h1>
                  <p className="text-muted font-medium">Ready to flourish today?</p>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.location.href = '/tools'}
                  className="flex items-center gap-2 px-4 py-2 bg-surface/80 backdrop-blur-sm border border-border rounded-xl hover:bg-surface transition-all duration-200 hover:scale-105"
                >
                  <Grid3X3 className="w-4 h-4 text-muted" />
                  <span className="text-sm font-medium text-text">Widgets</span>
                </button>
              </div>
            </div>
            
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-surface/60 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">{completedTasks.length}</div>
                <div className="text-xs text-muted">Tasks Done</div>
              </div>
              <div className="bg-surface/60 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-courage mb-1">
                  {habits.filter(h => h.checkedToday).length}
                </div>
                <div className="text-xs text-muted">Habits Today</div>
              </div>
              <div className="bg-surface/60 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-justice mb-1">
                  {userWidgets.length}
                </div>
                <div className="text-xs text-muted">Active Tools</div>
              </div>
            </div>
            
            {/* Focus & Progress */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={cn(
                  'px-4 py-2 rounded-xl border text-sm font-semibold shadow-sm',
                  'bg-primary/20 text-primary border-primary/30'
                )}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    Focus: {focusVirtue.charAt(0).toUpperCase() + focusVirtue.slice(1)}
                  </div>
                </div>
                <div className="text-sm text-muted">
                  {Math.round((completedTasks.length / tasks.length) * 100) || 0}% complete
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="flex-1 max-w-xs ml-4">
                <div className="w-full bg-surface/40 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-courage h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.round((completedTasks.length / tasks.length) * 100) || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Virtue Progress Radar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text">Virtue Progress</h2>
            <div className="text-xs text-muted">7-day average</div>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-6">
            <VirtueRadar data={virtueData} />
          </div>
        </div>

        {/* Enhanced Morning Intention */}
        {isMorning && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text">Morning Intention</h2>
              <div className="text-xs text-muted">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
            </div>
            
            {/* Mood & Intention Card */}
            <div className="bg-gradient-to-br from-surface via-surface to-surface-2 border border-border rounded-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mood Selector */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-courage/20 rounded-lg flex items-center justify-center">
                      <Heart className="w-4 h-4 text-courage" />
                    </div>
                    <h3 className="font-semibold text-text">How are you feeling?</h3>
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    {[
                      { value: 1, emoji: '😞', label: 'Struggling' },
                      { value: 2, emoji: '😐', label: 'Neutral' },
                      { value: 3, emoji: '😊', label: 'Good' },
                      { value: 4, emoji: '😄', label: 'Great' },
                      { value: 5, emoji: '🤩', label: 'Amazing' }
                    ].map(({ value, emoji, label }) => (
                      <button
                        key={value}
                        onClick={() => setMood(value)}
                        className={cn(
                          'p-4 rounded-xl border transition-all duration-200 hover:scale-105',
                          mood === value
                            ? 'bg-courage/20 border-courage/30 text-courage shadow-lg'
                            : 'bg-surface-2 border-border text-muted hover:text-text hover:border-courage/30 hover:bg-courage/5'
                        )}
                      >
                        <div className="text-2xl mb-1">{emoji}</div>
                        <div className="text-xs font-medium">{label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Intention Input */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="font-semibold text-text">Today's intention</h3>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={intention}
                      onChange={(e) => setIntention(e.target.value)}
                      placeholder="What will you focus on today?"
                      className="w-full px-4 py-3 bg-surface-2 border border-border rounded-xl text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                    />
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Practice patience',
                        'Show kindness',
                        'Learn something new',
                        'Stay present',
                        'Be grateful'
                      ].map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => setIntention(suggestion)}
                          className="px-3 py-1 bg-surface-2 border border-border rounded-full text-xs text-muted hover:text-text hover:border-primary/30 transition-colors duration-150"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top Tasks */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-text">Top 3 Tasks</h2>
          <div className="space-y-3">
            {topTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={handleTaskToggle}
              />
            ))}
          </div>
        </div>

        {/* Practice Row */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-text">Practice</h2>
          
          {/* Habit Quick Toggles */}
          <div className="bg-surface border border-border rounded-lg p-4">
            <h3 className="text-sm font-medium text-text mb-3">Quick Habits</h3>
            <div className="grid grid-cols-3 gap-2">
              {habits.map((habit) => (
                <button
                  key={habit.id}
                  onClick={() => handleHabitToggle(habit.id)}
                  className={cn(
                    'p-3 rounded-lg border transition-all duration-150',
                    habit.checkedToday
                      ? 'bg-success/20 border-success/30 text-success'
                      : 'bg-surface-2 border-border text-muted hover:text-text hover:border-primary/30'
                  )}
                >
                  <div className="text-sm font-medium">{habit.title}</div>
                  <div className="text-xs opacity-80">{habit.streakCount} day streak</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Widgets Section */}
        {userWidgets.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text">Your Wellness Tools</h2>
              <button
                onClick={() => window.location.href = '/tools'}
                className="text-xs text-primary hover:underline"
              >
                Manage Widgets
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {userWidgets.map(widgetId => {
                console.log('Rendering widget:', widgetId);
                return renderWidget(widgetId);
              })}
            </div>
          </div>
        )}





        {/* Evening Block */}
        {isEvening && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-text">Evening Reflection</h2>
            
            <div className="bg-surface border border-border rounded-lg p-4">
              <h3 className="text-sm font-medium text-text mb-3">Reflection Prompt</h3>
              <p className="text-sm text-muted mb-4">
                "What was the most meaningful moment of your day? How did you practice your focus virtue?"
              </p>
              <textarea
                placeholder="Share your thoughts..."
                className="w-full px-4 py-3 bg-surface-2 border border-border rounded-lg text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Streaks */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-text">Your Streaks</h2>
          <div className="grid grid-cols-2 gap-3">
            {habits.map((habit) => (
              <StreakCard
                key={habit.id}
                title={habit.title}
                count={habit.streakCount}
                lastActivity={habit.lastActivity}
                target={7}
              />
            ))}
          </div>
        </div>
      </main>

      <GuideFAB />
      <TabBar />
    </div>
  );
} 