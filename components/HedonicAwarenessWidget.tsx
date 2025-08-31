'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Brain, TrendingUp, TrendingDown, Activity, Sparkles, Target, AlertTriangle, CheckCircle, Clock, BarChart3, Lightbulb } from 'lucide-react';

interface HedonicEntry {
  id: string;
  activity: string;
  category: 'pleasure' | 'meaning' | 'neutral';
  intensity: number;
  duration: number;
  reflection: string;
  timestamp: Date;
  triggers?: string[];
  consequences?: string;
}

interface HedonicPattern {
  pleasureRatio: number;
  meaningRatio: number;
  averageIntensity: number;
  commonTriggers: string[];
  riskLevel: 'low' | 'medium' | 'high';
  trend: 'improving' | 'declining' | 'stable';
}

interface HedonicAwarenessWidgetProps {
  frameworkTone?: string;
}

const activityCategories = [
  { value: 'pleasure', label: 'Pleasure', icon: <Heart className="w-4 h-4" />, color: 'from-pink-500 to-rose-500', bgColor: 'bg-pink-500/20', textColor: 'text-pink-400' },
  { value: 'meaning', label: 'Meaning', icon: <Brain className="w-4 h-4" />, color: 'from-blue-500 to-indigo-500', bgColor: 'bg-blue-500/20', textColor: 'text-blue-400' },
  { value: 'neutral', label: 'Neutral', icon: <Activity className="w-4 h-4" />, color: 'from-gray-500 to-slate-500', bgColor: 'bg-gray-500/20', textColor: 'text-gray-400' },
];

const commonTriggers = [
  'Stress', 'Boredom', 'Social Media', 'Food', 'Shopping', 'Work', 'Exercise', 'Sleep', 'Social', 'Alone Time'
];

const intensityLevels = [
  { value: 1, label: 'Very Low', color: 'from-green-500 to-emerald-500' },
  { value: 2, label: 'Low', color: 'from-blue-500 to-cyan-500' },
  { value: 3, label: 'Moderate', color: 'from-yellow-500 to-orange-500' },
  { value: 4, label: 'High', color: 'from-orange-500 to-red-500' },
  { value: 5, label: 'Very High', color: 'from-red-500 to-pink-500' },
];

