'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Heart, Timer, Target, Volume2, VolumeX } from 'lucide-react';

interface BreathPattern {
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
  icon: string;
}

const breathPatterns: BreathPattern[] = [
  {
    name: 'Box Breathing',
    description: 'Equal duration for each phase to calm the nervous system',
    pattern: { inhale: 4, hold: 4, exhale: 4, hold2: 4, cycles: 10 },
    benefits: ['Reduces stress', 'Improves focus', 'Calms anxiety'],
    color: 'from-blue-500 to-cyan-500',
    icon: '🧘',
  },
  {
    name: '4-7-8 Breathing',
    description: 'Extended exhale to activate the parasympathetic nervous system',
    pattern: { inhale: 4, hold: 7, exhale: 8, hold2: 0, cycles: 8 },
    benefits: ['Promotes sleep', 'Reduces anxiety', 'Manages cravings'],
    color: 'from-purple-500 to-pink-500',
    icon: '🌙',
  },
  {
    name: 'Wim Hof Method',
    description: 'Deep breathing followed by breath retention',
    pattern: { inhale: 2, hold: 0, exhale: 2, hold2: 15, cycles: 6 },
    benefits: ['Boosts energy', 'Strengthens immune system', 'Increases focus'],
    color: 'from-orange-500 to-red-500',
    icon: '🔥',
  },
  {
    name: 'Coherent Breathing',
    description: 'Slow, rhythmic breathing at 5-6 breaths per minute',
    pattern: { inhale: 5, hold: 0, exhale: 5, hold2: 0, cycles: 12 },
    benefits: ['Balances nervous system', 'Reduces blood pressure', 'Improves mood'],
    color: 'from-green-500 to-emerald-500',
    icon: '🌿',
  },
  {
    name: 'Triangle Breathing',
    description: 'Equal inhale and exhale with no holds for simplicity',
    pattern: { inhale: 6, hold: 0, exhale: 6, hold2: 0, cycles: 10 },
    benefits: ['Simple and accessible', 'Reduces heart rate', 'Promotes relaxation'],
    color: 'from-indigo-500 to-blue-500',
    icon: '🔺',
  },
  {
    name: 'Ocean Breath',
    description: 'Gentle breathing with soft sound to calm the mind',
    pattern: { inhale: 4, hold: 2, exhale: 6, hold2: 0, cycles: 8 },
    benefits: ['Soothes nervous system', 'Improves concentration', 'Reduces tension'],
    color: 'from-teal-500 to-cyan-500',
    icon: '🌊',
  },
];

interface BreathworkWidgetNewProps {
  frameworkTone?: string;
}

// Framework-specific color schemes
const frameworkColors = {
  spartan: {
    primary: 'from-red-600 to-orange-600',
    secondary: 'from-orange-500 to-red-500',
    accent: 'text-red-600 bg-red-100 border-red-200'
  },
  bushido: {
    primary: 'from-gray-700 to-gray-900',
    secondary: 'from-gray-600 to-gray-800',
    accent: 'text-gray-700 bg-gray-100 border-gray-200'
  },
  stoic: {
    primary: 'from-blue-600 to-indigo-700',
    secondary: 'from-indigo-500 to-blue-600',
    accent: 'text-blue-600 bg-blue-100 border-blue-200'
  },
  monastic: {
    primary: 'from-purple-600 to-violet-700',
    secondary: 'from-violet-500 to-purple-600',
    accent: 'text-purple-600 bg-purple-100 border-purple-200'
  },
  yogic: {
    primary: 'from-green-600 to-emerald-700',
    secondary: 'from-emerald-500 to-green-600',
    accent: 'text-green-600 bg-green-100 border-green-200'
  },
  indigenous: {
    primary: 'from-amber-600 to-orange-600',
    secondary: 'from-orange-500 to-amber-500',
    accent: 'text-amber-600 bg-amber-100 border-amber-200'
  },
  martial: {
    primary: 'from-slate-700 to-gray-800',
    secondary: 'from-gray-600 to-slate-700',
    accent: 'text-slate-700 bg-slate-100 border-slate-200'
  },
  sufi: {
    primary: 'from-rose-600 to-pink-700',
    secondary: 'from-pink-500 to-rose-600',
    accent: 'text-rose-600 bg-rose-100 border-rose-200'
  },
  ubuntu: {
    primary: 'from-teal-600 to-cyan-700',
    secondary: 'from-cyan-500 to-teal-600',
    accent: 'text-teal-600 bg-teal-100 border-teal-200'
  },
  highperf: {
    primary: 'from-indigo-600 to-purple-700',
    secondary: 'from-purple-500 to-indigo-600',
    accent: 'text-indigo-600 bg-indigo-100 border-indigo-200'
  },
  systems: {
    primary: 'from-blue-600 to-cyan-700',
    secondary: 'from-cyan-500 to-blue-600',
    accent: 'text-blue-600 bg-blue-100 border-blue-200'
  }
};

