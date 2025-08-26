'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, CheckCircle, Clock, TrendingUp, Heart, Brain, Calendar } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  tag?: string;
  priority: string;
  dueAt?: string;
  completedAt?: string;
}

interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: string;
  streakCount: number;
  lastCheckInAt?: string;
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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [hedonicScore, setHedonicScore] = useState(50);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [tasksRes, habitsRes, goalsRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/habits'),
        fetch('/api/goals'),
      ]);

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setTasks(tasksData);
      }

      if (habitsRes.ok) {
        const habitsData = await habitsRes.json();
        setHabits(habitsData);
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

  const handleHabitCheckin = async (habitId: string) => {
    try {
      const response = await fetch('/api/skills/invoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skill: 'habit.checkin',
          args: { habitId },
        }),
      });

      if (response.ok) {
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error('Error checking in habit:', error);
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

  const dueTasks = tasks.filter(task => !task.completedAt && task.dueAt);
  const completedTasks = tasks.filter(task => task.completedAt);
  const activeGoals = goals.filter(goal => goal.status === 'active');

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
                            variant="outline"
                            size="sm"
                            onClick={() => handleHabitCheckin(habit.id)}
                          >
                            Check In
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