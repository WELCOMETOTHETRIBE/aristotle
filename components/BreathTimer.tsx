"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";

interface BreathPhase {
  name: string;
  duration: number;
  color: string;
}

interface BreathTimerProps {
  phases?: BreathPhase[];
  totalDuration?: number;
}

export default function BreathTimer({ 
  phases = [
    { name: "Inhale", duration: 4, color: "#7ad7ff" },
    { name: "Hold", duration: 4, color: "#a78bfa" },
    { name: "Exhale", duration: 4, color: "#7ad7ff" },
    { name: "Hold", duration: 4, color: "#a78bfa" },
  ],
  totalDuration = 300 // 5 minutes
}: BreathTimerProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [timeLeft, setTimeLeft] = useState(totalDuration);
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(phases[0].duration);

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
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, currentPhase, phases]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(totalDuration);
    setCurrentPhase(0);
    setPhaseTimeLeft(phases[0].duration);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = 1 - timeLeft / totalDuration;
  const phaseProgress = 1 - phaseTimeLeft / phases[currentPhase].duration;

  return (
    <div className="space-y-4">
      {/* Main timer display */}
      <div className="relative">
        <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="80"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx="100"
            cy="100"
            r="80"
            stroke={phases[currentPhase].color}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDasharray: 502.4, strokeDashoffset: 502.4 }}
            animate={{ strokeDashoffset: 502.4 * (1 - progress) }}
            transition={{ duration: 0.5 }}
            style={{ 
              transform: "rotate(-90deg)", 
              transformOrigin: "100px 100px" 
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
              <div className="text-2xl font-semibold text-white">
                {formatTime(timeLeft)}
              </div>
              <div 
                className="text-sm text-muted mt-1"
                style={{ color: phases[currentPhase].color }}
              >
                {phases[currentPhase].name}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Phase indicators */}
      <div className="flex justify-center gap-2">
        {phases.map((phase, index) => (
          <motion.div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentPhase ? 'w-8' : 'w-4'
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
      <div className="flex justify-center gap-3">
        <button
          onClick={toggleTimer}
                        className="btn-primary-light flex items-center gap-2"
          aria-label={isActive ? "Pause breathwork" : "Start breathwork"}
        >
          {isActive ? <Pause size={16} /> : <Play size={16} />}
          {isActive ? "Pause" : "Start"}
        </button>
        <button
          onClick={resetTimer}
                        className="btn-high-contrast flex items-center gap-2"
          aria-label="Reset breathwork timer"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>
    </div>
  );
} 