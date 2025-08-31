'use client';

import { useState, useEffect } from 'react';
import { Moon, Plus, Target, TrendingUp, Info, Settings, Sparkles, Brain, Clock, Activity, Bed, Sunrise } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SleepTrackerCardProps {
  className?: string;
}

interface SleepEntry {
  id: string;
  bedtime: Date;
  wakeTime: Date;
  quality: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  factors?: string[];
  mood?: number;
  energy?: number;
}

interface SleepSettings {
  targetSleepHours: number;
  targetBedtime: string;
  targetWakeTime: string;
  enableAIInsights: boolean;
  trackFactors: boolean;
  trackMood: boolean;
  trackEnergy: boolean;
  enableReminders: boolean;
  reminderTime: string;
}

const sleepFactors = [
  'Caffeine', 'Exercise', 'Stress', 'Screen time', 'Noise', 'Temperature',
  'Light', 'Alcohol', 'Large meal', 'Meditation', 'Reading', 'Music'
];

const qualityLabels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
const qualityEmojis = ['😴', '😐', '😊', '😄', '🤩'];

export function SleepTrackerCard({ className }: SleepTrackerCardProps) {
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([]);
  const [showAddSleep, setShowAddSleep] = useState(false);
  const [bedtime, setBedtime] = useState('');
  const [wakeTime, setWakeTime] = useState('');
  const [quality, setQuality] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [notes, setNotes] = useState('');
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [showInfo, setShowInfo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [settings, setSettings] = useState<SleepSettings>({
    targetSleepHours: 8,
    targetBedtime: '22:30',
    targetWakeTime: '06:30',
    enableAIInsights: true,
    trackFactors: true,
    trackMood: true,
    trackEnergy: true,
    enableReminders: true,
    reminderTime: '22:00',
  });

  // Load saved data
  useEffect(() => {
    const savedEntries = localStorage.getItem('sleepTrackerEntries');
    const savedSettings = localStorage.getItem('sleepTrackerSettings');
    
    if (savedEntries) {
      const parsed = JSON.parse(savedEntries);
      setSleepEntries(parsed.map((entry: any) => ({
        ...entry,
        bedtime: new Date(entry.bedtime),
        wakeTime: new Date(entry.wakeTime)
      })));
    }
    
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save data
  const saveSleepData = (entries: SleepEntry[]) => {
    setSleepEntries(entries);
    localStorage.setItem('sleepTrackerEntries', JSON.stringify(entries));
  };

  const saveSettings = (newSettings: SleepSettings) => {
    setSettings(newSettings);
    localStorage.setItem('sleepTrackerSettings', JSON.stringify(newSettings));
  };

  const calculateSleepHours = (bedtime: Date, wakeTime: Date) => {
    const diff = wakeTime.getTime() - bedtime.getTime();
    return Math.round((diff / (1000 * 60 * 60)) * 10) / 10;
  };

  const generateAIInsights = async () => {
    if (!settings.enableAIInsights || sleepEntries.length < 3) return;

    try {
      const response = await fetch('/api/ai/guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Analyze my sleep data and provide 3 actionable insights for better sleep. My sleep entries: ${JSON.stringify(sleepEntries.slice(0, 7))}. My target: ${settings.targetSleepHours} hours.`,
          context: {
            page: 'sleep_tracker',
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
          
          // Clean markdown formatting and parse insights from AI response
          const cleanContent = content
            .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
            .replace(/\*(.*?)\*/g, '$1') // Remove italic formatting
            .replace(/`(.*?)`/g, '$1') // Remove code formatting
            .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
            .replace(/^#+\s*/gm, '') // Remove markdown headers
            .replace(/^\s*[-*+]\s*/gm, '') // Remove markdown list markers
            .replace(/^\s*\d+\.\s*/gm, ''); // Remove numbered list markers
          
          const insights = cleanContent.split('\n').filter(line => line.trim().startsWith('•') || line.trim().startsWith('-')).slice(0, 3);
          setAiInsights(insights.length > 0 ? insights : [
            'Consistent bedtime and wake time help regulate your circadian rhythm',
            'Avoid screens 1-2 hours before bed to improve sleep quality',
            'Create a relaxing bedtime routine to signal your body it\'s time to sleep'
          ]);
        }
      }
    } catch (error) {
      console.error('Failed to generate AI insights:', error);
      setAiInsights([
        'Consistent bedtime and wake time help regulate your circadian rhythm',
        'Avoid screens 1-2 hours before bed to improve sleep quality',
        'Create a relaxing bedtime routine to signal your body it\'s time to sleep'
      ]);
    }
  };

  const addSleepEntry = () => {
    if (!bedtime || !wakeTime) return;

    const bedtimeDate = new Date(`2000-01-01T${bedtime}`);
    const wakeTimeDate = new Date(`2000-01-01T${wakeTime}`);
    
    // Adjust wake time if it's before bedtime (next day)
    if (wakeTimeDate <= bedtimeDate) {
      wakeTimeDate.setDate(wakeTimeDate.getDate() + 1);
    }

    const newEntry: SleepEntry = {
      id: Date.now().toString(),
      bedtime: bedtimeDate,
      wakeTime: wakeTimeDate,
      quality,
      notes: notes.trim() || undefined,
      factors: settings.trackFactors ? selectedFactors : undefined,
      mood: settings.trackMood ? mood : undefined,
      energy: settings.trackEnergy ? energy : undefined,
    };

    const updatedEntries = [newEntry, ...sleepEntries.slice(0, 29)]; // Keep last 30 entries
    saveSleepData(updatedEntries);
    
    setShowAddSleep(false);
    setBedtime('');
    setWakeTime('');
    setQuality(3);
    setNotes('');
    setSelectedFactors([]);
    setMood(3);
    setEnergy(3);
    
    // Generate AI insights after adding entry
    if (settings.enableAIInsights) {
      setTimeout(generateAIInsights, 1000);
    }
  };

  const lastNightEntry = sleepEntries[0];
  const averageSleepHours = sleepEntries.length > 0 
    ? sleepEntries.reduce((sum, entry) => sum + calculateSleepHours(entry.bedtime, entry.wakeTime), 0) / sleepEntries.length 
    : 0;

  const averageQuality = sleepEntries.length > 0 
    ? sleepEntries.reduce((sum, entry) => sum + entry.quality, 0) / sleepEntries.length 
    : 0;

  const getSleepStatus = () => {
    if (!lastNightEntry) return { status: 'No data', color: 'text-muted' };
    
    const hours = calculateSleepHours(lastNightEntry.bedtime, lastNightEntry.wakeTime);
    if (hours >= settings.targetSleepHours) return { status: 'Great sleep!', color: 'text-success' };
    if (hours >= settings.targetSleepHours * 0.8) return { status: 'Good sleep', color: 'text-primary' };
    if (hours >= settings.targetSleepHours * 0.6) return { status: 'Fair sleep', color: 'text-warning' };
    return { status: 'Need more sleep', color: 'text-error' };
  };

  const getWeeklyAverage = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weekEntries = sleepEntries.filter(entry => 
      entry.bedtime > weekAgo
    );
    
    if (weekEntries.length === 0) return 0;
    
    const total = weekEntries.reduce((sum, entry) => sum + calculateSleepHours(entry.bedtime, entry.wakeTime), 0);
    return Math.round((total / weekEntries.length) * 10) / 10;
  };

  const getConsistencyScore = () => {
    if (sleepEntries.length < 3) return 0;
    
    const recentEntries = sleepEntries.slice(0, 7);
    const bedtimes = recentEntries.map(entry => entry.bedtime.getHours() * 60 + entry.bedtime.getMinutes());
    const wakeTimes = recentEntries.map(entry => entry.wakeTime.getHours() * 60 + entry.wakeTime.getMinutes());
    
    const bedtimeVariance = Math.sqrt(bedtimes.reduce((sum, time) => sum + Math.pow(time - bedtimes.reduce((a, b) => a + b) / bedtimes.length, 2), 0) / bedtimes.length);
    const wakeTimeVariance = Math.sqrt(wakeTimes.reduce((sum, time) => sum + Math.pow(time - wakeTimes.reduce((a, b) => a + b) / wakeTimes.length, 2), 0) / wakeTimes.length);
    
    const maxVariance = 120; // 2 hours
    const bedtimeConsistency = Math.max(0, 100 - (bedtimeVariance / maxVariance) * 100);
    const wakeTimeConsistency = Math.max(0, 100 - (wakeTimeVariance / maxVariance) * 100);
    
    return Math.round((bedtimeConsistency + wakeTimeConsistency) / 2);
  };

  return (
    <div className={cn('bg-surface border border-border rounded-lg p-4', className)}>
      {/* Header with Info and Settings */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
            <Moon className="w-4 h-4 text-indigo-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text">Sleep Tracker</h3>
            <p className="text-xs text-muted">Track your rest</p>
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
            How to use Sleep Tracker
          </h4>
          <div className="text-xs text-muted space-y-2">
            <p>• Track your bedtime and wake time daily</p>
            <p>• Rate your sleep quality to identify patterns</p>
            <p>• Monitor factors that affect your sleep</p>
            <p>• Use AI insights to improve sleep habits</p>
            <p>• Aim for consistent sleep schedule</p>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="mb-4 p-3 bg-surface-2 border border-border rounded-lg">
          <h4 className="text-sm font-semibold text-text mb-3">Settings</h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted mb-1 block">Target sleep hours</label>
              <input
                type="number"
                value={settings.targetSleepHours}
                onChange={(e) => saveSettings({ ...settings, targetSleepHours: parseInt(e.target.value) || 8 })}
                className="w-full px-2 py-1 bg-surface border border-border rounded text-xs text-text"
                min="4"
                max="12"
                step="0.5"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-muted mb-1 block">Target bedtime</label>
                <input
                  type="time"
                  value={settings.targetBedtime}
                  onChange={(e) => saveSettings({ ...settings, targetBedtime: e.target.value })}
                  className="w-full px-2 py-1 bg-surface border border-border rounded text-xs text-text"
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">Target wake time</label>
                <input
                  type="time"
                  value={settings.targetWakeTime}
                  onChange={(e) => saveSettings({ ...settings, targetWakeTime: e.target.value })}
                  className="w-full px-2 py-1 bg-surface border border-border rounded text-xs text-text"
                />
              </div>
            </div>
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
              <span className="text-xs text-muted">Track factors</span>
              <button
                onClick={() => saveSettings({ ...settings, trackFactors: !settings.trackFactors })}
                className={cn(
                  'p-1.5 rounded-lg transition-colors',
                  settings.trackFactors 
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

      {/* Last Night's Sleep */}
      {lastNightEntry ? (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted">Last night</span>
            <span className="text-xs text-muted">
              {lastNightEntry.bedtime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {lastNightEntry.wakeTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-2xl">{qualityEmojis[lastNightEntry.quality - 1]}</div>
            <div>
              <div className="text-sm font-medium text-text">
                {calculateSleepHours(lastNightEntry.bedtime, lastNightEntry.wakeTime)}h sleep
              </div>
              <div className={cn('text-xs', getSleepStatus().color)}>
                {getSleepStatus().status}
              </div>
              {lastNightEntry.notes && (
                <div className="text-xs text-muted mt-1">{lastNightEntry.notes}</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-4 text-center py-3">
          <div className="text-muted text-sm">No sleep data recorded</div>
        </div>
      )}

      {/* Stats */}
      <div className="mb-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-surface-2 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-3 h-3 text-muted" />
              <span className="text-xs text-muted">Avg hours</span>
            </div>
            <div className="text-lg font-bold text-text">
              {Math.round(averageSleepHours * 10) / 10}h
            </div>
          </div>
          <div className="bg-surface-2 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-3 h-3 text-muted" />
              <span className="text-xs text-muted">Quality</span>
            </div>
            <div className="text-lg font-bold text-text">
              {qualityEmojis[Math.round(averageQuality) - 1]}
            </div>
          </div>
          <div className="bg-surface-2 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-3 h-3 text-muted" />
              <span className="text-xs text-muted">Consistency</span>
            </div>
            <div className="text-lg font-bold text-text">
              {getConsistencyScore()}%
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

      {/* Add Sleep Button */}
      {!showAddSleep ? (
        <button
          onClick={() => setShowAddSleep(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-150"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">
            {lastNightEntry ? 'Update Sleep' : 'Add Sleep'}
          </span>
        </button>
      ) : (
        <div className="space-y-3">
          {/* Time Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted mb-2 block">Bedtime</label>
              <input
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs text-muted mb-2 block">Wake time</label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Quality Selector */}
          <div>
            <label className="text-xs text-muted mb-2 block">Sleep quality</label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => setQuality(level as any)}
                  className={cn(
                    'p-3 rounded-lg border transition-all duration-150 text-center',
                    quality === level
                      ? 'bg-indigo-500/20 border-indigo-500/30'
                      : 'bg-surface-2 border-border hover:border-indigo-500/30'
                  )}
                >
                  <div className="text-lg">{qualityEmojis[level - 1]}</div>
                  <div className="text-xs text-muted mt-1">{qualityLabels[level - 1]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Factors */}
          {settings.trackFactors && (
            <div>
              <label className="text-xs text-muted mb-2 block">Factors (optional)</label>
              <div className="flex flex-wrap gap-1">
                {sleepFactors.map((factor) => (
                  <button
                    key={factor}
                    onClick={() => {
                      setSelectedFactors(prev => 
                        prev.includes(factor) 
                          ? prev.filter(f => f !== factor)
                          : [...prev, factor]
                      );
                    }}
                    className={cn(
                      'px-2 py-1 rounded-full text-xs transition-colors',
                      selectedFactors.includes(factor)
                        ? 'bg-indigo-500/20 text-indigo-500 border border-indigo-500/30'
                        : 'bg-surface-2 text-muted border border-border hover:border-indigo-500/30'
                    )}
                  >
                    {factor}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mood and Energy */}
          {(settings.trackMood || settings.trackEnergy) && (
            <div className="grid grid-cols-2 gap-3">
              {settings.trackMood && (
                <div>
                  <label className="text-xs text-muted mb-2 block">Morning mood</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        onClick={() => setMood(level)}
                        className={cn(
                          'flex-1 p-2 rounded-lg border text-xs transition-colors',
                          mood === level
                            ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-500'
                            : 'bg-surface-2 border-border text-muted hover:border-indigo-500/30'
                        )}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {settings.trackEnergy && (
                <div>
                  <label className="text-xs text-muted mb-2 block">Morning energy</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        onClick={() => setEnergy(level)}
                        className={cn(
                          'flex-1 p-2 rounded-lg border text-xs transition-colors',
                          energy === level
                            ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-500'
                            : 'bg-surface-2 border-border text-muted hover:border-indigo-500/30'
                        )}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="text-xs text-muted mb-2 block">Notes (optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did you sleep?"
              className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-sm text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowAddSleep(false);
                setBedtime('');
                setWakeTime('');
                setQuality(3);
                setNotes('');
                setSelectedFactors([]);
                setMood(3);
                setEnergy(3);
              }}
              className="flex-1 px-3 py-2 bg-surface-2 border border-border text-text rounded-lg hover:bg-surface transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              onClick={addSleepEntry}
              disabled={!bedtime || !wakeTime}
              className="flex-1 px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 