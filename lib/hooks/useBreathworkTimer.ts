import { useState, useEffect, useRef, useCallback } from 'react';
import { breathworkAudioManager } from '../breathwork-audio-manager';

interface BreathPhase {
  name: 'inhale' | 'hold' | 'exhale' | 'hold2';
  duration: number;
}

interface BreathPattern {
  inhale: number;
  hold: number;
  exhale: number;
  hold2: number;
  cycles: number;
}

interface UseBreathworkTimerProps {
  pattern: BreathPattern;
  onPhaseChange?: (phase: 'inhale' | 'hold' | 'exhale' | 'hold2') => void;
  onCycleComplete?: (cycle: number) => void;
  onSessionComplete?: () => void;
  audioEnabled?: boolean;
  hapticEnabled?: boolean;
}

export function useBreathworkTimer({
  pattern,
  onPhaseChange,
  onCycleComplete,
  onSessionComplete,
  audioEnabled = true,
  hapticEnabled = true
}: UseBreathworkTimerProps) {
  const [isActive, setIsActive] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'hold2'>('inhale');
  const [timeLeft, setTimeLeft] = useState(pattern.inhale);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [prepCountdown, setPrepCountdown] = useState(3);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const prepIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastPhaseTimeRef = useRef<number>(Date.now());

  // Trigger haptic feedback
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

  // Get next phase with proper logic
  const getNextPhase = useCallback((currentPhase: 'inhale' | 'hold' | 'exhale' | 'hold2'): 'inhale' | 'hold' | 'exhale' | 'hold2' => {
    switch (currentPhase) {
      case 'inhale':
        return pattern.hold > 0 ? 'hold' : 'exhale';
      case 'hold':
        return 'exhale';
      case 'exhale':
        return pattern.hold2 > 0 ? 'hold2' : 'inhale';
      case 'hold2':
        return 'inhale';
      default:
        return 'inhale';
    }
  }, [pattern]);

  // Get phase duration
  const getPhaseDuration = useCallback((phase: 'inhale' | 'hold' | 'exhale' | 'hold2'): number => {
    switch (phase) {
      case 'inhale': return pattern.inhale;
      case 'hold': return pattern.hold;
      case 'exhale': return pattern.exhale;
      case 'hold2': return pattern.hold2;
      default: return 0;
    }
  }, [pattern]);

  // Play audio cue for phase change
  const playPhaseAudio = useCallback(async (phase: 'inhale' | 'hold' | 'exhale' | 'hold2') => {
    if (!audioEnabled) return;
    
    try {
      await breathworkAudioManager.playPhaseCue(phase);
    } catch (error) {
      console.warn('Failed to play phase audio:', error);
    }
  }, [audioEnabled]);

  // Play countdown audio
  const playCountdownAudio = useCallback(async (count: number) => {
    if (!audioEnabled) return;
    
    try {
      await breathworkAudioManager.playCountdown(count);
    } catch (error) {
      console.warn('Failed to play countdown audio:', error);
    }
  }, [audioEnabled]);

  // Handle phase transition
  const handlePhaseTransition = useCallback((newPhase: 'inhale' | 'hold' | 'exhale' | 'hold2') => {
    setCurrentPhase(newPhase);
    setTimeLeft(getPhaseDuration(newPhase));
    lastPhaseTimeRef.current = Date.now();
    
    // Play audio cue immediately for perfect sync
    playPhaseAudio(newPhase);
    triggerHaptic();
    
    // Notify parent component
    onPhaseChange?.(newPhase);
  }, [getPhaseDuration, playPhaseAudio, triggerHaptic, onPhaseChange]);

  // Handle cycle completion
  const handleCycleComplete = useCallback(() => {
    if (currentCycle < pattern.cycles) {
      setCurrentCycle(prev => prev + 1);
      handlePhaseTransition('inhale');
      onCycleComplete?.(currentCycle + 1);
    } else {
      // Session complete
      setIsActive(false);
      onSessionComplete?.();
    }
  }, [currentCycle, pattern.cycles, handlePhaseTransition, onCycleComplete, onSessionComplete]);

  // Preparation countdown timer
  useEffect(() => {
    if (isPreparing && prepCountdown > 0) {
      prepIntervalRef.current = setInterval(() => {
        setPrepCountdown(prev => {
          if (prev <= 1) {
            setIsPreparing(false);
            setIsActive(true);
            handlePhaseTransition('inhale');
            return 3;
          }
          
          // Play countdown audio for preparation
          if (prev <= 3 && prev > 1) {
            playCountdownAudio(prev);
          }
          
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (prepIntervalRef.current) {
        clearInterval(prepIntervalRef.current);
      }
    };
  }, [isPreparing, prepCountdown, handlePhaseTransition, playCountdownAudio]);

  // Main breathwork timer
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Phase completed, move to next phase
            const nextPhase = getNextPhase(currentPhase);
            
            if (nextPhase === 'inhale' && currentPhase === 'hold2') {
              // Cycle completed
              handleCycleComplete();
              return 0;
            } else {
              // Phase transition
              handlePhaseTransition(nextPhase);
              return 0;
            }
          }
          
          // Play countdown audio at specific times for perfect sync
          if (prev === 3) {
            // Play "three" at 3 seconds remaining
            setTimeout(() => playCountdownAudio(3), 0);
          } else if (prev === 2) {
            // Play "two" at 2 seconds remaining
            setTimeout(() => playCountdownAudio(2), 0);
          } else if (prev === 1) {
            // Play "one" at 1 second remaining
            setTimeout(() => playCountdownAudio(1), 0);
          }
          
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, currentPhase, getNextPhase, handlePhaseTransition, handleCycleComplete, playCountdownAudio]);

  // Start session
  const startSession = useCallback(async () => {
    setIsPreparing(true);
    setPrepCountdown(3);
    
    // Play session start audio
    if (audioEnabled) {
      try {
        await breathworkAudioManager.playSessionStart();
      } catch (error) {
        console.warn('Failed to play session start audio:', error);
      }
    }
  }, [audioEnabled]);

  // Pause session
  const pauseSession = useCallback(() => {
    setIsActive(false);
    setIsPreparing(false);
    setPrepCountdown(3);
  }, []);

  // Reset session
  const resetSession = useCallback(() => {
    setIsActive(false);
    setIsPreparing(false);
    setPrepCountdown(3);
    setTimeLeft(pattern.inhale);
    setCurrentPhase('inhale');
    setCurrentCycle(1);
    lastPhaseTimeRef.current = Date.now();
  }, [pattern.inhale]);

  // Toggle session
  const toggleSession = useCallback(() => {
    if (isActive || isPreparing) {
      pauseSession();
    } else {
      startSession();
    }
  }, [isActive, isPreparing, startSession, pauseSession]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (prepIntervalRef.current) {
        clearInterval(prepIntervalRef.current);
      }
    };
  }, []);

  return {
    // State
    isActive,
    isPreparing,
    currentPhase,
    timeLeft,
    currentCycle,
    prepCountdown,
    
    // Actions
    startSession,
    pauseSession,
    resetSession,
    toggleSession,
    
    // Computed values
    totalCycles: pattern.cycles,
    currentPhaseDuration: getPhaseDuration(currentPhase),
    phaseProgress: (getPhaseDuration(currentPhase) - timeLeft) / getPhaseDuration(currentPhase),
    cycleProgress: (currentCycle - 1) / pattern.cycles,
    sessionProgress: ((currentCycle - 1) * (pattern.inhale + pattern.hold + pattern.exhale + pattern.hold2) + 
      (pattern.inhale + pattern.hold + pattern.exhale + pattern.hold2) - timeLeft) / 
      ((pattern.inhale + pattern.hold + pattern.exhale + pattern.hold2) * pattern.cycles)
  };
} 