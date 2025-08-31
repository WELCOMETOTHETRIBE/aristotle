'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Zap, Info, Settings, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreathworkCardProps {
  className?: string;
}

interface BreathworkPreset {
  id: string;
  label: string;
  seconds: number;
  description: string;
  inhale: number;
  hold: number;
  exhale: number;
  holdEmpty: number;
  cycles: number;
}

interface BreathworkSettings {
  audioEnabled: boolean;
  hapticEnabled: boolean;
  autoStart: boolean;
  customPresets: BreathworkPreset[];
}

const defaultPresets: BreathworkPreset[] = [
  { 
    id: 'box', 
    label: 'Box Breathing', 
    seconds: 60, 
    description: '4-4-4-4 pattern for calm focus',
    inhale: 4, hold: 4, exhale: 4, holdEmpty: 4, cycles: 4
  },
  { 
    id: 'coherent', 
    label: 'Coherent Breathing', 
    seconds: 90, 
    description: '5-5 pattern for stress relief',
    inhale: 5, hold: 0, exhale: 5, holdEmpty: 0, cycles: 6
  },
  { 
    id: 'triangle', 
    label: 'Triangle Breathing', 
    seconds: 120, 
    description: '4-4-8 pattern for deep relaxation',
    inhale: 4, hold: 4, exhale: 8, holdEmpty: 0, cycles: 5
  },
];

