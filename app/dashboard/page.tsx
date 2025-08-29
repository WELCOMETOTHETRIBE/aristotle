'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, CheckCircle, Clock, TrendingUp, Heart, Brain, Calendar, Droplets, Smile, Zap, Trophy } from 'lucide-react';
import BreathTimerCircle from '@/components/BreathTimerCircle';
import { getVirtueEmoji, getVirtueColor, getVirtueGradient } from '@/lib/virtue';

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
  const [hedonicScore, setHedonicScore] = useState(50);

  useEffect(() => {
    fetchDashboardData();
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

  const dueTasks = tasks.filter(task => !task.completedAt && task.dueAt);
  const completedTasks = tasks.filter(task => task.completedAt);
  const activeGoals = goals.filter(goal => goal.status === 'active');
  const checkedHabits = habits.filter(habit => habit.checkedToday);

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
            <h1 className="text-4xl font-bold mb-2">Your Dashboard</h1>
            <p className="text-muted-foreground">
              Track your progress toward flourishing and intentional living
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Virtue Progress */}
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Virtue Progress
                  </CardTitle>
                  <CardDescription>
                    7-day average scores for your core virtues
                  </CardDescription>
                </CardHeader>
                <CardContent>
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
                  </CardTitle>
                  <CardDescription>
                    {dueTasks.length} tasks due today
                  </CardDescription>
                </CardHeader>
                <CardContent>
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
                  </CardTitle>
                  <CardDescription>
                    Keep building momentum with your daily habits
                  </CardDescription>
                </CardHeader>
                <CardContent>
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
                  </CardTitle>
                  <CardDescription>
                    Your current objectives and aspirations
                  </CardDescription>
                </CardHeader>
                <CardContent>
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
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Breathwork Timer */}
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Breathwork Practice
                  </CardTitle>
                  <CardDescription>
                    Start your breathing practice
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BreathTimerCircle 
                    patternId="stoic"
                    ratio="4:4:4:4"
                    useVoice={true}
                    volume={0.7}
                    onSessionComplete={(session) => {
                      console.log('Breathwork session completed:', session);
                    }}
                  />
                </CardContent>
              </Card>

              {/* Hydration Tracker */}
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-primary" />
                    Hydration
                  </CardTitle>
                  <CardDescription>
                    Track your daily water intake
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">
                      {hydrationData.current}ml
                    </div>
                    <div className="text-sm text-muted-foreground mb-4">
                      of {hydrationData.target}ml target
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                      <div 
                        className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, hydrationData.percentage)}%` }}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[250, 500, 1000].map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          size="sm"
                          onClick={() => handleHydrationAdd(amount)}
                        >
                          +{amount}ml
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mood Tracker */}
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smile className="h-5 w-5 text-primary" />
                    Today's Mood
                  </CardTitle>
                  <CardDescription>
                    How are you feeling today?
                  </CardDescription>
                </CardHeader>
                <CardContent>
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
                  </CardTitle>
                  <CardDescription>
                    Monitor your patterns and triggers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getHedonicColor(hedonicScore)}`}>
                      <div className={`w-2 h-2 rounded-full ${hedonicScore <= 30 ? 'bg-green-600' : hedonicScore <= 70 ? 'bg-yellow-600' : 'bg-red-600'}`} />
                      {getHedonicLabel(hedonicScore)}
                    </div>
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            hedonicScore <= 30 ? 'bg-green-500' : 
                            hedonicScore <= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${hedonicScore}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Score: {hedonicScore}/100
                      </p>
                    </div>
                  </div>
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