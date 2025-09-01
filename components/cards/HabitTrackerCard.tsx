'use client';

import { useState, useEffect } from 'react';
import { Target, Plus, TrendingUp, Info, Settings, Sparkles, Brain, Calendar, Flame, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HabitTrackerCardProps {
  className?: string;
}

interface Habit {
  id: string;
  title: string;
  description?: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  target: number;
  streakCount: number;
  totalCompletions: number;
  lastCompleted?: Date;
  createdAt: Date;
  isActive: boolean;
  color: string;
}

interface HabitCompletion {
  id: string;
  habitId: string;
  timestamp: Date;
  notes?: string;
}

interface HabitSettings {
  enableAIInsights: boolean;
  showStreaks: boolean;
  showStats: boolean;
  enableReminders: boolean;
  reminderTime: string;
  defaultFrequency: 'daily' | 'weekly' | 'monthly';
  defaultTarget: number;
}

const habitCategories = [
  'Health', 'Productivity', 'Learning', 'Mindfulness', 'Social', 'Creative', 'Finance', 'Other'
];

const habitColors = [
  'from-green-500 to-emerald-500',
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-violet-500',
  'from-orange-500 to-red-500',
  'from-pink-500 to-rose-500',
  'from-indigo-500 to-blue-500',
  'from-yellow-500 to-orange-500',
  'from-teal-500 to-green-500'
];

export function HabitTrackerCard({ className }: HabitTrackerCardProps) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [newHabit, setNewHabit] = useState({
    title: '',
    description: '',
    category: 'Health',
    frequency: 'daily' as const,
    target: 1,
    color: habitColors[0]
  });
  const [settings, setSettings] = useState<HabitSettings>({
    enableAIInsights: true,
    showStreaks: true,
    showStats: true,
    enableReminders: true,
    reminderTime: '09:00',
    defaultFrequency: 'daily',
    defaultTarget: 1,
  });
  const [isAdding, setIsAdding] = useState(false);

  // Load saved data
  useEffect(() => {
    try {
      const savedHabits = localStorage.getItem('habitTrackerHabits');
      const savedCompletions = localStorage.getItem('habitTrackerCompletions');
      const savedSettings = localStorage.getItem('habitTrackerSettings');
      
      if (savedHabits) {
        const parsed = JSON.parse(savedHabits);
        setHabits(parsed.map((habit: any) => ({
          ...habit,
          createdAt: new Date(habit.createdAt),
          lastCompleted: habit.lastCompleted ? new Date(habit.lastCompleted) : undefined
        })));
      }
      
      if (savedCompletions) {
        const parsed = JSON.parse(savedCompletions);
        setCompletions(parsed.map((completion: any) => ({
          ...completion,
          timestamp: new Date(completion.timestamp)
        })));
      }
      
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (e) {
      // Ignore storage parse errors to avoid breaking the widget
      console.warn('HabitTracker: failed to load saved data');
    }
  }, []);

  // Save data
  const saveHabits = (newHabits: Habit[]) => {
    setHabits(newHabits);
    try {
      localStorage.setItem('habitTrackerHabits', JSON.stringify(newHabits));
    } catch (e) {
      console.warn('HabitTracker: failed to save habits');
    }
  };

  const saveCompletions = (newCompletions: HabitCompletion[]) => {
    setCompletions(newCompletions);
    try {
      localStorage.setItem('habitTrackerCompletions', JSON.stringify(newCompletions));
    } catch (e) {
      console.warn('HabitTracker: failed to save completions');
    }
  };

  const saveSettings = (newSettings: HabitSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem('habitTrackerSettings', JSON.stringify(newSettings));
    } catch (e) {
      console.warn('HabitTracker: failed to save settings');
    }
  };

  const addHabit = () => {
    if (isAdding) return;
    const title = newHabit.title.trim();
    if (!title) return;
    const safeTarget = Math.min(10, Math.max(1, Number(newHabit.target) || 1));

    setIsAdding(true);
    try {
      const habit: Habit = {
        id: Date.now().toString(),
        title,
        description: newHabit.description.trim() || undefined,
        category: newHabit.category,
        frequency: newHabit.frequency,
        target: safeTarget,
        streakCount: 0,
        totalCompletions: 0,
        createdAt: new Date(),
        isActive: true,
        color: newHabit.color,
      };

      const updatedHabits = [habit, ...habits];
      saveHabits(updatedHabits);
      
      setNewHabit({
        title: '',
        description: '',
        category: 'Health',
        frequency: 'daily',
        target: 1,
        color: habitColors[0]
      });
      setShowAddHabit(false);
    } finally {
      setIsAdding(false);
    }
  };

  const completeHabit = (habitId: string) => {
    const now = new Date();
    const completion: HabitCompletion = {
      id: Date.now().toString(),
      habitId,
      timestamp: now,
    };

    const updatedCompletions = [completion, ...completions];
    saveCompletions(updatedCompletions);

    // Update habit stats
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const habitCompletions = updatedCompletions.filter(c => c.habitId === habitId);
        const todayCompletions = habitCompletions.filter(c => {
          const completionDate = new Date(c.timestamp);
          return completionDate.toDateString() === now.toDateString();
        });

        // Calculate streak
        let streak = 0;
        const sortedCompletions = habitCompletions
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        
        let currentDate = new Date(now);
        for (const comp of sortedCompletions) {
          const compDate = new Date(comp.timestamp);
          const daysDiff = Math.floor((currentDate.getTime() - compDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysDiff <= 1) {
            streak++;
            currentDate = compDate;
          } else {
            break;
          }
        }

        return {
          ...habit,
          streakCount: streak,
          totalCompletions: habitCompletions.length,
          lastCompleted: now,
        };
      }
      return habit;
    });

    saveHabits(updatedHabits);
  };

  const generateAIInsights = async () => {
    if (!settings.enableAIInsights || habits.length < 2) return;

    try {
      const response = await fetch('/api/ai/guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Analyze my habit tracking data and provide 3 actionable insights for building better habits. My habits: ${JSON.stringify(habits)}. My completions: ${JSON.stringify(completions.slice(0, 20))}.`,
          context: {
            page: 'habit_tracker',
            focusVirtue: 'temperance',
            timeOfDay: new Date().getHours(),
          },
        }),
      });

      if (response.ok) {
        const reader = response.body?.getReader();
        if (reader) {
          let content = '';
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split('\n');
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') break;
                
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.content) {
                    content += parsed.content;
                  }
                } catch (e) {
                  // Ignore parsing errors
                }
              }
            }
          }
          
          const cleanContent = content
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/`(.*?)`/g, '$1')
            .replace(/\[(.*?)\]\(.*?\)/g, '$1')
            .replace(/^#+\s*/gm, '')
            .replace(/^\s*[-*+]\s*/gm, '')
            .replace(/^\s*\d+\.\s*/gm, '');
          
          const insights = cleanContent.split('\n').filter(line => line.trim().startsWith('•') || line.trim().startsWith('-')).slice(0, 3);
          setAiInsights(insights.length > 0 ? insights : [
            'Start with small, achievable habits to build momentum',
            'Stack new habits onto existing routines for better consistency',
            'Track your progress to stay motivated and identify patterns'
          ]);
        }
      }
    } catch (error) {
      console.error('Failed to generate AI insights:', error);
      setAiInsights([
        'Start with small, achievable habits to build momentum',
        'Stack new habits onto existing routines for better consistency',
        'Track your progress to stay motivated and identify patterns'
      ]);
    }
  };

  const getTodayCompletions = (habitId: string) => {
    const today = new Date();
    return completions.filter(completion => {
      const completionDate = new Date(completion.timestamp);
      return completion.habitId === habitId && completionDate.toDateString() === today.toDateString();
    }).length;
  };

  const getWeeklyStats = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weekCompletions = completions.filter(completion => 
      new Date(completion.timestamp) > weekAgo
    );
    
    const totalHabits = habits.length;
    const totalCompletions = weekCompletions.length;
    const completionRate = totalHabits > 0 ? Math.round((totalCompletions / (totalHabits * 7)) * 100) : 0;
    
    return { totalHabits, totalCompletions, completionRate };
  };

  const getTopStreak = () => {
    if (habits.length === 0) return 0;
    return Math.max(...habits.map(habit => habit.streakCount));
  };

  const weeklyStats = getWeeklyStats();

  return (
    <div className={cn('bg-surface border border-border rounded-lg p-4', className)}>
      {/* Header with Info and Settings */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center">
            <Target className="w-4 h-4 text-green-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text">Habit Tracker</h3>
            <p className="text-xs text-muted">Build lasting habits</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-1.5 hover:bg-surface-2 rounded-lg transition-colors"
          >
            <Info className="w-4 h-4 text-muted" />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 hover:bg-surface-2 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4 text-muted" />
          </button>
        </div>
      </div>

      {/* Info Modal */}
      {showInfo && (
        <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <h4 className="text-sm font-semibold text-text mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            How to use Habit Tracker
          </h4>
          <div className="text-xs text-muted space-y-2">
            <p>• Create habits with specific targets and frequencies</p>
            <p>• Check off habits daily to build streaks</p>
            <p>• Track your progress and consistency</p>
            <p>• Use AI insights to optimize your habit-building</p>
            <p>• Start small and gradually increase difficulty</p>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="mb-4 p-3 bg-surface-2 border border-border rounded-lg">
          <h4 className="text-sm font-semibold text-text mb-3">Settings</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">AI insights</span>
              <button
                onClick={() => saveSettings({ ...settings, enableAIInsights: !settings.enableAIInsights })}
                className={cn(
                  'p-1.5 rounded-lg transition-colors',
                  settings.enableAIInsights 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-surface text-muted'
                )}
              >
                <Brain className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">Show streaks</span>
              <button
                onClick={() => saveSettings({ ...settings, showStreaks: !settings.showStreaks })}
                className={cn(
                  'p-1.5 rounded-lg transition-colors',
                  settings.showStreaks 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-surface text-muted'
                )}
              >
                <Flame className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">Show stats</span>
              <button
                onClick={() => saveSettings({ ...settings, showStats: !settings.showStats })}
                className={cn(
                  'p-1.5 rounded-lg transition-colors',
                  settings.showStats 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-surface text-muted'
                )}
              >
                <TrendingUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      {settings.showStats && (
        <div className="mb-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-surface-2 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-3 h-3 text-muted" />
                <span className="text-xs text-muted">Active</span>
              </div>
              <div className="text-lg font-bold text-text">
                {habits.filter(h => h.isActive).length}
              </div>
            </div>
            <div className="bg-surface-2 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-3 h-3 text-muted" />
                <span className="text-xs text-muted">Top streak</span>
              </div>
              <div className="text-lg font-bold text-text">
                {getTopStreak()}
              </div>
            </div>
            <div className="bg-surface-2 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-3 h-3 text-muted" />
                <span className="text-xs text-muted">Weekly %</span>
              </div>
              <div className="text-lg font-bold text-text">
                {weeklyStats.completionRate}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Insights */}
      {settings.enableAIInsights && aiInsights.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted">AI Insights</span>
            <button
              onClick={() => setShowAIInsights(!showAIInsights)}
              className="text-xs text-primary hover:underline"
            >
              {showAIInsights ? 'Hide' : 'Show'}
            </button>
          </div>
          {showAIInsights && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
              {aiInsights.map((insight, index) => (
                <div key={index} className="text-xs text-primary/80 mb-2 flex items-start gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Habits List */}
      <div className="mb-4 space-y-3">
        {habits.filter(h => h.isActive).map(habit => {
          const todayCompletions = getTodayCompletions(habit.id);
          const isCompleted = todayCompletions >= habit.target;
          
          return (
            <div key={habit.id} className="bg-surface-2 border border-border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 bg-gradient-to-r ${habit.color} rounded-lg flex items-center justify-center`}>
                    <Target className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-text">{habit.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <span>{habit.category}</span>
                      <span>•</span>
                      <span>{habit.frequency}</span>
                      {habit.target > 1 && (
                        <>
                          <span>•</span>
                          <span>{todayCompletions}/{habit.target}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => completeHabit(habit.id)}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    isCompleted
                      ? 'bg-green-500/20 text-green-500'
                      : 'bg-surface border border-border text-muted hover:text-text hover:border-green-500/30'
                  )}
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
              </div>
              
              {settings.showStreaks && habit.streakCount > 0 && (
                <div className="flex items-center gap-2 text-xs text-muted">
                  <Flame className="w-3 h-3" />
                  <span>{habit.streakCount} day streak</span>
                  <span>•</span>
                  <span>{habit.totalCompletions} total</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Habit Button */}
      {!showAddHabit ? (
        <button
          onClick={() => setShowAddHabit(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-150"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Add Habit</span>
        </button>
      ) : (
        <div className="space-y-3">
          {/* Habit Title */}
          <div>
            <label className="text-xs text-muted mb-2 block">Habit name</label>
            <input
              type="text"
              value={newHabit.title}
              onChange={(e) => setNewHabit(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Morning meditation"
              className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-sm text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-muted mb-2 block">Description (optional)</label>
            <input
              type="text"
              value={newHabit.description}
              onChange={(e) => setNewHabit(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the habit"
              className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-sm text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500"
            />
          </div>

          {/* Category and Frequency */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted mb-2 block">Category</label>
              <select
                value={newHabit.category}
                onChange={(e) => setNewHabit(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500"
              >
                {habitCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted mb-2 block">Frequency</label>
              <select
                value={newHabit.frequency}
                onChange={(e) => setNewHabit(prev => ({ ...prev, frequency: e.target.value as any }))}
                className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          {/* Target */}
          <div>
            <label className="text-xs text-muted mb-2 block">Daily target</label>
            <input
              type="number"
              value={newHabit.target}
              onChange={(e) => setNewHabit(prev => ({ ...prev, target: parseInt(e.target.value) || 1 }))}
              className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500"
              min="1"
              max="10"
            />
          </div>

          {/* Color */}
          <div>
            <label className="text-xs text-muted mb-2 block">Color</label>
            <div className="grid grid-cols-4 gap-2">
              {habitColors.map((color, index) => (
                <button
                  key={color}
                  onClick={() => setNewHabit(prev => ({ ...prev, color }))}
                  className={cn(
                    'w-8 h-8 rounded-lg border-2 transition-all',
                    newHabit.color === color
                      ? 'border-white shadow-lg'
                      : 'border-border hover:border-white/50'
                  )}
                  style={{ background: `linear-gradient(135deg, ${color.split(' ')[0].replace('from-', '')} 0%, ${color.split(' ')[2].replace('to-', '')} 100%)` }}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowAddHabit(false);
                setNewHabit({
                  title: '',
                  description: '',
                  category: 'Health',
                  frequency: 'daily',
                  target: 1,
                  color: habitColors[0]
                });
              }}
              className="flex-1 px-3 py-2 bg-surface-2 border border-border text-text rounded-lg hover:bg-surface transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              onClick={addHabit}
              disabled={isAdding || !newHabit.title.trim()}
              className="flex-1 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? 'Adding…' : 'Add Habit'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 