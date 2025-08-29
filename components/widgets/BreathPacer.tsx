'use client';

import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Wind } from 'lucide-react';
import { GlassCard } from '../GlassCard';

interface BreathPacerProps {
  title: string;
  config: {
    pattern: string;
    rounds?: number;
    retention?: boolean;
    counts?: number[];
    inhale?: number;
    exhale?: number;
    teaching: string;
  };
  onComplete: (payload: any) => void;
  virtueGrantPerCompletion: any;
}

export default function BreathPacer({ title, config, onComplete, virtueGrantPerCompletion }: BreathPacerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'hold2'>('inhale');
  const [timeLeft, setTimeLeft] = useState(0);
  const [round, setRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(config.rounds || 10);
  const [isCompleted, setIsCompleted] = useState(false);
  const [moodPre, setMoodPre] = useState(3);
  const [moodPost, setMoodPost] = useState(3);

  // Get breath pattern parameters
  const getBreathPattern = () => {
    switch (config.pattern) {
      case 'wim_hof':
        return { inhale: 2, hold: 15, exhale: 2, hold2: 0 };
      case 'box':
        return { inhale: 4, hold: 4, exhale: 4, hold2: 4 };
      case 'coherent':
        return { inhale: config.inhale || 5.5, hold: 0, exhale: config.exhale || 5.5, hold2: 0 };
      case '4-7-8':
        return { inhale: 4, hold: 7, exhale: 8, hold2: 0 };
      case 'triangle':
        return { inhale: 3, hold: 3, exhale: 3, hold2: 0 };
      case 'ocean':
        return { inhale: 4, hold: 0, exhale: 6, hold2: 0 };
      case 'heart_coherence':
        return { inhale: 5, hold: 0, exhale: 5, hold2: 0 };
      case 'mantra':
        return { inhale: 4, hold: 0, exhale: 4, hold2: 0 };
      case 'nadi_shodhana':
        return { inhale: 4, hold: 0, exhale: 4, hold2: 0 };
      default:
        return { inhale: 4, hold: 0, exhale: 4, hold2: 0 };
    }
  };

  const pattern = getBreathPattern();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Move to next phase
            if (currentPhase === 'inhale') {
              setCurrentPhase('hold');
              setTimeLeft(pattern.hold);
            } else if (currentPhase === 'hold') {
              setCurrentPhase('exhale');
              setTimeLeft(pattern.exhale);
            } else if (currentPhase === 'exhale') {
              if (pattern.hold2 > 0) {
                setCurrentPhase('hold2');
                setTimeLeft(pattern.hold2);
              } else {
                // Complete round
                if (round < totalRounds) {
                  setRound(prev => prev + 1);
                  setCurrentPhase('inhale');
                  setTimeLeft(pattern.inhale);
                } else {
                  // All rounds complete
                  setIsRunning(false);
                  setIsCompleted(true);
                  return 0;
                }
              }
            } else if (currentPhase === 'hold2') {
              // Complete round
              if (round < totalRounds) {
                setRound(prev => prev + 1);
                setCurrentPhase('inhale');
                setTimeLeft(pattern.inhale);
              } else {
                setIsRunning(false);
                setIsCompleted(true);
                return 0;
              }
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, currentPhase, round, totalRounds, pattern]);

  const startBreathing = () => {
    setIsRunning(true);
    setCurrentPhase('inhale');
    setTimeLeft(pattern.inhale);
  };

  const pauseBreathing = () => {
    setIsRunning(false);
  };

  const resetBreathing = () => {
    setIsRunning(false);
    setCurrentPhase('inhale');
    setTimeLeft(0);
    setRound(1);
    setIsCompleted(false);
  };

  const handleComplete = useCallback(() => {
    const payload = {
      pattern: config.pattern,
      rounds: totalRounds,
      completedRounds: round,
      retention: config.retention,
      moodPre,
      moodPost
    };

    onComplete({
      type: 'breath',
      payload,
      virtues: virtueGrantPerCompletion
    });
  }, [config, totalRounds, round, moodPre, moodPost, onComplete, virtueGrantPerCompletion]);

  const getPhaseText = () => {
    switch (currentPhase) {
      case 'inhale':
        return 'Inhale';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Exhale';
      case 'hold2':
        return 'Hold';
      default:
        return 'Ready';
    }
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'inhale':
        return 'from-blue-500 to-green-500';
      case 'hold':
        return 'from-yellow-500 to-orange-500';
      case 'exhale':
        return 'from-red-500 to-purple-500';
      case 'hold2':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <GlassCard 
      title={title}
      action={<Wind className="w-5 h-5 text-gray-400" />}
      className="p-6"
    >
      <p className="text-sm text-gray-300 mb-4">{config.teaching}</p>

      {/* Pre-mood check */}
      {!isRunning && !isCompleted && (
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-2">How do you feel? (1-5)</label>
          <input
            type="range"
            min="1"
            max="5"
            value={moodPre}
            onChange={(e) => setMoodPre(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>Poor</span>
            <span>Good</span>
          </div>
        </div>
      )}

      {/* Breath Display */}
      <div className="text-center mb-6">
        <div className={`text-6xl font-bold mb-4 transition-all duration-1000 ${
          isRunning ? 'text-white' : 'text-gray-400'
        }`}>
          {timeLeft}
        </div>
        <div className={`text-xl font-medium mb-2 ${
          isRunning ? 'text-white' : 'text-gray-400'
        }`}>
          {getPhaseText()}
        </div>
        <div className="text-sm text-gray-400 mb-4">
          Round {round} of {totalRounds}
        </div>
        
        {/* Animated circle */}
        <div className="relative w-32 h-32 mx-auto mb-4">
          <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${getPhaseColor()} transition-all duration-1000 ${
            isRunning ? 'opacity-100 scale-100' : 'opacity-50 scale-75'
          }`} />
          <div className="absolute inset-2 rounded-full bg-gray-900" />
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-4">
        {!isCompleted ? (
          <>
            {!isRunning ? (
              <button
                onClick={startBreathing}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                <Play className="w-4 h-4" />
                Start
              </button>
            ) : (
              <button
                onClick={pauseBreathing}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
              >
                <Pause className="w-4 h-4" />
                Pause
              </button>
            )}
            <button
              onClick={resetBreathing}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </>
        ) : (
          <button
            onClick={handleComplete}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Complete
          </button>
        )}
      </div>

      {/* Post-mood check */}
      {isCompleted && (
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-2">How do you feel now? (1-5)</label>
          <input
            type="range"
            min="1"
            max="5"
            value={moodPost}
            onChange={(e) => setMoodPost(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>Poor</span>
            <span>Good</span>
          </div>
        </div>
      )}
    </GlassCard>
  );
} 