'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/nav/Header';
import { TabBar } from '@/components/nav/TabBar';
import { GuideFAB } from '@/components/ai/GuideFAB';
import { TaskCard } from '@/components/cards/TaskCard';
import { BreathworkCard } from '@/components/cards/BreathworkCard';

import { StreakCard } from '@/components/cards/StreakCard';
import { MoodTrackerCard } from '@/components/cards/MoodTrackerCard';
import { HydrationTrackerCard } from '@/components/cards/HydrationTrackerCard';
import { FocusTimerCard } from '@/components/cards/FocusTimerCard';
import { SleepTrackerCard } from '@/components/cards/SleepTrackerCard';
import { HabitTrackerCard } from '@/components/cards/HabitTrackerCard';
import { JournalCard } from '@/components/cards/JournalCard';
import { GoalTrackerCard } from '@/components/cards/GoalTrackerCard';
import { WisdomSpotlightCard } from '@/components/cards/WisdomSpotlightCard';
import { Sparkles, Target, Heart, Brain, BookOpen, Grid3X3 } from 'lucide-react';
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
  const [focusVirtue, setFocusVirtue] = useState<'wisdom' | 'courage' | 'justice' | 'temperance'>('wisdom');
  const [mood, setMood] = useState<number | null>(null);
  const [intention, setIntention] = useState('');
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Morning meditation',
      description: '10 minutes of focused breathing',
      priority: 'H',
      completed: false,
    },
    {
      id: '2',
      title: 'Read philosophy',
      description: 'Continue with Stoic texts',
      priority: 'M',
      completed: false,
    },
    {
      id: '3',
      title: 'Exercise',
      description: '30 minutes of movement',
      priority: 'H',
      completed: false,
    },
  ]);

  const [habits, setHabits] = useState<Habit[]>([
    {
      id: '1',
      title: 'Meditation',
      streakCount: 7,
      lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000),
      checkedToday: true,
    },
    {
      id: '2',
      title: 'Reading',
      streakCount: 5,
      lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      checkedToday: true,
    },
    {
      id: '3',
      title: 'Exercise',
      streakCount: 3,
      lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      checkedToday: false,
    },
  ]);

  const [userWidgets, setUserWidgets] = useState<string[]>([]);

  // Load user's added widgets
  useEffect(() => {
    const saved = localStorage.getItem('userWidgets');
    if (saved) {
      const parsedWidgets = JSON.parse(saved);
      // Remove duplicates and ensure wisdom_spotlight only appears once
      const uniqueWidgets = Array.from(new Set(parsedWidgets)) as string[];
      setUserWidgets(uniqueWidgets);
      localStorage.setItem('userWidgets', JSON.stringify(uniqueWidgets));
    } else {
      // Add some default widgets for demonstration
      const defaultWidgets = ['breathwork', 'mood_tracker', 'hydration', 'focus_timer', 'wisdom_spotlight'];
      setUserWidgets(defaultWidgets);
      localStorage.setItem('userWidgets', JSON.stringify(defaultWidgets));
    }
  }, []);

  const renderWidget = (widgetId: string) => {
    switch (widgetId) {
      case 'breathwork':
        return <BreathworkCard key={widgetId} />;
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
      case 'goal_tracker':
        return <GoalTrackerCard key={widgetId} />;
      case 'wisdom_spotlight':
        return <WisdomSpotlightCard key={widgetId} />;
      default:
        return null;
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
        {/* Hero Strip */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-text">
                  {isMorning ? 'Good morning' : isEvening ? 'Good evening' : 'Good afternoon'}
                </h1>
                <p className="text-sm text-muted">Ready to flourish today?</p>
              </div>
            </div>
            
            {/* Widget Gallery Button */}
            <button
              onClick={() => window.location.href = '/tools'}
              className="flex items-center gap-2 px-3 py-2 bg-surface border border-border rounded-lg hover:bg-surface-2 transition-colors duration-150"
            >
              <Grid3X3 className="w-4 h-4 text-muted" />
              <span className="text-sm font-medium text-text">Widgets</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={cn(
              'px-3 py-1 rounded-full border text-sm font-medium',
              'bg-primary/20 text-primary border-primary/30'
            )}>
              Focus: {focusVirtue.charAt(0).toUpperCase() + focusVirtue.slice(1)}
            </div>
            <p className="text-sm text-muted">
              {completedTasks.length} of {tasks.length} tasks completed
            </p>
          </div>
        </div>

        {/* Morning Block */}
        {isMorning && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-text">Morning Intention</h2>
            
            {/* Mood Selector */}
            <div className="bg-surface border border-border rounded-lg p-4">
              <h3 className="text-sm font-medium text-text mb-3">How are you feeling?</h3>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => setMood(value)}
                    className={cn(
                      'p-3 rounded-lg border transition-all duration-150',
                      mood === value
                        ? 'bg-primary/20 border-primary/30 text-primary'
                        : 'bg-surface-2 border-border text-muted hover:text-text hover:border-primary/30'
                    )}
                  >
                    <div className="text-lg">
                      {value === 1 ? '😞' : value === 2 ? '😐' : value === 3 ? '😊' : value === 4 ? '😄' : '🤩'}
                    </div>
                    <div className="text-xs mt-1">{value}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Intention Input */}
            <div className="bg-surface border border-border rounded-lg p-4">
              <h3 className="text-sm font-medium text-text mb-3">Today's intention</h3>
              <input
                type="text"
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                placeholder="What will you focus on today?"
                className="w-full px-4 py-2 bg-surface-2 border border-border rounded-lg text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
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
              {userWidgets.map(widgetId => renderWidget(widgetId))}
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