export function BreathworkCard({ className }: BreathworkCardProps) {
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'holdEmpty'>('inhale');
  const [phaseTime, setPhaseTime] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [showInfo, setShowInfo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<BreathworkSettings>({
    audioEnabled: true,
    hapticEnabled: true,
    autoStart: false,
    customPresets: []
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('breathworkSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = (newSettings: BreathworkSettings) => {
    setSettings(newSettings);
    localStorage.setItem('breathworkSettings', JSON.stringify(newSettings));
  };

  const presets = [...defaultPresets, ...settings.customPresets];
  const currentPreset = presets[selectedPreset];

  const getPhaseDuration = (phase: string) => {
    switch (phase) {
      case 'inhale': return currentPreset.inhale;
      case 'hold': return currentPreset.hold;
      case 'exhale': return currentPreset.exhale;
      case 'holdEmpty': return currentPreset.holdEmpty;
      default: return 4;
    }
  };

  const getNextPhase = (current: string): { phase: typeof currentPhase; cycle: number } => {
    const phases = ['inhale', 'hold', 'exhale', 'holdEmpty'].filter(p => 
      getPhaseDuration(p) > 0
    );
    const currentIndex = phases.indexOf(current);
    const nextIndex = (currentIndex + 1) % phases.length;
    const nextPhase = phases[nextIndex] as typeof currentPhase;
    
    // If we're back to inhale, increment cycle
    const nextCycle = nextPhase === 'inhale' ? currentCycle + 1 : currentCycle;
    
    return { phase: nextPhase, cycle: nextCycle };
  };

  const playAudioCue = (phase: string) => {
    if (!settings.audioEnabled || !audioRef.current) return;
    
    // In a real app, you'd have different audio files for each phase
    audioRef.current.play().catch(() => {
      // Audio failed to play, continue without audio
    });
  };

  const triggerHaptic = () => {
    if (!settings.hapticEnabled || !navigator.vibrate) return;
    navigator.vibrate(100);
  };

  const startSession = () => {
    setIsActive(true);
    setIsPaused(false);
    setCurrentPhase('inhale');
    setPhaseTime(0);
    setCurrentCycle(1);
    
    if (settings.autoStart) {
      startTimer();
    }
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setPhaseTime(prev => {
        const phaseDuration = getPhaseDuration(currentPhase);
        
        if (prev >= phaseDuration) {
          // Phase complete, move to next
          const { phase: nextPhase, cycle: nextCycle } = getNextPhase(currentPhase);
          
          // Check if session is complete
          if (nextCycle > currentPreset.cycles) {
            handleSessionComplete();
            return prev;
          }
          
          setCurrentPhase(nextPhase);
          setCurrentCycle(nextCycle);
          
          // Play audio and haptic for phase change
          playAudioCue(nextPhase);
          triggerHaptic();
          
          return 0;
        }
        
        return prev + 1;
      });
    }, 1000);
  };

  const handleSessionComplete = () => {
    setIsActive(false);
    setIsPaused(false);
    setCurrentPhase('inhale');
    setPhaseTime(0);
    setCurrentCycle(1);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Play completion sound
    if (settings.audioEnabled) {
      // In a real app, play completion audio
    }
    
    triggerHaptic();
  };

  const handlePause = () => {
    if (isPaused) {
      setIsPaused(false);
      startTimer();
    } else {
      setIsPaused(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    setCurrentPhase('inhale');
    setPhaseTime(0);
    setCurrentCycle(1);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseProgress = () => {
    const phaseDuration = getPhaseDuration(currentPhase);
    return phaseDuration > 0 ? (phaseTime / phaseDuration) * 100 : 0;
  };

  const getPhaseLabel = () => {
    const labels = {
      inhale: 'Inhale',
      hold: 'Hold',
      exhale: 'Exhale',
      holdEmpty: 'Hold Empty'
    };
    return labels[currentPhase];
  };

  const getPhaseColor = () => {
    const colors = {
      inhale: 'text-blue-500',
      hold: 'text-yellow-500',
      exhale: 'text-green-500',
      holdEmpty: 'text-purple-500'
    };
    return colors[currentPhase];
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className={cn(
      'bg-surface border border-border rounded-lg p-4',
      isActive && 'ring-2 ring-primary/50',
      className
    )}>
      {/* Header with Info and Settings */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center">
            <Zap className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text">Breathwork</h3>
            <p className="text-xs text-muted">Master your breath</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-1.5 hover:bg-surface-2 rounded-lg transition-colors"
          >
            <Info className="w-4 h-4 text-muted" />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 hover:bg-surface-2 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4 text-muted" />
          </button>
        </div>
      </div>

      {/* Info Modal */}
      {showInfo && (
        <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <h4 className="text-sm font-semibold text-text mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            How to use Breathwork
          </h4>
          <div className="text-xs text-muted space-y-2">
            <p>• Choose a breathing pattern that matches your needs</p>
            <p>• Follow the visual cues and audio guidance</p>
            <p>• Focus on your breath and let thoughts pass by</p>
            <p>• Practice regularly for best results</p>
            <p>• Use settings to customize your experience</p>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="mb-4 p-3 bg-surface-2 border border-border rounded-lg">
          <h4 className="text-sm font-semibold text-text mb-3">Settings</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">Audio cues</span>
              <button
                onClick={() => saveSettings({ ...settings, audioEnabled: !settings.audioEnabled })}
                className={cn(
                  'p-1.5 rounded-lg transition-colors',
                  settings.audioEnabled 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-surface text-muted'
                )}
              >
                {settings.audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">Haptic feedback</span>
              <button
                onClick={() => saveSettings({ ...settings, hapticEnabled: !settings.hapticEnabled })}
                className={cn(
                  'p-1.5 rounded-lg transition-colors',
                  settings.hapticEnabled 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-surface text-muted'
                )}
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  {settings.hapticEnabled ? '📳' : '🔇'}
                </div>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">Auto-start timer</span>
              <button
                onClick={() => saveSettings({ ...settings, autoStart: !settings.autoStart })}
                className={cn(
                  'p-1.5 rounded-lg transition-colors',
                  settings.autoStart 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-surface text-muted'
                )}
              >
                <Play className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timer Display */}
      {isActive && (
        <div className="mb-4">
          <div className="relative w-24 h-24 mx-auto mb-3">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 96 96">
              <circle
                cx="48"
                cy="48"
                r="44"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-surface-2"
              />
              <circle
                cx="48"
                cy="48"
                r="44"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 44}`}
                strokeDashoffset={`${2 * Math.PI * 44 * (1 - getPhaseProgress() / 100)}`}
                className={cn('transition-all duration-1000 ease-linear', getPhaseColor())}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-text">
                {getPhaseDuration(currentPhase) - phaseTime}
              </span>
              <span className="text-xs text-muted">{getPhaseLabel()}</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm font-medium text-text">
              Cycle {currentCycle} of {currentPreset.cycles}
            </div>
            <div className="text-xs text-muted">
              {formatTime(currentPreset.seconds - (currentCycle - 1) * (currentPreset.seconds / currentPreset.cycles))} remaining
            </div>
          </div>
        </div>
      )}

      {/* Preset Selection */}
      {!isActive && (
        <div className="mb-4">
          <div className="grid grid-cols-1 gap-2">
            {presets.map((preset, index) => (
              <button
                key={preset.id}
                onClick={() => setSelectedPreset(index)}
                className={cn(
                  'p-3 rounded-lg border transition-all duration-150 text-left',
                  selectedPreset === index
                    ? 'bg-primary/20 border-primary/30'
                    : 'bg-surface-2 border-border hover:border-primary/30'
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-text">{preset.label}</div>
                    <div className="text-xs text-muted">{preset.description}</div>
                    <div className="text-xs text-muted mt-1">
                      {preset.inhale}-{preset.hold}-{preset.exhale}-{preset.holdEmpty} • {preset.cycles} cycles
                    </div>
                  </div>
                  <div className="text-sm font-medium text-muted">
                    {formatTime(preset.seconds)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center space-x-2">
        {!isActive ? (
          <button
            onClick={startSession}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-150"
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

      {/* Hidden audio element */}
      <audio ref={audioRef} preload="auto" />
    </div>
  );
} 