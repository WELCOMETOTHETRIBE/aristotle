'use client';

import { useState, useEffect } from 'react';
import { Droplets, Plus, Target, TrendingUp, Info, Settings, Sparkles, Brain, Bell, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HydrationTrackerCardProps {
  className?: string;
}

interface HydrationEntry {
  id: string;
  amount: number;
  timestamp: Date;
  type?: 'water' | 'tea' | 'coffee' | 'juice' | 'other';
  note?: string;
}

interface HydrationSettings {
  dailyTarget: number;
  enableAIRecommendations: boolean;
  enableReminders: boolean;
  reminderInterval: number;
  trackBeverageTypes: boolean;
  weight: number;
  activityLevel: 'low' | 'moderate' | 'high';
  climate: 'cool' | 'moderate' | 'hot';
}

const beverageTypes = [
  { id: 'water', name: 'Water', icon: '💧', color: 'from-cyan-500 to-blue-500' },
  { id: 'tea', name: 'Tea', icon: '🫖', color: 'from-green-500 to-emerald-500' },
  { id: 'coffee', name: 'Coffee', icon: '☕', color: 'from-amber-500 to-orange-500' },
  { id: 'juice', name: 'Juice', icon: '🧃', color: 'from-pink-500 to-rose-500' },
  { id: 'other', name: 'Other', icon: '🥤', color: 'from-purple-500 to-violet-500' },
];

const waterAmounts = [250, 500, 750, 1000]; // ml

export function HydrationTrackerCard({ className }: HydrationTrackerCardProps) {
  const [hydrationEntries, setHydrationEntries] = useState<HydrationEntry[]>([]);
  const [showAddWater, setShowAddWater] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [selectedType, setSelectedType] = useState<'water' | 'tea' | 'coffee' | 'juice' | 'other'>('water');
  const [note, setNote] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);
  const [settings, setSettings] = useState<HydrationSettings>({
    dailyTarget: 2000,
    enableAIRecommendations: true,
    enableReminders: true,
    reminderInterval: 60,
    trackBeverageTypes: true,
    weight: 70,
    activityLevel: 'moderate',
    climate: 'moderate',
  });

  // Load saved data
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedEntries = localStorage.getItem('hydrationTrackerEntries');
    const savedSettings = localStorage.getItem('hydrationTrackerSettings');
    
    if (savedEntries) {
      const parsed = JSON.parse(savedEntries);
      setHydrationEntries(parsed.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      })));
    }
    
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save data
  const saveHydrationData = (entries: HydrationEntry[]) => {
    setHydrationEntries(entries);
    localStorage.setItem('hydrationTrackerEntries', JSON.stringify(entries));
  };

  const saveSettings = (newSettings: HydrationSettings) => {
    setSettings(newSettings);
    localStorage.setItem('hydrationTrackerSettings', JSON.stringify(newSettings));
  };

  const calculateRecommendedIntake = () => {
    // Basic calculation: 30ml per kg of body weight
    let base = settings.weight * 30;
    
    // Adjust for activity level
    switch (settings.activityLevel) {
      case 'low': base *= 1.0; break;
      case 'moderate': base *= 1.2; break;
      case 'high': base *= 1.5; break;
    }
    
    // Adjust for climate
    switch (settings.climate) {
      case 'cool': base *= 1.0; break;
      case 'moderate': base *= 1.1; break;
      case 'hot': base *= 1.3; break;
    }
    
    return Math.round(base);
  };

  const generateAIRecommendations = async () => {
    if (!settings.enableAIRecommendations || hydrationEntries.length < 3) return;

    try {
      const response = await fetch('/api/ai/guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Analyze my hydration data and provide 3 personalized recommendations. My hydration entries: ${JSON.stringify(hydrationEntries.slice(0, 7))}. My settings: weight ${settings.weight}kg, activity level ${settings.activityLevel}, climate ${settings.climate}.`,
          context: {
            page: 'hydration_tracker',
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
          
          // Clean markdown formatting and parse recommendations from AI response
          const cleanContent = content
            .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
            .replace(/\*(.*?)\*/g, '$1') // Remove italic formatting
            .replace(/`(.*?)`/g, '$1') // Remove code formatting
            .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
            .replace(/^#+\s*/gm, '') // Remove markdown headers
            .replace(/^\s*[-*+]\s*/gm, '') // Remove markdown list markers
            .replace(/^\s*\d+\.\s*/gm, ''); // Remove numbered list markers
          
          const recommendations = cleanContent.split('\n').filter(line => line.trim().startsWith('•') || line.trim().startsWith('-')).slice(0, 3);
          setAiRecommendations(recommendations.length > 0 ? recommendations : [
            'Consider drinking water first thing in the morning to rehydrate',
            'Try setting reminders every 2 hours to maintain consistent hydration',
            'Monitor your urine color - pale yellow indicates good hydration'
          ]);
        }
      }
    } catch (error) {
      console.error('Failed to generate AI recommendations:', error);
      setAiRecommendations([
        'Consider drinking water first thing in the morning to rehydrate',
        'Try setting reminders every 2 hours to maintain consistent hydration',
        'Monitor your urine color - pale yellow indicates good hydration'
      ]);
    }
  };

  const addWaterEntry = () => {
    const newEntry: HydrationEntry = {
      id: Date.now().toString(),
      amount: selectedAmount,
      timestamp: new Date(),
      type: settings.trackBeverageTypes ? selectedType : 'water',
      note: note.trim() || undefined,
    };

    const updatedEntries = [newEntry, ...hydrationEntries];
    saveHydrationData(updatedEntries);
    
    setShowAddWater(false);
    setNote('');
    
    // Generate AI recommendations after adding entry
    if (settings.enableAIRecommendations) {
      setTimeout(generateAIRecommendations, 1000);
    }
  };

  const todayEntries = hydrationEntries.filter(entry => {
    const today = new Date();
    const entryDate = new Date(entry.timestamp);
    return entryDate.toDateString() === today.toDateString();
  });

  const todayTotal = todayEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const progress = Math.min((todayTotal / settings.dailyTarget) * 100, 100);
  const remaining = Math.max(settings.dailyTarget - todayTotal, 0);
  const recommendedIntake = calculateRecommendedIntake();

  const getHydrationStatus = () => {
    if (todayTotal >= settings.dailyTarget) return { status: 'Goal reached!', color: 'text-success' };
    if (todayTotal >= settings.dailyTarget * 0.75) return { status: 'Almost there!', color: 'text-warning' };
    if (todayTotal >= settings.dailyTarget * 0.5) return { status: 'Halfway there', color: 'text-primary' };
    return { status: 'Keep going!', color: 'text-muted' };
  };

  const getWeeklyAverage = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weekEntries = hydrationEntries.filter(entry => 
      new Date(entry.timestamp) > weekAgo
    );
    
    if (weekEntries.length === 0) return 0;
    
    const total = weekEntries.reduce((sum, entry) => sum + entry.amount, 0);
    return Math.round(total / 7);
  };

  const getBeverageBreakdown = () => {
    const todayTypes = todayEntries.filter(entry => entry.type);
    const breakdown: { [key: string]: number } = {};
    
    todayTypes.forEach(entry => {
      if (entry.type) {
        breakdown[entry.type] = (breakdown[entry.type] || 0) + entry.amount;
      }
    });
    
    return breakdown;
  };

  return (
    <div className={cn('bg-surface border border-border rounded-lg p-4', className)}>
      {/* Header with Info and Settings */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
            <Droplets className="w-4 h-4 text-cyan-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text">Hydration</h3>
            <p className="text-xs text-muted">Track your water intake</p>
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
            How to use Hydration Tracker
          </h4>
          <div className="text-xs text-muted space-y-2">
            <p>• Track all your fluid intake throughout the day</p>
            <p>• Set personalized daily targets based on your needs</p>
            <p>• Use AI recommendations to optimize your hydration</p>
            <p>• Monitor different beverage types for better insights</p>
            <p>• Set reminders to maintain consistent hydration</p>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="mb-4 p-3 bg-surface-2 border border-border rounded-lg">
          <h4 className="text-sm font-semibold text-text mb-3">Settings</h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted mb-1 block">Daily target (ml)</label>
              <input
                type="number"
                value={settings.dailyTarget}
                onChange={(e) => saveSettings({ ...settings, dailyTarget: parseInt(e.target.value) || 2000 })}
                className="w-full px-2 py-1 bg-surface border border-border rounded text-xs text-text"
                min="500"
                max="5000"
                step="100"
              />
            </div>
            <div>
              <label className="text-xs text-muted mb-1 block">Weight (kg)</label>
              <input
                type="number"
                value={settings.weight}
                onChange={(e) => saveSettings({ ...settings, weight: parseInt(e.target.value) || 70 })}
                className="w-full px-2 py-1 bg-surface border border-border rounded text-xs text-text"
                min="30"
                max="200"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">AI recommendations</span>
              <button
                onClick={() => saveSettings({ ...settings, enableAIRecommendations: !settings.enableAIRecommendations })}
                className={cn(
                  'p-1.5 rounded-lg transition-colors',
                  settings.enableAIRecommendations 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-surface text-muted'
                )}
              >
                <Brain className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">Track beverage types</span>
              <button
                onClick={() => saveSettings({ ...settings, trackBeverageTypes: !settings.trackBeverageTypes })}
                className={cn(
                  'p-1.5 rounded-lg transition-colors',
                  settings.trackBeverageTypes 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-surface text-muted'
                )}
              >
                <Activity className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Circle */}
      <div className="mb-4">
        <div className="relative w-20 h-20 mx-auto mb-3">
          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-surface-2"
            />
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 36}`}
              strokeDashoffset={`${2 * Math.PI * 36 * (1 - progress / 100)}`}
              className="text-cyan-500 transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-text">{Math.round(progress)}%</span>
            <span className="text-xs text-muted">{Math.round(todayTotal / 1000)}L</span>
          </div>
        </div>
        
        <div className="text-center">
          <div className={cn('text-sm font-medium', getHydrationStatus().color)}>
            {getHydrationStatus().status}
          </div>
          <div className="text-xs text-muted">
            {remaining > 0 ? `${Math.round(remaining)}ml remaining` : 'Goal reached!'}
          </div>
          <div className="text-xs text-muted mt-1">
            Recommended: {Math.round(recommendedIntake / 1000)}L
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-surface-2 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-3 h-3 text-muted" />
              <span className="text-xs text-muted">Target</span>
            </div>
            <div className="text-lg font-bold text-text">
              {Math.round(settings.dailyTarget / 1000)}L
            </div>
          </div>
          <div className="bg-surface-2 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-3 h-3 text-muted" />
              <span className="text-xs text-muted">Weekly avg</span>
            </div>
            <div className="text-lg font-bold text-text">
              {Math.round(getWeeklyAverage() / 1000)}L
            </div>
          </div>
        </div>
      </div>

      {/* Beverage Breakdown */}
      {settings.trackBeverageTypes && todayEntries.length > 0 && (
        <div className="mb-4">
          <div className="text-xs text-muted mb-2">Today's breakdown</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(getBeverageBreakdown()).map(([type, amount]) => {
              const beverage = beverageTypes.find(b => b.id === type);
              return beverage ? (
                <div key={type} className="flex items-center gap-1 px-2 py-1 bg-surface-2 rounded-full">
                  <span className="text-xs">{beverage.icon}</span>
                  <span className="text-xs text-text">{Math.round(amount)}ml</span>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* AI Recommendations */}
      {settings.enableAIRecommendations && aiRecommendations.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted">AI Recommendations</span>
            <button
              onClick={() => setShowAIRecommendations(!showAIRecommendations)}
              className="text-xs text-primary hover:underline"
            >
              {showAIRecommendations ? 'Hide' : 'Show'}
            </button>
          </div>
          {showAIRecommendations && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
              {aiRecommendations.map((recommendation, index) => (
                <div key={index} className="text-xs text-primary/80 mb-2 flex items-start gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>{recommendation}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Water Button */}
      {!showAddWater ? (
        <button
          onClick={() => setShowAddWater(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-150"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Add Water</span>
        </button>
      ) : (
        <div className="space-y-3">
          {/* Amount Selector */}
          <div>
            <label className="text-xs text-muted mb-2 block">Amount to add</label>
            <div className="grid grid-cols-2 gap-2">
              {waterAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setSelectedAmount(amount)}
                  className={cn(
                    'p-3 rounded-lg border transition-all duration-150',
                    selectedAmount === amount
                      ? 'bg-cyan-500/20 border-cyan-500/30'
                      : 'bg-surface-2 border-border hover:border-cyan-500/30'
                  )}
                >
                  <div className="text-sm font-medium text-text">{amount}ml</div>
                  <div className="text-xs text-muted">{Math.round(amount / 250)} glasses</div>
                </button>
              ))}
            </div>
          </div>

          {/* Beverage Type Selector */}
          {settings.trackBeverageTypes && (
            <div>
              <label className="text-xs text-muted mb-2 block">Beverage type</label>
              <div className="grid grid-cols-5 gap-2">
                {beverageTypes.map((beverage) => (
                  <button
                    key={beverage.id}
                    onClick={() => setSelectedType(beverage.id as any)}
                    className={cn(
                      'p-2 rounded-lg border transition-all duration-150 text-center',
                      selectedType === beverage.id
                        ? 'bg-cyan-500/20 border-cyan-500/30'
                        : 'bg-surface-2 border-border hover:border-cyan-500/30'
                    )}
                  >
                    <div className="text-lg">{beverage.icon}</div>
                    <div className="text-xs text-muted mt-1">{beverage.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Note Input */}
          <div>
            <label className="text-xs text-muted mb-2 block">Note (optional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., After workout"
              className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-sm text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddWater(false)}
              className="flex-1 px-3 py-2 bg-surface-2 border border-border text-text rounded-lg hover:bg-surface transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              onClick={addWaterEntry}
              className="flex-1 px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-150"
            >
              Add {selectedAmount}ml
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 