'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/nav/Header';
import { TabBar } from '@/components/nav/TabBar';
import { GuideFAB } from '@/components/ai/GuideFAB';
import { BreathworkWidgetNew } from '@/components/BreathworkWidgetNew';
import { useAuth } from '@/lib/auth-context';
import { logToJournal, createMoodLog } from '@/lib/journal-logger';

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
import { DailyWisdomCard } from '@/components/cards/DailyWisdomCard';
import { TerminologyWidget } from '@/components/cards/TerminologyWidget';
import AcademyLogo from '@/components/AcademyLogo';
import { Target, Heart, Brain, BookOpen, Grid3X3, MessageCircle, Plus, Activity, Zap, Shield, Camera, Leaf, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NaturePhotoLogWidget } from '@/components/ModuleWidgets';
import BalanceCard from '@/components/widgets/BalanceCard';
import Link from 'next/link';

export default function TodayPage() {
  const { user, loading } = useAuth();
  const [focusVirtue, setFocusVirtue] = useState<'wisdom' | 'courage' | 'justice' | 'temperance'>('wisdom');
  const [mood, setMood] = useState<number | null>(null);
  const [intention, setIntention] = useState('');
  const [virtueData, setVirtueData] = useState<Array<{ virtue: string; score: number }>>([]);
  const [userPreferences, setUserPreferences] = useState<any>(null);
  const [submittedIntentions, setSubmittedIntentions] = useState<{[key: string]: boolean}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dismissedMoodModal, setDismissedMoodModal] = useState<{[key: string]: boolean}>({});
  const [showTasksModal, setShowTasksModal] = useState(false);
  const [pendingTaskCount, setPendingTaskCount] = useState(0);
  
  // Initialize empty arrays for authenticated users
  const [userWidgets, setUserWidgets] = useState<string[]>([]);

  // No longer auto-loading demo data for unauthenticated users

  // Load user's added widgets and preferences
  useEffect(() => {
    if (loading) return; // Wait for auth to load

    if (user) {
      // Authenticated user - load their personal widgets
      if (typeof window !== 'undefined') {
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

        // Load user preferences
        const savedPrefs = localStorage.getItem('userPreferences');
        if (savedPrefs) {
          try {
            const prefs = JSON.parse(savedPrefs);
            setUserPreferences(prefs);
            if (prefs.focusVirtue) {
              setFocusVirtue(prefs.focusVirtue);
            }
          } catch (error) {
            console.error('Error parsing user preferences:', error);
          }
        }

        // Fetch pending task count
        const fetchTaskCount = async () => {
          try {
            const response = await fetch('/api/tasks');
            if (response.ok) {
              const data = await response.json();
              if (Array.isArray(data)) {
                const pending = data.filter((task: any) => !task.completedAt).length;
                setPendingTaskCount(pending);
              } else {
                setPendingTaskCount(data.pendingCount || 0);
              }
            }
          } catch (error) {
            console.error('Error fetching task count:', error);
          }
        };

        fetchTaskCount();
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
        case 'wisdom_spotlight':
          return <DailyWisdomCard key={widgetId} />;
        case 'terminology':
          return <TerminologyWidget key={widgetId} />;
        case 'nature_photo':
          return <NaturePhotoLogWidget key={widgetId} />;
        case 'gratitude_journal':
          return <GratitudeJournalCard key={widgetId} />;
        case 'goal_tracker':
          return <GoalTrackerCard key={widgetId} />;
        case 'journal':
          return <JournalCard key={widgetId} />;
        case 'balance_gyro':
          return (
            <BalanceCard 
              key={widgetId}
              title="Balance Challenge"
              config={{ targetSec: 60, sensitivity: 'medium', teaching: "Find your center through stillness" }}
              onComplete={() => console.log('Balance challenge completed')}
              virtueGrantPerCompletion={{ temperance: 2, wisdom: 1 }}
            />
          );
        case 'movement_tracker':
          return (
            <div key={widgetId} className="bg-surface border border-border rounded-xl p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-text">Movement Tracker</h3>
                  <p className="text-sm text-muted">Track your daily physical activity</p>
                </div>
              </div>
              <div className="text-center py-6">
                <p className="text-muted text-sm mb-3">Track your daily movement and exercise</p>
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Activity className="w-8 h-8 text-emerald-500" />
                </div>
              </div>
            </div>
          );
        case 'reading_tracker':
          return (
            <div key={widgetId} className="bg-surface border border-border rounded-xl p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-text">Reading Tracker</h3>
                  <p className="text-sm text-muted">Track your reading progress and goals</p>
                </div>
              </div>
              <div className="text-center py-6">
                <p className="text-muted text-sm mb-3">Monitor your reading habits and progress</p>
                <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto">
                  <BookOpen className="w-8 h-8 text-amber-500" />
                </div>
              </div>
            </div>
          );
        case 'energy_tracker':
          return (
            <div key={widgetId} className="bg-surface border border-border rounded-xl p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-text">Energy Tracker</h3>
                  <p className="text-sm text-muted">Monitor your daily energy levels</p>
                </div>
              </div>
              <div className="text-center py-6">
                <p className="text-muted text-sm mb-3">Track your energy throughout the day</p>
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
            </div>
          );
        case 'boundary_tracker':
          return (
            <div key={widgetId} className="bg-surface border border-border rounded-xl p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-slate-500 to-gray-500 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-text">Boundary Tracker</h3>
                  <p className="text-sm text-muted">Track and maintain personal boundaries</p>
                </div>
              </div>
              <div className="text-center py-6">
                <p className="text-muted text-sm mb-3">Set and maintain healthy boundaries</p>
                <div className="w-16 h-16 bg-slate-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="w-8 h-8 text-slate-500" />
                </div>
              </div>
            </div>
          );
        case 'virtue_balance':
          return (
            <div key={widgetId} className="bg-surface border border-border rounded-xl p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-text">Virtue Balance</h3>
                  <p className="text-sm text-muted">Track your virtue development and balance</p>
                </div>
              </div>
              <div className="text-center py-6">
                <p className="text-muted text-sm mb-3">Monitor your virtue development</p>
                <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Leaf className="w-8 h-8 text-teal-500" />
                </div>
              </div>
            </div>
          );
        case 'fasting_tracker':
          return (
            <div key={widgetId} className="bg-surface border border-border rounded-xl p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Timer className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-text">Fasting Tracker</h3>
                  <p className="text-sm text-muted">Track your fasting windows and progress</p>
                </div>
              </div>
              <div className="text-center py-6">
                <p className="text-muted text-sm mb-3">Monitor your fasting schedule</p>
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Timer className="w-8 h-8 text-red-500" />
                </div>
              </div>
            </div>
          );
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
  const isAfternoon = currentHour >= 12 && currentHour < 18;
  const isEvening = currentHour >= 18;

  // Determine current time period
  const getCurrentTimePeriod = () => {
    if (isMorning) return 'morning';
    if (isAfternoon) return 'afternoon';
    return 'evening';
  };

  const currentTimePeriod = getCurrentTimePeriod();

  // Load submitted intentions for today
  useEffect(() => {
    if (!user) return;

    const loadIntentions = async () => {
      try {
        const response = await fetch(`/api/daily-intention?userId=${user.id}&date=${new Date().toISOString().split('T')[0]}`);
        if (response.ok) {
          const data = await response.json();
          const submitted = data.intentions.reduce((acc: {[key: string]: boolean}, intention: any) => {
            acc[intention.timePeriod] = intention.submitted;
            return acc;
          }, {});
          setSubmittedIntentions(submitted);
        }
      } catch (error) {
        console.error('Error loading intentions:', error);
      }
    };

    loadIntentions();
  }, [user]);

  // Load dismissed mood modal state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dismissedMoodModal');
      if (saved) {
        try {
          const dismissed = JSON.parse(saved);
          // Check if we need to reset dismiss state for new time period
          const currentDate = new Date().toDateString();
          const lastDismissDate = dismissed.lastDate;
          
          if (lastDismissDate !== currentDate) {
            // New day, reset all dismiss states
            setDismissedMoodModal({});
            localStorage.setItem('dismissedMoodModal', JSON.stringify({ lastDate: currentDate, dismissed: {} }));
          } else {
            setDismissedMoodModal(dismissed.dismissed || {});
          }
        } catch (error) {
          console.error('Error parsing dismissed mood modal state:', error);
        }
      }
    }
  }, [currentTimePeriod]);

  const handleIntentionSubmit = async () => {
    if (!user || !mood || !intention.trim()) return;

    setIsSubmitting(true);
    try {
      // Submit intention to API
      const response = await fetch('/api/daily-intention', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          timePeriod: currentTimePeriod,
          mood,
          intention: intention.trim()
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Intention submitted successfully:', data);
        
        // Log mood to journal
        const moodLogData = {
          type: 'mood',
          content: `Mood check: ${mood}/5 during ${currentTimePeriod}`,
          category: 'wellness',
          metadata: {
            mood: mood,
            timePeriod: currentTimePeriod,
            timestamp: new Date().toISOString(),
          },
          moduleId: 'mood_tracker',
          widgetId: 'mood_widget',
        };
        await logToJournal(moodLogData);
        
        // Log intention to journal
        const intentionLogData = {
          type: 'daily_intention',
          content: `Set ${currentTimePeriod} intention: ${intention.trim()}`,
          category: 'goal_setting',
          metadata: {
            timePeriod: currentTimePeriod,
            mood: mood,
            timestamp: new Date().toISOString(),
          },
          moduleId: 'daily_intention',
          widgetId: 'intention_setter',
        };
        await logToJournal(intentionLogData);
        
        // Update submitted intentions state
        setSubmittedIntentions(prev => ({
          ...prev,
          [currentTimePeriod]: true
        }));
        
        // Reset form
        setMood(null);
        setIntention('');
      } else {
        console.error('Failed to submit intention');
      }
    } catch (error) {
      console.error('Error submitting intention:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDismissMoodModal = () => {
    const newDismissedState = {
      ...dismissedMoodModal,
      [currentTimePeriod]: true
    };
    setDismissedMoodModal(newDismissedState);
    
    // Save to localStorage with date tracking
    const currentDate = new Date().toDateString();
    localStorage.setItem('dismissedMoodModal', JSON.stringify({
      lastDate: currentDate,
      dismissed: newDismissedState
    }));
  };

  const getTimePeriodTitle = () => {
    switch (currentTimePeriod) {
      case 'morning': return 'Morning Intention';
      case 'afternoon': return 'Afternoon Intention';
      case 'evening': return 'Evening Intention';
      default: return 'Daily Intention';
    }
  };

  const getTimePeriodGreeting = () => {
    switch (currentTimePeriod) {
      case 'morning': return 'Set your intention for the day ahead';
      case 'afternoon': return 'Reflect on your morning and set afternoon goals';
      case 'evening': return 'Review your day and set evening intentions';
      default: return 'Set your intention';
    }
  };

  return (
    <div className="min-h-screen bg-bg pb-20">
      <Header focusVirtue={focusVirtue} />
      
      <main className="px-4 py-6 space-y-6">
        {/* Enhanced Hero Section */}
        <div className="bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-4 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-courage rounded-full blur-2xl"></div>
          </div>
          
          <div className="relative z-10">
            {/* Header Row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl flex items-center justify-center shadow-lg p-2">
                    <AcademyLogo className="w-full h-full text-primary" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-courage/20 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-courage rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-text mb-1">
                    {isMorning ? 'Good morning' : isEvening ? 'Good evening' : 'Good afternoon'}
                    {userPreferences?.displayName && `, ${userPreferences.displayName.split(' ')[0]}`}
                  </h1>
                  <p className="text-sm text-muted font-medium">Ready to flourish today?</p>
                </div>
              </div>
              
              {/* Tools Link */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={async () => {
                    // Log tools navigation to journal
                    const toolsLogData = {
                      type: 'navigation',
                      content: 'Navigated to tools section',
                      category: 'navigation',
                      metadata: {
                        destination: 'tools',
                        timestamp: new Date().toISOString(),
                      },
                      moduleId: 'navigation',
                      widgetId: 'tools_button',
                    };
                    await logToJournal(toolsLogData);
                    window.location.href = '/tools';
                  }}
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors underline decoration-primary/30 hover:decoration-primary/60"
                >
                  tools
                </button>
              </div>
            </div>
            
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <button 
                onClick={() => setShowTasksModal(true)}
                className="relative bg-surface/60 backdrop-blur-sm border border-border/50 rounded-lg p-3 text-center hover:bg-surface/80 transition-colors cursor-pointer"
              >
                {/* Task Count Blip */}
                {pendingTaskCount > 0 && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse shadow-lg">
                    {pendingTaskCount > 9 ? '9+' : pendingTaskCount}
                  </div>
                )}
                
                <div className="text-xl font-bold text-primary mb-1">
                  {Math.max(1, pendingTaskCount)}
                </div>
                <div className="text-xs text-muted">Tasks</div>
              </button>
              <div className="bg-surface/60 backdrop-blur-sm border border-border/50 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-courage mb-1">
                  0
                </div>
                <div className="text-xs text-muted">Habits Today</div>
              </div>
              <div className="bg-surface/60 backdrop-blur-sm border border-border/50 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-justice mb-1">
                  {userWidgets.length}
                </div>
                <div className="text-xs text-muted">Active Tools</div>
              </div>
            </div>
            
            {/* Focus & Progress */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={cn(
                  'px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-sm',
                  'bg-primary/20 text-primary border-primary/30'
                )}>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                    Focus: {focusVirtue.charAt(0).toUpperCase() + focusVirtue.slice(1)}
                  </div>
                </div>
                <div className="text-xs text-muted">
                  0% complete
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="flex-1 max-w-xs ml-4">
                <div className="w-full bg-surface/40 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-primary to-courage h-1.5 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Wisdom Widget - Prominently placed */}
        <div className="space-y-4">
          <DailyWisdomCard />
        </div>

        {/* Dynamic Daily Intention */}
        {!submittedIntentions[currentTimePeriod] && !dismissedMoodModal[currentTimePeriod] ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
              <button
                onClick={handleDismissMoodModal}
                className="text-xs text-muted hover:text-text transition-colors duration-200 px-2 py-1 rounded hover:bg-surface-2"
              >
                Dismiss
              </button>
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
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { value: 1, emoji: '😞', label: 'Struggling' },
                      { value: 2, emoji: '😐', label: 'Neutral' },
                      { value: 3, emoji: '😊', label: 'Good' },
                      { value: 4, emoji: '😄', label: 'Great' },
                      { value: 5, emoji: '🤩', label: 'Amazing' }
                    ].map(({ value, emoji, label }) => (
                      <button
                        key={value}
                        onClick={async () => {
                          setMood(value);
                          // Log mood selection to journal
                          const moodLogData = {
                            type: 'mood_selection',
                            content: `Selected mood: ${label} (${value}/5)`,
                            category: 'wellness',
                            metadata: {
                              mood: value,
                              moodLabel: label,
                              timePeriod: currentTimePeriod,
                              timestamp: new Date().toISOString(),
                            },
                            moduleId: 'mood_tracker',
                            widgetId: 'mood_selector',
                          };
                          await logToJournal(moodLogData);
                        }}
                        className={cn(
                          'p-2 rounded-xl border transition-all duration-200 hover:scale-105 min-h-[4rem] flex flex-col items-center justify-center',
                          mood === value
                            ? 'bg-courage/20 border-courage/30 text-courage shadow-lg'
                            : 'bg-surface-2 border-border text-muted hover:text-text hover:border-courage/30 hover:bg-courage/5'
                        )}
                      >
                        <div className="text-lg mb-1">{emoji}</div>
                        <div className="text-[10px] font-medium leading-tight text-center break-words max-w-full">
                          {label}
                        </div>
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
                    <h3 className="font-semibold text-text">{getTimePeriodGreeting()}</h3>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={intention}
                      onChange={(e) => setIntention(e.target.value)}
                      placeholder={currentTimePeriod === 'morning' ? "What will you focus on today?" : 
                                   currentTimePeriod === 'afternoon' ? "What's your afternoon priority?" : 
                                   "What's your evening intention?"}
                      className="w-full px-4 py-3 bg-surface-2 border border-border rounded-xl text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                    />

                    {/* Submit Button */}
                    <button
                      onClick={handleIntentionSubmit}
                      disabled={!mood || !intention.trim() || isSubmitting}
                      className="w-full px-4 py-3 bg-gradient-to-r from-primary to-courage text-white font-semibold rounded-xl hover:from-primary/90 hover:to-courage/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Submitting...' : `Submit ${currentTimePeriod.charAt(0).toUpperCase() + currentTimePeriod.slice(1)} Intention`}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-green-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-text text-sm">Intention Set</h3>
                  <p className="text-xs text-muted">Your {currentTimePeriod} intention has been recorded</p>
                </div>
                <div className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                  ✓ Complete
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Widgets Section */}
        {userWidgets.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-end">
              <button
                onClick={async () => {
                  // Log widget management navigation to journal
                  const widgetLogData = {
                    type: 'navigation',
                    content: 'Navigated to widget management',
                    category: 'navigation',
                    metadata: {
                      destination: 'tools',
                      purpose: 'widget_management',
                      timestamp: new Date().toISOString(),
                    },
                    moduleId: 'navigation',
                    widgetId: 'widget_management_button',
                  };
                  await logToJournal(widgetLogData);
                  window.location.href = '/tools';
                }}
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

        {/* Widget Placeholder */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text">Add More Tools</h2>
          </div>
          <div className="relative">
            {/* Cut-out effect with dashed border */}
            <div className="bg-gradient-to-br from-surface/50 to-surface/30 border-2 border-dashed border-border/50 rounded-2xl p-8 text-center group hover:border-primary/50 hover:bg-surface/70 transition-all duration-300">
              {/* Plus icon */}
              <div className="w-16 h-16 bg-primary/20 border-2 border-dashed border-primary/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:border-primary/50 group-hover:bg-primary/30 transition-all duration-300">
                <Plus className="w-8 h-8 text-primary group-hover:text-primary/80" />
              </div>
              
              <h3 className="text-lg font-semibold text-text mb-2">Add a New Tool</h3>
              <p className="text-sm text-muted mb-4 max-w-md mx-auto">
                Discover and add wellness tools to personalize your daily routine
              </p>
              
              <button
                onClick={async () => {
                  // Log widget addition navigation to journal
                  const widgetAddLogData = {
                    type: 'navigation',
                    content: 'Navigated to add new widget',
                    category: 'navigation',
                    metadata: {
                      destination: 'tools',
                      purpose: 'add_widget',
                      timestamp: new Date().toISOString(),
                    },
                    moduleId: 'navigation',
                    widgetId: 'add_widget_button',
                  };
                  await logToJournal(widgetAddLogData);
                  window.location.href = '/tools';
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                Browse Tools
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Tasks Modal */}
      {showTasksModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text">Your Tasks</h3>
              <button
                onClick={() => setShowTasksModal(false)}
                className="p-2 text-muted hover:text-text hover:bg-surface-2 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              {/* Onboarding Task - Always show first for new users */}
              <div className="flex items-center gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-primary">Complete Onboarding</h4>
                  <p className="text-xs text-primary/70 mt-1">
                    Set up your profile, choose your framework, and get started with Aristotle
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                      onboarding
                    </span>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                      H
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowTasksModal(false);
                    window.location.href = '/onboarding';
                  }}
                  className="px-3 py-1 bg-primary text-white text-xs rounded hover:bg-primary/90 transition-colors"
                >
                  Start
                </button>
              </div>
              
              {/* Other tasks would be loaded here */}
              <p className="text-sm text-muted text-center py-4">
                Complete your onboarding to unlock more features and tasks!
              </p>
            </div>
          </div>
        </div>
      )}

      <GuideFAB />
      <TabBar />
    </div>
  );
} 