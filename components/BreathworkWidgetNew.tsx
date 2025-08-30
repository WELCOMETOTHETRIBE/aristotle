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

export function BreathworkWidgetNew({ frameworkTone }: BreathworkWidgetNewProps) {
  const [selectedPattern, setSelectedPattern] = useState<BreathPattern>(breathPatterns[0]);
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
    switch (phase) {
      case 'inhale': return '#3b82f6';
      case 'hold': return '#8b5cf6';
      case 'exhale': return '#10b981';
      case 'hold2': return '#f59e0b';
      default: return '#e5e7eb';
    }
  };

  const getPhaseGlowColor = (phase: string): string => {
    switch (phase) {
      case 'inhale': return 'rgba(59, 130, 246, 0.5)';
      case 'hold': return 'rgba(139, 92, 246, 0.5)';
      case 'exhale': return 'rgba(16, 185, 129, 0.5)';
      case 'hold2': return 'rgba(245, 158, 11, 0.5)';
      default: return 'rgba(59, 130, 246, 0.3)';
    }
  };

  const getPhaseProgressColor = (phase: string): string => {
    switch (phase) {
      case 'inhale': return '#3b82f6';
      case 'hold': return '#8b5cf6';
      case 'exhale': return '#10b981';
      case 'hold2': return '#f59e0b';
      default: return '#3b82f6';
    }
  };

  const getPhaseColor = (phase: string): string => {
    switch (phase) {
      case 'inhale': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'hold': return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'exhale': return 'text-green-600 bg-green-100 border-green-200';
      case 'hold2': return 'text-orange-600 bg-orange-100 border-orange-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
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
                  className={`w-24 h-24 rounded-full bg-gradient-to-r ${selectedPattern.color} flex items-center justify-center shadow-2xl transition-all duration-500 ease-out relative`}
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
                className={`h-2 rounded-full bg-gradient-to-r ${selectedPattern.color} transition-all duration-500`}
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
                className="px-6 py-2 text-sm bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
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