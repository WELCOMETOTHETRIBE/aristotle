'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Frown, Meh, Heart, Activity, TrendingUp, Calendar, Sparkles, Sun, Cloud, CloudRain, Wind } from 'lucide-react';

interface MoodData {
  mood: number;
  note: string;
  energy: number;
  stress: number;
  activities: string[];
  weather?: string;
  timestamp: Date;
}

interface MoodTrackerWidgetProps {
  frameworkTone?: string;
}

const moodOptions = [
  { value: 1, label: 'Very Low', icon: <Frown className="w-6 h-6" />, color: 'from-red-500 to-pink-500', emoji: '😢' },
  { value: 2, label: 'Low', icon: <Frown className="w-6 h-6" />, color: 'from-orange-500 to-red-500', emoji: '😕' },
  { value: 3, label: 'Neutral', icon: <Meh className="w-6 h-6" />, color: 'from-yellow-500 to-orange-500', emoji: '😐' },
  { value: 4, label: 'Good', icon: <Smile className="w-6 h-6" />, color: 'from-green-500 to-yellow-500', emoji: '😊' },
  { value: 5, label: 'Excellent', icon: <Heart className="w-6 h-6" />, color: 'from-blue-500 to-green-500', emoji: '😄' },
];

const activityOptions = [
  'Exercise', 'Meditation', 'Reading', 'Work', 'Social', 'Nature', 'Music', 'Cooking', 'Sleep', 'Creative'
];

const weatherOptions = [
  { value: 'sunny', icon: <Sun className="w-4 h-4" />, label: 'Sunny' },
  { value: 'cloudy', icon: <Cloud className="w-4 h-4" />, label: 'Cloudy' },
  { value: 'rainy', icon: <CloudRain className="w-4 h-4" />, label: 'Rainy' },
  { value: 'windy', icon: <Wind className="w-4 h-4" />, label: 'Windy' },
];

