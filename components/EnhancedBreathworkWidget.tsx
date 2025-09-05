'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Wind, Timer, Target, Sparkles, Heart, Settings, Info } from 'lucide-react';

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
    icon: <Heart className="w-6 h-6" />,
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
    icon: <Sparkles className="w-6 h-6" />,
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
    icon: <Target className="w-6 h-6" />,
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
    icon: <Wind className="w-6 h-6" />,
    intent: 'balance',
    primaryVirtue: 'Wisdom',
    notes: [
      'Even inhale/exhale with no strain',
      'If you prefer, sync to a 5-5 timing',
      'Let thoughts pass; return to the breath'
    ],
    contraindications: [],
    bpmApprox: 6
  }
];

interface EnhancedBreathworkWidgetProps {
  frameworkTone?: string;
}

export function EnhancedBreathworkWidget({ frameworkTone = "stoic" }: EnhancedBreathworkWidgetProps) {
  const [selectedPattern, setSelectedPattern] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'hold2'>('inhale');
  const [timeLeft, setTimeLeft] = useState(breathPatterns[0].pattern.inhale);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showPatterns, setShowPatterns] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [sessionStats, setSessionStats] = useState({ totalSessions: 0, totalMinutes: 0 });
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [prepCountdown, setPrepCountdown] = useState(3);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [hapticEnabled, setHapticEnabled] = useState(true);

  const pattern = breathPatterns[selectedPattern];
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioCache = useRef<Map<string, HTMLAudioElement>>(new Map());

  // Preload all audio files for instant playback
  useEffect(() => {
    const preloadAudio = async () => {
      const audioFiles = [
        '/audio/breathwork/inhale.mp3',
        '/audio/breathwork/hold.mp3',
        '/audio/breathwork/exhale.mp3',
        '/audio/breathwork/hold-empty.mp3',
        '/audio/breathwork/session-start.mp3',
        '/audio/breathwork/session-complete.mp3'
      ];

      // Preload counting audio (1-15)
      for (let i = 1; i <= 15; i++) {
        audioFiles.push(`/audio/breathwork/count-${i}.mp3`);
      }

      try {
        for (const audioFile of audioFiles) {
          const audio = new Audio(audioFile);
          audio.preload = 'auto';
          audioCache.current.set(audioFile, audio);
          
          // Wait for audio to be loaded
          await new Promise((resolve, reject) => {
            audio.addEventListener('canplaythrough', resolve, { once: true });
            audio.addEventListener('error', reject, { once: true });
            audio.load();
          });
        }
        setAudioLoaded(true);
        console.log('✅ All audio files preloaded successfully');
      } catch (error) {
        console.warn('⚠️ Some audio files failed to preload:', error);
        setAudioLoaded(false);
      }
    };

    preloadAudio();
  }, []);

  // Enhanced audio cue system with perfect timing
  const playAudioCue = useCallback(async (phase: string) => {
    if (isMuted || !audioEnabled || !audioLoaded) return;
    
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
      
      const cachedAudio = audioCache.current.get(audioUrl);
      if (cachedAudio) {
        cachedAudio.currentTime = 0;
        cachedAudio.volume = 0.7;
        await cachedAudio.play();
      }
    } catch (error) {
      console.log('Audio cue not available');
    }
  }, [isMuted, audioEnabled, audioLoaded]);

  // Enhanced counting audio with perfect timing
  const playCountingAudio = useCallback(async (count: number) => {
    if (isMuted || !audioEnabled || !audioLoaded || count < 1 || count > 15) return;
    
    try {
      const audioUrl = `/audio/breathwork/count-${count}.mp3`;
      const cachedAudio = audioCache.current.get(audioUrl);
      if (cachedAudio) {
        cachedAudio.currentTime = 0;
        cachedAudio.volume = 0.5;
        await cachedAudio.play();
      }
    } catch (error) {
      console.log('Counting audio not available');
    }
  }, [isMuted, audioEnabled, audioLoaded]);

  // Haptic feedback for phase transitions
  const triggerHaptic = useCallback(() => {
    if (!hapticEnabled) return;
    
    try {
      if ('vibrate' in navigator) {
        navigator.vibrate(100);
      }
    } catch (error) {
      // Haptic feedback not supported
    }
  }, [hapticEnabled]);

  // Perfect timing for phase transitions
  useEffect(() => {
    if (isActive && timeLeft === 1) {
      // Play counting audio exactly when phase is about to end
      const timer = setTimeout(() => {
        playCountingAudio(1);
      }, 500); // Play "one" at 0.5 seconds remaining
      
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isActive, playCountingAudio]);

  // Preparation phase with perfect countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPreparing && prepCountdown > 0) {
      interval = setInterval(() => {
        setPrepCountdown(prev => {
          if (prev <= 1) {
            setIsPreparing(false);
            setIsActive(true);
            // Perfect timing: play inhale cue immediately when session starts
            playAudioCue('inhale');
            triggerHaptic();
            return 3;
          }
          
          // Play countdown audio for preparation
          if (prev <= 3 && prev > 1) {
            playCountingAudio(prev);
          }
          
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPreparing, prepCountdown, playAudioCue, playCountingAudio, triggerHaptic]);

  // Main breathwork session timer with perfect synchronization
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Phase completed, move to next phase with perfect timing
            if (currentPhase === 'inhale') {
              if (pattern.pattern.hold > 0) {
                setCurrentPhase('hold');
                // Play audio cue immediately for perfect sync
                playAudioCue('hold');
                triggerHaptic();
                return pattern.pattern.hold;
              } else {
                setCurrentPhase('exhale');
                playAudioCue('exhale');
                triggerHaptic();
                return pattern.pattern.exhale;
              }
            } else if (currentPhase === 'hold') {
              setCurrentPhase('exhale');
              playAudioCue('exhale');
              triggerHaptic();
              return pattern.pattern.exhale;
            } else if (currentPhase === 'exhale') {
              if (pattern.pattern.hold2 > 0) {
                setCurrentPhase('hold2');
                playAudioCue('hold2');
                triggerHaptic();
                return pattern.pattern.hold2;
              } else {
                // Cycle completed
                if (currentCycle < pattern.pattern.cycles) {
                  setCurrentCycle(prev => prev + 1);
                  setCurrentPhase('inhale');
                  playAudioCue('inhale');
                  triggerHaptic();
                  return pattern.pattern.inhale;
                } else {
                  handleSessionComplete();
                  return pattern.pattern.inhale;
                }
              }
            } else if (currentPhase === 'hold2') {
              if (currentCycle < pattern.pattern.cycles) {
                setCurrentCycle(prev => prev + 1);
                setCurrentPhase('inhale');
                playAudioCue('inhale');
                triggerHaptic();
                return pattern.pattern.inhale;
              } else {
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
  }, [isActive, timeLeft, currentPhase, currentCycle, pattern, playAudioCue, triggerHaptic]);

  const handleSessionComplete = () => {
    setIsActive(false);
    setCurrentCycle(1);
    setCurrentPhase('inhale');
    setTimeLeft(pattern.pattern.inhale);
    
    // Play session complete audio
    if (!isMuted && audioEnabled && audioLoaded) {
      const sessionCompleteAudio = audioCache.current.get('/audio/breathwork/session-complete.mp3');
      if (sessionCompleteAudio) {
        sessionCompleteAudio.currentTime = 0;
        sessionCompleteAudio.volume = 0.7;
        sessionCompleteAudio.play();
      }
    }
    
    if (sessionStartTime) {
      const sessionDuration = Math.ceil(
        (pattern.pattern.inhale + pattern.pattern.hold + pattern.pattern.exhale + pattern.pattern.hold2) * pattern.pattern.cycles / 60
      );
      setSessionStats(prev => ({
        totalSessions: prev.totalSessions + 1,
        totalMinutes: prev.totalMinutes + sessionDuration
      }));
      
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
        const result = await response.json();
        if (result.xpGained) {
          console.log(`🎯 +${result.xpGained} Temperance XP gained!`);
        }
        if (result.journalEntry) {
          console.log('📝 Session logged to journal');
        }
      }
    } catch (error) {
      console.error('Failed to log session:', error);
    }
  };

  const startSession = () => {
    setIsPreparing(true);
    setPrepCountdown(3);
    setSessionStartTime(new Date());
    
    // Play preparation audio
    if (!isMuted && audioEnabled && audioLoaded) {
      const sessionStartAudio = audioCache.current.get('/audio/breathwork/session-start.mp3');
      if (sessionStartAudio) {
        sessionStartAudio.currentTime = 0;
        sessionStartAudio.volume = 0.7;
        sessionStartAudio.play();
      }
    }
  };

  const toggleSession = () => {
    if (isActive || isPreparing) {
      setIsActive(false);
      setIsPreparing(false);
      setPrepCountdown(3);
    } else {
      startSession();
    }
  };

  const resetSession = () => {
    setIsActive(false);
    setIsPreparing(false);
    setPrepCountdown(3);
    setTimeLeft(pattern.pattern.inhale);
    setCurrentPhase('inhale');
    setCurrentCycle(1);
    setSessionStartTime(null);
  };

  // Calculate progress and timing
  const totalSessionTime = (pattern.pattern.inhale + pattern.pattern.hold + pattern.pattern.exhale + pattern.pattern.hold2) * pattern.pattern.cycles;
  const cycleProgress = isActive ? (currentCycle - 1) / pattern.pattern.cycles : 0;
  const currentCyclePhaseProgress = isActive ? {
    inhale: currentPhase === 'inhale' ? (pattern.pattern.inhale - timeLeft) / pattern.pattern.inhale : 
            currentPhase === 'hold' || currentPhase === 'exhale' || currentPhase === 'hold2' ? 1 : 0,
    hold: currentPhase === 'hold' ? (pattern.pattern.hold - timeLeft) / pattern.pattern.hold :
          currentPhase === 'exhale' || currentPhase === 'hold2' ? 1 : 0,
    exhale: currentPhase === 'exhale' ? (pattern.pattern.exhale - timeLeft) / pattern.pattern.exhale :
            currentPhase === 'hold2' ? 1 : 0,
    hold2: currentPhase === 'hold2' ? (pattern.pattern.hold2 - timeLeft) / pattern.pattern.hold2 : 0
  } : { inhale: 0, hold: 0, exhale: 0, hold2: 0 };

  const getPhaseRingColor = (phase: string) => {
    switch (phase) {
      case 'inhale': return '#3b82f6';
      case 'hold': return '#f59e0b';
      case 'exhale': return '#10b981';
      case 'hold2': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getPhaseBgColor = (phase: string) => {
    switch (phase) {
      case 'inhale': return 'from-blue-500/20 to-cyan-500/20';
      case 'hold': return 'from-amber-500/20 to-yellow-500/20';
      case 'exhale': return 'from-emerald-500/20 to-green-500/20';
      case 'hold2': return 'from-violet-500/20 to-purple-500/20';
      default: return 'from-gray-500/20 to-gray-600/20';
    }
  };

  const getPhaseTransition = (phase: string) => {
    switch (phase) {
      case 'inhale':
        return { scale: [1, 1.1, 1], borderColor: ['rgba(59, 130, 246, 0.3)', 'rgba(59, 130, 246, 0.6)', 'rgba(59, 130, 246, 0.3)'] };
      case 'hold':
        return { scale: [1, 1.05, 1], borderColor: ['rgba(245, 158, 11, 0.3)', 'rgba(245, 158, 11, 0.6)', 'rgba(245, 158, 11, 0.3)'] };
      case 'exhale':
        return { scale: [1, 0.95, 1], borderColor: ['rgba(16, 185, 129, 0.3)', 'rgba(16, 185, 129, 0.6)', 'rgba(16, 185, 129, 0.3)'] };
      case 'hold2':
        return { scale: [1, 1.02, 1], borderColor: ['rgba(139, 92, 246, 0.3)', 'rgba(139, 92, 246, 0.6)', 'rgba(139, 92, 246, 0.3)'] };
      default:
        return { scale: 1, borderColor: 'rgba(255,255,255,0.15)' };
    }
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'inhale': return 'text-blue-400';
      case 'hold': return 'text-amber-400';
      case 'exhale': return 'text-emerald-400';
      case 'hold2': return 'text-violet-400';
      default: return 'text-gray-400';
    }
  };

  const getPhaseIcon = () => {
    switch (currentPhase) {
      case 'inhale': return <Wind className="w-8 h-8" />;
      case 'hold': return <Timer className="w-8 h-8" />;
      case 'exhale': return <Target className="w-8 h-8" />;
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

  const getCurrentPhaseProgress = () => {
    const phaseDuration = pattern.pattern[currentPhase];
    const phaseTimeLeft = timeLeft;
    return (phaseDuration - phaseTimeLeft) / phaseDuration;
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <motion.div 
            className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20"
            animate={{ 
              scale: isActive ? [1, 1.1, 1] : 1,
              rotate: isActive ? [0, 5, -5, 0] : 0
            }}
            transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
          >
            <Wind className="w-5 h-5 text-blue-400" />
          </motion.div>
          <div>
            <h3 className="font-bold text-text text-base">Enhanced Breathwork</h3>
            <p className="text-xs text-muted">{sessionStats.totalSessions} sessions • {sessionStats.totalMinutes} min</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-1.5 bg-surface-2 rounded-lg text-muted hover:text-text transition-colors"
            title="Pattern Information"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 bg-surface-2 rounded-lg text-muted hover:text-text transition-colors"
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          
          <button
            onClick={() => setHapticEnabled(!hapticEnabled)}
            className={`p-1.5 rounded-lg transition-colors ${
              hapticEnabled ? 'bg-green-500/20 text-green-500' : 'bg-surface-2 text-muted'
            }`}
            title={hapticEnabled ? "Disable Haptic" : "Enable Haptic"}
          >
            <div className="w-3.5 h-3.5">📳</div>
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowPatterns(!showPatterns)}
              className="flex items-center gap-1 px-2 py-1.5 bg-surface-2 rounded-lg text-text hover:bg-surface transition-colors text-sm"
            >
              <span className="truncate max-w-20">{pattern.name}</span>
              <motion.div
                animate={{ rotate: showPatterns ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-3.5 h-3.5">▼</div>
              </motion.div>
            </button>
            
            <AnimatePresence>
              {showPatterns && (
                <motion.div 
                  className="absolute top-full right-0 mt-1 w-56 bg-surface border border-border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto"
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
                      className={`w-full p-2 text-left hover:bg-surface-2 transition-colors border-b border-border last:border-b-0 ${
                        selectedPattern === index ? 'bg-primary/10 text-primary' : 'text-text'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-surface-2">
                          {p.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{p.name}</div>
                          <div className="text-xs text-muted truncate">{p.description}</div>
                          <div className="text-xs text-primary font-mono mt-1">
                            {p.pattern.inhale}
                            {p.pattern.hold > 0 ? `-${p.pattern.hold}` : ''}
                            -{p.pattern.exhale}
                            {p.pattern.hold2 > 0 ? `-${p.pattern.hold2}` : ''}
                            {' '}× {p.pattern.cycles}
                          </div>
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

      {/* Audio Status */}
      {!audioLoaded && (
        <div className="mb-4 p-2 bg-amber-500/20 border border-amber-500/30 rounded-lg">
          <p className="text-xs text-amber-600">Loading audio files... Please wait</p>
        </div>
      )}

      {/* Pattern Information */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 bg-surface-2 rounded-lg border border-border"
          >
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-text text-sm mb-1">About {pattern.name}</h4>
                <p className="text-xs text-muted mb-2">{pattern.description}</p>
                
                <div className="flex flex-wrap gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <Target className="w-3 h-3 text-primary" />
                    <span className="text-text">{pattern.intent}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3 text-primary" />
                    <span className="text-text">{pattern.primaryVirtue}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Timer className="w-3 h-3 text-primary" />
                    <span className="text-text">~{pattern.bpmApprox} bpm</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-text text-sm mb-1">Guidance</h4>
                <ul className="text-xs text-muted space-y-1">
                  {pattern.notes.slice(0, 2).map((note, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
                
                {pattern.contraindications.length > 0 && (
                  <div className="mt-2">
                    <h5 className="font-medium text-text text-xs mb-1">Safety</h5>
                    <p className="text-xs text-muted">{pattern.contraindications[0]}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Breath Circle */}
      <div className="flex justify-center mb-6">
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Background pattern animation */}
          <motion.div
            className="absolute inset-0 rounded-full opacity-10"
            style={{
              background: `conic-gradient(from 0deg, ${pattern.gradient.replace('bg-gradient-to-br ', '').replace(' ', ', ')} 0deg, transparent 360deg)`
            }}
            animate={{
              rotate: isActive ? 360 : 0
            }}
            transition={{
              duration: 20,
              repeat: isActive ? Infinity : 0,
              ease: "linear"
            }}
          />
          
          {/* Outer cycle progress ring */}
          <svg width="192" height="192" viewBox="0 0 192 192" className="absolute inset-0">
            <defs>
              <linearGradient id="cycleProgress" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.2)" />
                <stop offset="100%" stopColor="rgba(147, 197, 253, 0.4)" />
              </linearGradient>
            </defs>
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="3"
              fill="none"
              className="drop-shadow-sm"
            />
            <motion.circle
              cx="96"
              cy="96"
              r="88"
              stroke="url(#cycleProgress)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDasharray: 553, strokeDashoffset: 553 }}
              animate={{ strokeDashoffset: 553 * (1 - cycleProgress) }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{ 
                transform: "rotate(-90deg)", 
                transformOrigin: "96px 96px",
                filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.3))"
              }}
            />
          </svg>

          {/* Phase countdown ring */}
          <svg width="192" height="192" viewBox="0 0 192 192" className="absolute inset-0">
            <defs>
              <linearGradient id="phaseProgress" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={getPhaseRingColor(currentPhase)} />
                <stop offset="100%" stopColor={getPhaseRingColor(currentPhase)} />
              </linearGradient>
            </defs>
            <circle
              cx="96"
              cy="96"
              r="72"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="5"
              fill="none"
              className="drop-shadow-sm"
            />
            <motion.circle
              cx="96"
              cy="96"
              r="72"
              stroke="url(#phaseProgress)"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDasharray: 452, strokeDashoffset: 452 }}
              animate={{ strokeDashoffset: 452 * (1 - getCurrentPhaseProgress()) }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              style={{ 
                transform: "rotate(-90deg)", 
                transformOrigin: "96px 96px",
                filter: `drop-shadow(0 0 12px ${getPhaseRingColor(currentPhase)}40)`
              }}
            />
          </svg>
          
          {/* Inner breath circle */}
          <motion.div 
            className={`relative w-36 h-36 rounded-full border-4 flex items-center justify-center bg-gradient-to-br ${getPhaseBgColor(currentPhase)} shadow-2xl`}
            animate={{
              scale: isActive ? getPhaseTransition(currentPhase).scale : 1,
              borderColor: isActive ? getPhaseTransition(currentPhase).borderColor : 'rgba(255,255,255,0.15)',
              boxShadow: isActive ? [
                `0 0 20px ${getPhaseRingColor(currentPhase)}20`,
                `0 0 30px ${getPhaseRingColor(currentPhase)}30`,
                `0 0 20px ${getPhaseRingColor(currentPhase)}20`
              ] : '0 4px 20px rgba(0,0,0,0.1)'
            }}
            transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
            style={{
              background: `radial-gradient(circle, ${getPhaseBgColor(currentPhase).replace('bg-gradient-to-br ', '').replace(' ', ', ')} 0%, rgba(0,0,0,0.1) 100%)`
            }}
          >
            <div className="relative z-10 text-center">
              {isPreparing ? (
                <motion.div 
                  className="text-4xl font-bold text-amber-400"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                >
                  {prepCountdown}
                </motion.div>
              ) : (
                <>
                  <motion.div 
                    className={`text-3xl font-bold ${getPhaseColor()} drop-shadow-sm`}
                    animate={{ 
                      scale: isActive ? [1, 1.08, 1] : 1,
                      color: currentCycle === pattern.pattern.cycles ? ['#fbbf24', '#f59e0b', '#fbbf24'] : undefined
                    }}
                    transition={{ 
                      duration: currentCycle === pattern.pattern.cycles ? 1.5 : 1.2, 
                      repeat: isActive ? Infinity : 0 
                    }}
                  >
                    {timeLeft}
                  </motion.div>
                  <div className="text-sm text-muted mt-2 font-medium">{getPhaseText()}</div>
                  {currentCycle === pattern.pattern.cycles && (
                    <motion.div
                      className="text-xs text-amber-400 font-medium mt-1"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Final Cycle
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </motion.div>

          {/* Preparation overlay */}
          {isPreparing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-xl text-amber-400 font-bold mb-3"
                >
                  Get Ready
                </motion.div>
                <div className="text-sm text-muted font-medium">
                  Find a comfortable position
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Phase Indicators */}
      <div className="flex justify-center gap-2 mb-4">
        {['inhale', 'hold', 'exhale', 'hold2'].map((phase, index) => {
          if (phase === 'hold' && pattern.pattern.hold === 0) return null;
          if (phase === 'hold2' && pattern.pattern.hold2 === 0) return null;
          return (
            <motion.div
              key={phase}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentPhase === phase ? 'w-8' : 'w-4'
              }`}
              style={{
                backgroundColor: currentPhase === phase 
                  ? getPhaseRingColor(phase)
                  : 'rgba(255,255,255,0.2)'
              }}
              animate={{
                scale: currentPhase === phase ? [1, 1.2, 1] : 1,
                opacity: currentPhase === phase ? [1, 0.8, 1] : 0.6
              }}
              transition={{ 
                duration: 1.5, 
                repeat: currentPhase === phase ? Infinity : 0,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </div>

      {/* Progress and Stats */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-muted mb-1">
          <span>Cycle {currentCycle}/{pattern.pattern.cycles}</span>
          <span>{Math.round(cycleProgress * 100)}%</span>
        </div>
        <div className="w-full bg-surface-2 rounded-full h-2">
          <motion.div 
            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${cycleProgress * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted mt-1">
          <span>
            {pattern.pattern.inhale}
            {pattern.pattern.hold > 0 ? `-${pattern.pattern.hold}` : ''}
            -{pattern.pattern.exhale}
            {pattern.pattern.hold2 > 0 ? `-${pattern.pattern.hold2}` : ''}
          </span>
          <span>~{Math.ceil(totalSessionTime / 60)}m</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-2 mb-3">
        <motion.button
          onClick={toggleSession}
          className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 text-sm ${
            isActive || isPreparing
              ? 'bg-error hover:bg-error/80 text-white' 
              : 'bg-primary hover:bg-primary/80 text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isActive || isPreparing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isActive || isPreparing ? 'Pause' : 'Start'}</span>
        </motion.button>
        
        <motion.button
          onClick={resetSession}
          className="px-4 py-3 rounded-xl bg-surface-2 hover:bg-surface text-text transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Reset Session"
        >
          <RotateCcw className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Benefits */}
      <div className="flex flex-wrap gap-1.5">
        {pattern.benefits.slice(0, 2).map((benefit, index) => (
          <span
            key={index}
            className="px-2 py-0.5 bg-surface-2 text-text text-xs rounded-full"
          >
            {benefit}
          </span>
        ))}
        {pattern.benefits.length > 2 && (
          <span className="px-2 py-0.5 bg-surface-2 text-text text-xs rounded-full">
            +{pattern.benefits.length - 2}
          </span>
        )}
      </div>

      {/* Audio element for fallback */}
      <audio ref={audioRef} preload="auto" />
    </div>
  );
} 