"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, CheckCircle } from "lucide-react";

interface FocusTimerProps {
  defaultDuration?: number; // in minutes
  onComplete?: () => void;
}

export default function FocusTimer({ 
  defaultDuration = 25,
  onComplete 
}: FocusTimerProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(defaultDuration * 60); // Convert to seconds
  const [isCompleted, setIsCompleted] = useState(false);
  const [showZenParticles, setShowZenParticles] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            setIsCompleted(true);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onComplete]);

  const toggleTimer = () => {
    if (isCompleted) {
      // Reset if completed
      setTimeLeft(defaultDuration * 60);
      setIsCompleted(false);
    } else {
      setIsActive(!isActive);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(defaultDuration * 60);
    setIsCompleted(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = 1 - timeLeft / (defaultDuration * 60);

  return (
    <div className="space-y-6">
      {/* Timer Display */}
      <div className="text-center">
        <motion.div
          key={timeLeft}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          className="text-3xl font-bold text-white mb-1"
        >
          {formatTime(timeLeft)}
        </motion.div>
        <div className="text-sm text-muted">
          {isCompleted ? 'Focus session completed!' : 'Focus time remaining'}
        </div>
      </div>

      {/* Progress Ring */}
      <div className="relative flex justify-center">
        <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r="50"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="4"
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx="60"
            cy="60"
            r="50"
            stroke="var(--accent)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDasharray: 314, strokeDashoffset: 314 }}
            animate={{ strokeDashoffset: 314 * (1 - progress) }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isCompleted ? (
            <CheckCircle size={24} className="text-success" />
          ) : (
            <div className="w-4 h-4 rounded-full bg-accent"></div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={toggleTimer}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
          aria-label={isActive ? "Pause focus session" : isCompleted ? "Start new session" : "Start focus session"}
        >
          {isActive ? <Pause size={16} /> : <Play size={16} />}
          {isActive ? "Pause" : isCompleted ? "New Session" : "Start"}
        </button>
        <button
          onClick={resetTimer}
          className="btn-secondary flex items-center justify-center gap-2"
          aria-label="Reset focus timer"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      {/* Zen Particles Toggle */}
      <div className="flex items-center justify-center gap-3 bg-white/5 rounded-lg p-3">
        <input 
          type="checkbox" 
          id="zen-particles"
          checked={showZenParticles}
          onChange={(e) => setShowZenParticles(e.target.checked)}
          className="rounded accent-accent"
        />
        <label htmlFor="zen-particles" className="text-sm text-muted cursor-pointer">
          Zen particles
        </label>
      </div>

      {/* Zen Particles Animation */}
      {showZenParticles && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-accent rounded-full opacity-60"
              initial={{
                x: Math.random() * 100 + '%',
                y: '100%',
                opacity: 0
              }}
              animate={{
                y: '-10%',
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
} 