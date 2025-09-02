"use client";
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { 
  Play, Pause, RotateCcw, Timer, Target, BookOpen, Heart, Brain, Zap, 
  Users, Sun, Moon, Coffee, Droplets, Dumbbell, CheckCircle,
  Clock, TrendingUp, Activity, Sparkles, Flame, Wind, Camera, Minus, Plus
} from 'lucide-react';
import { BreathworkWidgetNew } from './BreathworkWidgetNew';
import BalanceCard from './widgets/BalanceCard';

// ===== ENHANCED BREATHWORK WIDGET =====
interface BreathworkWidgetProps {
  frameworkTone?: string;
}

export function BreathworkWidget({ 
  frameworkTone = "stoic"
}: BreathworkWidgetProps) {
  return <BreathworkWidgetNew frameworkTone={frameworkTone} />;
}

// ===== FOCUS TIMER WIDGET =====
interface FocusTimerWidgetProps {
  frameworkTone?: string;
}

export function FocusTimerWidget({ frameworkTone = "stoic" }: FocusTimerWidgetProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes default
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentTask, setCurrentTask] = useState('');
  const [interruptions, setInterruptions] = useState(0);
  const [isLogging, setIsLogging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const focusDurations = [
    { value: 15, label: '15 min', color: 'text-green-400' },
    { value: 25, label: '25 min', color: 'text-blue-400' },
    { value: 45, label: '45 min', color: 'text-purple-400' },
    { value: 60, label: '60 min', color: 'text-red-400' }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setTimeLeft(25 * 60);
    setIsRunning(false);
    setIsCompleted(false);
    setInterruptions(0);
  };

  const setDuration = (minutes: number) => {
    setTimeLeft(minutes * 60);
    setIsRunning(false);
    setIsCompleted(false);
    setInterruptions(0);
  };

  const logFocusSession = async () => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      
      try {
        // Create focus log using the new journal system
        const { createFocusLog, logToJournal } = await import('@/lib/journal-logger');
        
        const sessionDuration = 25 * 60 - timeLeft; // Calculate actual duration
        
        const journalData = createFocusLog(
          Math.floor(sessionDuration / 60),
          currentTask || undefined,
          interruptions
        );

        const result = await logToJournal(journalData);
        
        if (result.success) {
          // Reset form
          setCurrentTask('');
          setInterruptions(0);
          setIsLogging(false);
          
          // Show success feedback
          console.log('✅ Focus session logged to journal:', result.message);
        } else {
          console.error('❌ Failed to log focus session:', result.error);
        }
      } catch (error) {
        console.error('Error logging focus session:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  const getProgressPercentage = () => {
    const totalTime = isCompleted ? (timeLeft + (interruptions * 10)) : timeLeft; // Adjust for interruptions
    return ((totalTime / (25 * 60)) * 100);
  };

  const getTechniqueColor = () => {
    switch (timeLeft) {
      case 15 * 60: return 'from-red-500/10 to-orange-500/10 border-red-500/20';
      case 25 * 60: return 'from-blue-500/10 to-purple-500/10 border-blue-500/20';
      case 45 * 60: return 'from-purple-500/10 to-indigo-500/10 border-purple-500/20';
      default: return 'from-blue-500/10 to-purple-500/10 border-blue-500/20';
    }
  };

  const getTechniqueIcon = () => {
    switch (timeLeft) {
      case 15 * 60: return <Timer className="w-6 h-6 text-red-400" />;
      case 25 * 60: return <Brain className="w-6 h-6 text-purple-400" />;
      case 45 * 60: return <Zap className="w-6 h-6 text-green-400" />;
      default: return <Target className="w-6 h-6 text-blue-400" />;
    }
  };

  return (
    <motion.div 
      className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div 
            className="p-3 rounded-xl bg-blue-500/20"
            animate={{ 
              scale: isRunning ? [1, 1.1, 1] : 1,
              rotate: isRunning ? 360 : 0
            }}
            transition={{ duration: 3, repeat: isRunning ? Infinity : 0, ease: "linear" }}
          >
            <Target className="w-6 h-6 text-blue-400" />
          </motion.div>
          <div>
            <h3 className="font-bold text-white text-lg">Focus Timer</h3>
            <p className="text-sm text-gray-400">
              {isCompleted ? 'Session Complete!' : isRunning ? 'Focusing...' : 'Deep work timer'}
            </p>
          </div>
        </div>
      </div>

      {/* Duration Selection */}
      <div className="mb-6">
        <div className="text-sm text-gray-400 mb-3">Focus Duration:</div>
        <div className="grid grid-cols-4 gap-2">
          {focusDurations.map((duration) => (
            <motion.button
              key={duration.value}
              onClick={() => setDuration(duration.value)}
              className={`p-3 rounded-lg border transition-all ${
                timeLeft === duration.value * 60
                  ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                  : 'border-white/20 bg-white/5 text-white hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-sm font-medium">{duration.label}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Task Input */}
      <div className="mb-6">
        <div className="text-sm text-gray-400 mb-2">What are you focusing on?</div>
        <input
          type="text"
          value={currentTask}
          onChange={(e) => setCurrentTask(e.target.value)}
          placeholder="Enter your focus task..."
          className="w-full p-3 bg-white/10 border border-blue-500/30 rounded-lg text-white placeholder-gray-400"
        />
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>Focus Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Timer Display */}
      <div className="text-center mb-6">
        <motion.div 
          className="text-5xl font-bold text-white mb-2"
          animate={{ 
            scale: isRunning ? [1, 1.05, 1] : 1,
            color: isRunning ? '#3b82f6' : '#ffffff'
          }}
          transition={{ duration: 1, repeat: isRunning ? Infinity : 0 }}
        >
          {formatTime(timeLeft)}
        </motion.div>
        <div className="text-sm text-gray-400">
          {isCompleted ? 'Session Complete!' : 'Focus Time'}
        </div>
      </div>

      {/* Interruption Counter */}
      <div className="mb-6 text-center">
        <div className="text-sm text-gray-400 mb-2">Interruptions:</div>
        <div className="flex items-center justify-center gap-2">
          <motion.button
            onClick={() => setInterruptions(prev => Math.max(0, prev - 1))}
            className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Minus className="w-4 h-4" />
          </motion.button>
          <span className="text-2xl font-bold text-white px-4">{interruptions}</span>
          <motion.button
            onClick={() => setInterruptions(prev => prev + 1)}
            className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Plus className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3 mb-6">
        {!isCompleted ? (
          <>
            {!isRunning ? (
              <motion.button
                onClick={startTimer}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  <span>Start Focus</span>
                </div>
              </motion.button>
            ) : (
              <motion.button
                onClick={pauseTimer}
                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-2">
                  <Pause className="w-5 h-5" />
                  <span>Pause</span>
                </div>
              </motion.button>
            )}
          </>
        ) : (
          <motion.button
            onClick={() => setIsLogging(true)}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Log Session</span>
            </div>
          </motion.button>
        )}
        
        <motion.button
          onClick={resetTimer}
          className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Logging Form */}
      {isLogging && (
        <motion.div 
          className="mb-6 p-4 bg-white/5 rounded-lg border border-blue-500/30"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="text-sm text-white mb-3">Log your focus session:</div>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-400 mb-1">Task:</div>
              <input
                type="text"
                value={currentTask}
                onChange={(e) => setCurrentTask(e.target.value)}
                placeholder="What did you focus on?"
                className="w-full p-2 bg-white/10 border border-blue-500/30 rounded text-white placeholder-gray-400 text-sm"
              />
            </div>
            <div className="flex justify-center gap-3">
              <motion.button
                onClick={logFocusSession}
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm rounded transition-colors"
                whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
              >
                {isSubmitting ? 'Saving...' : 'Save Session'}
              </motion.button>
              <motion.button
                onClick={() => setIsLogging(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Focus Tips */}
      <div className="mt-4 p-3 bg-white/5 rounded-lg">
        <div className="text-xs text-gray-400 mb-1">Focus Tip:</div>
        <div className="text-sm text-white">
          Deep focus builds concentration and creates meaningful progress in your work.
        </div>
      </div>
    </motion.div>
  );
}

// ===== ENHANCED GRATITUDE JOURNAL WIDGET =====
interface GratitudeJournalWidgetProps {
  frameworkTone?: string;
}

export function GratitudeJournalWidget({ frameworkTone = "stoic" }: GratitudeJournalWidgetProps) {
  const [entries, setEntries] = useState<string[]>([]);
  const [currentEntry, setCurrentEntry] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load saved entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('gratitudeJournalEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('gratitudeJournalEntries', JSON.stringify(entries));
  }, [entries]);

  const prompts = [
    "What am I grateful for today?",
    "Who made a positive impact on my life?",
    "What challenge am I grateful for overcoming?",
    "What beauty did I notice today?",
    "What skill or ability am I thankful for?",
    "What moment brought me joy today?"
  ];

  const addEntry = async () => {
    if (currentEntry.trim() && !isSubmitting) {
      setIsSubmitting(true);
      
      try {
        // Create gratitude log using the new journal system
        const { createGratitudeLog, logToJournal } = await import('@/lib/journal-logger');
        
        const journalData = createGratitudeLog(
          currentEntry.trim(),
          prompts[selectedPrompt]
        );

        const result = await logToJournal(journalData);
        
        if (result.success) {
          // Add to local state
          setEntries(prev => [currentEntry.trim(), ...prev.slice(0, 4)]);
          setCurrentEntry('');
          setIsAdding(false);
          
          // Show success feedback
          console.log('✅ Gratitude entry logged to journal:', result.message);
        } else {
          console.error('❌ Failed to log gratitude entry:', result.error);
        }
      } catch (error) {
        console.error('Error logging gratitude entry:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const removeEntry = (index: number) => {
    setEntries(prev => prev.filter((_, i) => i !== index));
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

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
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Heart className="w-6 h-6 text-yellow-400" />
          </motion.div>
          <div>
            <h3 className="font-bold text-white text-lg">Gratitude Journal</h3>
            <p className="text-sm text-gray-400">{formatDate()}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-yellow-400">{entries.length}</div>
          <div className="text-xs text-gray-400">Entries</div>
        </div>
      </div>

      {/* Prompt Selector */}
      <div className="mb-6">
        <div className="text-sm text-gray-400 mb-2">Today's Prompt:</div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {prompts.map((prompt, index) => (
            <motion.button
              key={index}
              onClick={() => setSelectedPrompt(index)}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedPrompt === index
                  ? 'bg-yellow-500/30 text-yellow-200 border border-yellow-500/50'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {prompt}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Add Entry */}
      {!isAdding ? (
        <motion.button
          onClick={() => setIsAdding(true)}
          className="w-full p-4 border-2 border-dashed border-yellow-500/30 rounded-xl text-yellow-400 hover:border-yellow-500/50 hover:bg-yellow-500/10 transition-all mb-6"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            <span>Add Gratitude Entry</span>
          </div>
        </motion.button>
      ) : (
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-sm text-gray-400 mb-2">{prompts[selectedPrompt]}</div>
          <textarea
            value={currentEntry}
            onChange={(e) => setCurrentEntry(e.target.value)}
            placeholder="Write your gratitude entry..."
            className="w-full p-3 bg-white/10 border border-yellow-500/30 rounded-lg text-white placeholder-gray-400 resize-none"
            rows={3}
            autoFocus
          />
          <div className="flex gap-2 mt-3">
            <motion.button
              onClick={addEntry}
              disabled={!currentEntry.trim() || isSubmitting}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-medium rounded-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Save
            </motion.button>
            <motion.button
              onClick={() => {
                setIsAdding(false);
                setCurrentEntry('');
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

      {/* Entries List */}
      <div className="space-y-3">
        <div className="text-sm text-gray-400 mb-2">Recent Entries:</div>
        {entries.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Heart className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No entries yet. Start your gratitude practice!</p>
          </div>
        ) : (
          <AnimatePresence>
            {entries.map((entry, index) => (
              <motion.div
                key={index}
                className="p-3 bg-white/5 border border-yellow-500/20 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-between items-start gap-3">
                  <p className="text-white text-sm flex-1">{entry}</p>
                  <motion.button
                    onClick={() => removeEntry(index)}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ×
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Gratitude Tips */}
      <div className="mt-4 p-3 bg-white/5 rounded-lg">
        <div className="text-xs text-gray-400 mb-1">Practice Tip:</div>
        <div className="text-sm text-white">
          Write 3 things you're grateful for each day. This simple practice can transform your perspective and increase happiness.
        </div>
      </div>
    </motion.div>
  );
}

// ===== MOVEMENT WIDGET =====
interface MovementWidgetProps {
  frameworkTone?: string;
}

export function MovementWidget({ frameworkTone = "stoic" }: MovementWidgetProps) {
  const [selectedActivity, setSelectedActivity] = useState('walking');
  const [duration, setDuration] = useState(30);
  const [intensity, setIntensity] = useState('moderate');
  const [notes, setNotes] = useState('');
  const [isLogging, setIsLogging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activities = [
    { id: 'walking', name: 'Walking', icon: '🚶', color: 'text-green-400' },
    { id: 'running', name: 'Running', icon: '🏃', color: 'text-blue-400' },
    { id: 'cycling', name: 'Cycling', icon: '🚴', color: 'text-yellow-400' },
    { id: 'swimming', name: 'Swimming', icon: '🏊', color: 'text-cyan-400' },
    { id: 'yoga', name: 'Yoga', icon: '🧘', color: 'text-purple-400' },
    { id: 'strength', name: 'Strength Training', icon: '💪', color: 'text-red-400' }
  ];

  const intensityLevels = [
    { value: 'light', label: 'Light', color: 'text-green-400' },
    { value: 'moderate', label: 'Moderate', color: 'text-yellow-400' },
    { value: 'vigorous', label: 'Vigorous', color: 'text-red-400' }
  ];

  const logMovement = async () => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      
      try {
        // Create movement log using the new journal system
        const { createMovementLog, logToJournal } = await import('@/lib/journal-logger');
        
        const activityName = activities.find(a => a.id === selectedActivity)?.name || selectedActivity;
        
        const journalData = createMovementLog(
          activityName,
          duration,
          intensity,
          notes || undefined
        );

        const result = await logToJournal(journalData);
        
        if (result.success) {
          // Reset form
          setDuration(30);
          setIntensity('moderate');
          setNotes('');
          setIsLogging(false);
          
          // Show success feedback
          console.log('✅ Movement logged to journal:', result.message);
        } else {
          console.error('❌ Failed to log movement:', result.error);
        }
      } catch (error) {
        console.error('Error logging movement:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <motion.div 
      className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 backdrop-blur-sm"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div 
            className="p-3 rounded-xl bg-green-500/20"
            animate={{ 
              scale: isLogging ? [1, 1.1, 1] : 1,
              rotate: isLogging ? [0, 5, -5, 0] : 0
            }}
            transition={{ duration: 1, repeat: isLogging ? Infinity : 0 }}
          >
            <Dumbbell className="w-6 h-6 text-green-400" />
          </motion.div>
          <div>
            <h3 className="font-bold text-white text-lg">Movement</h3>
            <p className="text-sm text-gray-400">
              {isLogging ? 'Logging activity...' : 'Track your movement'}
            </p>
          </div>
        </div>
      </div>

      {/* Activity Selection */}
      <div className="mb-6">
        <div className="text-sm text-gray-400 mb-3">Select Activity:</div>
        <div className="grid grid-cols-3 gap-2">
          {activities.map((activity) => (
            <motion.button
              key={activity.id}
              onClick={() => setSelectedActivity(activity.id)}
              className={`p-3 rounded-lg border transition-all ${
                selectedActivity === activity.id
                  ? 'border-green-500 bg-green-500/20 text-green-400'
                  : 'border-white/20 bg-white/5 text-white hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-2xl mb-1">{activity.icon}</div>
              <div className="text-xs">{activity.name}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Duration and Intensity */}
      <div className="mb-6 space-y-4">
        <div>
          <div className="text-sm text-gray-400 mb-2">Duration (minutes):</div>
          <input
            type="range"
            min="5"
            max="120"
            step="5"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-white font-medium">{duration} min</div>
        </div>

        <div>
          <div className="text-sm text-gray-400 mb-2">Intensity:</div>
          <div className="flex gap-2">
            {intensityLevels.map((level) => (
              <motion.button
                key={level.value}
                onClick={() => setIntensity(level.value)}
                className={`px-3 py-2 rounded-lg border transition-all ${
                  intensity === level.value
                    ? 'border-green-500 bg-green-500/20 text-green-400'
                    : 'border-white/20 bg-white/5 text-white hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {level.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="mb-6">
        <div className="text-sm text-gray-400 mb-2">Notes:</div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How did this activity feel?"
          className="w-full p-3 bg-white/10 border border-green-500/30 rounded-lg text-white placeholder-gray-400 resize-none"
          rows={3}
        />
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3 mb-6">
        {!isLogging ? (
          <motion.button
            onClick={() => setIsLogging(true)}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              <span>Log Activity</span>
            </div>
          </motion.button>
        ) : (
          <motion.button
            onClick={logMovement}
            disabled={isSubmitting}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-semibold rounded-xl transition-all"
            whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
          >
            <div className="flex items-center gap-2">
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Save Activity</span>
                </>
              )}
            </div>
          </motion.button>
        )}
        
        <motion.button
          onClick={() => {
            setDuration(30);
            setIntensity('moderate');
            setNotes('');
            setIsLogging(false);
          }}
          className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Reset
        </motion.button>
      </div>

      {/* Movement Tips */}
      <div className="mt-4 p-3 bg-white/5 rounded-lg">
        <div className="text-xs text-gray-400 mb-1">Movement Tip:</div>
        <div className="text-sm text-white">
          Regular movement nourishes both body and mind, creating energy and clarity.
        </div>
      </div>
    </motion.div>
  );
}

// ===== HYDRATION WIDGET =====
interface HydrationWidgetProps {
  frameworkTone?: string;
}

export function HydrationWidget({ frameworkTone = "stoic" }: HydrationWidgetProps) {
  const [currentHydration, setCurrentHydration] = useState(0);
  const [targetHydration, setTargetHydration] = useState(2500);
  const [isAdding, setIsAdding] = useState(false);
  const [amount, setAmount] = useState(250);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load saved hydration from localStorage on component mount
  useEffect(() => {
    const savedHydration = localStorage.getItem('dailyHydration');
    if (savedHydration) {
      setCurrentHydration(parseInt(savedHydration));
    }
  }, []);

  // Save hydration to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('dailyHydration', JSON.stringify(currentHydration));
  }, [currentHydration]);

  const addHydration = async () => {
    if (amount > 0 && !isSubmitting) {
      setIsSubmitting(true);
      
      try {
        // Create hydration log using the new journal system
        const { createHydrationLog, logToJournal } = await import('@/lib/journal-logger');
        
        const journalData = createHydrationLog(
          amount,
          'ml',
          currentHydration + amount
        );

        const result = await logToJournal(journalData);
        
        if (result.success) {
          // Update local state
          setCurrentHydration(prev => prev + amount);
          setIsAdding(false);
          setAmount(250);
          
          // Show success feedback
          console.log('✅ Hydration logged to journal:', result.message);
        } else {
          console.error('❌ Failed to log hydration:', result.error);
        }
      } catch (error) {
        console.error('Error logging hydration:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getProgressPercentage = () => {
    return Math.min((currentHydration / targetHydration) * 100, 100);
  };

  const getWaterLevel = () => {
    const percentage = getProgressPercentage();
    if (percentage >= 100) return "Full";
    if (percentage >= 75) return "Almost Full";
    if (percentage >= 50) return "Half Full";
    if (percentage >= 25) return "Quarter Full";
    return "Empty";
  };

  return (
    <motion.div 
      className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 backdrop-blur-sm"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div 
            className="p-3 rounded-xl bg-blue-500/20"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Droplets className="w-6 h-6 text-blue-400" />
          </motion.div>
          <div>
            <h3 className="font-bold text-white text-lg">Hydration</h3>
            <p className="text-sm text-gray-400">Daily water intake</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-400">{currentHydration}</div>
          <div className="text-xs text-gray-400">ml</div>
          <button
            onClick={() => setIsAdding(true)}
            className="text-xs text-blue-300 hover:text-blue-200 mt-1 underline"
          >
            Add Water
          </button>
        </div>
      </div>

      {/* Water Level Visualization */}
      <div className="flex justify-center mb-6">
        <div className="relative w-24 h-32">
          <div className="w-full h-full border-4 border-blue-400/30 rounded-lg bg-blue-500/10 overflow-hidden">
            <motion.div
              className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-cyan-400"
              initial={{ height: 0 }}
              animate={{ height: `${getProgressPercentage()}%` }}
              transition={{ duration: 0.5 }}
              style={{ 
                maxHeight: '100%',
                borderRadius: '0 0 4px 4px'
              }}
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-2xl">💧</div>
              <div className="text-xs text-white font-medium">{getWaterLevel()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>Daily Goal</span>
          <span>{Math.round(getProgressPercentage())}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div 
            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${getProgressPercentage()}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="text-center text-sm text-gray-400 mt-1">
          {currentHydration} / {targetHydration} ml
        </div>
      </div>

      {/* Add Water Form */}
      {isAdding && (
        <motion.div 
          className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="text-sm text-white mb-3">Add Water</div>
          <div className="flex items-center gap-3 mb-3">
            <input
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
              className="flex-1"
            />
            <span className="text-white font-medium min-w-[3rem]">ml</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={addHydration}
              disabled={amount <= 0 || isSubmitting}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Quick Add Buttons */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {[250, 500, 1000].map((amount) => (
          <motion.button
            key={amount}
            onClick={() => setAmount(amount)}
            className="p-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-white font-medium transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            +{amount} ml
          </motion.button>
        ))}
      </div>

      {/* Hydration Tips */}
      <div className="mt-4 p-3 bg-white/5 rounded-lg">
        <div className="text-xs text-gray-400 mb-1">Hydration Tip:</div>
        <div className="text-sm text-white">
          Aim for 2.5L (2500ml) of water daily. Listen to your body and drink when thirsty.
        </div>
      </div>
    </motion.div>
  );
}

// ===== NATURE PHOTO LOG WIDGET =====
interface NaturePhotoLogWidgetProps {
  frameworkTone?: string;
}

interface NaturePhoto {
  id: number;
  imagePath: string;
  caption: string;
  tags: string[];
  location?: string;
  date: Date;
  weather?: string;
  mood?: string;
  aiInsights?: string;
  aiComment?: string;
}

export function NaturePhotoLogWidget({ frameworkTone = "stewardship" }: NaturePhotoLogWidgetProps) {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<NaturePhoto[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState('');
  const [mood, setMood] = useState('');
  const [showGallery, setShowGallery] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<NaturePhoto | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [shareToCommunity, setShareToCommunity] = useState(false);

  const availableTags = [
    'dawn','sunrise','morning','midday','afternoon','dusk','sunset','night','stars','moon',
    'tree','forest','leaf','flower','grass','moss','mushroom',
    'water','river','stream','lake','ocean','wave','waterfall','rain','snow','ice',
    'sky','clouds','fog','mist','storm','lightning','rainbow',
    'mountain','hill','valley','meadow','desert','beach','coast','cliff',
    'animal','bird','insect','fish','mammal','tracks',
    'earth','rock','sand','soil',
    'wind','breeze','calm','serene','vibrant','moody','golden-hour'
  ];

  // Load saved photos from database on component mount
  useEffect(() => {
    const loadPhotos = async () => {
      try {
        // For now, we'll use a demo user ID. In a real app, this would come from auth context
        const response = await fetch('/api/nature-photo?userId=1');
        if (response.ok) {
          const data = await response.json();
          setPhotos(data.photos || []);
        } else {
          console.error('Failed to load photos:', response.status);
        }
      } catch (error) {
        console.error('Error loading photos:', error);
      }
    };

    loadPhotos();
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addPhoto = async () => {
    if (!uploadedImage) return;
    
    setIsProcessing(true);
    
    try {
      // Convert image to base64 for API
      const base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read image file'));
        reader.readAsDataURL(uploadedImage);
      });

      // Upload to API (atomic: server will optionally share to community and post AI reply)
      const response = await fetch('/api/nature-photo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id ?? 1,
          imageData: base64Image,
          caption: caption || 'Nature moment',
          tags: selectedTags,
          location: location || null,
          weather: weather || null,
          mood: mood || null,
          shareToCommunity: shareToCommunity,
          // Let server generate aiInsights/aiComment from the image
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('Photo uploaded successfully:', data);
        setPhotos(prev => [data.photo, ...prev]);
        
        setSuccessMessage(shareToCommunity ? 'Photo uploaded and shared to community successfully!' : 'Photo uploaded successfully!');
        
        // Reset form
        setIsAdding(false);
        setSelectedTags([]);
        setCaption('');
        setLocation('');
        setWeather('');
        setMood('');
        setUploadedImage(null);
        setImagePreview('');
        setShareToCommunity(false);
        
        // Show success notification
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        console.error('API error:', data);
        alert(`Failed to save photo: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding photo:', error);
      alert(`Failed to save photo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const removePhoto = (photoId: number) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <motion.div 
      className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div 
            className="p-3 rounded-xl bg-green-500/20"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Camera className="w-6 h-6 text-green-400" />
          </motion.div>
          <div>
            <h3 className="font-bold text-white text-lg">Nature Photo Log</h3>
            <p className="text-sm text-gray-400">
              Capture moments in nature and reflect on their meaning
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-400">{photos.length}</div>
          <div className="text-xs text-gray-400">Photos</div>
        </div>
      </div>

      {/* Success Notification */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm text-center"
        >
          {successMessage}
        </motion.div>
      )}

      {/* Add Photo Section */}
      {!isAdding ? (
        <motion.button
          onClick={() => setIsAdding(true)}
          className="w-full p-6 border-2 border-dashed border-green-500/30 rounded-xl text-green-400 hover:border-green-500/50 hover:bg-green-500/10 transition-all mb-6"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-center gap-2">
            <Camera className="w-5 h-5" />
            <span>Add Nature Photo</span>
          </div>
        </motion.button>
      ) : (
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          {/* Image Upload */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-text">Upload Photo</label>
            <div className="border-2 border-dashed border-green-500/30 rounded-lg p-4 text-center">
              {imagePreview ? (
                <div className="space-y-3">
                  <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                  <button
                    onClick={() => {
                      setUploadedImage(null);
                      setImagePreview('');
                    }}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Camera className="w-8 h-8 text-green-400 mx-auto" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer text-green-400 hover:text-green-300">
                    Click to upload or drag and drop
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text">Caption</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Describe this moment..."
              className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text">Tags</label>
            <div className="overflow-x-auto no-scrollbar">
              <div className="grid grid-rows-2 grid-flow-col auto-cols-max gap-2 pr-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTags(prev => 
                      prev.includes(tag) 
                        ? prev.filter(t => t !== tag)
                        : [...prev, tag]
                    )}
                    className={`px-3 py-1 rounded-full text-xs transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-green-500 text-white'
                        : 'bg-surface-2 text-muted hover:text-text hover:bg-green-500/10'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Optional Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where was this taken?"
                className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text">Weather</label>
              <input
                type="text"
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
                placeholder="Sunny, rainy, etc."
                className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500"
              />
            </div>
          </div>

          {/* Community Share Checkbox */}
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="share-to-community"
              checked={shareToCommunity}
              onChange={(e) => setShareToCommunity(e.target.checked)}
              className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="share-to-community" className="text-sm text-gray-400">
              Share this photo to the community?
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsAdding(false);
                setSelectedTags([]);
                setCaption('');
                setLocation('');
                setWeather('');
                setMood('');
                setUploadedImage(null);
                setImagePreview('');
                setShareToCommunity(false);
              }}
              className="flex-1 px-3 py-2 bg-surface-2 border border-border text-text rounded-lg hover:bg-surface transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              onClick={addPhoto}
              disabled={isProcessing || !uploadedImage}
              className="flex-1 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  Processing...
                </>
              ) : (
                'Add Photo'
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* Gallery Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-400">Your Nature Collection:</div>
        <button
          onClick={() => setShowGallery(!showGallery)}
          className="text-sm text-green-400 hover:text-green-300 transition-colors"
        >
          {showGallery ? 'Hide Gallery' : 'Show Gallery'}
        </button>
      </div>

      {/* Photo Gallery */}
      {showGallery && (
        <motion.div 
          className=""
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          {photos.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Camera className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No photos yet. Start your nature connection journey!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {photos.map((photo) => (
                <motion.div
                  key={photo.id}
                  className="relative group cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img
                    src={photo.imagePath}
                    alt={photo.caption}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <div className="text-white text-xs text-center">
                      <div className="font-medium">{photo.caption}</div>
                      <div className="text-gray-300">{formatDate(new Date(photo.date))}</div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removePhoto(photo.id);
                    }}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-surface border border-border rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <img
                src={selectedPhoto.imagePath}
                alt={selectedPhoto.caption}
                className="w-full h-48 object-cover rounded-lg"
              />
              
              <div>
                <h3 className="font-semibold text-text text-lg mb-2">{selectedPhoto.caption}</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedPhoto.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                
                {selectedPhoto.location && (
                  <p className="text-sm text-muted mb-2">📍 {selectedPhoto.location}</p>
                )}
                {selectedPhoto.weather && (
                  <p className="text-sm text-muted mb-2">🌤️ {selectedPhoto.weather}</p>
                )}
                <p className="text-sm text-muted mb-4">{formatDate(new Date(selectedPhoto.date))}</p>
                
                {/* AI Insights */}
                {selectedPhoto.aiComment && (
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-green-400">AI Reflection</span>
                    </div>
                    <p className="text-sm text-green-300 leading-relaxed">{selectedPhoto.aiComment}</p>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setSelectedPhoto(null)}
                className="w-full px-4 py-2 bg-surface-2 border border-border text-text rounded-lg hover:bg-surface transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

// ===== SLEEP TRACKER WIDGET =====
interface SleepTrackerWidgetProps {
  frameworkTone?: string;
}

export function SleepTrackerWidget({ frameworkTone = "stoic" }: SleepTrackerWidgetProps) {
  const [sleepHours, setSleepHours] = useState(7);
  const [sleepQuality, setSleepQuality] = useState('good');
  const [sleepNotes, setSleepNotes] = useState('');
  const [isLogging, setIsLogging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const qualityOptions = [
    { value: 'excellent', label: 'Excellent', color: 'text-green-400', emoji: '😴' },
    { value: 'good', label: 'Good', color: 'text-blue-400', emoji: '😊' },
    { value: 'fair', label: 'Fair', color: 'text-yellow-400', emoji: '😐' },
    { value: 'poor', label: 'Poor', color: 'text-red-400', emoji: '😴' }
  ];

  const logSleep = async () => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      
      try {
        // Create sleep log using the new journal system
        const { createSleepLog, logToJournal } = await import('@/lib/journal-logger');
        
        const journalData = createSleepLog(
          sleepHours,
          sleepQuality,
          sleepNotes || undefined
        );

        const result = await logToJournal(journalData);
        
        if (result.success) {
          // Reset form
          setSleepHours(7);
          setSleepQuality('good');
          setSleepNotes('');
          setIsLogging(false);
          
          // Show success feedback
          console.log('✅ Sleep logged to journal:', result.message);
        } else {
          console.error('❌ Failed to log sleep:', result.error);
        }
      } catch (error) {
        console.error('Error logging sleep:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getSleepStatus = () => {
    if (sleepHours >= 8) return { status: "Excellent", color: "text-green-400", emoji: "😴" };
    if (sleepHours >= 7) return { status: "Good", color: "text-blue-400", emoji: "😊" };
    if (sleepHours >= 6) return { status: "Fair", color: "text-yellow-400", emoji: "😐" };
    return { status: "Poor", color: "text-red-400", emoji: "😴" };
  };

  const sleepStatus = getSleepStatus();

  return (
    <motion.div 
      className="p-6 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 backdrop-blur-sm"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div 
            className="p-3 rounded-xl bg-indigo-500/20"
            animate={{ 
              scale: isLogging ? [1, 1.1, 1] : 1,
              opacity: isLogging ? [1, 0.7, 1] : 1
            }}
            transition={{ duration: 2, repeat: isLogging ? Infinity : 0 }}
          >
            <Moon className="w-6 h-6 text-indigo-400" />
          </motion.div>
          <div>
            <h3 className="font-bold text-white text-lg">Sleep Tracker</h3>
            <p className="text-sm text-gray-400">
              {isLogging ? 'Logging sleep...' : 'Monitor your rest'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-indigo-400">{sleepHours}</div>
          <div className="text-xs text-gray-400">Hours</div>
        </div>
      </div>

      {/* Sleep Status */}
      {sleepHours > 0 && (
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">{sleepStatus.emoji}</div>
          <div className={`text-lg font-bold ${sleepStatus.color}`}>
            {sleepStatus.status}
          </div>
          <div className="text-sm text-gray-400">
            {sleepHours} hours of sleep
          </div>
        </div>
      )}

      {/* Tracking Controls */}
      <div className="flex justify-center gap-3 mb-6">
        {!isLogging ? (
          <motion.button
            onClick={() => setIsLogging(true)}
            className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center gap-2">
              <Moon className="w-5 h-5" />
              <span>Start Sleep</span>
            </div>
          </motion.button>
        ) : (
          <motion.button
            onClick={logSleep}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5" />
              <span>Wake Up</span>
            </div>
          </motion.button>
        )}
        
        <motion.button
          onClick={() => {
            setSleepHours(7);
            setSleepQuality('good');
            setSleepNotes('');
            setIsLogging(false);
          }}
          className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Sleep Quality Rating */}
      {sleepHours > 0 && (
        <div className="mb-6">
          <div className="text-sm text-gray-400 mb-3 text-center">Rate your sleep quality:</div>
          <div className="flex justify-center gap-2">
            {qualityOptions.map((option) => (
              <motion.button
                key={option.value}
                onClick={() => setSleepQuality(option.value)}
                className={`p-2 text-2xl hover:scale-110 transition-all ${
                  sleepQuality === option.value ? 'text-white' : option.color
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {option.emoji}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Sleep Quality Display */}
      {sleepQuality && (
        <div className="mb-4 p-3 bg-white/5 rounded-lg text-center">
          <div className="text-xs text-gray-400 mb-1">Sleep Quality:</div>
          <div className="text-2xl mb-1">
            {sleepQuality === 'excellent' ? "😴" : sleepQuality === 'good' ? "😊" : sleepQuality === 'fair' ? "😐" : "😴"}
          </div>
          <div className="text-sm text-white">
            {sleepQuality}
          </div>
        </div>
      )}

      {/* Sleep Notes */}
      {sleepHours > 0 && (
        <div className="mb-6">
          <div className="text-sm text-gray-400 mb-2">Notes:</div>
          <textarea
            value={sleepNotes}
            onChange={(e) => setSleepNotes(e.target.value)}
            placeholder="Any thoughts or feelings about your sleep?"
            className="w-full p-3 bg-white/10 border border-indigo-500/30 rounded-lg text-white placeholder-gray-400 resize-none"
            rows={3}
          />
        </div>
      )}

      {/* Sleep Tips */}
      <div className="mt-4 p-3 bg-white/5 rounded-lg">
        <div className="text-xs text-gray-400 mb-1">Sleep Tip:</div>
        <div className="text-sm text-white">
          Aim for 7-9 hours of quality sleep. Create a consistent bedtime routine for better rest.
        </div>
      </div>
    </motion.div>
  );
}

// ===== DEFAULT EXPORT =====
export default function ModuleWidget({ moduleId, moduleName, frameworkTone }: { 
  moduleId: string; 
  moduleName: string; 
  frameworkTone?: string 
}) {
  switch (moduleId) {
    case 'breathwork':
    case 'box_breathing':
    case 'coherent_breathing':
    case 'triangle_breathing':
      return <BreathworkWidget frameworkTone={frameworkTone} />;
    case 'focus_deepwork':
      return <FocusTimerWidget frameworkTone={frameworkTone} />;
    case 'gratitude_awe':
      return <GratitudeJournalWidget frameworkTone={frameworkTone} />;
    case 'movement_posture':
    case 'strength':
    case 'flexibility':
      return <MovementWidget frameworkTone={frameworkTone} />;
    case 'hydration':
      return <HydrationWidget frameworkTone={frameworkTone} />;
    case 'sleep_circadian':
      return <SleepTrackerWidget frameworkTone={frameworkTone} />;
    case 'nature_photo_log':
      return <NaturePhotoLogWidget frameworkTone={frameworkTone} />;
    case 'balance_gyro':
      return <BalanceCard 
        title="Balance Challenge"
        config={{ targetSec: 60, sensitivity: 'medium', teaching: "Find your center through stillness" }}
        onComplete={() => console.log('Balance challenge completed')}
        virtueGrantPerCompletion={{ temperance: 2, wisdom: 1 }}
      />;
    default:
      return (
        <motion.div 
          className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-white/10">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg capitalize">{moduleName}</h3>
              <p className="text-sm text-gray-400">Interactive widget in development</p>
            </div>
          </div>
          <div className="text-center py-8 text-gray-400">
            <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Interactive features are being developed for this module.</p>
          </div>
        </motion.div>
      );
  }
} 