export function MoodTrackerWidget({ frameworkTone = "stoic" }: MoodTrackerWidgetProps) {
  const [moodData, setMoodData] = useState<MoodData | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [energy, setEnergy] = useState(3);
  const [stress, setStress] = useState(3);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedWeather, setSelectedWeather] = useState<string>('');
  const [showHistory, setShowHistory] = useState(false);
  const [moodHistory, setMoodHistory] = useState<MoodData[]>([]);

  // Load saved mood data from localStorage
  useEffect(() => {
    const savedMoodData = localStorage.getItem('moodTrackerData');
    const savedHistory = localStorage.getItem('moodTrackerHistory');
    
    if (savedMoodData) {
      const parsed = JSON.parse(savedMoodData);
      setMoodData({ ...parsed, timestamp: new Date(parsed.timestamp) });
    }
    
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      setMoodHistory(parsed.map((item: any) => ({ ...item, timestamp: new Date(item.timestamp) })));
    }
  }, []);

  const saveMoodData = (data: MoodData) => {
    setMoodData(data);
    setMoodHistory(prev => [data, ...prev.slice(0, 29)]); // Keep last 30 entries
    
    localStorage.setItem('moodTrackerData', JSON.stringify(data));
    localStorage.setItem('moodTrackerHistory', JSON.stringify([data, ...moodHistory.slice(0, 29)]));
  };

  const addMoodEntry = () => {
    if (selectedMood === null) return;

    const newMoodData: MoodData = {
      mood: selectedMood,
      note: note.trim(),
      energy,
      stress,
      activities: selectedActivities,
      weather: selectedWeather || undefined,
      timestamp: new Date()
    };

    saveMoodData(newMoodData);
    
    // Reset form
    setSelectedMood(null);
    setNote('');
    setEnergy(3);
    setStress(3);
    setSelectedActivities([]);
    setSelectedWeather('');
    setIsAdding(false);
  };

  const toggleActivity = (activity: string) => {
    setSelectedActivities(prev => 
      prev.includes(activity) 
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const getMoodColor = (mood: number) => {
    const moodOption = moodOptions.find(m => m.value === mood);
    return moodOption ? moodOption.color : 'from-gray-500 to-gray-600';
  };

  const getAverageMood = () => {
    if (moodHistory.length === 0) return 0;
    const sum = moodHistory.reduce((acc, entry) => acc + entry.mood, 0);
    return Math.round(sum / moodHistory.length);
  };

  const getMoodTrend = () => {
    if (moodHistory.length < 2) return 'stable';
    const recent = moodHistory.slice(0, 3).reduce((acc, entry) => acc + entry.mood, 0) / 3;
    const older = moodHistory.slice(3, 6).reduce((acc, entry) => acc + entry.mood, 0) / 3;
    return recent > older ? 'improving' : recent < older ? 'declining' : 'stable';
  };

  return (
    <motion.div 
      className="p-6 rounded-xl bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20 backdrop-blur-sm"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div 
            className="p-3 rounded-xl bg-pink-500/20"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Smile className="w-6 h-6 text-pink-400" />
          </motion.div>
          <div>
            <h3 className="font-bold text-white text-lg">Mood Tracker</h3>
            <p className="text-sm text-gray-400">Track your feelings</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-pink-400">{moodHistory.length}</div>
          <div className="text-xs text-gray-400">Entries</div>
        </div>
      </div>

      {/* Current Mood Display */}
      {moodData && !isAdding && (
        <motion.div 
          className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{moodOptions.find(m => m.value === moodData.mood)?.emoji}</div>
              <div>
                <div className="font-medium text-white">
                  {moodOptions.find(m => m.value === moodData.mood)?.label}
                </div>
                <div className="text-sm text-gray-400">
                  {moodData.timestamp.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Energy: {moodData.energy}/5</div>
              <div className="text-sm text-gray-400">Stress: {moodData.stress}/5</div>
            </div>
          </div>
          
          {moodData.note && (
            <div className="text-sm text-gray-300 italic">"{moodData.note}"</div>
          )}
          
          {moodData.activities.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {moodData.activities.map((activity, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-pink-500/20 text-pink-300 text-xs rounded-full"
                >
                  {activity}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Add Mood Entry */}
      {!isAdding ? (
        <motion.button
          onClick={() => setIsAdding(true)}
          className="w-full p-4 border-2 border-dashed border-pink-500/30 rounded-xl text-pink-400 hover:border-pink-500/50 hover:bg-pink-500/10 transition-all mb-6"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            <span>Add Mood Entry</span>
          </div>
        </motion.button>
      ) : (
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Mood Selection */}
          <div className="mb-4">
            <div className="text-sm text-gray-400 mb-3">How are you feeling?</div>
            <div className="grid grid-cols-5 gap-2">
              {moodOptions.map((mood) => (
                <motion.button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`p-3 rounded-lg text-center transition-all ${
                    selectedMood === mood.value
                      ? `bg-gradient-to-br ${mood.color} text-white border border-white/30`
                      : 'bg-white/10 text-gray-400 hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-2xl mb-1">{mood.emoji}</div>
                  <div className="text-xs">{mood.label}</div>
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
                    onClick={() => setEnergy(level)}
                    className={`w-8 h-8 rounded-full transition-all ${
                      energy >= level ? 'bg-yellow-500 text-white' : 'bg-white/10 text-gray-400'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-2">Stress Level</div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => setStress(level)}
                    className={`w-8 h-8 rounded-full transition-all ${
                      stress >= level ? 'bg-red-500 text-white' : 'bg-white/10 text-gray-400'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Activities */}
          <div className="mb-4">
            <div className="text-sm text-gray-400 mb-2">Activities (optional)</div>
            <div className="flex flex-wrap gap-2">
              {activityOptions.map((activity) => (
                <motion.button
                  key={activity}
                  onClick={() => toggleActivity(activity)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedActivities.includes(activity)
                      ? 'bg-pink-500/30 text-pink-200 border border-pink-500/50'
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

          {/* Weather */}
          <div className="mb-4">
            <div className="text-sm text-gray-400 mb-2">Weather (optional)</div>
            <div className="flex gap-2">
              {weatherOptions.map((weather) => (
                <motion.button
                  key={weather.value}
                  onClick={() => setSelectedWeather(weather.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    selectedWeather === weather.value
                      ? 'bg-blue-500/30 text-blue-200 border border-blue-500/50'
                      : 'bg-white/10 text-gray-400 hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {weather.icon}
                  {weather.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="mb-4">
            <div className="text-sm text-gray-400 mb-2">Note (optional)</div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="How are you feeling today?"
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm resize-none"
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <motion.button
              onClick={addMoodEntry}
              disabled={selectedMood === null}
              className="flex-1 px-4 py-2 bg-pink-500 hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Save Entry
            </motion.button>
            <motion.button
              onClick={() => {
                setIsAdding(false);
                setSelectedMood(null);
                setNote('');
                setEnergy(3);
                setStress(3);
                setSelectedActivities([]);
                setSelectedWeather('');
              }}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Mood Stats */}
      {moodHistory.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-400">Mood Stats</div>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-sm text-pink-400 hover:text-pink-300 transition-colors"
            >
              {showHistory ? 'Hide History' : 'Show History'}
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-lg font-bold text-white">{getAverageMood()}/5</div>
              <div className="text-xs text-gray-400">Avg Mood</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-lg font-bold text-white">{moodHistory.length}</div>
              <div className="text-xs text-gray-400">Entries</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-lg font-bold text-white capitalize">{getMoodTrend()}</div>
              <div className="text-xs text-gray-400">Trend</div>
            </div>
          </div>

          {/* Mood History */}
          <AnimatePresence>
            {showHistory && (
              <motion.div 
                className="space-y-2 max-h-40 overflow-y-auto"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                {moodHistory.slice(0, 5).map((entry, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="text-lg">{moodOptions.find(m => m.value === entry.mood)?.emoji}</div>
                      <div className="text-sm text-white">
                        {moodOptions.find(m => m.value === entry.mood)?.label}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {entry.timestamp.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Mood Tips */}
      <div className="p-3 bg-white/5 rounded-lg">
        <div className="text-xs text-gray-400 mb-1">Mood Tip:</div>
        <div className="text-sm text-white">
          Regular mood tracking helps identify patterns and triggers for better emotional well-being.
        </div>
      </div>
    </motion.div>
  );
} 