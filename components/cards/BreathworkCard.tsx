'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Zap, Info, Settings, Volume2, VolumeX, Sparkles, Moon, Heart, Wind, Target, Waves, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreathworkCardProps {
  className?: string;
}

interface BreathworkPattern {
  id: string;
  label: string;
  description: string;
  category: 'foundation' | 'calm' | 'energy' | 'advanced' | 'therapeutic';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  inhale: number;
  hold: number;
  exhale: number;
  holdEmpty: number;
  cycles: number;
  visualType: 'circle' | 'square' | 'wave' | 'orb' | 'nostrils' | 'pulse';
  audioType: 'guided' | 'chimes' | 'nature' | 'ambient';
  benefits: string[];
  contraindications: string[];
  masteryCue: string;
  icon: any;
  color: string;
}

interface BreathworkSettings {
  audioEnabled: boolean;
  hapticEnabled: boolean;
  autoStart: boolean;
  visualMode: 'minimalist' | 'immersive';
  audioType: 'guided' | 'chimes' | 'nature' | 'ambient';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  customPatterns: BreathworkPattern[];
  showSafetyDisclaimers: boolean;
  showPostureGuidance: boolean;
}

const defaultPatterns: BreathworkPattern[] = [
  {
    id: 'box',
    label: 'Box Breathing',
    description: '4-4-4-4 pattern for calm focus and stress relief',
    category: 'calm',
    difficulty: 'beginner',
    inhale: 4, hold: 4, exhale: 4, holdEmpty: 4, cycles: 5,
    visualType: 'square',
    audioType: 'guided',
    benefits: ['Reduces stress', 'Improves focus', 'Calms nervous system'],
    contraindications: ['Avoid if dizzy or lightheaded'],
    masteryCue: 'Smooth transitions between phases, ability to sustain 5+ minutes',
    icon: Target,
    color: 'bg-blue-500/20 text-blue-500'
  },
  {
    id: '478',
    label: '4-7-8 Breathing',
    description: 'Inhale 4, hold 7, exhale 8 for deep relaxation',
    category: 'calm',
    difficulty: 'beginner',
    inhale: 4, hold: 7, exhale: 8, holdEmpty: 0, cycles: 4,
    visualType: 'orb',
    audioType: 'guided',
    benefits: ['Promotes sleep', 'Reduces anxiety', 'Calms mind'],
    contraindications: ['Stop if dizzy or uncomfortable'],
    masteryCue: 'Exhales become smooth and extended without strain',
    icon: Moon,
    color: 'bg-purple-500/20 text-purple-500'
  },
  {
    id: 'alternate-nostril',
    label: 'Alternate Nostril',
    description: 'Nadi Shodhana for balance and clarity',
    category: 'foundation',
    difficulty: 'intermediate',
    inhale: 4, hold: 4, exhale: 4, holdEmpty: 0, cycles: 10,
    visualType: 'nostrils',
    audioType: 'guided',
    benefits: ['Balances energy', 'Improves focus', 'Calms mind'],
    contraindications: ['Avoid if congested', 'Stop if uncomfortable'],
    masteryCue: 'Ability to sustain rhythm for 10+ cycles with focus',
    icon: Wind,
    color: 'bg-green-500/20 text-green-500'
  },
  {
    id: 'wim-hof',
    label: 'Wim Hof Method',
    description: '30-40 deep breaths, hold, big inhale, hold',
    category: 'advanced',
    difficulty: 'advanced',
    inhale: 2, hold: 0, exhale: 2, holdEmpty: 15, cycles: 3,
    visualType: 'pulse',
    audioType: 'guided',
    benefits: ['Increases energy', 'Improves focus', 'Enhances immunity'],
    contraindications: ['Only practice sitting/lying down', 'Stop if dizzy'],
    masteryCue: 'Comfort in longer retention, calm in cold exposure',
    icon: Flame,
    color: 'bg-orange-500/20 text-orange-500'
  },
  {
    id: 'coherent',
    label: 'Coherent Breathing',
    description: '5-6 second inhale and exhale for optimal HRV',
    category: 'foundation',
    difficulty: 'beginner',
    inhale: 5, hold: 0, exhale: 5, holdEmpty: 0, cycles: 6,
    visualType: 'wave',
    audioType: 'chimes',
    benefits: ['Optimizes HRV', 'Reduces stress', 'Improves focus'],
    contraindications: ['None for healthy individuals'],
    masteryCue: 'Feeling of calm balance, measurable HRV improvement',
    icon: Heart,
    color: 'bg-pink-500/20 text-pink-500'
  },
  {
    id: 'holotropic',
    label: 'Holotropic Breathwork',
    description: 'Deep, continuous accelerated breathing for therapeutic release',
    category: 'therapeutic',
    difficulty: 'advanced',
    inhale: 3, hold: 0, exhale: 3, holdEmpty: 0, cycles: 20,
    visualType: 'wave',
    audioType: 'ambient',
    benefits: ['Emotional release', 'Deep insights', 'Therapeutic healing'],
    contraindications: ['Requires guidance', 'Not for beginners', 'Stop if overwhelmed'],
    masteryCue: 'Emotional catharsis and self-regulation',
    icon: Waves,
    color: 'bg-indigo-500/20 text-indigo-500'
  }
];

