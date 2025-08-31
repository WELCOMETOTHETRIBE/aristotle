'use client';

import { useState, useEffect } from 'react';
import { Heart, Plus, TrendingUp, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MoodTrackerCardProps {
  className?: string;
}

interface MoodEntry {
  id: string;
  mood: number;
  timestamp: Date;
  note?: string;
}

const moodEmojis = ['😞', '😐', '😊', '😄', '🤩'];
const moodLabels = ['Poor', 'Okay', 'Good', 'Great', 'Excellent'];

export function MoodTrackerCard({ className }: MoodTrackerCardProps) {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState('');

  // Load saved mood data
  useEffect(() => {
    const saved = localStorage.getItem('moodTrackerEntries');
    if (saved) {
      const parsed = JSON.parse(saved);
      setMoodEntries(parsed.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      })));
    }
  }, []);

  // Save mood data
  const saveMoodData = (entries: MoodEntry[]) => {
    setMoodEntries(entries);
    localStorage.setItem('moodTrackerEntries', JSON.stringify(entries));
  };

  const addMoodEntry = () => {
    if (selectedMood === null) return;

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      mood: selectedMood,
      timestamp: new Date(),
      note: note.trim() || undefined,
    };

    const updatedEntries = [newEntry, ...moodEntries.slice(0, 6)]; // Keep last 7 entries
    saveMoodData(updatedEntries);
    
    setSelectedMood(null);
    setNote('');
    setShowMoodSelector(false);
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

  return (
    <div className={cn('bg-surface border border-border rounded-lg p-4', className)}>
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
        <div className="text-right">
          <div className="text-lg font-bold text-text">{moodEntries.length}</div>
          <div className="text-xs text-muted">Entries</div>
        </div>
      </div>

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
          <div className="grid grid-cols-2 gap-3">
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
          </div>
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
              {[1, 2, 3, 4, 5].map((mood) => (
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

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowMoodSelector(false);
                setSelectedMood(null);
                setNote('');
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