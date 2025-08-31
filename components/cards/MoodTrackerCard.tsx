'use client';

import { useState, useEffect } from 'react';
import { Heart, Plus, TrendingUp, Calendar, Info, Settings, Sparkles, Brain, Target, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MoodTrackerCardProps {
  className?: string;
}

interface MoodEntry {
  id: string;
  mood: number;
  timestamp: Date;
  note?: string;
  activities?: string[];
  energy?: number;
  stress?: number;
}

interface MoodSettings {
  enableAIInsights: boolean;
  reminderTime: string;
  enableNotifications: boolean;
  moodScale: 5 | 7 | 10;
  trackActivities: boolean;
  trackEnergy: boolean;
  trackStress: boolean;
}

const moodEmojis5 = ['😞', '😐', '😊', '😄', '🤩'];
const moodLabels5 = ['Poor', 'Okay', 'Good', 'Great', 'Excellent'];

const moodEmojis7 = ['😢', '😞', '😐', '😊', '😄', '🤩', '🥰'];
const moodLabels7 = ['Terrible', 'Bad', 'Okay', 'Good', 'Great', 'Excellent', 'Amazing'];

const moodEmojis10 = ['😭', '😢', '😞', '😐', '🙂', '😊', '😄', '🤩', '🥰', '😍'];
const moodLabels10 = ['Awful', 'Terrible', 'Bad', 'Okay', 'Fine', 'Good', 'Great', 'Excellent', 'Amazing', 'Perfect'];

const activityOptions = [
  'Exercise', 'Work', 'Social', 'Family', 'Hobbies', 'Reading', 
  'Music', 'Nature', 'Food', 'Sleep', 'Meditation', 'Travel'
];

export function MoodTrackerCard({ className }: MoodTrackerCardProps) {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [energy, setEnergy] = useState(3);
  const [stress, setStress] = useState(3);
  const [showInfo, setShowInfo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [settings, setSettings] = useState<MoodSettings>({
    enableAIInsights: true,
    reminderTime: '20:00',
    enableNotifications: true,
    moodScale: 5,
    trackActivities: true,
    trackEnergy: true,
    trackStress: true,
  });

  // Load saved data
  useEffect(() => {
    const savedMood = localStorage.getItem('moodTrackerEntries');
    const savedSettings = localStorage.getItem('moodTrackerSettings');
    
    if (savedMood) {
      const parsed = JSON.parse(savedMood);
      setMoodEntries(parsed.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      })));
    }
    
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save data
  const saveMoodData = (entries: MoodEntry[]) => {
    setMoodEntries(entries);
    localStorage.setItem('moodTrackerEntries', JSON.stringify(entries));
  };

  const saveSettings = (newSettings: MoodSettings) => {
    setSettings(newSettings);
    localStorage.setItem('moodTrackerSettings', JSON.stringify(newSettings));
  };

  const getMoodEmojis = () => {
    switch (settings.moodScale) {
      case 7: return moodEmojis7;
      case 10: return moodEmojis10;
      default: return moodEmojis5;
    }
  };

  const getMoodLabels = () => {
    switch (settings.moodScale) {
      case 7: return moodLabels7;
      case 10: return moodLabels10;
      default: return moodLabels5;
    }
  };

  const generateAIInsights = async () => {
    if (!settings.enableAIInsights || moodEntries.length < 3) return;

    try {
      const response = await fetch('/api/ai/guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Analyze my mood data and provide 3 actionable insights. My mood entries: ${JSON.stringify(moodEntries.slice(0, 7))}`,
          context: {
            page: 'mood_tracker',
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
          
          // Parse insights from AI response
          const insights = content.split('\n').filter(line => line.trim().startsWith('•') || line.trim().startsWith('-')).slice(0, 3);
          setAiInsights(insights.length > 0 ? insights : [
            'Your mood patterns show consistency - great for building awareness',
            'Consider tracking activities that correlate with better moods',
            'Regular mood tracking helps identify triggers and patterns'
          ]);
        }
      }
    } catch (error) {
      console.error('Failed to generate AI insights:', error);
      setAiInsights([
        'Your mood patterns show consistency - great for building awareness',
        'Consider tracking activities that correlate with better moods',
        'Regular mood tracking helps identify triggers and patterns'
      ]);
    }
  };

  const addMoodEntry = () => {
    if (selectedMood === null) return;

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      mood: selectedMood,
      timestamp: new Date(),
      note: note.trim() || undefined,
      activities: settings.trackActivities ? selectedActivities : undefined,
      energy: settings.trackEnergy ? energy : undefined,
      stress: settings.trackStress ? stress : undefined,
    };

    const updatedEntries = [newEntry, ...moodEntries.slice(0, 29)]; // Keep last 30 entries
    saveMoodData(updatedEntries);
    
    setSelectedMood(null);
    setNote('');
    setSelectedActivities([]);
    setEnergy(3);
    setStress(3);
    setShowMoodSelector(false);
    
    // Generate AI insights after adding entry
    if (settings.enableAIInsights) {
      setTimeout(generateAIInsights, 1000);
    }
  };

  const todayEntry = moodEntries.find(entry => {
    const today = new Date();
    const entryDate = new Date(entry.timestamp);
    return entryDate.toDateString() === today.toDateString();
  });

  const averageMood = moodEntries.length > 0 
    ? moodEntries.reduce((sum, entry) => sum + entry.mood, 0) / moodEntries.length 
    : 0;

  const getMoodTrend = () => {
    if (moodEntries.length < 2) return 'stable';
    const recent = moodEntries.slice(0, 3).reduce((sum, entry) => sum + entry.mood, 0) / 3;
    const older = moodEntries.slice(3, 6).reduce((sum, entry) => sum + entry.mood, 0) / 3;
    if (recent > older) return 'improving';
    if (recent < older) return 'declining';
    return 'stable';
  };

  const getWeeklyAverage = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weekEntries = moodEntries.filter(entry => 
      new Date(entry.timestamp) > weekAgo
    );
    
    if (weekEntries.length === 0) return 0;
    
    const total = weekEntries.reduce((sum, entry) => sum + entry.mood, 0);
    return Math.round(total / weekEntries.length);
  };

  const moodEmojis = getMoodEmojis();
  const moodLabels = getMoodLabels();

  return (
    <div className={cn('bg-surface border border-border rounded-lg p-4', className)}>
      {/* Header with Info and Settings */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-full flex items-center justify-center">
            <Heart className="w-4 h-4 text-pink-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text">Mood Tracker</h3>
            <p className="text-xs text-muted">Track your feelings</p>
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
            How to use Mood Tracker
          </h4>
          <div className="text-xs text-muted space-y-2">
            <p>• Track your mood daily to build emotional awareness</p>
            <p>• Add notes to understand what affects your mood</p>
            <p>• Use AI insights to discover patterns and triggers</p>
            <p>• Review trends to improve your emotional well-being</p>
            <p>• Customize settings to track what matters to you</p>
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
              <span className="text-xs text-muted">Track activities</span>
              <button
                onClick={() => saveSettings({ ...settings, trackActivities: !settings.trackActivities })}
                className={cn(
                  'p-1.5 rounded-lg transition-colors',
                  settings.trackActivities 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-surface text-muted'
                )}
              >
                <Target className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">Track energy</span>
              <button
                onClick={() => saveSettings({ ...settings, trackEnergy: !settings.trackEnergy })}
                className={cn(
                  'p-1.5 rounded-lg transition-colors',
                  settings.trackEnergy 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-surface text-muted'
                )}
              >
                <TrendingUp className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">Track stress</span>
              <button
                onClick={() => saveSettings({ ...settings, trackStress: !settings.trackStress })}
                className={cn(
                  'p-1.5 rounded-lg transition-colors',
                  settings.trackStress 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-surface text-muted'
                )}
              >
                <BarChart3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Today's Mood */}
      {todayEntry ? (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted">Today's mood</span>
            <span className="text-xs text-muted">
              {new Date(todayEntry.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-2xl">{moodEmojis[todayEntry.mood - 1]}</div>
            <div>
              <div className="text-sm font-medium text-text">
                {moodLabels[todayEntry.mood - 1]}
              </div>
              {todayEntry.note && (
                <div className="text-xs text-muted mt-1">{todayEntry.note}</div>
              )}
              {todayEntry.activities && todayEntry.activities.length > 0 && (
                <div className="text-xs text-muted mt-1">
                  Activities: {todayEntry.activities.join(', ')}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-4 text-center py-3">
          <div className="text-muted text-sm">No mood recorded today</div>
        </div>
      )}

      {/* Stats */}
      {moodEntries.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-surface-2 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-3 h-3 text-muted" />
                <span className="text-xs text-muted">Average</span>
              </div>
              <div className="text-lg font-bold text-text">
                {moodEmojis[Math.round(averageMood) - 1]}
              </div>
            </div>
            <div className="bg-surface-2 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-3 h-3 text-muted" />
                <span className="text-xs text-muted">Trend</span>
              </div>
              <div className="text-sm font-medium text-text capitalize">
                {getMoodTrend()}
              </div>
            </div>
            <div className="bg-surface-2 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="w-3 h-3 text-muted" />
                <span className="text-xs text-muted">Weekly</span>
              </div>
              <div className="text-lg font-bold text-text">
                {moodEmojis[getWeeklyAverage() - 1]}
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

      {/* Add Mood Button */}
      {!showMoodSelector ? (
        <button
          onClick={() => setShowMoodSelector(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-150"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">
            {todayEntry ? 'Update Mood' : 'Add Mood'}
          </span>
        </button>
      ) : (
        <div className="space-y-3">
          {/* Mood Selector */}
          <div>
            <label className="text-xs text-muted mb-2 block">How are you feeling?</label>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: settings.moodScale }, (_, i) => i + 1).map((mood) => (
                <button
                  key={mood}
                  onClick={() => setSelectedMood(mood)}
                  className={cn(
                    'p-3 rounded-lg border transition-all duration-150',
                    selectedMood === mood
                      ? 'bg-pink-500/20 border-pink-500/30'
                      : 'bg-surface-2 border-border hover:border-pink-500/30'
                  )}
                >
                  <div className="text-lg">{moodEmojis[mood - 1]}</div>
                  <div className="text-xs text-muted mt-1">{mood}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Note Input */}
          <div>
            <label className="text-xs text-muted mb-2 block">Optional note</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="How was your day?"
              className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-sm text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500"
            />
          </div>

          {/* Activities */}
          {settings.trackActivities && (
            <div>
              <label className="text-xs text-muted mb-2 block">Activities (optional)</label>
              <div className="flex flex-wrap gap-1">
                {activityOptions.map((activity) => (
                  <button
                    key={activity}
                    onClick={() => {
                      setSelectedActivities(prev => 
                        prev.includes(activity) 
                          ? prev.filter(a => a !== activity)
                          : [...prev, activity]
                      );
                    }}
                    className={cn(
                      'px-2 py-1 rounded-full text-xs transition-colors',
                      selectedActivities.includes(activity)
                        ? 'bg-pink-500/20 text-pink-500 border border-pink-500/30'
                        : 'bg-surface-2 text-muted border border-border hover:border-pink-500/30'
                    )}
                  >
                    {activity}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Energy and Stress */}
          {(settings.trackEnergy || settings.trackStress) && (
            <div className="grid grid-cols-2 gap-3">
              {settings.trackEnergy && (
                <div>
                  <label className="text-xs text-muted mb-2 block">Energy level</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        onClick={() => setEnergy(level)}
                        className={cn(
                          'flex-1 p-2 rounded-lg border text-xs transition-colors',
                          energy === level
                            ? 'bg-pink-500/20 border-pink-500/30 text-pink-500'
                            : 'bg-surface-2 border-border text-muted hover:border-pink-500/30'
                        )}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {settings.trackStress && (
                <div>
                  <label className="text-xs text-muted mb-2 block">Stress level</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        onClick={() => setStress(level)}
                        className={cn(
                          'flex-1 p-2 rounded-lg border text-xs transition-colors',
                          stress === level
                            ? 'bg-pink-500/20 border-pink-500/30 text-pink-500'
                            : 'bg-surface-2 border-border text-muted hover:border-pink-500/30'
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

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowMoodSelector(false);
                setSelectedMood(null);
                setNote('');
                setSelectedActivities([]);
                setEnergy(3);
                setStress(3);
              }}
              className="flex-1 px-3 py-2 bg-surface-2 border border-border text-text rounded-lg hover:bg-surface transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              onClick={addMoodEntry}
              disabled={selectedMood === null}
              className="flex-1 px-3 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 