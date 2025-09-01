'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Heart, Timer, Target, Volume2, VolumeX, Wind, Sparkles, Zap, Moon, Sun, Flame, Leaf, Droplets } from 'lucide-react';

interface BreathPattern {
  name: string;
  description: string;
  pattern: {
    inhale: number;
    hold: number;
    exhale: number;
    hold2: number;
    cycles: number;
  };
  benefits: string[];
  color: string;
  icon: React.ReactNode;
  gradient: string;
}

const breathPatterns: BreathPattern[] = [
  {
    name: 'Box Breathing',
    description: 'Equal duration for each phase to calm the nervous system',
    pattern: { inhale: 4, hold: 4, exhale: 4, hold2: 4, cycles: 10 },
    benefits: ['Reduces stress', 'Improves focus', 'Calms anxiety'],
    color: 'from-blue-500 to-cyan-500',
    gradient: 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20',
    icon: <Wind className="w-6 h-6" />,
  },
  {
    name: '4-7-8 Breathing',
    description: 'Extended exhale to activate the parasympathetic nervous system',
    pattern: { inhale: 4, hold: 7, exhale: 8, hold2: 0, cycles: 8 },
    benefits: ['Promotes sleep', 'Reduces anxiety', 'Manages cravings'],
    color: 'from-purple-500 to-pink-500',
    gradient: 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20',
    icon: <Moon className="w-6 h-6" />,
  },
  {
    name: 'Wim Hof Method',
    description: 'Deep breathing followed by breath retention',
    pattern: { inhale: 2, hold: 0, exhale: 2, hold2: 15, cycles: 6 },
    benefits: ['Boosts energy', 'Strengthens immune system', 'Increases focus'],
    color: 'from-orange-500 to-red-500',
    gradient: 'bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20',
    icon: <Flame className="w-6 h-6" />,
  },
  {
    name: 'Coherent Breathing',
    description: 'Slow, rhythmic breathing at 5-6 breaths per minute',
    pattern: { inhale: 5, hold: 0, exhale: 5, hold2: 0, cycles: 12 },
    benefits: ['Balances nervous system', 'Reduces blood pressure', 'Improves mood'],
    color: 'from-green-500 to-emerald-500',
    gradient: 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20',
    icon: <Leaf className="w-6 h-6" />,
  },
  {
    name: 'Ocean Breath',
    description: 'Gentle breathing with soft sound to calm the mind',
    pattern: { inhale: 4, hold: 2, exhale: 6, hold2: 0, cycles: 8 },
    benefits: ['Soothes nervous system', 'Improves concentration', 'Reduces tension'],
    color: 'from-teal-500 to-cyan-500',
    gradient: 'bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border-teal-500/20',
    icon: <Droplets className="w-6 h-6" />,
  },
];

interface BreathworkWidgetNewProps {
  frameworkTone?: string;
}

