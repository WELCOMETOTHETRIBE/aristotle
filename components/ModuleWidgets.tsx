"use client";
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { 
  Play, Pause, RotateCcw, Timer, Target, BookOpen, Heart, Brain, Zap, 
  Users, Sun, Moon, Coffee, Droplets, Dumbbell, CheckCircle,
  Clock, TrendingUp, Activity, Sparkles, Flame, Wind, Camera
} from 'lucide-react';
import { BreathworkWidgetNew } from './BreathworkWidgetNew';

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
  duration?: number;
  technique?: string;
  frameworkTone?: string;
}

export function FocusTimerWidget({ 
  duration = 25, 
  technique = 'pomodoro',
  frameworkTone = "stoic"
}: FocusTimerWidgetProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isCompleted, setIsCompleted] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [currentSession, setCurrentSession] = useState(1);
  const [isBreak, setIsBreak] = useState(false);

  const breakDuration = technique === 'pomodoro' ? 5 : technique === 'deep-work' ? 15 : 10;
  const longBreakDuration = 15;
  const sessionsBeforeLongBreak = 4;

  // Haptic feedback
  const triggerHaptic = useCallback(() => {
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            setIsCompleted(true);
            triggerHaptic();
            
            if (isBreak) {
              // Break completed, start next session
              setIsBreak(false);
              setTimeLeft(duration * 60);
              setCurrentSession(prev => prev + 1);
            } else {
              // Session completed, start break
              setIsBreak(true);
              const isLongBreak = currentSession % sessionsBeforeLongBreak === 0;
              setTimeLeft((isLongBreak ? longBreakDuration : breakDuration) * 60);
              setSessions(prev => prev + 1);
            }
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak, currentSession, duration, breakDuration, longBreakDuration, sessionsBeforeLongBreak, triggerHaptic]);

  const toggleTimer = () => {
    if (isCompleted) {
      if (isBreak) {
        setIsBreak(false);
        setTimeLeft(duration * 60);
        setCurrentSession(prev => prev + 1);
      } else {
        setIsBreak(true);
        const isLongBreak = currentSession % sessionsBeforeLongBreak === 0;
        setTimeLeft((isLongBreak ? longBreakDuration : breakDuration) * 60);
      }
      setIsCompleted(false);
    } else {
      setIsActive(!isActive);
      triggerHaptic();
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(duration * 60);
    setIsCompleted(false);
    setCurrentSession(1);
    triggerHaptic();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const totalTime = isBreak ? (currentSession % sessionsBeforeLongBreak === 0 ? longBreakDuration : breakDuration) * 60 : duration * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const getTechniqueColor = () => {
    switch (technique) {
      case 'pomodoro': return 'from-red-500/10 to-orange-500/10 border-red-500/20';
      case 'deep-work': return 'from-purple-500/10 to-indigo-500/10 border-purple-500/20';
      case 'flow': return 'from-green-500/10 to-emerald-500/10 border-green-500/20';
      default: return 'from-blue-500/10 to-purple-500/10 border-blue-500/20';
    }
  };

  const getTechniqueIcon = () => {
    switch (technique) {
      case 'pomodoro': return <Timer className="w-6 h-6 text-red-400" />;
      case 'deep-work': return <Brain className="w-6 h-6 text-purple-400" />;
      case 'flow': return <Zap className="w-6 h-6 text-green-400" />;
      default: return <Target className="w-6 h-6 text-blue-400" />;
    }
  };

  return (
    <motion.div 
      className={`p-6 rounded-xl bg-gradient-to-br ${getTechniqueColor()} backdrop-blur-sm`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div 
            className="p-3 rounded-xl bg-white/10"
            animate={{ rotate: isActive ? 360 : 0 }}
            transition={{ duration: 3, repeat: isActive ? Infinity : 0, ease: "linear" }}
          >
            {getTechniqueIcon()}
          </motion.div>
          <div>
            <h3 className="font-bold text-white text-lg capitalize">{technique.replace('-', ' ')}</h3>
            <p className="text-sm text-gray-400">
              {isBreak ? 'Break Time' : `Session ${currentSession}`}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{sessions}</div>
          <div className="text-xs text-gray-400">Completed</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>{isBreak ? 'Break' : 'Focus'} Progress</span>
          <span>{Math.round(getProgressPercentage())}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div 
            className={`h-2 rounded-full ${
              isBreak 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                : technique === 'pomodoro'
                  ? 'bg-gradient-to-r from-red-500 to-orange-500'
                  : technique === 'deep-work'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500'
                    : 'bg-gradient-to-r from-green-500 to-emerald-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${getProgressPercentage()}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Timer Display */}
      <div className="text-center mb-6">
        <motion.div 
          className="text-5xl font-bold text-white mb-2"
          animate={{ 
            scale: isActive ? [1, 1.05, 1] : 1,
            color: isBreak ? '#10b981' : '#ffffff'
          }}
          transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
        >
          {formatTime(timeLeft)}
        </motion.div>
        <div className="text-sm text-gray-400">
          {isBreak ? 'Break Time' : `${technique.replace('-', ' ')} Session`}
        </div>
      </div>

      {/* Session Info */}
      <div className="flex justify-center gap-4 mb-6 text-sm">
        <div className="text-center">
          <div className="text-white font-semibold">{currentSession}</div>
          <div className="text-gray-400">Session</div>
        </div>
        <div className="text-center">
          <div className="text-white font-semibold">{sessionsBeforeLongBreak - (currentSession % sessionsBeforeLongBreak)}</div>
          <div className="text-gray-400">Until Long Break</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <motion.button
          onClick={toggleTimer}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            isCompleted 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : isActive 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isCompleted ? (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Continue</span>
            </div>
          ) : isActive ? (
            <div className="flex items-center gap-2">
              <Pause className="w-5 h-5" />
              <span>Pause</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              <span>Start</span>
            </div>
          )}
        </motion.button>
        
        <motion.button
          onClick={resetTimer}
          className="px-4 py-3 rounded-xl bg-gray-600 hover:bg-gray-700 text-white transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Technique Tips */}
      <div className="mt-4 p-3 bg-white/5 rounded-lg">
        <div className="text-xs text-gray-400 mb-1">Tip:</div>
        <div className="text-sm text-white">
          {technique === 'pomodoro' && 'Work in focused 25-minute sessions with 5-minute breaks'}
          {technique === 'deep-work' && 'Immerse yourself in complex tasks for extended periods'}
          {technique === 'flow' && 'Find your optimal state of concentration and creativity'}
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

  const addEntry = () => {
    if (currentEntry.trim()) {
      setEntries(prev => [currentEntry.trim(), ...prev.slice(0, 4)]);
      setCurrentEntry('');
      setIsAdding(false);
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
              disabled={!currentEntry.trim()}
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

// ===== ENHANCED MOVEMENT WIDGET =====
interface MovementWidgetProps {
  frameworkTone?: string;
}

export function MovementWidget({ frameworkTone = "stoic" }: MovementWidgetProps) {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [sets, setSets] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);

  const exercises = [
    { name: "Push-ups", duration: 30, icon: "💪", category: "Strength" },
    { name: "Squats", duration: 45, icon: "🦵", category: "Strength" },
    { name: "Plank", duration: 60, icon: "🧘", category: "Core" },
    { name: "Jumping Jacks", duration: 30, icon: "🏃", category: "Cardio" },
    { name: "Lunges", duration: 40, icon: "🚶", category: "Strength" },
    { name: "Mountain Climbers", duration: 30, icon: "⛰️", category: "Cardio" }
  ];

  const currentExerciseData = exercises[currentExercise];

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            setSets(prev => prev + 1);
            setCompletedExercises(prev => [...prev, currentExercise]);
            return currentExerciseData.duration;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, currentExercise, currentExerciseData.duration]);

  const startExercise = () => {
    setIsActive(true);
    setTimeLeft(currentExerciseData.duration);
  };

  const pauseExercise = () => {
    setIsActive(false);
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(prev => prev + 1);
      setTimeLeft(exercises[currentExercise + 1].duration);
      setIsActive(false);
    }
  };

  const resetWorkout = () => {
    setCurrentExercise(0);
    setTimeLeft(exercises[0].duration);
    setIsActive(false);
    setSets(0);
    setCompletedExercises([]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((currentExerciseData.duration - timeLeft) / currentExerciseData.duration) * 100;
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
              scale: isActive ? [1, 1.1, 1] : 1,
              rotate: isActive ? [0, 5, -5, 0] : 0
            }}
            transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
          >
            <Dumbbell className="w-6 h-6 text-green-400" />
          </motion.div>
          <div>
            <h3 className="font-bold text-white text-lg">Movement</h3>
            <p className="text-sm text-gray-400">Exercise {currentExercise + 1} of {exercises.length}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-400">{sets}</div>
          <div className="text-xs text-gray-400">Sets</div>
        </div>
      </div>

      {/* Current Exercise */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">{currentExerciseData.icon}</div>
        <h4 className="text-xl font-bold text-white mb-2">{currentExerciseData.name}</h4>
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm">
          {currentExerciseData.category}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>Exercise Progress</span>
          <span>{Math.round(getProgressPercentage())}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div 
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${getProgressPercentage()}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Timer Display */}
      <div className="text-center mb-6">
        <motion.div 
          className="text-4xl font-bold text-white mb-2"
          animate={{ 
            scale: isActive ? [1, 1.05, 1] : 1,
            color: isActive ? '#10b981' : '#ffffff'
          }}
          transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
        >
          {formatTime(timeLeft)}
        </motion.div>
        <div className="text-sm text-gray-400">Time Remaining</div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3 mb-6">
        {!isActive ? (
          <motion.button
            onClick={startExercise}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              <span>Start</span>
            </div>
          </motion.button>
        ) : (
          <motion.button
            onClick={pauseExercise}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center gap-2">
              <Pause className="w-5 h-5" />
              <span>Pause</span>
            </div>
          </motion.button>
        )}
        
        <motion.button
          onClick={resetWorkout}
          className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Exercise Progress */}
      <div className="mb-4">
        <div className="text-sm text-gray-400 mb-2">Workout Progress:</div>
        <div className="grid grid-cols-3 gap-2">
          {exercises.map((exercise, index) => (
            <motion.div
              key={index}
              className={`p-2 rounded-lg text-center text-xs ${
                completedExercises.includes(index)
                  ? 'bg-green-500/30 text-green-200 border border-green-500/50'
                  : index === currentExercise
                    ? 'bg-blue-500/30 text-blue-200 border border-blue-500/50'
                    : 'bg-white/10 text-gray-400'
              }`}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-lg mb-1">{exercise.icon}</div>
              <div className="font-medium">{exercise.name}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Next Exercise Button */}
      {currentExercise < exercises.length - 1 && (
        <motion.button
          onClick={nextExercise}
          className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Next: {exercises[currentExercise + 1].name}
        </motion.button>
      )}

      {/* Movement Tips */}
      <div className="mt-4 p-3 bg-white/5 rounded-lg">
        <div className="text-xs text-gray-400 mb-1">Movement Tip:</div>
        <div className="text-sm text-white">
          Focus on form over speed. Quality movement builds strength and prevents injury.
        </div>
      </div>
    </motion.div>
  );
}

// ===== ENHANCED HYDRATION WIDGET =====
interface HydrationWidgetProps {
  frameworkTone?: string;
}

export function HydrationWidget({ frameworkTone = "stoic" }: HydrationWidgetProps) {
  const [waterIntake, setWaterIntake] = useState(0);
  const [goal, setGoal] = useState(8); // cups
  const [lastDrink, setLastDrink] = useState<Date | null>(null);
  const [showGoalSettings, setShowGoalSettings] = useState(false);
  const [tempGoal, setTempGoal] = useState(8);

  const addWater = (amount: number) => {
    setWaterIntake(prev => Math.min(prev + amount, goal * 2)); // Cap at 2x goal
    setLastDrink(new Date());
  };

  const resetWater = () => {
    setWaterIntake(0);
    setLastDrink(null);
  };

  const getProgressPercentage = () => {
    return Math.min((waterIntake / goal) * 100, 100);
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
          <div className="text-2xl font-bold text-blue-400">{waterIntake}</div>
          <div className="text-xs text-gray-400">Cups</div>
          <button
            onClick={() => setShowGoalSettings(!showGoalSettings)}
            className="text-xs text-blue-300 hover:text-blue-200 mt-1 underline"
          >
            Set Goal
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
          {waterIntake} / {goal} cups
        </div>
      </div>

      {/* Goal Settings */}
      {showGoalSettings && (
        <motion.div 
          className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="text-sm text-white mb-3">Set Daily Water Goal</div>
          <div className="flex items-center gap-3 mb-3">
            <input
              type="range"
              min="4"
              max="16"
              step="0.5"
              value={tempGoal}
              onChange={(e) => setTempGoal(parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="text-white font-medium min-w-[3rem]">{tempGoal} cups</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setGoal(tempGoal);
                setShowGoalSettings(false);
              }}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition-colors"
            >
              Save Goal
            </button>
            <button
              onClick={() => {
                setTempGoal(goal);
                setShowGoalSettings(false);
              }}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Quick Add Buttons */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {[0.5, 1, 2].map((amount) => (
          <motion.button
            key={amount}
            onClick={() => addWater(amount)}
            className="p-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-white font-medium transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            +{amount} cup{amount !== 1 ? 's' : ''}
          </motion.button>
        ))}
      </div>

      {/* Last Drink Info */}
      {lastDrink && (
        <div className="mb-4 p-3 bg-white/5 rounded-lg">
          <div className="text-xs text-gray-400 mb-1">Last Drink:</div>
          <div className="text-sm text-white">
            {lastDrink.toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true 
            })}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex justify-center gap-3">
        <motion.button
          onClick={resetWater}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Reset
        </motion.button>
      </div>

      {/* Hydration Tips */}
      <div className="mt-4 p-3 bg-white/5 rounded-lg">
        <div className="text-xs text-gray-400 mb-1">Hydration Tip:</div>
        <div className="text-sm text-white">
          Aim for 8 cups of water daily. Listen to your body and drink when thirsty.
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

  const availableTags = ['dawn', 'dusk', 'tree', 'water', 'earth', 'sky', 'flower', 'animal', 'mountain', 'forest', 'ocean', 'river', 'sunset', 'sunrise', 'clouds', 'rain', 'snow', 'wind'];

  // Load saved photos from database on component mount
  useEffect(() => {
    const loadPhotos = async () => {
      try {
        // For now, we'll use a demo user ID. In a real app, this would come from auth context
        const response = await fetch('/api/nature-photo?userId=1');
        if (response.ok) {
          const data = await response.json();
          setPhotos(data.photos || []);
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

  const generateAIInsights = async (imageFile: File, tags: string[], caption: string) => {
    try {
      setIsProcessing(true);
      
      // Convert image to base64 for API
      const base64Image = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(imageFile);
      });
      
      const response = await fetch('/api/ai/guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Analyze this nature photo and provide thoughtful insights. The user has tagged it with: ${tags.join(', ')} and added the caption: "${caption}". 
          
          Please provide:
          1. A brief philosophical reflection on the natural elements shown
          2. A thoughtful comment about what this moment might teach us
          3. A connection to mindfulness or the user's relationship with nature
          
          Keep it warm, insightful, and under 150 words total.`,
          context: {
            page: 'nature_photo_log',
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
          
          return content.trim();
        }
      }
    } catch (error) {
      console.error('Failed to generate AI insights:', error);
      return "This moment in nature reminds us of the beauty and wisdom that surrounds us. Take a moment to breathe and appreciate the simple gifts of the natural world.";
    } finally {
      setIsProcessing(false);
    }
  };

  const addPhoto = async () => {
    if (selectedTags.length === 0 || !uploadedImage) return;
    
    setIsProcessing(true);
    
    try {
      // Generate AI insights first
      const aiInsights = await generateAIInsights(uploadedImage, selectedTags, caption);
      
      // Convert image to base64 for API
      const base64Image = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(uploadedImage);
      });

      // Upload to API
      const response = await fetch('/api/nature-photo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 1, // Demo user ID - in real app this would come from auth context
          imageData: base64Image,
          caption: caption || 'Nature moment',
          tags: selectedTags,
          location: location || null,
          weather: weather || null,
          mood: mood || null,
          aiInsights: aiInsights,
          aiComment: aiInsights,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPhotos(prev => [data.photo, ...prev]);
        
        // Reset form
        setIsAdding(false);
        setSelectedTags([]);
        setCaption('');
        setLocation('');
        setWeather('');
        setMood('');
        setUploadedImage(null);
        setImagePreview('');
      }
    } catch (error) {
      console.error('Error adding photo:', error);
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
            <div className="flex flex-wrap gap-2">
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
              }}
              className="flex-1 px-3 py-2 bg-surface-2 border border-border text-text rounded-lg hover:bg-surface transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              onClick={addPhoto}
              disabled={isProcessing || selectedTags.length === 0 || !uploadedImage}
              className="flex-1 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Add Photo'}
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

