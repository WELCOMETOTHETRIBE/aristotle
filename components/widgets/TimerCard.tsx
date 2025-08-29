'use client';

import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Target } from 'lucide-react';
import { GlassCard } from '../GlassCard';

interface TimerCardProps {
  title: string;
  config: {
    duration: number; // seconds
    targetTemp?: string;
    includeRPE?: boolean;
    teaching: string;
  };
  onComplete: (payload: any) => void;
  virtueGrantPerCompletion: any;
}

export default function TimerCard({ title, config, onComplete, virtueGrantPerCompletion }: TimerCardProps) {
  const [timeLeft, setTimeLeft] = useState(config.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [rpe, setRpe] = useState(5);
  const [moodPre, setMoodPre] = useState(3);
  const [moodPost, setMoodPost] = useState(3);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setTimeLeft(config.duration);
    setIsRunning(false);
    setIsCompleted(false);
  };

  const handleComplete = useCallback(() => {
    const payload = {
      duration: config.duration - timeLeft,
      rpe: config.includeRPE ? rpe : undefined,
      moodPre,
      moodPost,
      targetTemp: config.targetTemp
    };

    onComplete({
      type: 'timer',
      payload,
      virtues: virtueGrantPerCompletion
    });
  }, [timeLeft, rpe, moodPre, moodPost, config, onComplete, virtueGrantPerCompletion]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((config.duration - timeLeft) / config.duration) * 100;

  return (
    <GlassCard 
      title={title}
      action={<Target className="w-5 h-5 text-gray-400" />}
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

      {/* Timer Display */}
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-white mb-2">
          {formatTime(timeLeft)}
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-4">
        {!isCompleted ? (
          <>
            {!isRunning ? (
              <button
                onClick={startTimer}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                <Play className="w-4 h-4" />
                Start
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
              >
                <Pause className="w-4 h-4" />
                Pause
              </button>
            )}
            <button
              onClick={resetTimer}
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

      {/* RPE Slider */}
      {config.includeRPE && isCompleted && (
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-2">Rate of Perceived Exertion (1-10)</label>
          <input
            type="range"
            min="1"
            max="10"
            value={rpe}
            onChange={(e) => setRpe(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>Easy</span>
            <span>Hard</span>
          </div>
        </div>
      )}

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