export function BreathworkWidgetNew({ frameworkTone }: BreathworkWidgetNewProps) {
  const [selectedPattern, setSelectedPattern] = useState<BreathPattern>(breathPatterns[0]);
  
  // Get framework-specific colors
  const getFrameworkColor = () => {
    if (frameworkTone && frameworkColors[frameworkTone as keyof typeof frameworkColors]) {
      return frameworkColors[frameworkTone as keyof typeof frameworkColors];
    }
    return frameworkColors.stoic; // Default fallback
  };
  
  const frameworkColor = getFrameworkColor();
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'hold2'>('inhale');
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [totalCycles, setTotalCycles] = useState(selectedPattern.pattern.cycles);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [breathScale, setBreathScale] = useState(1);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [audioMapping, setAudioMapping] = useState<any>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [databaseAvailable, setDatabaseAvailable] = useState(true);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load audio mapping on component mount
  useEffect(() => {
    const loadAudioMapping = async () => {
      try {
        const response = await fetch('/audio/breathwork/audio-mapping.json');
        if (response.ok) {
          const mapping = await response.json();
          setAudioMapping(mapping);
        }
      } catch (error) {
        console.warn('Audio mapping not available');
        setAudioMapping(null);
      }
    };
    
    loadAudioMapping();
  }, []);

  // Initialize audio context on user interaction
  const initializeAudio = () => {
    if (!audioInitialized && audioRef.current) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContext.resume().then(() => {
        setAudioInitialized(true);
        setAudioEnabled(true);
      });
    }
  };

  // Play pre-generated audio guidance for current phase
  const playAudioGuidance = (phase: string) => {
    if (!audioEnabled || !audioMapping || isLoadingAudio) return;
    
    setIsLoadingAudio(true);
    
    let audioUrl = '';
    switch (phase) {
      case 'inhale':
        audioUrl = audioMapping.instructions.inhale;
        break;
      case 'hold':
        audioUrl = audioMapping.instructions.hold;
        break;
      case 'exhale':
        audioUrl = audioMapping.instructions.exhale;
        break;
      case 'hold2':
        audioUrl = audioMapping.instructions.holdEmpty;
        break;
    }

    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.volume = 0.7;
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsLoadingAudio(false);
          })
          .catch((error) => {
            console.error('Error playing audio guidance:', error);
            setIsLoadingAudio(false);
          });
      }
    } else {
      setIsLoadingAudio(false);
    }
  };

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Move to next phase
            const nextPhase = getNextPhase(currentPhase);
            setCurrentPhase(nextPhase);
            
            if (nextPhase === 'inhale' && currentPhase === 'hold2') {
              // Completed a cycle
              if (currentCycle >= totalCycles) {
                // Session complete
                handleSessionComplete();
                return 0;
              } else {
                setCurrentCycle(prev => prev + 1);
              }
            }
            
            const newDuration = getPhaseDuration(nextPhase);
            
            // Play audio guidance for new phase
            if (audioEnabled) {
              setTimeout(() => {
                playAudioGuidance(nextPhase);
              }, 100);
            }
            
            return newDuration;
          }
          
          return prev - 1;
        });
      }, 1000);

      // Track session duration
      sessionIntervalRef.current = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (sessionIntervalRef.current) {
        clearInterval(sessionIntervalRef.current);
        sessionIntervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (sessionIntervalRef.current) clearInterval(sessionIntervalRef.current);
    };
  }, [isActive, currentPhase, currentCycle, totalCycles, audioEnabled]);

  // Animate breath circle with smooth transitions
  useEffect(() => {
    if (isActive) {
      let scale = 1;
      
      switch (currentPhase) {
        case 'inhale':
          scale = 1.3;
          break;
        case 'hold':
          scale = 1.1;
          break;
        case 'exhale':
          scale = 0.7;
          break;
        case 'hold2':
          scale = 0.9;
          break;
        default:
          scale = 1;
      }
      
      setBreathScale(scale);
    } else {
      setBreathScale(1);
    }
  }, [currentPhase, isActive]);

  const getNextPhase = (phase: string): 'inhale' | 'hold' | 'exhale' | 'hold2' => {
    switch (phase) {
      case 'inhale': return 'hold';
      case 'hold': return 'exhale';
      case 'exhale': return selectedPattern.pattern.hold2 > 0 ? 'hold2' : 'inhale';
      case 'hold2': return 'inhale';
      default: return 'inhale';
    }
  };

  const getPhaseDuration = (phase: string): number => {
    switch (phase) {
      case 'inhale': return selectedPattern.pattern.inhale;
      case 'hold': return selectedPattern.pattern.hold;
      case 'exhale': return selectedPattern.pattern.exhale;
      case 'hold2': return selectedPattern.pattern.hold2;
      default: return 0;
    }
  };

  const getPhaseLabel = (phase: string): string => {
    switch (phase) {
      case 'inhale': return 'Inhale';
      case 'hold': return 'Hold';
      case 'exhale': return 'Exhale';
      case 'hold2': return 'Hold';
      default: return '';
    }
  };

  const getPhaseBorderColor = (phase: string): string => {
    // Use framework-specific colors for phases
    const baseColor = frameworkColor.primary.includes('red') ? '#dc2626' :
                     frameworkColor.primary.includes('blue') ? '#2563eb' :
                     frameworkColor.primary.includes('green') ? '#16a34a' :
                     frameworkColor.primary.includes('purple') ? '#7c3aed' :
                     frameworkColor.primary.includes('gray') ? '#4b5563' :
                     frameworkColor.primary.includes('teal') ? '#0d9488' :
                     frameworkColor.primary.includes('indigo') ? '#4f46e5' :
                     frameworkColor.primary.includes('rose') ? '#e11d48' :
                     frameworkColor.primary.includes('amber') ? '#d97706' :
                     frameworkColor.primary.includes('slate') ? '#475569' : '#3b82f6';
    
    switch (phase) {
      case 'inhale': return baseColor;
      case 'hold': return baseColor;
      case 'exhale': return baseColor;
      case 'hold2': return baseColor;
      default: return '#e5e7eb';
    }
  };

  const getPhaseGlowColor = (phase: string): string => {
    const baseColor = frameworkColor.primary.includes('red') ? 'rgba(220, 38, 38, 0.5)' :
                     frameworkColor.primary.includes('blue') ? 'rgba(37, 99, 235, 0.5)' :
                     frameworkColor.primary.includes('green') ? 'rgba(22, 163, 74, 0.5)' :
                     frameworkColor.primary.includes('purple') ? 'rgba(124, 58, 237, 0.5)' :
                     frameworkColor.primary.includes('gray') ? 'rgba(75, 85, 99, 0.5)' :
                     frameworkColor.primary.includes('teal') ? 'rgba(13, 148, 136, 0.5)' :
                     frameworkColor.primary.includes('indigo') ? 'rgba(79, 70, 229, 0.5)' :
                     frameworkColor.primary.includes('rose') ? 'rgba(225, 29, 72, 0.5)' :
                     frameworkColor.primary.includes('amber') ? 'rgba(217, 119, 6, 0.5)' :
                     frameworkColor.primary.includes('slate') ? 'rgba(71, 85, 105, 0.5)' : 'rgba(59, 130, 246, 0.5)';
    
    switch (phase) {
      case 'inhale': return baseColor;
      case 'hold': return baseColor;
      case 'exhale': return baseColor;
      case 'hold2': return baseColor;
      default: return baseColor;
    }
  };

  const getPhaseProgressColor = (phase: string): string => {
    const baseColor = frameworkColor.primary.includes('red') ? '#dc2626' :
                     frameworkColor.primary.includes('blue') ? '#2563eb' :
                     frameworkColor.primary.includes('green') ? '#16a34a' :
                     frameworkColor.primary.includes('purple') ? '#7c3aed' :
                     frameworkColor.primary.includes('gray') ? '#4b5563' :
                     frameworkColor.primary.includes('teal') ? '#0d9488' :
                     frameworkColor.primary.includes('indigo') ? '#4f46e5' :
                     frameworkColor.primary.includes('rose') ? '#e11d48' :
                     frameworkColor.primary.includes('amber') ? '#d97706' :
                     frameworkColor.primary.includes('slate') ? '#475569' : '#3b82f6';
    
    switch (phase) {
      case 'inhale': return baseColor;
      case 'hold': return baseColor;
      case 'exhale': return baseColor;
      case 'hold2': return baseColor;
      default: return baseColor;
    }
  };

  const getPhaseColor = (phase: string): string => {
    return frameworkColor.accent;
  };

  const handleStart = async () => {
    if (!audioInitialized) {
      initializeAudio();
    }
    
    setIsActive(true);
    setCurrentPhase('inhale');
    setTimeLeft(selectedPattern.pattern.inhale);
    setCurrentCycle(1);
    setSessionStartTime(new Date());
    setSessionDuration(0);

    if (audioEnabled) {
      playAudioGuidance('inhale');
    }

    if (databaseAvailable) {
      try {
        await fetch('/api/skills/invoke', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            skill: 'breathwork.start',
            args: {
              name: selectedPattern.name,
              pattern: selectedPattern.pattern,
              durationSec: selectedPattern.pattern.cycles * (
                selectedPattern.pattern.inhale + 
                selectedPattern.pattern.hold + 
                selectedPattern.pattern.exhale + 
                (selectedPattern.pattern.hold2 || 0)
              ),
            },
          }),
        });
      } catch (error) {
        console.warn('Breathwork session logging failed:', error);
        setDatabaseAvailable(false);
      }
    }
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentPhase('inhale');
    setTimeLeft(selectedPattern.pattern.inhale);
    setCurrentCycle(1);
    setSessionStartTime(null);
    setSessionDuration(0);
  };

  const handleSessionComplete = async () => {
    setIsActive(false);
    setCurrentPhase('inhale');
    setTimeLeft(0);
    
    if (audioEnabled) {
      // Play completion sound if available
    }
    
    try {
      console.log('Breathwork session completed:', {
        pattern: selectedPattern.name,
        duration: sessionDuration,
        cycles: totalCycles,
      });
    } catch (error) {
      console.warn('Session completion logging failed:', error);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatSessionDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div>
      {/* Hidden audio element for TTS playback */}
      <audio ref={audioRef} preload="auto" />
      
      <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-2xl">{selectedPattern.icon}</span>
            <CardTitle className="text-lg">{selectedPattern.name}</CardTitle>
          </div>
          <CardDescription className="text-sm">{selectedPattern.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="text-center pb-6">
          {/* Audio Controls */}
          <div className="flex justify-center gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!audioInitialized) {
                  initializeAudio();
                } else {
                  setAudioEnabled(!audioEnabled);
                }
              }}
              disabled={isLoadingAudio}
              className={`flex items-center gap-2 ${
                audioEnabled ? 'text-blue-600 border-blue-200' : 'text-gray-500 border-gray-200'
              }`}
            >
              {isLoadingAudio ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
              ) : audioEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
              {isLoadingAudio 
                ? 'Loading...' 
                : !audioInitialized 
                ? 'Enable Audio' 
                : audioEnabled 
                ? 'Audio On' 
                : 'Audio Off'
              }
            </Button>
          </div>

          {/* Breath Circle */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div 
                className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-500 ease-out relative overflow-hidden`}
                style={{ 
                  transform: `scale(${breathScale})`,
                  borderColor: isActive ? getPhaseBorderColor(currentPhase) : '#e5e7eb',
                  background: isActive ? `radial-gradient(circle, ${getPhaseGlowColor(currentPhase)}20, transparent 70%)` : 'transparent'
                }}
              >
                <div 
                  className={`w-24 h-24 rounded-full bg-gradient-to-r ${frameworkColor.primary} flex items-center justify-center shadow-2xl transition-all duration-500 ease-out relative`}
                  style={{
                    boxShadow: isActive 
                      ? `0 0 20px ${getPhaseGlowColor(currentPhase)}, 0 4px 16px rgba(0,0,0,0.1)` 
                      : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div className="text-center z-10">
                    <div className="text-2xl font-bold text-white mb-1 transition-all duration-300">
                      {formatTime(timeLeft)}
                    </div>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${getPhaseColor(currentPhase)} backdrop-blur-sm`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'animate-pulse' : ''}`} style={{ backgroundColor: getPhaseBorderColor(currentPhase) }} />
                      <span>{getPhaseLabel(currentPhase)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Progress ring */}
              <div className="absolute inset-0 w-32 h-32">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-gray-100"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="transition-all duration-500 ease-out drop-shadow-sm"
                    style={{
                      stroke: getPhaseProgressColor(currentPhase),
                      strokeDasharray: `${2 * Math.PI * 45}`,
                      strokeDashoffset: `${2 * Math.PI * 45 * (1 - (getPhaseDuration(currentPhase) - timeLeft) / getPhaseDuration(currentPhase))}`
                    }}
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Cycle Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                Cycle {currentCycle} of {totalCycles}
              </span>
            </div>
            <div className="w-full max-w-sm mx-auto bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r ${frameworkColor.primary} transition-all duration-500`}
                style={{ width: `${(currentCycle / totalCycles) * 100}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-3 mb-4">
            {!isActive ? (
              <Button 
                onClick={handleStart} 
                size="lg" 
                className={`px-6 py-2 text-sm bg-gradient-to-r ${frameworkColor.primary} hover:${frameworkColor.secondary} shadow-lg`}
              >
                <Play className="h-4 w-4 mr-2" />
                Start Session
              </Button>
            ) : (
              <Button 
                onClick={handlePause} 
                variant="outline" 
                size="lg" 
                className="px-6 py-2 text-sm border-2"
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            )}
            
            <Button 
              onClick={handleReset} 
              variant="outline" 
              size="lg" 
              className="px-4 py-2"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {/* Session Info */}
          {sessionStartTime && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs">
              <Timer className="h-3 w-3" />
              <span>Session duration: {formatSessionDuration(sessionDuration)}</span>
            </div>
          )}

          {/* Pattern Selector */}
          <div className="mt-4">
            <select
              value={selectedPattern.name}
              onChange={(e) => {
                const pattern = breathPatterns.find(p => p.name === e.target.value);
                if (pattern) {
                  setSelectedPattern(pattern);
                  setTotalCycles(pattern.pattern.cycles);
                  if (!isActive) {
                    setTimeLeft(pattern.pattern.inhale);
                  }
                }
              }}
              className="w-full p-2 border border-gray-300 rounded-lg bg-white text-sm"
              disabled={isActive}
            >
              {breathPatterns.map((pattern) => (
                <option key={pattern.name} value={pattern.name}>
                  {pattern.icon} {pattern.name}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 