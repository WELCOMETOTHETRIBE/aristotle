"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";

interface BreathPhase {
  name: string;
  duration: number;
  color: string;
  audioCue?: string;
}

interface BreathTimerCircleProps {
  patternId?: string;
  ratio?: string;
  useVoice?: boolean;
  volume?: number;
  onSessionComplete?: (session: any) => void;
}

const FRAMEWORK_BREATH_MAP: Record<string, BreathPhase[]> = {
  'stoic': [
    { name: "Inhale", duration: 4, color: "#7ad7ff", audioCue: "inhale" },
    { name: "Hold", duration: 4, color: "#a78bfa", audioCue: "hold" },
    { name: "Exhale", duration: 4, color: "#7ad7ff", audioCue: "exhale" },
    { name: "Hold", duration: 4, color: "#a78bfa", audioCue: "hold" }
  ],
  'spartan': [
    { name: "Inhale", duration: 6, color: "#ef4444", audioCue: "inhale" },
    { name: "Hold", duration: 2, color: "#dc2626", audioCue: "hold" },
    { name: "Exhale", duration: 6, color: "#ef4444", audioCue: "exhale" },
    { name: "Hold", duration: 2, color: "#dc2626", audioCue: "hold" }
  ],
  'bushido': [
    { name: "Inhale", duration: 5, color: "#10b981", audioCue: "inhale" },
    { name: "Hold", duration: 3, color: "#059669", audioCue: "hold" },
    { name: "Exhale", duration: 5, color: "#10b981", audioCue: "exhale" },
    { name: "Hold", duration: 3, color: "#059669", audioCue: "hold" }
  ],
  'default': [
    { name: "Inhale", duration: 4, color: "#7ad7ff", audioCue: "inhale" },
    { name: "Hold", duration: 4, color: "#a78bfa", audioCue: "hold" },
    { name: "Exhale", duration: 4, color: "#7ad7ff", audioCue: "exhale" },
    { name: "Hold", duration: 4, color: "#a78bfa", audioCue: "hold" }
  ]
};