export function HedonicAwarenessWidget({ frameworkTone = "stoic" }: HedonicAwarenessWidgetProps) {
  const [entries, setEntries] = useState<HedonicEntry[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'pleasure' | 'meaning' | 'neutral'>('pleasure');
  const [activity, setActivity] = useState('');
  const [intensity, setIntensity] = useState(3);
  const [duration, setDuration] = useState(30);
  const [reflection, setReflection] = useState('');
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [consequences, setConsequences] = useState('');
  const [showInsights, setShowInsights] = useState(false);

  // Load saved entries from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem('hedonicAwarenessEntries');
    if (savedEntries) {
      const parsed = JSON.parse(savedEntries);
      setEntries(parsed.map((entry: any) => ({ ...entry, timestamp: new Date(entry.timestamp) })));
    }
  }, []);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('hedonicAwarenessEntries', JSON.stringify(entries));
  }, [entries]);

  const addEntry = () => {
    if (!activity.trim()) return;

    const newEntry: HedonicEntry = {
      id: Date.now().toString(),
      activity: activity.trim(),
      category: selectedCategory,
      intensity,
      duration,
      reflection: reflection.trim(),
      timestamp: new Date(),
      triggers: selectedTriggers.length > 0 ? selectedTriggers : undefined,
      consequences: consequences.trim() || undefined,
    };

    setEntries(prev => [newEntry, ...prev.slice(0, 49)]); // Keep last 50 entries
    
    // Reset form
    setActivity('');
    setIntensity(3);
    setDuration(30);
    setReflection('');
    setSelectedTriggers([]);
    setConsequences('');
    setIsAdding(false);
  };

  const removeEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const toggleTrigger = (trigger: string) => {
    setSelectedTriggers(prev => 
      prev.includes(trigger) 
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    );
  };

  const getHedonicPatterns = (): HedonicPattern => {
    if (entries.length === 0) {
      return {
        pleasureRatio: 0,
        meaningRatio: 0,
        averageIntensity: 0,
        commonTriggers: [],
        riskLevel: 'low',
        trend: 'stable'
      };
    }

    const recentEntries = entries.slice(0, 10); // Last 10 entries
    const totalEntries = recentEntries.length;
    
    const pleasureCount = recentEntries.filter(e => e.category === 'pleasure').length;
    const meaningCount = recentEntries.filter(e => e.category === 'meaning').length;
    
    const averageIntensity = recentEntries.reduce((sum, entry) => sum + entry.intensity, 0) / totalEntries;
    
    // Count triggers
    const triggerCounts = recentEntries.reduce((counts, entry) => {
      entry.triggers?.forEach(trigger => {
        counts[trigger] = (counts[trigger] || 0) + 1;
      });
      return counts;
    }, {} as Record<string, number>);
    
    const commonTriggers = Object.entries(triggerCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([trigger]) => trigger);

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (pleasureCount / totalEntries > 0.7 && averageIntensity > 3.5) {
      riskLevel = 'high';
    } else if (pleasureCount / totalEntries > 0.5 && averageIntensity > 3) {
      riskLevel = 'medium';
    }

    // Determine trend
    const firstHalf = recentEntries.slice(0, Math.ceil(totalEntries / 2));
    const secondHalf = recentEntries.slice(Math.ceil(totalEntries / 2));
    const firstAvg = firstHalf.reduce((sum, entry) => sum + entry.intensity, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, entry) => sum + entry.intensity, 0) / secondHalf.length;
    
    let trend: 'improving' | 'declining' | 'stable' = 'stable';
    if (secondAvg < firstAvg - 0.5) trend = 'improving';
    else if (secondAvg > firstAvg + 0.5) trend = 'declining';

    return {
      pleasureRatio: Math.round((pleasureCount / totalEntries) * 100),
      meaningRatio: Math.round((meaningCount / totalEntries) * 100),
      averageIntensity: Math.round(averageIntensity * 10) / 10,
      commonTriggers,
      riskLevel,
      trend
    };
  };

  const patterns = getHedonicPatterns();

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'from-red-500 to-pink-500';
      case 'medium': return 'from-yellow-500 to-orange-500';
      default: return 'from-green-500 to-emerald-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingDown className="w-4 h-4 text-green-400" />;
      case 'declining': return <TrendingUp className="w-4 h-4 text-red-400" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <motion.div 
      className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-500/20 backdrop-blur-sm"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div 
            className="p-3 rounded-xl bg-purple-500/20"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Brain className="w-6 h-6 text-purple-400" />
          </motion.div>
          <div>
            <h3 className="font-bold text-white text-lg">Hedonic Awareness</h3>
            <p className="text-sm text-gray-400">Monitor your patterns</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-purple-400">{entries.length}</div>
          <div className="text-xs text-gray-400">Entries</div>
        </div>
      </div>

      {/* Risk Assessment */}
      {entries.length > 0 && (
        <motion.div 
          className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-purple-400" />
              <span className="font-medium text-white">Risk Assessment</span>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getRiskColor(patterns.riskLevel)} text-white`}>
              {patterns.riskLevel.toUpperCase()} RISK
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-white">{patterns.pleasureRatio}%</div>
              <div className="text-xs text-gray-400">Pleasure</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">{patterns.meaningRatio}%</div>
              <div className="text-xs text-gray-400">Meaning</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">{patterns.averageIntensity}</div>
              <div className="text-xs text-gray-400">Avg Intensity</div>
            </div>
          </div>

          {patterns.commonTriggers.length > 0 && (
            <div className="mt-3">
              <div className="text-xs text-gray-400 mb-1">Common Triggers:</div>
              <div className="flex flex-wrap gap-1">
                {patterns.commonTriggers.map((trigger, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full"
                  >
                    {trigger}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Add Entry */}
      {!isAdding ? (
        <motion.button
          onClick={() => setIsAdding(true)}
          className="w-full p-4 border-2 border-dashed border-purple-500/30 rounded-xl text-purple-400 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all mb-6"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            <span>Add Activity Entry</span>
          </div>
        </motion.button>
      ) : (
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Category Selection */}
          <div className="mb-4">
            <div className="text-sm text-gray-400 mb-3">Activity Category:</div>
            <div className="grid grid-cols-3 gap-2">
              {activityCategories.map((category) => (
                <motion.button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value as any)}
                  className={`p-3 rounded-lg text-center transition-all ${
                    selectedCategory === category.value
                      ? `bg-gradient-to-br ${category.color} text-white border border-white/30`
                      : 'bg-white/10 text-gray-400 hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="mb-1">{category.icon}</div>
                  <div className="text-xs">{category.label}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Activity Input */}
          <div className="mb-4">
            <div className="text-sm text-gray-400 mb-2">Activity:</div>
            <input
              type="text"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              placeholder="What activity did you engage in?"
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm"
            />
          </div>

          {/* Intensity Selection */}
          <div className="mb-4">
            <div className="text-sm text-gray-400 mb-2">Intensity Level:</div>
            <div className="grid grid-cols-5 gap-2">
              {intensityLevels.map((level) => (
                <motion.button
                  key={level.value}
                  onClick={() => setIntensity(level.value)}
                  className={`p-2 rounded-lg text-center transition-all ${
                    intensity === level.value
                      ? `bg-gradient-to-br ${level.color} text-white border border-white/30`
                      : 'bg-white/10 text-gray-400 hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-sm font-medium">{level.value}</div>
                  <div className="text-xs">{level.label}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="mb-4">
            <div className="text-sm text-gray-400 mb-2">Duration (minutes):</div>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
              min="1"
              max="480"
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
            />
          </div>

          {/* Triggers */}
          <div className="mb-4">
            <div className="text-sm text-gray-400 mb-2">Triggers (optional):</div>
            <div className="flex flex-wrap gap-2">
              {commonTriggers.map((trigger) => (
                <motion.button
                  key={trigger}
                  onClick={() => toggleTrigger(trigger)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedTriggers.includes(trigger)
                      ? 'bg-purple-500/30 text-purple-200 border border-purple-500/50'
                      : 'bg-white/10 text-gray-400 hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {trigger}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Reflection */}
          <div className="mb-4">
            <div className="text-sm text-gray-400 mb-2">Reflection:</div>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="How did this activity make you feel? What were the consequences?"
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm resize-none"
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <motion.button
              onClick={addEntry}
              disabled={!activity.trim()}
              className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Save Entry
            </motion.button>
            <motion.button
              onClick={() => {
                setIsAdding(false);
                setActivity('');
                setIntensity(3);
                setDuration(30);
                setReflection('');
                setSelectedTriggers([]);
                setConsequences('');
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

      {/* Recent Entries */}
      {entries.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-400">Recent Entries</div>
            <button
              onClick={() => setShowInsights(!showInsights)}
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              {showInsights ? 'Hide Insights' : 'Show Insights'}
            </button>
          </div>

          <AnimatePresence>
            {showInsights && (
              <motion.div 
                className="space-y-2 max-h-40 overflow-y-auto"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                {entries.slice(0, 5).map((entry, index) => {
                  const category = activityCategories.find(c => c.value === entry.category);
                  return (
                    <motion.div
                      key={entry.id}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${category?.bgColor}`}>
                          {category?.icon}
                        </div>
                        <div>
                          <div className="text-sm text-white font-medium">{entry.activity}</div>
                          <div className="text-xs text-gray-400">
                            {entry.timestamp.toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-white">{entry.intensity}/5</div>
                        <div className="text-xs text-gray-400">{entry.duration}m</div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Hedonic Tips */}
      <div className="p-3 bg-white/5 rounded-lg">
        <div className="text-xs text-gray-400 mb-1">Awareness Tip:</div>
        <div className="text-sm text-white">
          Notice patterns in your pleasure-seeking behaviors. Balance immediate gratification with long-term meaning and purpose.
        </div>
      </div>
    </motion.div>
  );
} 