// ===== ENHANCED SLEEP TRACKER WIDGET =====
interface SleepTrackerWidgetProps {
  frameworkTone?: string;
}

export function SleepTrackerWidget({ frameworkTone = "stoic" }: SleepTrackerWidgetProps) {
  const [sleepHours, setSleepHours] = useState(0);
  const [sleepQuality, setSleepQuality] = useState<number | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [bedtime, setBedtime] = useState<Date | null>(null);

  const startTracking = () => {
    setIsTracking(true);
    setBedtime(new Date());
  };

  const stopTracking = () => {
    if (bedtime) {
      const now = new Date();
      const diffMs = now.getTime() - bedtime.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      setSleepHours(Math.round(diffHours * 10) / 10);
    }
    setIsTracking(false);
    setBedtime(null);
  };

  const setQuality = (quality: number) => {
    setSleepQuality(quality);
  };

  const resetSleep = () => {
    setSleepHours(0);
    setSleepQuality(null);
    setIsTracking(false);
    setBedtime(null);
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
              scale: isTracking ? [1, 1.1, 1] : 1,
              opacity: isTracking ? [1, 0.7, 1] : 1
            }}
            transition={{ duration: 2, repeat: isTracking ? Infinity : 0 }}
          >
            <Moon className="w-6 h-6 text-indigo-400" />
          </motion.div>
          <div>
            <h3 className="font-bold text-white text-lg">Sleep Tracker</h3>
            <p className="text-sm text-gray-400">
              {isTracking ? 'Tracking sleep...' : 'Monitor your rest'}
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
        {!isTracking ? (
          <motion.button
            onClick={startTracking}
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
            onClick={stopTracking}
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
          onClick={resetSleep}
          className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Sleep Quality Rating */}
      {sleepHours > 0 && sleepQuality === null && (
        <div className="mb-6">
          <div className="text-sm text-gray-400 mb-3 text-center">Rate your sleep quality:</div>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <motion.button
                key={rating}
                onClick={() => setQuality(rating)}
                className="p-2 text-2xl hover:scale-110 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {rating <= 2 ? "😴" : rating <= 3 ? "😐" : rating <= 4 ? "😊" : "😴"}
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
            {sleepQuality <= 2 ? "😴" : sleepQuality <= 3 ? "😐" : sleepQuality <= 4 ? "😊" : "😴"}
          </div>
          <div className="text-sm text-white">
            {sleepQuality}/5 stars
          </div>
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