'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Settings, Heart, Timer, Target, Sparkles, ChevronDown, ChevronUp, Volume2, VolumeX } from 'lucide-react';

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

export default function BreathPage() {
  const [selectedPattern, setSelectedPattern] = useState<BreathPattern>(breathPatterns[0]);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'hold2'>('inhale');
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [totalCycles, setTotalCycles] = useState(selectedPattern.pattern.cycles);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [breathScale, setBreathScale] = useState(1);
  const [audioEnabled, setAudioEnabled] = useState(false); // Start with audio disabled
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [expandedPattern, setExpandedPattern] = useState<string | null>(null);
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
        console.log('Loading audio mapping...');
        const response = await fetch('/audio/breathwork/audio-mapping.json');
        console.log('Audio mapping response status:', response.status);
        
        if (response.ok) {
          const mapping = await response.json();
          setAudioMapping(mapping);
          console.log('Audio mapping loaded successfully:', mapping);
        } else {
          console.error('Failed to load audio mapping:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error loading audio mapping:', error);
      }
    };
    
    loadAudioMapping();
  }, []);

  // Initialize audio context on user interaction
  const initializeAudio = () => {
    if (!audioInitialized && audioRef.current) {
      // Create a silent audio context to enable audio playback
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContext.resume().then(() => {
        console.log('Audio context initialized');
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
      console.log('Playing audio guidance:', phase, audioUrl);
      audioRef.current.src = audioUrl;
      audioRef.current.volume = 0.7; // Set volume to 70%
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Audio guidance played successfully');
            setIsLoadingAudio(false);
          })
          .catch((error) => {
            console.error('Error playing audio guidance:', error);
            // Try to enable audio context if it's suspended
            if (audioRef.current) {
              audioRef.current.muted = false;
              audioRef.current.play().catch(console.error);
            }
            setIsLoadingAudio(false);
          });
      }
    } else {
      console.log('No audio URL found for phase:', phase);
      setIsLoadingAudio(false);
    }
  };

  // Play pre-generated counting audio
  const playCountingAudio = (count: number) => {
    if (!audioEnabled || !audioMapping || isLoadingAudio) return;
    
    const audioUrl = audioMapping.counting[count.toString()];
    if (audioUrl && audioRef.current) {
      console.log('Playing counting audio:', count, audioUrl);
      audioRef.current.src = audioUrl;
      audioRef.current.volume = 0.5; // Lower volume for counting
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error('Error playing counting audio:', error);
          // Try to enable audio context if it's suspended
          if (audioRef.current) {
            audioRef.current.muted = false;
            audioRef.current.play().catch(console.error);
          }
        });
      }
    }
  };

  // Play session start audio
  const playSessionStartAudio = () => {
    if (!audioEnabled || !audioMapping) return;
    
    const audioUrl = audioMapping.session.start;
    if (audioUrl && audioRef.current) {
      console.log('Playing session start audio:', audioUrl);
      audioRef.current.src = audioUrl;
      audioRef.current.volume = 0.7;
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error('Error playing session start audio:', error);
          if (audioRef.current) {
            audioRef.current.muted = false;
            audioRef.current.play().catch(console.error);
          }
        });
      }
    }
  };

  // Play session complete audio
  const playSessionCompleteAudio = () => {
    if (!audioEnabled || !audioMapping) return;
    
    const audioUrl = audioMapping.session.complete;
    if (audioUrl && audioRef.current) {
      console.log('Playing session complete audio:', audioUrl);
      audioRef.current.src = audioUrl;
      audioRef.current.volume = 0.7;
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error('Error playing session complete audio:', error);
          if (audioRef.current) {
            audioRef.current.muted = false;
            audioRef.current.play().catch(console.error);
          }
        });
      }
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
              playAudioGuidance(nextPhase);
            }
            
            return newDuration;
          }
          
          // Play counting audio for the last 3 seconds of each phase
          if (audioEnabled && prev <= 3 && prev > 1) {
            playCountingAudio(prev);
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

  // Animate breath circle
  useEffect(() => {
    if (isActive) {
      const scale = currentPhase === 'inhale' ? 1.2 : 
                   currentPhase === 'exhale' ? 0.8 : 1;
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
    // Initialize audio on first start
    if (!audioInitialized) {
      initializeAudio();
    }
    
    setIsActive(true);
    setCurrentPhase('inhale');
    setTimeLeft(selectedPattern.pattern.inhale);
    setCurrentCycle(1);
    setSessionStartTime(new Date());
    setSessionDuration(0);

    // Play session start audio
    if (audioEnabled) {
      playSessionStartAudio();
    }

    // Log breathwork session start (optional - don't block session if it fails)
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
        // Don't block the breathwork session if logging fails
        console.warn('Breathwork session logging failed (non-critical):', error);
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
    
    // Play session completion audio
    if (audioEnabled) {
      playSessionCompleteAudio();
    }
    
    // Log session completion (optional - don't block if it fails)
    try {
      console.log('Breathwork session completed:', {
        pattern: selectedPattern.name,
        duration: sessionDuration,
        cycles: totalCycles,
      });
    } catch (error) {
      console.warn('Session completion logging failed (non-critical):', error);
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

  const togglePatternExpansion = (patternName: string) => {
    setExpandedPattern(expandedPattern === patternName ? null : patternName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Hidden audio element for TTS playback */}
      <audio ref={audioRef} preload="auto" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                <Heart className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Breathwork
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Harness the power of conscious breathing for clarity, calm, and connection
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Timer Widget */}
            <div className="xl:col-span-2">
              <Card className="glass-effect border-0 shadow-2xl bg-white/80 backdrop-blur-xl h-full">
                <CardHeader className="text-center pb-6">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="text-3xl">{selectedPattern.icon}</span>
                    <CardTitle className="text-2xl">{selectedPattern.name}</CardTitle>
                  </div>
                  <CardDescription className="text-base">{selectedPattern.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="text-center pb-8">
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
                    
                    {audioEnabled && audioMapping && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => playAudioGuidance('inhale')}
                        className="text-green-600 border-green-200"
                      >
                        Test Audio
                      </Button>
                    )}
                  </div>

                  {/* Animated Breath Circle */}
                  <div className="flex justify-center mb-8">
                    <div className="relative">
                      {/* Outer ring */}
                      <div className={`w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full border-4 border-gray-200 flex items-center justify-center transition-all duration-1000 ease-in-out`}
                           style={{ transform: `scale(${breathScale})` }}>
                        
                        {/* Inner circle with gradient */}
                        <div className={`w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full bg-gradient-to-r ${selectedPattern.color} flex items-center justify-center shadow-lg`}>
                          <div className="text-center">
                            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                              {formatTime(timeLeft)}
                            </div>
                            <div className={`inline-flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getPhaseColor(currentPhase)}`}>
                              <Heart className="h-3 w-3" />
                              <span className="hidden sm:inline">{getPhaseLabel(currentPhase)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress ring */}
                      <div className="absolute inset-0 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-gray-200"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            className={`text-blue-500 transition-all duration-1000 ease-in-out`}
                            strokeDasharray={`${2 * Math.PI * 45}`}
                            strokeDashoffset={`${2 * Math.PI * 45 * (1 - (getPhaseDuration(currentPhase) - timeLeft) / getPhaseDuration(currentPhase))}`}
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Cycle Progress */}
                  <div className="mb-6">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="text-base font-medium">
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
                  <div className="flex justify-center gap-3 mb-6">
                    {!isActive ? (
                      <Button onClick={handleStart} size="lg" className="px-8 py-4 text-base bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg">
                        <Play className="h-5 w-5 mr-2" />
                        Start Session
                      </Button>
                    ) : (
                      <Button onClick={handlePause} variant="outline" size="lg" className="px-8 py-4 text-base border-2">
                        <Pause className="h-5 w-5 mr-2" />
                        Pause
                      </Button>
                    )}
                    
                    <Button onClick={handleReset} variant="outline" size="lg" className="px-4 py-4">
                      <RotateCcw className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Session Info */}
                  {sessionStartTime && (
                    <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                      <Timer className="h-4 w-4" />
                      <span>Session duration: {formatSessionDuration(sessionDuration)}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Getting Started Panel */}
            <div>
              <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Getting Started
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium">Find a comfortable position</h4>
                        <p className="text-muted-foreground">Sit or lie down in a relaxed posture</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium">Close your eyes</h4>
                        <p className="text-muted-foreground">Focus inward and minimize distractions</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium">Follow the guidance</h4>
                        <p className="text-muted-foreground">Listen to audio cues and follow visual indicators</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        4
                      </div>
                      <div>
                        <h4 className="font-medium">Stay present</h4>
                        <p className="text-muted-foreground">Gently return focus to your breath if your mind wanders</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Benefits Section */}
                  <div className="mt-8">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Benefits
                    </h3>
                    <div className="space-y-2">
                      {selectedPattern.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" />
                          <span className="text-sm font-medium">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Choose Pattern Panel */}
            <div className="xl:col-span-1">
              <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Choose Pattern
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {breathPatterns.map((pattern) => (
                      <div
                        key={pattern.name}
                        className={`rounded-xl border-2 transition-all duration-300 ${
                          selectedPattern.name === pattern.name
                            ? `border-primary bg-gradient-to-r ${pattern.color} bg-opacity-10 shadow-lg`
                            : 'border-gray-200 bg-white/50'
                        }`}
                      >
                        {/* Pattern Header - Always Visible */}
                        <div
                          className="p-3 cursor-pointer"
                          onClick={() => {
                            setSelectedPattern(pattern);
                            setTotalCycles(pattern.pattern.cycles);
                            if (!isActive) {
                              setTimeLeft(pattern.pattern.inhale);
                            }
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-xl">{pattern.icon}</span>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm mb-1 truncate">{pattern.name}</h4>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {pattern.description}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePatternExpansion(pattern.name);
                              }}
                              className="p-1 hover:bg-gray-100 rounded flex-shrink-0"
                            >
                              {expandedPattern === pattern.name ? (
                                <ChevronUp className="h-4 w-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Expanded Content */}
                        {expandedPattern === pattern.name && (
                          <div className="px-3 pb-3 border-t border-gray-100">
                            <div className="pt-3 space-y-3">
                              {/* Pattern Details */}
                              <div>
                                <h5 className="text-xs font-medium text-gray-700 mb-2">Breathing Pattern</h5>
                                <div className="flex flex-wrap gap-1">
                                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                    {pattern.pattern.inhale}s inhale
                                  </span>
                                  {pattern.pattern.hold > 0 && (
                                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                      {pattern.pattern.hold}s hold
                                    </span>
                                  )}
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                    {pattern.pattern.exhale}s exhale
                                  </span>
                                  {pattern.pattern.hold2 > 0 && (
                                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                                      {pattern.pattern.hold2}s hold
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Benefits */}
                              <div>
                                <h5 className="text-xs font-medium text-gray-700 mb-2">Benefits</h5>
                                <div className="space-y-1">
                                  {pattern.benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex-shrink-0" />
                                      <span className="text-xs text-gray-600">{benefit}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Cycles Info */}
                              <div>
                                <h5 className="text-xs font-medium text-gray-700 mb-1">Total Cycles</h5>
                                <span className="text-xs text-gray-600">{pattern.pattern.cycles} cycles</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 