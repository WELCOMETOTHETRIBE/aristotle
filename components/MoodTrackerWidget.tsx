'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Frown, Meh, TrendingUp, TrendingDown, Activity, Calendar, BarChart3, Plus, X, Edit3, Save } from 'lucide-react';

interface MoodTrackerWidgetProps {
  frameworkTone?: string;
}

interface MoodEntry {
  id: string;
  mood: number;
  note?: string;
  timestamp: Date;
  activities?: string[];
  energy?: number;
  stress?: number;
}

interface MoodPattern {
  averageMood: number;
  moodTrend: 'improving' | 'declining' | 'stable';
  bestDay: string;
  worstDay: string;
  mostCommonMood: number;
}

export function MoodTrackerWidget({ frameworkTone = "stoic" }: MoodTrackerWidgetProps) {
  const [currentMood, setCurrentMood] = useState<number | null>(null);
  const [moodNote, setMoodNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [energyLevel, setEnergyLevel] = useState<number>(3);
  const [stressLevel, setStressLevel] = useState<number>(3);
  const [isEditing, setIsEditing] = useState(false);

  const moodOptions = [
    { value: 1, emoji: '😢', label: 'Very Low', color: 'from-red-500 to-red-600', bgColor: 'bg-red-500/20' },
    { value: 2, emoji: '😕', label: 'Low', color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-500/20' },
    { value: 3, emoji: '😐', label: 'Neutral', color: 'from-yellow-500 to-yellow-600', bgColor: 'bg-yellow-500/20' },
    { value: 4, emoji: '🙂', label: 'Good', color: 'from-green-500 to-green-600', bgColor: 'bg-green-500/20' },
    { value: 5, emoji: '😊', label: 'Excellent', color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-500/20' }
  ];

  const activityOptions = [
    'Exercise', 'Work', 'Social', 'Family', 'Hobbies', 'Reading', 'Music', 'Nature', 'Food', 'Sleep', 'Stress', 'Health'
  ];

  // Load saved mood data from localStorage
  useEffect(() => {
    const savedMoodHistory = localStorage.getItem('moodTrackerHistory');
    if (savedMoodHistory) {
      const parsedHistory = JSON.parse(savedMoodHistory).map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      }));
      setMoodHistory(parsedHistory);
      
      // Set current mood from today's entry
      const today = new Date().toDateString();
      const todayEntry = parsedHistory.find((entry: MoodEntry) => 
        entry.timestamp.toDateString() === today
      );
      if (todayEntry) {
        setCurrentMood(todayEntry.mood);
        setMoodNote(todayEntry.note || '');
        setSelectedActivities(todayEntry.activities || []);
        setEnergyLevel(todayEntry.energy || 3);
        setStressLevel(todayEntry.stress || 3);
      }
    }
  }, []);

  // Save mood history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('moodTrackerHistory', JSON.stringify(moodHistory));
  }, [moodHistory]);

  const addMoodEntry = () => {
    if (selectedMood === null) return;

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      mood: selectedMood,
      note: moodNote.trim() || undefined,
      timestamp: new Date(),
      activities: selectedActivities.length > 0 ? selectedActivities : undefined,
      energy: energyLevel,
      stress: stressLevel
    };

    // Replace today's entry if it exists, otherwise add new
    const today = new Date().toDateString();
    const updatedHistory = moodHistory.filter(entry => 
      entry.timestamp.toDateString() !== today
    );

    setMoodHistory([newEntry, ...updatedHistory]);
    setCurrentMood(selectedMood);
    setIsAdding(false);
    setSelectedMood(null);
    setMoodNote('');
    setSelectedActivities([]);
    setEnergyLevel(3);
    setStressLevel(3);
  };

  const updateMoodEntry = () => {
    if (selectedMood === null) return;

    const today = new Date().toDateString();
    const updatedHistory = moodHistory.map(entry => {
      if (entry.timestamp.toDateString() === today) {
        return {
          ...entry,
          mood: selectedMood,
          note: moodNote.trim() || undefined,
          activities: selectedActivities.length > 0 ? selectedActivities : undefined,
          energy: energyLevel,
          stress: stressLevel
        };
      }
      return entry;
    });

    setMoodHistory(updatedHistory);
    setCurrentMood(selectedMood);
    setIsEditing(false);
    setSelectedMood(null);
    setMoodNote('');
    setSelectedActivities([]);
    setEnergyLevel(3);
    setStressLevel(3);
  };

  const getMoodPatterns = (): MoodPattern => {
    if (moodHistory.length === 0) {
      return {
        averageMood: 3,
        moodTrend: 'stable',
        bestDay: 'N/A',
        worstDay: 'N/A',
        mostCommonMood: 3
      };
    }

    const recentMoods = moodHistory.slice(0, 7); // Last 7 days
    const averageMood = recentMoods.reduce((sum, entry) => sum + entry.mood, 0) / recentMoods.length;
    
    // Calculate trend
    const firstHalf = recentMoods.slice(0, Math.ceil(recentMoods.length / 2));
    const secondHalf = recentMoods.slice(Math.ceil(recentMoods.length / 2));
    const firstAvg = firstHalf.reduce((sum, entry) => sum + entry.mood, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, entry) => sum + entry.mood, 0) / secondHalf.length;
    
    let moodTrend: 'improving' | 'declining' | 'stable' = 'stable';
    if (secondAvg > firstAvg + 0.5) moodTrend = 'improving';
    else if (secondAvg < firstAvg - 0.5) moodTrend = 'declining';

    // Find best and worst days
    const bestEntry = recentMoods.reduce((best, current) => 
      current.mood > best.mood ? current : best
    );
    const worstEntry = recentMoods.reduce((worst, current) => 
      current.mood < worst.mood ? current : worst
    );

    // Most common mood
    const moodCounts = recentMoods.reduce((counts, entry) => {
      counts[entry.mood] = (counts[entry.mood] || 0) + 1;
      return counts;
    }, {} as Record<number, number>);
    const mostCommonMood = Object.entries(moodCounts).reduce((a, b) => 
      moodCounts[a[0]] > moodCounts[b[0]] ? a : b
    )[0];

    return {
      averageMood: Math.round(averageMood * 10) / 10,
      moodTrend,
      bestDay: bestEntry.timestamp.toLocaleDateString('en-US', { weekday: 'short' }),
      worstDay: worstEntry.timestamp.toLocaleDateString('en-US', { weekday: 'short' }),
      mostCommonMood: parseInt(mostCommonMood)
    };
  };

  const toggleActivity = (activity: string) => {
    setSelectedActivities(prev => 
      prev.includes(activity) 
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const patterns = getMoodPatterns();
  const currentMoodOption = moodOptions.find(option => option.value === currentMood);

  return (
    <motion.div 
      className="p-6 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 backdrop-blur-sm"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div 
            className="p-3 rounded-xl bg-yellow-500/20"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Smile className="w-6 h-6 text-yellow-400" />
          </motion.div>
          <div>
            <h3 className="font-bold text-white text-lg">Today's Mood</h3>
            <p className="text-sm text-gray-400">Track your emotional well-being</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-yellow-400">
            {currentMood ? `${currentMood}/5` : '--'}
          </div>
          <div className="text-xs text-gray-400">Current</div>
        </div>
      </div>

      {/* Current Mood Display */}
      {currentMood && currentMoodOption && (
        <motion.div 
          className="mb-6 p-4 bg-white/5 rounded-lg border border-yellow-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`text-4xl bg-gradient-to-r ${currentMoodOption.color} bg-clip-text text-transparent`}>
                {currentMoodOption.emoji}
              </div>
              <div>
                <div className="text-white font-bold">{currentMoodOption.label}</div>
                <div className="text-sm text-gray-400">{formatDate(new Date())}</div>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
          
          {moodNote && (
            <div className="text-sm text-gray-300 mb-3">
              "{moodNote}"
            </div>
          )}

          {/* Mood Metrics */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-400 mb-1">Energy Level</div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`w-3 h-3 rounded-full ${
                      level <= energyLevel ? 'bg-green-400' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Stress Level</div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`w-3 h-3 rounded-full ${
                      level <= stressLevel ? 'bg-red-400' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Add/Edit Mood Section */}
      {(isAdding || isEditing) && (
        <motion.div 
          className="mb-6 p-4 bg-white/5 rounded-lg border border-yellow-500/20"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-medium">
              {isEditing ? 'Edit Today\'s Mood' : 'How are you feeling?'}
            </h4>
            <button
              onClick={() => {
                setIsAdding(false);
                setIsEditing(false);
                setSelectedMood(null);
                setMoodNote('');
                setSelectedActivities([]);
                setEnergyLevel(3);
                setStressLevel(3);
              }}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mood Selection */}
          <div className="mb-4">
            <div className="text-sm text-gray-400 mb-2">Select your mood:</div>
            <div className="grid grid-cols-5 gap-2">
              {moodOptions.map((option) => (
                <motion.button
                  key={option.value}
                  onClick={() => setSelectedMood(option.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedMood === option.value
                      ? `border-yellow-500 ${option.bgColor}`
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-2xl mb-1">{option.emoji}</div>
                  <div className="text-xs text-white">{option.label}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Mood Note */}
          <div className="mb-4">
            <div className="text-sm text-gray-400 mb-2">Add a note (optional):</div>
            <textarea
              value={moodNote}
              onChange={(e) => setMoodNote(e.target.value)}
              placeholder="How are you feeling? What's on your mind?"
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 resize-none"
              rows={3}
            />
          </div>

          {/* Activity Tags */}
          <div className="mb-4">
            <div className="text-sm text-gray-400 mb-2">What influenced your mood today?</div>
            <div className="flex flex-wrap gap-2">
              {activityOptions.map((activity) => (
                <motion.button
                  key={activity}
                  onClick={() => toggleActivity(activity)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedActivities.includes(activity)
                      ? 'bg-yellow-500/30 text-yellow-200 border border-yellow-500/50'
                      : 'bg-white/10 text-gray-400 hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {activity}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Energy and Stress Levels */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm text-gray-400 mb-2">Energy Level</div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => setEnergyLevel(level)}
                    className={`w-6 h-6 rounded-full transition-all ${
                      level <= energyLevel ? 'bg-green-400' : 'bg-gray-600'
                    } hover:scale-110`}
                  />
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-2">Stress Level</div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => setStressLevel(level)}
                    className={`w-6 h-6 rounded-full transition-all ${
                      level <= stressLevel ? 'bg-red-400' : 'bg-gray-600'
                    } hover:scale-110`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <motion.button
            onClick={isEditing ? updateMoodEntry : addMoodEntry}
            disabled={selectedMood === null}
            className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-medium rounded-lg transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Save className="w-4 h-4 inline mr-2" />
            {isEditing ? 'Update Mood' : 'Save Mood'}
          </motion.button>
        </motion.div>
      )}

      {/* Add Mood Button */}
      {!currentMood && !isAdding && (
        <motion.button
          onClick={() => setIsAdding(true)}
          className="w-full p-4 border-2 border-dashed border-yellow-500/30 rounded-xl text-yellow-400 hover:border-yellow-500/50 hover:bg-yellow-500/10 transition-all mb-6"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            <span>Log Today's Mood</span>
          </div>
        </motion.button>
      )}

      {/* Mood Patterns */}
      {moodHistory.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-400">Weekly Patterns</div>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              {showHistory ? 'Hide History' : 'Show History'}
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-gray-400 mb-1">Average Mood</div>
              <div className="text-white font-bold">{patterns.averageMood}/5</div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-gray-400 mb-1">Trend</div>
              <div className="flex items-center gap-1">
                {patterns.moodTrend === 'improving' && <TrendingUp className="w-4 h-4 text-green-400" />}
                {patterns.moodTrend === 'declining' && <TrendingDown className="w-4 h-4 text-red-400" />}
                {patterns.moodTrend === 'stable' && <Activity className="w-4 h-4 text-gray-400" />}
                <span className="text-white font-bold capitalize">{patterns.moodTrend}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mood History */}
      {showHistory && moodHistory.length > 0 && (
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          <div className="text-sm text-gray-400 mb-3">Recent Mood History:</div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {moodHistory.slice(0, 7).map((entry) => {
              const moodOption = moodOptions.find(option => option.value === entry.mood);
              return (
                <motion.div
                  key={entry.id}
                  className="p-3 bg-white/5 border border-white/10 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{moodOption?.emoji}</div>
                      <div>
                        <div className="text-white font-medium">{moodOption?.label}</div>
                        <div className="text-xs text-gray-400">{formatDate(entry.timestamp)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-white">{entry.mood}/5</div>
                      {entry.activities && entry.activities.length > 0 && (
                        <div className="text-xs text-gray-400">
                          {entry.activities.slice(0, 2).join(', ')}
                          {entry.activities.length > 2 && '...'}
                        </div>
                      )}
                    </div>
                  </div>
                  {entry.note && (
                    <div className="text-sm text-gray-300 mt-2 italic">
                      "{entry.note}"
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Mood Tips */}
      <div className="mt-4 p-3 bg-white/5 rounded-lg">
        <div className="text-xs text-gray-400 mb-1">Wellness Tip:</div>
        <div className="text-sm text-white">
          Regular mood tracking helps identify patterns and triggers. Notice what activities boost your mood and what drains your energy.
        </div>
      </div>
    </motion.div>
  );
} 