'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Heart, Timer, Target, Volume2, VolumeX, Wind, Sparkles, Zap, Moon, Sun, Flame, Leaf, Droplets, Info, ChevronDown, ChevronUp, Settings, BookOpen, Brain, Shield, Users } from 'lucide-react';
import { FRAMEWORK_BREATH_MAP } from '@/data/frameworkBreath';

interface BreathPattern {
  id: string;
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
  intent: string;
  primaryVirtue: string;
  notes: string[];
  contraindications: string[];
  bpmApprox: number;
}

const breathPatterns: BreathPattern[] = [
  {
    id: 'box_breathing',
    name: 'Box Breathing',
    description: 'Equal duration for each phase to calm the nervous system and improve focus',
    pattern: { inhale: 4, hold: 4, exhale: 4, hold2: 4, cycles: 12 },
    benefits: ['Reduces stress and anxiety', 'Improves focus and concentration', 'Calms the nervous system', 'Enhances emotional regulation'],
    color: 'from-blue-500 to-cyan-500',
    gradient: 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20',
    icon: <Shield className="w-6 h-6" />,
    intent: 'focus',
    primaryVirtue: 'Courage',
    notes: [
      'In through the nose, out through the nose or mouth',
      'Keep posture tall; shoulders relaxed',
      'Draw the box in your mind: inhale → hold → exhale → hold'
    ],
    contraindications: ['If dizzy, shorten holds or pause'],
    bpmApprox: 3.75
  },
  {
    id: '478_breathing',
    name: '4-7-8 Breathing',
    description: 'Extended exhale to activate the parasympathetic nervous system and promote relaxation',
    pattern: { inhale: 4, hold: 7, exhale: 8, hold2: 0, cycles: 8 },
    benefits: ['Promotes sleep and relaxation', 'Reduces anxiety and stress', 'Manages cravings and impulses', 'Improves sleep quality'],
    color: 'from-purple-500 to-pink-500',
    gradient: 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20',
    icon: <Moon className="w-6 h-6" />,
    intent: 'calm',
    primaryVirtue: 'Temperance',
    notes: [
      'Gentle inhale, no strain on the 7-second hold',
      'Whispered prayer/mantra optional on exhale',
      'Practice lying down for best results'
    ],
    contraindications: ['Avoid long holds during pregnancy or if you feel lightheaded'],
    bpmApprox: 3
  },
  {
    id: 'wim_hof',
    name: 'Wim Hof Method',
    description: 'Deep breathing followed by breath retention to boost energy and strengthen immunity',
    pattern: { inhale: 2, hold: 0, exhale: 2, hold2: 15, cycles: 6 },
    benefits: ['Boosts energy and alertness', 'Strengthens immune system', 'Increases focus and mental clarity', 'Improves stress resilience'],
    color: 'from-orange-500 to-red-500',
    gradient: 'bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20',
    icon: <Flame className="w-6 h-6" />,
    intent: 'energize',
    primaryVirtue: 'Courage',
    notes: [
      'Never practice in/near water or while driving',
      'Stop if dizzy or uncomfortable',
      'Lie or sit safely; be gentle on your first rounds'
    ],
    contraindications: ['Avoid if pregnant or with certain cardiac conditions; consult a professional'],
    bpmApprox: 8
  },
  {
    id: 'coherent_breathing',
    name: 'Coherent Breathing',
    description: 'Slow, rhythmic breathing at 5-6 breaths per minute to balance the nervous system',
    pattern: { inhale: 5, hold: 0, exhale: 5, hold2: 0, cycles: 12 },
    benefits: ['Balances nervous system', 'Reduces blood pressure', 'Improves mood and emotional stability', 'Enhances heart rate variability'],
    color: 'from-green-500 to-emerald-500',
    gradient: 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20',
    icon: <Leaf className="w-6 h-6" />,
    intent: 'balance',
    primaryVirtue: 'Wisdom',
    notes: [
      'Even inhale/exhale with no strain',
      'If you prefer, sync to a 5-5 timing',
      'Let thoughts pass; return to the breath'
    ],
    contraindications: [],
    bpmApprox: 6
  },
  {
    id: 'ocean_breath',
    name: 'Ocean Breath (Ujjayi)',
    description: 'Gentle breathing with soft sound to calm the mind and soothe the nervous system',
    pattern: { inhale: 4, hold: 2, exhale: 6, hold2: 0, cycles: 8 },
    benefits: ['Soothes nervous system', 'Improves concentration', 'Reduces tension and anxiety', 'Enhances meditation practice'],
    color: 'from-teal-500 to-cyan-500',
    gradient: 'bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border-teal-500/20',
    icon: <Droplets className="w-6 h-6" />,
    intent: 'calm',
    primaryVirtue: 'Temperance',
    notes: [
      'Create a soft ocean sound in the back of your throat',
      'Keep the breath smooth and continuous',
      'Focus on the sound to anchor your attention'
    ],
    contraindications: [],
    bpmApprox: 5
  },
  {
    id: 'triangle_breathing',
    name: 'Triangle Breathing',
    description: 'Three-part breath pattern to build focus and mental clarity',
    pattern: { inhale: 4, hold: 4, exhale: 4, hold2: 0, cycles: 10 },
    benefits: ['Builds mental focus', 'Improves concentration', 'Reduces mental fatigue', 'Enhances cognitive performance'],
    color: 'from-indigo-500 to-purple-500',
    gradient: 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20',
    icon: <Target className="w-6 h-6" />,
    intent: 'focus',
    primaryVirtue: 'Wisdom',
    notes: [
      'Visualize a triangle as you breathe',
      'Equal timing for all three phases',
      'Keep your attention on the breath pattern'
    ],
    contraindications: [],
    bpmApprox: 4
  }
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
  const [showInfo, setShowInfo] = useState(false);
  const [sessionStats, setSessionStats] = useState({ totalSessions: 0, totalMinutes: 0 });
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const pattern = breathPatterns[selectedPattern];
  const audioRef = useRef<HTMLAudioElement>(null);

  // Calculate total session time
  const totalSessionTime = (pattern.pattern.inhale + pattern.pattern.hold + pattern.pattern.exhale + pattern.pattern.hold2) * pattern.pattern.cycles;
  const sessionProgress = isActive ? ((currentCycle - 1) * (pattern.pattern.inhale + pattern.pattern.hold + pattern.pattern.exhale + pattern.pattern.hold2) + 
    (pattern.pattern.inhale + pattern.pattern.hold + pattern.pattern.exhale + pattern.pattern.hold2) - timeLeft) / totalSessionTime : 0;

  // Audio cue system
  const playAudioCue = async (phase: string) => {
    if (isMuted || !audioEnabled) return;
    
    try {
      let audioUrl = '';
      switch (phase) {
        case 'inhale':
          audioUrl = '/audio/breathwork/inhale.mp3';
          break;
        case 'hold':
          audioUrl = '/audio/breathwork/hold.mp3';
          break;
        case 'exhale':
          audioUrl = '/audio/breathwork/exhale.mp3';
          break;
        case 'hold2':
          audioUrl = '/audio/breathwork/hold-empty.mp3';
          break;
        default:
          return;
      }
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.volume = 0.7;
        await audioRef.current.play();
      }
    } catch (error) {
      console.log('Audio cue not available');
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Phase completed, move to next phase
            if (currentPhase === 'inhale') {
              setCurrentPhase('hold');
              playAudioCue('hold');
              return pattern.pattern.hold;
            } else if (currentPhase === 'hold') {
              setCurrentPhase('exhale');
              playAudioCue('exhale');
              return pattern.pattern.exhale;
            } else if (currentPhase === 'exhale') {
              if (pattern.pattern.hold2 > 0) {
                setCurrentPhase('hold2');
                playAudioCue('hold2');
                return pattern.pattern.hold2;
              } else {
                // Cycle completed
                if (currentCycle < pattern.pattern.cycles) {
                  setCurrentCycle(prev => prev + 1);
                  setCurrentPhase('inhale');
                  playAudioCue('inhale');
                  return pattern.pattern.inhale;
                } else {
                  // Session completed
                  handleSessionComplete();
                  return pattern.pattern.inhale;
                }
              }
            } else {
              // hold2 completed, start new cycle
              if (currentCycle < pattern.pattern.cycles) {
                setCurrentCycle(prev => prev + 1);
                setCurrentPhase('inhale');
                playAudioCue('inhale');
                return pattern.pattern.inhale;
              } else {
                // Session completed
                handleSessionComplete();
                return pattern.pattern.inhale;
              }
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, currentPhase, currentCycle, pattern, isMuted, audioEnabled]);

  const handleSessionComplete = () => {
    setIsActive(false);
    setCurrentCycle(1);
    setCurrentPhase('inhale');
    setTimeLeft(pattern.pattern.inhale);
    
    // Play session complete audio
    if (!isMuted && audioEnabled && audioRef.current) {
      audioRef.current.src = '/audio/breathwork/session-complete.mp3';
      audioRef.current.volume = 0.7;
      audioRef.current.play();
    }
    
    if (sessionStartTime) {
      const sessionDuration = Math.ceil(totalSessionTime / 60);
      setSessionStats(prev => ({
        totalSessions: prev.totalSessions + 1,
        totalMinutes: prev.totalMinutes + sessionDuration
      }));
      
      // Log session to API
      logSession(sessionDuration);
    }
  };

  const logSession = async (duration: number) => {
    try {
      const response = await fetch('/api/breathwork/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pattern: pattern.id,
          duration,
          startedAt: sessionStartTime,
          completedAt: new Date()
        })
      });
      
      if (response.ok) {
        console.log('Session logged successfully');
      }
    } catch (error) {
      console.error('Failed to log session:', error);
    }
  };

  const toggleSession = () => {
    if (isActive) {
      setIsActive(false);
    } else {
      setIsActive(true);
      setTimeLeft(pattern.pattern.inhale);
      setCurrentPhase('inhale');
      setCurrentCycle(1);
      setSessionStartTime(new Date());
      
      // Play session start audio
      if (!isMuted && audioEnabled && audioRef.current) {
        audioRef.current.src = '/audio/breathwork/session-start.mp3';
        audioRef.current.volume = 0.7;
        audioRef.current.play().then(() => {
          // Play first inhale cue after session start
          setTimeout(() => playAudioCue('inhale'), 2000);
        });
      } else {
        playAudioCue('inhale');
      }
    }
  };

  const resetSession = () => {
    setIsActive(false);
    setTimeLeft(pattern.pattern.inhale);
    setCurrentPhase('inhale');
    setCurrentCycle(1);
    setSessionStartTime(null);
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div 
            className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20"
            animate={{ 
              scale: isActive ? [1, 1.1, 1] : 1,
              rotate: isActive ? [0, 5, -5, 0] : 0
            }}
            transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
          >
            <Wind className="w-6 h-6 text-blue-400" />
          </motion.div>
          <div>
            <h3 className="font-bold text-text text-lg">Breathwork</h3>
            <p className="text-sm text-muted">{sessionStats.totalSessions} sessions • {sessionStats.totalMinutes} min</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 bg-surface-2 rounded-lg text-muted hover:text-text transition-colors"
            title="Pattern Information"
          >
            <Info className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 bg-surface-2 rounded-lg text-muted hover:text-text transition-colors"
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowPatterns(!showPatterns)}
              className="flex items-center gap-2 px-3 py-2 bg-surface-2 rounded-lg text-text hover:bg-surface transition-colors"
            >
              <span className="truncate max-w-24">{pattern.name}</span>
              <motion.div
                animate={{ rotate: showPatterns ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </button>
            
            <AnimatePresence>
              {showPatterns && (
                <motion.div 
                  className="absolute top-full right-0 mt-1 w-64 bg-surface border border-border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
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
                      className={`w-full p-3 text-left hover:bg-surface-2 transition-colors border-b border-border last:border-b-0 ${
                        selectedPattern === index ? 'bg-primary/10 text-primary' : 'text-text'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-surface-2">
                          {p.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{p.name}</div>
                          <div className="text-xs text-muted truncate">{p.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Pattern Information */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-surface-2 rounded-lg border border-border"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-text mb-2">About {pattern.name}</h4>
                <p className="text-sm text-muted mb-3">{pattern.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-sm text-text">Intent: {pattern.intent}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="text-sm text-text">Virtue: {pattern.primaryVirtue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-primary" />
                    <span className="text-sm text-text">~{pattern.bpmApprox} breaths/min</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-text mb-2">Guidance</h4>
                <ul className="text-sm text-muted space-y-1 mb-3">
                  {pattern.notes.map((note, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
                
                {pattern.contraindications.length > 0 && (
                  <div>
                    <h5 className="font-medium text-text mb-1">Safety Notes</h5>
                    <ul className="text-sm text-muted space-y-1">
                      {pattern.contraindications.map((contra, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-error mt-1">⚠</span>
                          <span>{contra}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Breath Circle */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          {/* Outer progress ring */}
          <svg width="200" height="200" viewBox="0 0 200 200" className="absolute inset-0">
            <circle
              cx="100"
              cy="100"
              r="90"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="4"
              fill="none"
            />
            <motion.circle
              cx="100"
              cy="100"
              r="90"
              stroke="rgba(59, 130, 246, 0.3)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDasharray: 565, strokeDashoffset: 565 }}
              animate={{ strokeDashoffset: 565 * (1 - sessionProgress) }}
              transition={{ duration: 0.5 }}
              style={{ 
                transform: "rotate(-90deg)", 
                transformOrigin: "100px 100px" 
              }}
            />
          </svg>
          
          {/* Inner breath circle */}
          <motion.div 
            className="relative w-32 h-32 rounded-full border-4 border-white/20 flex items-center justify-center"
            animate={{
              scale: isActive ? [1, 1.2, 1] : 1,
              borderColor: isActive ? ['rgba(255,255,255,0.2)', 'rgba(59,130,246,0.4)', 'rgba(255,255,255,0.2)'] : 'rgba(255,255,255,0.2)'
            }}
            transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
          >
            <motion.div 
              className="absolute inset-4 rounded-full bg-gradient-to-br from-white/10 to-white/5"
              animate={{
                scale: isActive ? [1, 1.1, 1] : 1,
              }}
              transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
            />
            <div className="relative z-10 text-center">
              <motion.div 
                className={`text-2xl font-bold ${getPhaseColor()}`}
                animate={{ scale: isActive ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
              >
                {timeLeft}
              </motion.div>
              <div className="text-xs text-muted">{getPhaseText()}</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Phase Indicators */}
      <div className="flex justify-center gap-2 mb-6">
        {['inhale', 'hold', 'exhale', 'hold2'].map((phase, index) => {
          if (phase === 'hold2' && pattern.pattern.hold2 === 0) return null;
          return (
            <motion.div
              key={phase}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentPhase === phase ? 'w-8' : 'w-4'
              }`}
              style={{
                backgroundColor: currentPhase === phase 
                  ? (phase === 'inhale' ? '#60a5fa' : 
                     phase === 'hold' ? '#fbbf24' : 
                     phase === 'exhale' ? '#34d399' : '#a78bfa')
                  : 'rgba(255,255,255,0.2)'
              }}
              animate={{
                scale: currentPhase === phase ? 1.2 : 1,
              }}
            />
          );
        })}
      </div>

      {/* Progress and Stats */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted mb-2">
          <span>Cycle {currentCycle}/{pattern.pattern.cycles}</span>
          <span>{Math.round(sessionProgress * 100)}% complete</span>
        </div>
        <div className="w-full bg-surface-2 rounded-full h-2">
          <motion.div 
            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${sessionProgress * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted mt-2">
          <span>Pattern: {pattern.pattern.inhale}-{pattern.pattern.hold}-{pattern.pattern.exhale}-{pattern.pattern.hold2}</span>
          <span>~{formatTime(totalSessionTime)} total</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3 mb-4">
        <motion.button
          onClick={toggleSession}
          className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
            isActive 
              ? 'bg-error hover:bg-error/80 text-white' 
              : 'bg-primary hover:bg-primary/80 text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isActive ? 'Pause' : 'Start'}</span>
        </motion.button>
        
        <motion.button
          onClick={resetSession}
          className="px-4 py-3 rounded-lg bg-surface-2 hover:bg-surface text-text transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Reset Session"
        >
          <RotateCcw className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Benefits */}
      <div className="flex flex-wrap gap-2">
        {pattern.benefits.slice(0, 3).map((benefit, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-surface-2 text-text text-xs rounded-full"
          >
            {benefit}
          </span>
        ))}
        {pattern.benefits.length > 3 && (
          <span className="px-3 py-1 bg-surface-2 text-text text-xs rounded-full">
            +{pattern.benefits.length - 3} more
          </span>
        )}
      </div>

      {/* Audio element */}
      <audio ref={audioRef} preload="auto" />
    </div>
  );
} 