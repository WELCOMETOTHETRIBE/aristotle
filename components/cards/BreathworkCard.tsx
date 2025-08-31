'use client';

import { useState } from 'react';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreathworkCardProps {
  className?: string;
}

const presets = [
  { label: '60s', seconds: 60, description: 'Quick reset' },
  { label: '90s', seconds: 90, description: 'Mindful moment' },
  { label: '120s', seconds: 120, description: 'Deep focus' },
];

export function BreathworkCard({ className }: BreathworkCardProps) {
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(presets[0].seconds);
  const [isPaused, setIsPaused] = useState(false);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    setTimeRemaining(presets[selectedPreset].seconds);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeRemaining(presets[selectedPreset].seconds);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((presets[selectedPreset].seconds - timeRemaining) / presets[selectedPreset].seconds) * 100;

  return (
    <div className={cn(
      'bg-surface border border-border rounded-lg p-4',
      isActive && 'ring-2 ring-primary/50',
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text">Breathwork</h3>
            <p className="text-xs text-muted">Master your breath</p>
          </div>
        </div>
      </div>

      {/* Timer Display */}
      {isActive && (
        <div className="mb-4">
          <div className="relative w-20 h-20 mx-auto mb-3">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-surface-2"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 36}`}
                strokeDashoffset={`${2 * Math.PI * 36 * (1 - progress / 100)}`}
                className="text-primary transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-text">
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Preset Selection */}
      {!isActive && (
        <div className="mb-4">
          <div className="grid grid-cols-3 gap-2">
            {presets.map((preset, index) => (
              <button
                key={preset.label}
                onClick={() => setSelectedPreset(index)}
                className={cn(
                  'p-3 rounded-lg border transition-all duration-150',
                  selectedPreset === index
                    ? 'bg-primary/20 border-primary/30 text-primary'
                    : 'bg-surface-2 border-border text-muted hover:text-text hover:border-primary/30'
                )}
              >
                <div className="text-sm font-medium">{preset.label}</div>
                <div className="text-xs opacity-80">{preset.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center space-x-2">
        {!isActive ? (
          <button
            onClick={handleStart}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-150"
          >
            <Play className="w-4 h-4" />
            <span className="text-sm font-medium">Start Session</span>
          </button>
        ) : (
          <>
            <button
              onClick={handlePause}
              className="flex items-center space-x-2 px-4 py-2 bg-surface-2 border border-border text-text rounded-lg hover:bg-surface hover:border-primary/30 transition-colors duration-150"
            >
              {isPaused ? (
                <>
                  <Play className="w-4 h-4" />
                  <span className="text-sm font-medium">Resume</span>
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4" />
                  <span className="text-sm font-medium">Pause</span>
                </>
              )}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 px-4 py-2 bg-surface-2 border border-border text-muted rounded-lg hover:bg-surface hover:text-text transition-colors duration-150"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm font-medium">Reset</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
} 