export default function BreathTimerCircle({ 
  patternId = 'default',
  ratio = '4:4:4:4',
  useVoice = true,
  volume = 0.7,
  onSessionComplete
}: BreathTimerCircleProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(0);
  const [totalDuration, setTotalDuration] = useState(300);
  const [phases, setPhases] = useState<BreathPhase[]>(FRAMEWORK_BREATH_MAP[patternId] || FRAMEWORK_BREATH_MAP.default);
  const [isMuted, setIsMuted] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize phases based on ratio
  useEffect(() => {
    const ratioParts = ratio.split(':').map(Number);
    if (ratioParts.length === 4) {
      const newPhases = [...phases];
      newPhases[0].duration = ratioParts[0];
      newPhases[1].duration = ratioParts[1];
      newPhases[2].duration = ratioParts[2];
      newPhases[3].duration = ratioParts[3];
      setPhases(newPhases);
      
      const total = ratioParts.reduce((sum, part) => sum + part, 0);
      setTotalDuration(total * 10); // 10 cycles by default
      setTimeLeft(total * 10);
      setPhaseTimeLeft(ratioParts[0]);
    }
  }, [ratio]);

  // Audio cue system
  const playAudioCue = async (cue: string) => {
    if (isMuted || !useVoice) return;
    
    try {
      // Try to get cached audio from API
      const response = await fetch('/api/generate-breathwork-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pattern: patternId,
          cue,
          voice: useVoice ? 'en-US' : 'beep'
        })
      });
      
      if (response.ok) {
        const { audioUrl } = await response.json();
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.volume = volume;
          await audioRef.current.play();
        }
      }
    } catch (error) {
      console.log('Audio cue not available, using fallback');
    }
  };

  // Timer logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });

        setPhaseTimeLeft((prev) => {
          if (prev <= 1) {
            const nextPhase = (currentPhase + 1) % phases.length;
            setCurrentPhase(nextPhase);
            const newPhaseTime = phases[nextPhase].duration;
            
            // Play audio cue for new phase
            if (phases[nextPhase].audioCue) {
              playAudioCue(phases[nextPhase].audioCue!);
            }
            
            return newPhaseTime;
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
  }, [isActive, timeLeft, currentPhase, phases, isMuted, useVoice, volume]);

  const handleSessionComplete = async () => {
    if (!sessionStartTime) return;
    
    const sessionData = {
      pattern: patternId,
      durationSec: totalDuration - timeLeft,
      startedAt: sessionStartTime,
      completedAt: new Date()
    };
    
    // Log session to API
    try {
      const response = await fetch('/api/breathwork/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      });
      
      if (response.ok) {
        const result = await response.json();
        
        // Show XP gained notification
        if (result.xpGained) {
          console.log(`🎯 +${result.xpGained} Temperance XP gained!`);
          // You could add a toast notification here
        }
        
        // Show journal entry created notification
        if (result.journalEntry) {
          console.log('📝 Session logged to journal');
        }
        
        onSessionComplete?.(result.session);
      }
    } catch (error) {
      console.error('Failed to log breathwork session:', error);
    }
  };

  const toggleTimer = () => {
    if (!isActive && !sessionStartTime) {
      setSessionStartTime(new Date());
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(totalDuration);
    setCurrentPhase(0);
    setPhaseTimeLeft(phases[0].duration);
    setSessionStartTime(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = 1 - timeLeft / totalDuration;
  const phaseProgress = 1 - phaseTimeLeft / phases[currentPhase].duration;
  const circumference = 2 * Math.PI * 80;

  return (
    <div className="space-y-6">
      {/* Main timer display */}
      <div className="relative">
        <svg width="240" height="240" viewBox="0 0 240 240" className="mx-auto">
          {/* Background circle */}
          <circle
            cx="120"
            cy="120"
            r="80"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="12"
            fill="none"
          />
          
          {/* Total progress circle */}
          <motion.circle
            cx="120"
            cy="120"
            r="80"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference * (1 - progress) }}
            transition={{ duration: 0.5 }}
            style={{ 
              transform: "rotate(-90deg)", 
              transformOrigin: "120px 120px" 
            }}
          />
          
          {/* Phase progress circle */}
          <motion.circle
            cx="120"
            cy="120"
            r="60"
            stroke={phases[currentPhase].color}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDasharray: circumference * 0.75, strokeDashoffset: circumference * 0.75 }}
            animate={{ strokeDashoffset: circumference * 0.75 * (1 - phaseProgress) }}
            transition={{ duration: 0.3 }}
            style={{ 
              transform: "rotate(-90deg)", 
              transformOrigin: "120px 120px" 
            }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhase}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-white mb-2">
                {formatTime(timeLeft)}
              </div>
              <div 
                className="text-lg font-medium"
                style={{ color: phases[currentPhase].color }}
              >
                {phases[currentPhase].name}
              </div>
              <div className="text-sm text-muted mt-1">
                {phases[currentPhase].duration}s
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Phase indicators */}
      <div className="flex justify-center gap-3">
        {phases.map((phase, index) => (
          <motion.div
            key={index}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === currentPhase ? 'w-12' : 'w-6'
            }`}
            style={{
              backgroundColor: index === currentPhase 
                ? phase.color 
                : 'rgba(255,255,255,0.2)'
            }}
            animate={{
              scale: index === currentPhase ? 1.2 : 1,
            }}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <button
          onClick={toggleTimer}
          className="btn-primary-light flex items-center gap-2 px-6 py-3"
          aria-label={isActive ? "Pause breathwork" : "Start breathwork"}
        >
          {isActive ? <Pause size={20} /> : <Play size={20} />}
          {isActive ? "Pause" : "Start"}
        </button>
        
        <button
          onClick={resetTimer}
          className="btn-high-contrast flex items-center gap-2 px-6 py-3"
          aria-label="Reset breathwork timer"
        >
          <RotateCcw size={20} />
          Reset
        </button>
        
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="btn-secondary flex items-center gap-2 px-4 py-3"
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>

      {/* Audio element */}
      <audio ref={audioRef} preload="auto" />
      
      {/* Pattern info */}
      <div className="text-center text-sm text-muted">
        <div>Pattern: {patternId}</div>
        <div>Ratio: {ratio}</div>
        <div>Voice: {useVoice ? 'On' : 'Off'}</div>
      </div>
    </div>
  );
} 