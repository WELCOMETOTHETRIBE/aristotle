"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Timer, Target, BookOpen, Heart, Brain, Zap, Users, Sun, Moon, Coffee, Water, Dumbbell, Meditation } from 'lucide-react';

// ===== BREATHWORK WIDGET =====
interface BreathworkWidgetProps {
  pattern?: {
    inhale: number;
    hold: number;
    exhale: number;
    hold2?: number;
  };
  duration?: number; // in minutes
}

export function BreathworkWidget({ 
  pattern = { inhale: 4, hold: 4, exhale: 4, hold2: 4 },
  duration = 5 
}: BreathworkWidgetProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(pattern.inhale);
  const [breathScale, setBreathScale] = useState(1);

  const phases = [
    { name: "Inhale", duration: pattern.inhale, color: "#7ad7ff", icon: "↗" },
    { name: "Hold", duration: pattern.hold, color: "#a78bfa", icon: "●" },
    { name: "Exhale", duration: pattern.exhale, color: "#7ad7ff", icon: "↘" },
    ...(pattern.hold2 ? [{ name: "Hold", duration: pattern.hold2, color: "#a78bfa", icon: "●" }] : [])
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });

        setPhaseTimeLeft((prev) => {
          if (prev <= 1) {
            const nextPhase = (currentPhase + 1) % phases.length;
            setCurrentPhase(nextPhase);
            return phases[nextPhase].duration;
          }
          return prev - 1;
        });

        // Animate breath scale
        const currentPhaseData = phases[currentPhase];
        if (currentPhaseData.name === "Inhale") {
          setBreathScale(1.2);
        } else if (currentPhaseData.name === "Exhale") {
          setBreathScale(0.8);
        } else {
          setBreathScale(1);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, currentPhase, phases]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration * 60);
    setCurrentPhase(0);
    setPhaseTimeLeft(pattern.inhale);
    setBreathScale(1);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-blue-500/20">
          <Meditation className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Breathwork</h3>
          <p className="text-sm text-gray-400">Box {pattern.inhale}-{pattern.hold}-{pattern.exhale}-{pattern.hold2 || 0}</p>
        </div>
      </div>

      {/* Visual Breath Indicator */}
      <div className="flex justify-center mb-6">
        <motion.div 
          className="w-24 h-24 rounded-full border-4 border-blue-400/30 flex items-center justify-center"
          animate={{ scale: breathScale }}
          transition={{ duration: 1, ease: "easeInOut" }}
          style={{ backgroundColor: isActive ? 'rgba(122, 215, 255, 0.1)' : 'transparent' }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {isActive ? phaseTimeLeft : phases[0].duration}
            </div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">
              {isActive ? phases[currentPhase].name : 'Ready'}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Timer Display */}
      <div className="text-center mb-4">
        <div className="text-3xl font-bold text-white mb-1">
          {formatTime(timeLeft)}
        </div>
        <div className="text-sm text-gray-400">Session Time</div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        <button
          onClick={toggleTimer}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            isActive 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button
          onClick={resetTimer}
          className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ===== FOCUS TIMER WIDGET =====
interface FocusTimerWidgetProps {
  duration?: number; // in minutes
  technique?: 'pomodoro' | 'deep-work' | 'flow';
}

