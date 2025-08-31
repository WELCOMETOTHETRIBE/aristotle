'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Trophy, Target, TrendingUp, Brain, Calendar, Droplets, 
  Smile, Zap, ArrowRight, Sparkles, Heart, Scale, Leaf
} from 'lucide-react';
import { BreathworkWidgetNew } from '@/components/BreathworkWidgetNew';
import { MoodTrackerWidget } from '@/components/MoodTrackerWidget';
import VirtueRadar from '@/components/VirtueRadar';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface Goal {
  id: string;
  title: string;
  progress: number;
}

interface Habit {
  id: string;
  title: string;
  streakCount: number;
  checkedToday: boolean;
}

export default function HomePage() {
  const [shouldShowPrompt, setShouldShowPrompt] = useState(false);
  const [loading, setLoading] = useState(true);

  const completedTasks: Task[] = [
    { id: '1', title: 'Morning meditation', completed: true },
    { id: '2', title: 'Read philosophy', completed: true },
    { id: '3', title: 'Exercise', completed: true }
  ];

  const activeGoals: Goal[] = [
    { id: '1', title: 'Master Stoicism', progress: 65 },
    { id: '2', title: 'Build daily habits', progress: 80 },
    { id: '3', title: 'Improve focus', progress: 45 }
  ];

  const habits: Habit[] = [
    { id: '1', title: 'Meditation', streakCount: 7, checkedToday: true },
    { id: '2', title: 'Reading', streakCount: 5, checkedToday: true },
    { id: '3', title: 'Exercise', streakCount: 3, checkedToday: false }
  ];

  const checkedHabits = habits.filter(habit => habit.checkedToday);

  const virtueScores = {
    wisdom: 8,
    courage: 7,
    justice: 6,
    temperance: 9
  };

  const totalVirtueScore = Object.values(virtueScores).reduce((sum, score) => sum + score, 0);
  const averageVirtueScore = Math.round(totalVirtueScore / 4);

  useEffect(() => {
    // Check if user should see onboarding prompt
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    setShouldShowPrompt(!hasSeenOnboarding);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white font-medium">Loading your journey...</p>
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
                    <div className="pt-4">
                      <VirtueRadar data={[
                        { virtue: 'Wisdom', score: virtueScores.wisdom },
                        { virtue: 'Courage', score: virtueScores.courage },
                        { virtue: 'Justice', score: virtueScores.justice },
                        { virtue: 'Temperance', score: virtueScores.temperance }
                      ]} />
                    </div>
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
}