export function BreathworkCard({ className }: BreathworkCardProps) {
  const [selectedPattern, setSelectedPattern] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'holdEmpty'>('inhale');
  const [phaseTime, setPhaseTime] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [showInfo, setShowInfo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSafety, setShowSafety] = useState(true);
  const [showPosture, setShowPosture] = useState(true);
  const [settings, setSettings] = useState<BreathworkSettings>({
    audioEnabled: true,
    hapticEnabled: true,
    autoStart: false,
    visualMode: 'minimalist',
    audioType: 'guided',
    difficulty: 'beginner',
    customPatterns: [],
    showSafetyDisclaimers: true,
    showPostureGuidance: true
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

  const patterns = [...defaultPatterns, ...settings.customPatterns];
  const currentPattern = patterns[selectedPattern];

  const getPhaseDuration = (phase: string) => {
    switch (phase) {
      case 'inhale': return currentPattern.inhale;
      case 'hold': return currentPattern.hold;
      case 'exhale': return currentPattern.exhale;
      case 'holdEmpty': return currentPattern.holdEmpty;
      default: return 4;
    }
  };

  const getTotalDuration = () => {
    const cycleDuration = currentPattern.inhale + currentPattern.hold + currentPattern.exhale + currentPattern.holdEmpty;
    return cycleDuration * currentPattern.cycles;
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
          if (nextCycle > currentPattern.cycles) {
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

  const handleSessionComplete = async () => {
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

    // Log session to API
    try {
      const sessionDuration = getTotalDuration();
      const response = await fetch('/api/breathwork/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pattern: currentPattern.label,
          durationSec: sessionDuration,
          startedAt: new Date(Date.now() - sessionDuration * 1000),
          completedAt: new Date()
        })
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
        
        console.log('Breathwork session logged successfully');
      }
    } catch (error) {
      console.error('Failed to log breathwork session:', error);
    }
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
          <h4 className="text-sm font-semibold text-text mb-3">Breathwork Settings</h4>
          <div className="space-y-3">
            {/* Audio Settings */}
            <div className="space-y-2">
              <h5 className="text-xs font-medium text-text">Audio & Feedback</h5>
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
            </div>

            {/* Visual Settings */}
            <div className="space-y-2">
              <h5 className="text-xs font-medium text-text">Visual Experience</h5>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted">Visual mode</span>
                <select
                  value={settings.visualMode}
                  onChange={(e) => saveSettings({ ...settings, visualMode: e.target.value as 'minimalist' | 'immersive' })}
                  className="text-xs bg-surface border border-border rounded px-2 py-1"
                >
                  <option value="minimalist">Minimalist</option>
                  <option value="immersive">Immersive</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted">Audio type</span>
                <select
                  value={settings.audioType}
                  onChange={(e) => saveSettings({ ...settings, audioType: e.target.value as 'guided' | 'chimes' | 'nature' | 'ambient' })}
                  className="text-xs bg-surface border border-border rounded px-2 py-1"
                >
                  <option value="guided">Guided Voice</option>
                  <option value="chimes">Chimes</option>
                  <option value="nature">Nature Sounds</option>
                  <option value="ambient">Ambient Music</option>
                </select>
              </div>
            </div>

            {/* Safety & Guidance */}
            <div className="space-y-2">
              <h5 className="text-xs font-medium text-text">Safety & Guidance</h5>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted">Show safety disclaimers</span>
                <button
                  onClick={() => saveSettings({ ...settings, showSafetyDisclaimers: !settings.showSafetyDisclaimers })}
                  className={cn(
                    'p-1.5 rounded-lg transition-colors',
                    settings.showSafetyDisclaimers 
                      ? 'bg-warning/20 text-warning' 
                      : 'bg-surface text-muted'
                  )}
                >
                  ⚠️
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted">Show posture guidance</span>
                <button
                  onClick={() => saveSettings({ ...settings, showPostureGuidance: !settings.showPostureGuidance })}
                  className={cn(
                    'p-1.5 rounded-lg transition-colors',
                    settings.showPostureGuidance 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-surface text-muted'
                  )}
                >
                  🧘
                </button>
              </div>
            </div>

            {/* Session Settings */}
            <div className="space-y-2">
              <h5 className="text-xs font-medium text-text">Session</h5>
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
              Cycle {currentCycle} of {currentPattern.cycles}
            </div>
            <div className="text-xs text-muted">
              {formatTime(getTotalDuration() - (currentCycle - 1) * (getTotalDuration() / currentPattern.cycles))} remaining
            </div>
          </div>
        </div>
      )}

      {/* Safety Disclaimers */}
      {!isActive && settings.showSafetyDisclaimers && (
        <div className="mb-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <h4 className="text-sm font-semibold text-warning mb-2">⚠️ Safety First</h4>
          <div className="text-xs text-muted space-y-1">
            <p>• Don't practice while driving, swimming, or operating machinery</p>
            <p>• Stop if you feel dizzy, lightheaded, or uncomfortable</p>
            <p>• Listen to your body and take breaks as needed</p>
          </div>
        </div>
      )}

      {/* Posture Guidance */}
      {!isActive && settings.showPostureGuidance && (
        <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <h4 className="text-sm font-semibold text-primary mb-2">🧘 Posture Guidance</h4>
          <div className="text-xs text-muted space-y-1">
            <p>• Sit upright or lie down comfortably</p>
            <p>• Relax shoulders, unclench jaw, keep spine tall but not tense</p>
            <p>• Focus on diaphragmatic (belly) breathing</p>
          </div>
        </div>
      )}

      {/* Pattern Selection */}
      {!isActive && (
        <div className="mb-4">
          <div className="grid grid-cols-1 gap-2">
            {patterns.map((pattern, index) => {
              const IconComponent = pattern.icon;
              return (
                <button
                  key={pattern.id}
                  onClick={() => setSelectedPattern(index)}
                  className={cn(
                    'p-3 rounded-lg border transition-all duration-150 text-left',
                    selectedPattern === index
                      ? 'bg-primary/20 border-primary/30'
                      : 'bg-surface-2 border-border hover:border-primary/30'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', pattern.color)}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-text">{pattern.label}</div>
                        <div className="text-xs text-muted">{pattern.description}</div>
                        <div className="text-xs text-muted mt-1">
                          {pattern.inhale}-{pattern.hold}-{pattern.exhale}-{pattern.holdEmpty} • {pattern.cycles} cycles
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-muted">
                      {formatTime(getTotalDuration())}
                    </div>
                  </div>
                </button>
              );
            })}
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