export function FocusTimerWidget({ 
  duration = 25, 
  technique = 'pomodoro' 
}: FocusTimerWidgetProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isCompleted, setIsCompleted] = useState(false);
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            setIsCompleted(true);
            setSessions(prev => prev + 1);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    if (isCompleted) {
      setTimeLeft(duration * 60);
      setIsCompleted(false);
    } else {
      setIsActive(!isActive);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration * 60);
    setIsCompleted(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = 1 - timeLeft / (duration * 60);

  return (
    <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-green-500/20">
          <Target className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Focus Timer</h3>
          <p className="text-sm text-gray-400 capitalize">{technique.replace('-', ' ')}</p>
        </div>
      </div>

      {/* Progress Circle */}
      <div className="flex justify-center mb-4">
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="rgba(34, 197, 94, 0.2)"
              strokeWidth="4"
              fill="none"
            />
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="#22c55e"
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 36}`}
              strokeDashoffset={`${2 * Math.PI * 36 * (1 - progress)}`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold text-white">
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Session Counter */}
      <div className="text-center mb-4">
        <div className="text-sm text-gray-400">Sessions Completed</div>
        <div className="text-2xl font-bold text-white">{sessions}</div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        <button
          onClick={toggleTimer}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            isCompleted 
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : isActive 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isCompleted ? 'Restart' : isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button
          onClick={resetTimer}
          className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ===== GRATITUDE JOURNAL WIDGET =====
export function GratitudeJournalWidget() {
  const [entries, setEntries] = useState<string[]>([]);
  const [currentEntry, setCurrentEntry] = useState('');
  const [showPrompt, setShowPrompt] = useState(true);

  const prompts = [
    "What made you smile today?",
    "Who are you grateful for?",
    "What's something beautiful you noticed?",
    "What's a challenge you're grateful for?",
    "What's something you're looking forward to?"
  ];

  const [currentPrompt, setCurrentPrompt] = useState(prompts[0]);

  const addEntry = () => {
    if (currentEntry.trim()) {
      setEntries([...entries, currentEntry.trim()]);
      setCurrentEntry('');
      setCurrentPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
    }
  };

  const clearEntries = () => {
    setEntries([]);
  };

  return (
    <div className="p-6 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-yellow-500/20">
          <Heart className="w-5 h-5 text-yellow-400" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Gratitude Journal</h3>
          <p className="text-sm text-gray-400">Daily appreciation practice</p>
        </div>
      </div>

      {/* Prompt */}
      {showPrompt && (
        <div className="mb-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <p className="text-sm text-yellow-200 italic">"{currentPrompt}"</p>
        </div>
      )}

      {/* Entry Input */}
      <div className="mb-4">
        <textarea
          value={currentEntry}
          onChange={(e) => setCurrentEntry(e.target.value)}
          placeholder="Write your gratitude entry..."
          className="w-full p-3 rounded-lg bg-black/20 border border-yellow-500/20 text-white placeholder-gray-400 resize-none"
          rows={3}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              addEntry();
            }
          }}
        />
        <button
          onClick={addEntry}
          disabled={!currentEntry.trim()}
          className="mt-2 px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all"
        >
          Add Entry
        </button>
      </div>

      {/* Entries List */}
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {entries.map((entry, index) => (
          <div key={index} className="p-2 rounded-lg bg-black/20 border border-yellow-500/10">
            <p className="text-sm text-white">{entry}</p>
          </div>
        ))}
      </div>

      {entries.length > 0 && (
        <button
          onClick={clearEntries}
          className="mt-3 px-3 py-1 rounded-lg bg-gray-600 hover:bg-gray-700 text-white text-sm transition-all"
        >
          Clear All
        </button>
      )}
    </div>
  );
}

// ===== MOVEMENT WIDGET =====
export function MovementWidget() {
  const [isActive, setIsActive] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [sets, setSets] = useState(0);

  const exercises = [
    { name: "Push-ups", duration: 30, icon: "💪" },
    { name: "Squats", duration: 30, icon: "🦵" },
    { name: "Plank", duration: 45, icon: "🧘" },
    { name: "Jumping Jacks", duration: 30, icon: "🏃" },
    { name: "Burpees", duration: 30, icon: "⚡" }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            const nextExercise = (currentExercise + 1) % exercises.length;
            setCurrentExercise(nextExercise);
            setTimeLeft(exercises[nextExercise].duration);
            if (nextExercise === 0) {
              setSets(prev => prev + 1);
            }
            return exercises[nextExercise].duration;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, currentExercise]);

  const startWorkout = () => {
    setIsActive(true);
    setTimeLeft(exercises[0].duration);
    setCurrentExercise(0);
  };

  const pauseWorkout = () => {
    setIsActive(false);
  };

  const resetWorkout = () => {
    setIsActive(false);
    setTimeLeft(exercises[0].duration);
    setCurrentExercise(0);
    setSets(0);
  };

  return (
    <div className="p-6 rounded-xl bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-red-500/20">
          <Dumbbell className="w-5 h-5 text-red-400" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Movement</h3>
          <p className="text-sm text-gray-400">Quick workout session</p>
        </div>
      </div>

      {/* Current Exercise */}
      <div className="text-center mb-4">
        <div className="text-4xl mb-2">{exercises[currentExercise].icon}</div>
        <div className="text-lg font-bold text-white mb-1">
          {exercises[currentExercise].name}
        </div>
        <div className="text-3xl font-bold text-red-400">
          {timeLeft}s
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>Exercise {currentExercise + 1} of {exercises.length}</span>
          <span>Set {sets + 1}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-red-500 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${((currentExercise * exercises[0].duration + (exercises[0].duration - timeLeft)) / (exercises.length * exercises[0].duration)) * 100}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        {!isActive ? (
          <button
            onClick={startWorkout}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all"
          >
            <Play className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={pauseWorkout}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all"
          >
            <Pause className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={resetWorkout}
          className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ===== HYDRATION WIDGET =====
export function HydrationWidget() {
  const [glasses, setGlasses] = useState(0);
  const [goal] = useState(8);
  const [lastDrink, setLastDrink] = useState<Date | null>(null);

  const addGlass = () => {
    setGlasses(prev => Math.min(prev + 1, goal));
    setLastDrink(new Date());
  };

  const resetGlasses = () => {
    setGlasses(0);
    setLastDrink(null);
  };

  const progress = glasses / goal;

  return (
    <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-blue-500/20">
          <Water className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Hydration</h3>
          <p className="text-sm text-gray-400">Daily water intake</p>
        </div>
      </div>

      {/* Water Level Visualization */}
      <div className="flex justify-center mb-4">
        <div className="relative w-16 h-24 bg-gray-700 rounded-lg border-2 border-blue-400/30 overflow-hidden">
          <div 
            className="absolute bottom-0 w-full bg-blue-400 transition-all duration-1000 ease-out"
            style={{ height: `${progress * 100}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-bold text-sm">{glasses}</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="text-center mb-4">
        <div className="text-2xl font-bold text-white">{glasses} / {goal}</div>
        <div className="text-sm text-gray-400">glasses today</div>
      </div>

      {/* Last Drink */}
      {lastDrink && (
        <div className="text-center mb-4 text-xs text-gray-400">
          Last drink: {lastDrink.toLocaleTimeString()}
        </div>
      )}

      {/* Controls */}
      <div className="flex justify-center gap-3">
        <button
          onClick={addGlass}
          disabled={glasses >= goal}
          className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all"
        >
          +1 Glass
        </button>
        <button
          onClick={resetGlasses}
          className="px-3 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition-all"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

// ===== SLEEP TRACKER WIDGET =====
export function SleepTrackerWidget() {
  const [sleepHours, setSleepHours] = useState(0);
  const [goal] = useState(8);
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const startTracking = () => {
    setIsTracking(true);
    setStartTime(new Date());
  };

  const stopTracking = () => {
    if (startTime) {
      const endTime = new Date();
      const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      setSleepHours(Math.round(hours * 10) / 10);
    }
    setIsTracking(false);
    setStartTime(null);
  };

  const resetTracking = () => {
    setSleepHours(0);
    setIsTracking(false);
    setStartTime(null);
  };

  const progress = Math.min(sleepHours / goal, 1);

  return (
    <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-indigo-500/20">
          <Moon className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Sleep Tracker</h3>
          <p className="text-sm text-gray-400">Track your sleep quality</p>
        </div>
      </div>

      {/* Sleep Visualization */}
      <div className="flex justify-center mb-4">
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="rgba(99, 102, 241, 0.2)"
              strokeWidth="4"
              fill="none"
            />
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="#6366f1"
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 36}`}
              strokeDashoffset={`${2 * Math.PI * 36 * (1 - progress)}`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold text-white">
                {sleepHours}h
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="text-center mb-4">
        <div className="text-sm text-gray-400">Goal: {goal} hours</div>
        {isTracking && (
          <div className="text-xs text-indigo-400 mt-1">
            Tracking sleep...
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        {!isTracking ? (
          <button
            onClick={startTracking}
            className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white transition-all"
          >
            Start Sleep
          </button>
        ) : (
          <button
            onClick={stopTracking}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all"
          >
            Stop Sleep
          </button>
        )}
        <button
          onClick={resetTracking}
          className="px-3 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition-all"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

// ===== MAIN MODULE WIDGET COMPONENT =====
interface ModuleWidgetProps {
  moduleId: string;
  moduleName: string;
  frameworkTone?: string;
}

export default function ModuleWidget({ moduleId, moduleName, frameworkTone }: ModuleWidgetProps) {
  // Map module IDs to their corresponding widgets
  const getWidget = () => {
    switch (moduleId) {
      case 'breathwork':
        return <BreathworkWidget />;
      case 'focus_deepwork':
      case 'meditation':
        return <FocusTimerWidget technique="deep-work" />;
      case 'gratitude_awe':
        return <GratitudeJournalWidget />;
      case 'movement_posture':
      case 'strength':
        return <MovementWidget />;
      case 'hydration':
        return <HydrationWidget />;
      case 'sleep_circadian':
        return <SleepTrackerWidget />;
      default:
        // Default widget for unknown modules
        return (
          <div className="p-6 rounded-xl bg-gradient-to-br from-gray-500/10 to-gray-600/10 border border-gray-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gray-500/20">
                <Zap className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{moduleName}</h3>
                <p className="text-sm text-gray-400">Interactive practice</p>
              </div>
            </div>
            <div className="text-center py-8">
              <p className="text-gray-400">Coming soon...</p>
            </div>
          </div>
        );
    }
  };

  return getWidget();
} 