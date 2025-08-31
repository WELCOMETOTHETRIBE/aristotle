'use client';

import { useState, useEffect } from 'react';
import { Target, Plus, TrendingUp, Info, Settings, Sparkles, Brain, Calendar, CheckCircle, Clock, Award, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoalTrackerCardProps {
  className?: string;
}

interface Goal {
  id: string;
  title: string;
  description?: string;
  category: string;
  target: number;
  current: number;
  unit: string;
  deadline?: Date;
  status: 'active' | 'completed' | 'paused';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  color: string;
  milestones: Milestone[];
}

interface Milestone {
  id: string;
  title: string;
  target: number;
  completed: boolean;
  completedAt?: Date;
}

interface GoalProgress {
  id: string;
  goalId: string;
  value: number;
  notes?: string;
  timestamp: Date;
}

interface GoalSettings {
  enableAIInsights: boolean;
  showProgress: boolean;
  showMilestones: boolean;
  enableReminders: boolean;
  reminderTime: string;
  defaultPriority: 'low' | 'medium' | 'high';
  defaultUnit: string;
}

const goalCategories = [
  'Health', 'Career', 'Learning', 'Relationships', 'Finance', 'Personal', 'Creative', 'Other'
];

const goalColors = [
  'from-purple-500 to-violet-500',
  'from-blue-500 to-cyan-500',
  'from-green-500 to-emerald-500',
  'from-orange-500 to-red-500',
  'from-pink-500 to-rose-500',
  'from-indigo-500 to-blue-500',
  'from-yellow-500 to-orange-500',
  'from-teal-500 to-green-500'
];

const priorityColors = {
  low: 'text-green-500',
  medium: 'text-yellow-500',
  high: 'text-red-500'
};

export function GoalTrackerCard({ className }: GoalTrackerCardProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [progress, setProgress] = useState<GoalProgress[]>([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'Personal',
    target: 100,
    unit: 'units',
    deadline: '',
    priority: 'medium' as const,
    color: goalColors[0]
  });
  const [newProgress, setNewProgress] = useState({
    value: 0,
    notes: ''
  });
  const [settings, setSettings] = useState<GoalSettings>({
    enableAIInsights: true,
    showProgress: true,
    showMilestones: true,
    enableReminders: true,
    reminderTime: '09:00',
    defaultPriority: 'medium',
    defaultUnit: 'units',
  });

  // Load saved data
  useEffect(() => {
    const savedGoals = localStorage.getItem('goalTrackerGoals');
    const savedProgress = localStorage.getItem('goalTrackerProgress');
    const savedSettings = localStorage.getItem('goalTrackerSettings');
    
    if (savedGoals) {
      const parsed = JSON.parse(savedGoals);
      setGoals(parsed.map((goal: any) => ({
        ...goal,
        createdAt: new Date(goal.createdAt),
        deadline: goal.deadline ? new Date(goal.deadline) : undefined,
        milestones: goal.milestones?.map((milestone: any) => ({
          ...milestone,
          completedAt: milestone.completedAt ? new Date(milestone.completedAt) : undefined
        })) || []
      })));
    }
    
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      setProgress(parsed.map((prog: any) => ({
        ...prog,
        timestamp: new Date(prog.timestamp)
      })));
    }
    
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save data
  const saveGoals = (newGoals: Goal[]) => {
    setGoals(newGoals);
    localStorage.setItem('goalTrackerGoals', JSON.stringify(newGoals));
  };

  const saveProgress = (newProgress: GoalProgress[]) => {
    setProgress(newProgress);
    localStorage.setItem('goalTrackerProgress', JSON.stringify(newProgress));
  };

  const saveSettings = (newSettings: GoalSettings) => {
    setSettings(newSettings);
    localStorage.setItem('goalTrackerSettings', JSON.stringify(newSettings));
  };

  const addGoal = () => {
    if (!newGoal.title.trim()) return;

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title.trim(),
      description: newGoal.description.trim() || undefined,
      category: newGoal.category,
      target: newGoal.target,
      current: 0,
      unit: newGoal.unit,
      deadline: newGoal.deadline ? new Date(newGoal.deadline) : undefined,
      status: 'active',
      priority: newGoal.priority,
      createdAt: new Date(),
      color: newGoal.color,
      milestones: []
    };

    const updatedGoals = [goal, ...goals];
    saveGoals(updatedGoals);
    
    setNewGoal({
      title: '',
      description: '',
      category: 'Personal',
      target: 100,
      unit: 'units',
      deadline: '',
      priority: 'medium',
      color: goalColors[0]
    });
    setShowAddGoal(false);
  };

  const updateProgress = (goalId: string) => {
    if (newProgress.value <= 0) return;

    const progressEntry: GoalProgress = {
      id: Date.now().toString(),
      goalId,
      value: newProgress.value,
      notes: newProgress.notes.trim() || undefined,
      timestamp: new Date(),
    };

    const updatedProgress = [progressEntry, ...progress];
    saveProgress(updatedProgress);

    // Update goal current value
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const newCurrent = goal.current + newProgress.value;
        const newStatus = newCurrent >= goal.target ? 'completed' : goal.status;
        
        return {
          ...goal,
          current: newCurrent,
          status: newStatus,
        };
      }
      return goal;
    });

    saveGoals(updatedGoals);
    setNewProgress({ value: 0, notes: '' });
    setSelectedGoal(null);
  };

  const generateAIInsights = async () => {
    if (!settings.enableAIInsights || goals.length < 2) return;

    try {
      const response = await fetch('/api/ai/guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Analyze my goal tracking data and provide 3 actionable insights for achieving my goals more effectively. My goals: ${JSON.stringify(goals)}. My progress: ${JSON.stringify(progress.slice(0, 20))}.`,
          context: {
            page: 'goal_tracker',
            focusVirtue: 'courage',
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
          
          // Parse insights from AI response
          const insights = content.split('\n').filter(line => line.trim().startsWith('•') || line.trim().startsWith('-')).slice(0, 3);
          setAiInsights(insights.length > 0 ? insights : [
            'Break large goals into smaller, achievable milestones',
            'Track progress regularly to maintain momentum',
            'Celebrate small wins to stay motivated'
          ]);
        }
      }
    } catch (error) {
      console.error('Failed to generate AI insights:', error);
      setAiInsights([
        'Break large goals into smaller, achievable milestones',
        'Track progress regularly to maintain momentum',
        'Celebrate small wins to stay motivated'
      ]);
    }
  };

  const getProgressPercentage = (goal: Goal) => {
    return Math.min((goal.current / goal.target) * 100, 100);
  };

  const getDaysUntilDeadline = (goal: Goal) => {
    if (!goal.deadline) return null;
    const now = new Date();
    const diff = goal.deadline.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getWeeklyStats = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weekProgress = progress.filter(prog => prog.timestamp > weekAgo);
    const totalProgress = weekProgress.reduce((sum, prog) => sum + prog.value, 0);
    const activeGoals = goals.filter(goal => goal.status === 'active').length;
    const completedGoals = goals.filter(goal => goal.status === 'completed').length;
    
    return { totalProgress, activeGoals, completedGoals };
  };

  const getGoalStatus = (goal: Goal) => {
    if (goal.status === 'completed') return { status: 'Completed', color: 'text-success' };
    if (goal.status === 'paused') return { status: 'Paused', color: 'text-muted' };
    
    const daysLeft = getDaysUntilDeadline(goal);
    if (daysLeft !== null) {
      if (daysLeft < 0) return { status: 'Overdue', color: 'text-error' };
      if (daysLeft <= 7) return { status: 'Due soon', color: 'text-warning' };
    }
    
    return { status: 'On track', color: 'text-primary' };
  };

  const weeklyStats = getWeeklyStats();

  return (
    <div className={cn('bg-surface border border-border rounded-lg p-4', className)}>
      {/* Header with Info and Settings */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-full flex items-center justify-center">
            <Target className="w-4 h-4 text-purple-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text">Goal Tracker</h3>
            <p className="text-xs text-muted">Achieve your dreams</p>
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
            How to use Goal Tracker
          </h4>
          <div className="text-xs text-muted space-y-2">
            <p>• Set specific, measurable goals with deadlines</p>
            <p>• Track progress regularly to stay motivated</p>
            <p>• Break large goals into smaller milestones</p>
            <p>• Use AI insights to optimize your approach</p>
            <p>• Celebrate achievements and learn from setbacks</p>
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
              <span className="text-xs text-muted">Show progress</span>
              <button
                onClick={() => saveSettings({ ...settings, showProgress: !settings.showProgress })}
                className={cn(
                  'p-1.5 rounded-lg transition-colors',
                  settings.showProgress 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-surface text-muted'
                )}
              >
                <BarChart3 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">Show milestones</span>
              <button
                onClick={() => saveSettings({ ...settings, showMilestones: !settings.showMilestones })}
                className={cn(
                  'p-1.5 rounded-lg transition-colors',
                  settings.showMilestones 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-surface text-muted'
                )}
              >
                <Award className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mb-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-surface-2 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-3 h-3 text-muted" />
              <span className="text-xs text-muted">Active</span>
            </div>
            <div className="text-lg font-bold text-text">
              {weeklyStats.activeGoals}
            </div>
          </div>
          <div className="bg-surface-2 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-3 h-3 text-muted" />
              <span className="text-xs text-muted">Completed</span>
            </div>
            <div className="text-lg font-bold text-text">
              {weeklyStats.completedGoals}
            </div>
          </div>
          <div className="bg-surface-2 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-3 h-3 text-muted" />
              <span className="text-xs text-muted">This week</span>
            </div>
            <div className="text-lg font-bold text-text">
              {weeklyStats.totalProgress}
            </div>
          </div>
        </div>
      </div>

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

      {/* Goals List */}
      <div className="mb-4 space-y-3">
        {goals.map(goal => {
          const progressPercentage = getProgressPercentage(goal);
          const goalStatus = getGoalStatus(goal);
          const daysLeft = getDaysUntilDeadline(goal);
          
          return (
            <div key={goal.id} className="bg-surface-2 border border-border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 bg-gradient-to-r ${goal.color} rounded-lg flex items-center justify-center`}>
                    <Target className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-text">{goal.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <span>{goal.category}</span>
                      <span>•</span>
                      <span className={priorityColors[goal.priority]}>{goal.priority}</span>
                      {daysLeft !== null && (
                        <>
                          <span>•</span>
                          <span>{daysLeft} days left</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-medium text-text">
                    {goal.current}/{goal.target} {goal.unit}
                  </div>
                  <div className={cn('text-xs', goalStatus.color)}>
                    {goalStatus.status}
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              {settings.showProgress && (
                <div className="mb-2">
                  <div className="w-full bg-surface rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${progressPercentage}%`,
                        background: `linear-gradient(135deg, ${goal.color.split(' ')[0].replace('from-', '')} 0%, ${goal.color.split(' ')[2].replace('to-', '')} 100%)`
                      }}
                    />
                  </div>
                  <div className="text-xs text-muted mt-1">
                    {Math.round(progressPercentage)}% complete
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                {goal.status === 'active' && (
                  <button
                    onClick={() => setSelectedGoal(goal)}
                    className="flex-1 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-lg hover:from-purple-600 hover:to-violet-600 transition-all duration-150 text-xs font-medium"
                  >
                    Update Progress
                  </button>
                )}
                <button
                  onClick={() => {
                    const updatedGoals = goals.map(g => 
                      g.id === goal.id 
                        ? { ...g, status: g.status === 'active' ? 'paused' : 'active' }
                        : g
                    );
                    saveGoals(updatedGoals);
                  }}
                  className="px-3 py-1.5 bg-surface border border-border text-text rounded-lg hover:bg-surface-2 transition-colors duration-150 text-xs"
                >
                  {goal.status === 'active' ? 'Pause' : 'Resume'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Update Modal */}
      {selectedGoal && (
        <div className="mb-4 p-3 bg-surface-2 border border-border rounded-lg">
          <h4 className="text-sm font-semibold text-text mb-3">Update Progress</h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted mb-2 block">Progress ({selectedGoal.unit})</label>
              <input
                type="number"
                value={newProgress.value}
                onChange={(e) => setNewProgress(prev => ({ ...prev, value: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
                min="1"
              />
            </div>
            <div>
              <label className="text-xs text-muted mb-2 block">Notes (optional)</label>
              <input
                type="text"
                value={newProgress.notes}
                onChange={(e) => setNewProgress(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="What did you accomplish?"
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedGoal(null);
                  setNewProgress({ value: 0, notes: '' });
                }}
                className="flex-1 px-3 py-2 bg-surface border border-border text-text rounded-lg hover:bg-surface-2 transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                onClick={() => updateProgress(selectedGoal.id)}
                disabled={newProgress.value <= 0}
                className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-lg hover:from-purple-600 hover:to-violet-600 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Goal Button */}
      {!showAddGoal ? (
        <button
          onClick={() => setShowAddGoal(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-lg hover:from-purple-600 hover:to-violet-600 transition-all duration-150"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Add Goal</span>
        </button>
      ) : (
        <div className="space-y-3">
          {/* Goal Title */}
          <div>
            <label className="text-xs text-muted mb-2 block">Goal name</label>
            <input
              type="text"
              value={newGoal.title}
              onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Run a marathon"
              className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-sm text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-muted mb-2 block">Description (optional)</label>
            <input
              type="text"
              value={newGoal.description}
              onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of your goal"
              className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-sm text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
            />
          </div>

          {/* Category and Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted mb-2 block">Category</label>
              <select
                value={newGoal.category}
                onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
              >
                {goalCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted mb-2 block">Priority</label>
              <select
                value={newGoal.priority}
                onChange={(e) => setNewGoal(prev => ({ ...prev, priority: e.target.value as any }))}
                className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Target and Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted mb-2 block">Target</label>
              <input
                type="number"
                value={newGoal.target}
                onChange={(e) => setNewGoal(prev => ({ ...prev, target: parseInt(e.target.value) || 100 }))}
                className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
                min="1"
              />
            </div>
            <div>
              <label className="text-xs text-muted mb-2 block">Unit</label>
              <input
                type="text"
                value={newGoal.unit}
                onChange={(e) => setNewGoal(prev => ({ ...prev, unit: e.target.value }))}
                placeholder="e.g., miles, books, hours"
                className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-sm text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="text-xs text-muted mb-2 block">Deadline (optional)</label>
            <input
              type="date"
              value={newGoal.deadline}
              onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
              className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
            />
          </div>

          {/* Color */}
          <div>
            <label className="text-xs text-muted mb-2 block">Color</label>
            <div className="grid grid-cols-4 gap-2">
              {goalColors.map((color, index) => (
                <button
                  key={color}
                  onClick={() => setNewGoal(prev => ({ ...prev, color }))}
                  className={cn(
                    'w-8 h-8 rounded-lg border-2 transition-all',
                    newGoal.color === color
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
                setShowAddGoal(false);
                setNewGoal({
                  title: '',
                  description: '',
                  category: 'Personal',
                  target: 100,
                  unit: 'units',
                  deadline: '',
                  priority: 'medium',
                  color: goalColors[0]
                });
              }}
              className="flex-1 px-3 py-2 bg-surface-2 border border-border text-text rounded-lg hover:bg-surface transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              onClick={addGoal}
              disabled={!newGoal.title.trim()}
              className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-lg hover:from-purple-600 hover:to-violet-600 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Goal
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 