export function BreathworkWidgetNew({ frameworkTone = "stoic" }: BreathworkWidgetNewProps) {
  const [selectedPattern, setSelectedPattern] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'hold2'>('inhale');
  const [timeLeft, setTimeLeft] = useState(breathPatterns[0].pattern.inhale);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showPatterns, setShowPatterns] = useState(false);
  const [sessionStats, setSessionStats] = useState({ totalSessions: 0, totalMinutes: 0 });

  const pattern = breathPatterns[selectedPattern];
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Phase completed, move to next phase
            if (currentPhase === 'inhale') {
              setCurrentPhase('hold');
              return pattern.pattern.hold;
            } else if (currentPhase === 'hold') {
              setCurrentPhase('exhale');
              return pattern.pattern.exhale;
            } else if (currentPhase === 'exhale') {
              if (pattern.pattern.hold2 > 0) {
                setCurrentPhase('hold2');
                return pattern.pattern.hold2;
              } else {
                // Cycle completed
                if (currentCycle < pattern.pattern.cycles) {
                  setCurrentCycle(prev => prev + 1);
                  setCurrentPhase('inhale');
                  return pattern.pattern.inhale;
                } else {
                  // Session completed
                  setIsActive(false);
                  setCurrentCycle(1);
                  setCurrentPhase('inhale');
                  setSessionStats(prev => ({
                    totalSessions: prev.totalSessions + 1,
                    totalMinutes: prev.totalMinutes + Math.ceil((pattern.pattern.inhale + pattern.pattern.hold + pattern.pattern.exhale + pattern.pattern.hold2) * pattern.pattern.cycles / 60)
                  }));
                  return pattern.pattern.inhale;
                }
              }
            } else {
              // hold2 completed, start new cycle
              if (currentCycle < pattern.pattern.cycles) {
                setCurrentCycle(prev => prev + 1);
                setCurrentPhase('inhale');
                return pattern.pattern.inhale;
              } else {
                // Session completed
                setIsActive(false);
                setCurrentCycle(1);
                setCurrentPhase('inhale');
                setSessionStats(prev => ({
                  totalSessions: prev.totalSessions + 1,
                  totalMinutes: prev.totalMinutes + Math.ceil((pattern.pattern.inhale + pattern.pattern.hold + pattern.pattern.exhale + pattern.pattern.hold2) * pattern.pattern.cycles / 60)
                }));
                return pattern.pattern.inhale;
              }
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, currentPhase, currentCycle, pattern]);

  const toggleSession = () => {
    if (isActive) {
      setIsActive(false);
    } else {
      setIsActive(true);
      setTimeLeft(pattern.pattern.inhale);
      setCurrentPhase('inhale');
      setCurrentCycle(1);
    }
  };

  const resetSession = () => {
    setIsActive(false);
    setTimeLeft(pattern.pattern.inhale);
    setCurrentPhase('inhale');
    setCurrentCycle(1);
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'inhale': return 'text-blue-400';
      case 'hold': return 'text-yellow-400';
      case 'exhale': return 'text-green-400';
      case 'hold2': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getPhaseIcon = () => {
    switch (currentPhase) {
      case 'inhale': return <Wind className="w-8 h-8" />;
      case 'hold': return <Timer className="w-8 h-8" />;
      case 'exhale': return <Leaf className="w-8 h-8" />;
      case 'hold2': return <Sparkles className="w-8 h-8" />;
      default: return <Wind className="w-8 h-8" />;
    }
  };

  const getPhaseText = () => {
    switch (currentPhase) {
      case 'inhale': return 'Inhale';
      case 'hold': return 'Hold';
      case 'exhale': return 'Exhale';
      case 'hold2': return 'Hold Empty';
      default: return 'Inhale';
    }
  };

  return (
    <motion.div 
      className={`p-4 rounded-xl ${pattern.gradient} backdrop-blur-sm`}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <motion.div 
            className="p-2 rounded-lg bg-white/10"
            animate={{ 
              scale: isActive ? [1, 1.1, 1] : 1,
              rotate: isActive ? [0, 5, -5, 0] : 0
            }}
            transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
          >
            {pattern.icon}
          </motion.div>
          <div>
            <h3 className="font-bold text-white text-base">Breathwork</h3>
            <p className="text-xs text-gray-400">{sessionStats.totalSessions} sessions</p>
          </div>
        </div>
        
        {/* Pattern Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowPatterns(!showPatterns)}
            className="flex items-center gap-1 px-3 py-1.5 bg-white/10 rounded-lg text-white text-sm hover:bg-white/20 transition-colors"
          >
            <span className="truncate max-w-20">{pattern.name}</span>
            <motion.div
              animate={{ rotate: showPatterns ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              ▼
            </motion.div>
          </button>
          
          <AnimatePresence>
            {showPatterns && (
              <motion.div 
                className="absolute top-full right-0 mt-1 w-48 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 z-10"
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
              >
                {breathPatterns.map((p, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedPattern(index);
                      setShowPatterns(false);
                      resetSession();
                    }}
                    className={`w-full p-2 text-left hover:bg-white/10 transition-colors ${
                      selectedPattern === index ? 'bg-white/20 text-white' : 'text-gray-300'
                    } ${index === 0 ? 'rounded-t-lg' : ''} ${index === breathPatterns.length - 1 ? 'rounded-b-lg' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{p.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{p.name}</div>
                        <div className="text-xs opacity-75 truncate">{p.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Compact Breath Circle */}
      <div className="flex justify-center mb-4">
        <motion.div 
          className="relative w-20 h-20 rounded-full border-3 border-white/20 flex items-center justify-center"
          animate={{
            scale: isActive ? [1, 1.15, 1] : 1,
            borderColor: isActive ? ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.4)', 'rgba(255,255,255,0.2)'] : 'rgba(255,255,255,0.2)'
          }}
          transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
        >
          <motion.div 
            className="absolute inset-3 rounded-full bg-gradient-to-br from-white/10 to-white/5"
            animate={{
              scale: isActive ? [1, 1.1, 1] : 1,
            }}
            transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
          />
          <div className="relative z-10 text-center">
            <motion.div 
              className={`text-xl font-bold ${getPhaseColor()}`}
              animate={{ scale: isActive ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
            >
              {timeLeft}
            </motion.div>
            <div className="text-xs text-gray-400">{getPhaseText()}</div>
          </div>
        </motion.div>
      </div>

      {/* Compact Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Cycle {currentCycle}/{pattern.pattern.cycles}</span>
          <span>{Math.round((currentCycle / pattern.pattern.cycles) * 100)}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5">
          <motion.div 
            className="bg-gradient-to-r from-white/30 to-white/50 h-1.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentCycle / pattern.pattern.cycles) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Compact Controls */}
      <div className="flex justify-center gap-2 mb-3">
        <motion.button
          onClick={toggleSession}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            isActive 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center gap-1">
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="text-sm">{isActive ? 'Pause' : 'Start'}</span>
          </div>
        </motion.button>
        
        <motion.button
          onClick={resetSession}
          className="px-3 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Compact Benefits */}
      <div className="flex flex-wrap gap-1">
        {pattern.benefits.slice(0, 2).map((benefit, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-white/10 text-white text-xs rounded-full"
          >
            {benefit}
          </span>
        ))}
        {pattern.benefits.length > 2 && (
          <span className="px-2 py-1 bg-white/10 text-white text-xs rounded-full">
            +{pattern.benefits.length - 2}
          </span>
        )}
      </div>
    </motion.div>
  );
} 