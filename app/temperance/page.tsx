'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Heart, Timer, Target, Sparkles, ChevronDown, ChevronUp, Volume2, VolumeX, Leaf, Brain, Shield, Scale } from 'lucide-react';

interface VirtueBreathPattern {
  name: string;
  description: string;
  philosophicalContext: string;
  pattern: {
    inhale: number;
    hold: number;
    exhale: number;
    hold2: number;
    cycles: number;
  };
  benefits: string[];
  virtueAlignment: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

const temperanceBreathPatterns: VirtueBreathPattern[] = [
  {
    name: 'Box Breathing (Temperance)',
    description: 'Equal duration for each phase to cultivate balance and self-control',
    philosophicalContext: 'Aristotle taught that temperance is the virtue of moderation. This breathing pattern embodies that principle through its balanced, measured approach.',
    pattern: { inhale: 4, hold: 4, exhale: 4, hold2: 4, cycles: 10 },
    benefits: ['Cultivates self-control', 'Promotes emotional balance', 'Enhances mental clarity', 'Strengthens willpower'],
    virtueAlignment: 'Temperance - The virtue of moderation and self-control',
    color: 'from-purple-500 to-pink-500',
    icon: Leaf,
  },
  {
    name: 'Ocean Breath (Harmony)',
    description: 'Gentle breathing with soft sound to cultivate inner peace',
    philosophicalContext: 'Like the ocean\'s steady rhythm, this practice teaches us to find harmony within ourselves and with the world around us.',
    pattern: { inhale: 4, hold: 2, exhale: 6, hold2: 0, cycles: 8 },
    benefits: ['Soothes the nervous system', 'Promotes inner harmony', 'Reduces stress and tension', 'Enhances mindfulness'],
    virtueAlignment: 'Temperance - Finding balance in all things',
    color: 'from-teal-500 to-cyan-500',
    icon: Leaf,
  },
  {
    name: 'Coherent Breathing (Balance)',
    description: 'Slow, rhythmic breathing at 5-6 breaths per minute for optimal balance',
    philosophicalContext: 'This pattern aligns with our natural respiratory rhythm, teaching us to work with nature rather than against it.',
    pattern: { inhale: 5, hold: 0, exhale: 5, hold2: 0, cycles: 12 },
    benefits: ['Balances nervous system', 'Optimizes heart rate variability', 'Promotes emotional stability', 'Enhances focus'],
    virtueAlignment: 'Temperance - Working in harmony with natural rhythms',
    color: 'from-emerald-500 to-green-500',
    icon: Leaf,
  },
  {
    name: 'Triangle Breathing (Simplicity)',
    description: 'Equal inhale and exhale for simplicity and clarity',
    philosophicalContext: 'Sometimes the most profound wisdom comes from simplicity. This practice teaches us to find beauty in the basic.',
    pattern: { inhale: 6, hold: 0, exhale: 6, hold2: 0, cycles: 10 },
    benefits: ['Simplifies the mind', 'Reduces complexity', 'Promotes clarity', 'Enhances presence'],
    virtueAlignment: 'Temperance - Finding contentment in simplicity',
    color: 'from-indigo-500 to-blue-500',
    icon: Leaf,
  },
];

export default function TemperancePage() {
  const [selectedPattern, setSelectedPattern] = useState<VirtueBreathPattern>(temperanceBreathPatterns[0]);
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
  const [expandedPattern, setExpandedPattern] = useState<string | null>(null);
  const [audioMapping, setAudioMapping] = useState<any>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [virtueProgress, setVirtueProgress] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load audio mapping on component mount
  useEffect(() => {
    const loadAudioMapping = async () => {
      try {
        console.log('Loading audio mapping...');
        const response = await fetch('/audio/breathwork/audio-mapping.json');
        if (response.ok) {
          const mapping = await response.json();
          setAudioMapping(mapping);
          console.log('Audio mapping loaded successfully');
        } else {
          console.log('Audio mapping not found, attempting to generate...');
          try {
            const generateResponse = await fetch('/api/generate-breathwork-audio', { method: 'POST' });
            if (generateResponse.ok) {
              const newMapping = await generateResponse.json();
              setAudioMapping(newMapping);
              console.log('Audio files generated successfully');
            }
          } catch (error) {
            console.log('Could not generate audio files:', error);
          }
        }
      } catch (error) {
        console.log('Error loading audio mapping:', error);
      }
    };

    loadAudioMapping();
  }, []);

  // Initialize audio context on first user interaction
  const initializeAudio = async () => {
    if (audioInitialized) return;
    
    try {
      if (audioRef.current) {
        await audioRef.current.play();
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setAudioInitialized(true);
        setAudioEnabled(true);
        console.log('Audio context initialized');
      }
    } catch (error) {
      console.log('Audio initialization failed:', error);
    }
  };

  // Audio playback functions
  const playAudioGuidance = async (phase: string) => {
    if (!audioEnabled || !audioMapping) return;
    
    try {
      const audioUrl = audioMapping.instructions[phase];
      if (audioUrl && audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.volume = 0.7;
        await new Promise(resolve => setTimeout(resolve, 100));
        await audioRef.current.play();
      }
    } catch (error) {
      console.log('Error playing guidance audio:', error);
    }
  };

  const playCountingAudio = async (count: number) => {
    if (!audioEnabled || !audioMapping) return;
    
    try {
      const audioUrl = audioMapping.counting[count.toString()];
      if (audioUrl && audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.volume = 0.5;
        await new Promise(resolve => setTimeout(resolve, 50));
        await audioRef.current.play();
      }
    } catch (error) {
      console.log('Error playing counting audio:', error);
    }
  };

  const playSessionStartAudio = async () => {
    if (!audioEnabled || !audioMapping) return;
    
    try {
      const audioUrl = audioMapping.session.start;
      if (audioUrl && audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.volume = 0.7;
        await audioRef.current.play();
      }
    } catch (error) {
      console.log('Error playing session start audio:', error);
    }
  };

  const playSessionCompleteAudio = async () => {
    if (!audioEnabled || !audioMapping) return;
    
    try {
      const audioUrl = audioMapping.session.complete;
      if (audioUrl && audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.volume = 0.7;
        await audioRef.current.play();
      }
    } catch (error) {
      console.log('Error playing session complete audio:', error);
    }
  };

  // Test audio function
  const testAudio = async () => {
    await initializeAudio();
    await playAudioGuidance('inhale');
  };

  // Handle session start
  const handleStart = async () => {
    await initializeAudio();
    setIsLoadingAudio(true);
    
    try {
      await playSessionStartAudio();
      setIsActive(true);
      setSessionStartTime(new Date());
      setCurrentCycle(1);
      setTotalCycles(selectedPattern.pattern.cycles);
      setVirtueProgress(0);
      
      // Start session timer
      sessionIntervalRef.current = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);
      
      // Start breathing cycle
      startBreathingCycle();
      
      // Log session to database if available
      try {
        await fetch('/api/skills/invoke', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            skill: 'breathwork.start',
            args: {
              pattern: selectedPattern.pattern,
              name: selectedPattern.name,
              durationSec: selectedPattern.pattern.cycles * (selectedPattern.pattern.inhale + selectedPattern.pattern.hold + selectedPattern.pattern.exhale + selectedPattern.pattern.hold2),
              virtue: 'temperance'
            }
          })
        });
      } catch (error) {
        console.log('Could not log session to database:', error);
      }
    } catch (error) {
      console.log('Error starting session:', error);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const startBreathingCycle = () => {
    const cycle = () => {
      // Inhale phase
      setCurrentPhase('inhale');
      setTimeLeft(selectedPattern.pattern.inhale);
      setBreathScale(1.3);
      playAudioGuidance('inhale');
      
      let timeRemaining = selectedPattern.pattern.inhale;
      const inhaleInterval = setInterval(() => {
        timeRemaining--;
        setTimeLeft(timeRemaining);
        
        if (timeRemaining <= 0) {
          clearInterval(inhaleInterval);
          
          // Hold phase
          if (selectedPattern.pattern.hold > 0) {
            setCurrentPhase('hold');
            setTimeLeft(selectedPattern.pattern.hold);
            setBreathScale(1.1);
            playAudioGuidance('hold');
            
            let holdTimeRemaining = selectedPattern.pattern.hold;
            const holdInterval = setInterval(() => {
              holdTimeRemaining--;
              setTimeLeft(holdTimeRemaining);
              
              if (holdTimeRemaining <= 0) {
                clearInterval(holdInterval);
                startExhale();
              }
            }, 1000);
          } else {
            startExhale();
          }
        }
      }, 1000);
    };
    
    cycle();
  };

  const startExhale = () => {
    setCurrentPhase('exhale');
    setTimeLeft(selectedPattern.pattern.exhale);
    setBreathScale(0.7);
    playAudioGuidance('exhale');
    
    let timeRemaining = selectedPattern.pattern.exhale;
    const exhaleInterval = setInterval(() => {
      timeRemaining--;
      setTimeLeft(timeRemaining);
      
      if (timeRemaining <= 0) {
        clearInterval(exhaleInterval);
        
        // Hold empty phase
        if (selectedPattern.pattern.hold2 > 0) {
          setCurrentPhase('hold2');
          setTimeLeft(selectedPattern.pattern.hold2);
          setBreathScale(0.9);
          playAudioGuidance('holdEmpty');
          
          let hold2TimeRemaining = selectedPattern.pattern.hold2;
          const hold2Interval = setInterval(() => {
            hold2TimeRemaining--;
            setTimeLeft(hold2TimeRemaining);
            
            if (hold2TimeRemaining <= 0) {
              clearInterval(hold2Interval);
              completeCycle();
            }
          }, 1000);
        } else {
          completeCycle();
        }
      }
    }, 1000);
  };

  const completeCycle = () => {
    setCurrentCycle(prev => {
      const newCycle = prev + 1;
      setVirtueProgress((newCycle / totalCycles) * 100);
      
      if (newCycle <= totalCycles) {
        // Play counting audio
        playCountingAudio(newCycle);
        
        // Start next cycle
        setTimeout(() => {
          if (isActive) {
            startBreathingCycle();
          }
        }, 1000);
      } else {
        // Session complete
        handleComplete();
      }
      return newCycle;
    });
  };

  const handleComplete = async () => {
    setIsActive(false);
    setCurrentPhase('inhale');
    setTimeLeft(0);
    setBreathScale(1);
    
    if (sessionIntervalRef.current) {
      clearInterval(sessionIntervalRef.current);
    }
    
    await playSessionCompleteAudio();
    
    // Update virtue progress
    setVirtueProgress(100);
  };

  const handlePause = () => {
    setIsActive(false);
    if (sessionIntervalRef.current) {
      clearInterval(sessionIntervalRef.current);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentPhase('inhale');
    setTimeLeft(0);
    setCurrentCycle(1);
    setSessionDuration(0);
    setSessionStartTime(null);
    setBreathScale(1);
    setVirtueProgress(0);
    
    if (sessionIntervalRef.current) {
      clearInterval(sessionIntervalRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatSessionDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'inhale': return 'border-blue-500 bg-blue-50';
      case 'hold': return 'border-yellow-500 bg-yellow-50';
      case 'exhale': return 'border-green-500 bg-green-50';
      case 'hold2': return 'border-purple-500 bg-purple-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getPhaseLabel = (phase: string) => {
    switch (phase) {
      case 'inhale': return 'Inhale';
      case 'hold': return 'Hold';
      case 'exhale': return 'Exhale';
      case 'hold2': return 'Hold Empty';
      default: return 'Ready';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Leaf className="w-8 h-8 text-purple-600 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Temperance
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The virtue of self-control and moderation. Cultivate balance, discipline, and inner harmony through mindful breathing practices.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Breathing Interface */}
          <div className="lg:col-span-2">
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                  <Leaf className="w-6 h-6 text-purple-600" />
                  {selectedPattern.name}
                </CardTitle>
                <CardDescription className="text-lg">
                  {selectedPattern.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="text-center">
                {/* Philosophical Context */}
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-gray-700 italic">
                    "{selectedPattern.philosophicalContext}"
                  </p>
                </div>

                {/* Breathing Circle */}
                <div className="relative flex justify-center items-center mb-8">
                  {/* Animated background rings */}
                  <div className="absolute w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] rounded-full bg-gradient-to-r from-purple-200/30 to-pink-200/30 animate-pulse hidden sm:block"></div>
                  <div className="absolute w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full bg-gradient-to-r from-purple-300/20 to-pink-300/20 animate-pulse hidden sm:block" style={{ animationDelay: '0.5s' }}></div>
                  
                  {/* Main breathing circle */}
                  <div 
                    className={`relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full border-4 flex items-center justify-center transition-all duration-500 ease-out ${getPhaseColor(currentPhase)}`}
                    style={{ 
                      transform: `scale(${breathScale})`,
                      boxShadow: `0 0 20px ${currentPhase === 'inhale' ? '#3b82f6' : currentPhase === 'hold' ? '#eab308' : currentPhase === 'exhale' ? '#22c55e' : '#a855f7'}40`
                    }}
                  >
                    <div className="text-center">
                      <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-2">
                        {formatTime(timeLeft)}
                      </div>
                      <div className="text-sm sm:text-base text-gray-600 font-medium">
                        {getPhaseLabel(currentPhase)}
                      </div>
                    </div>
                    
                    {/* Heart icon during active session */}
                    {isActive && (
                      <div className="absolute -top-2 -right-2">
                        <Heart className="w-6 h-6 text-red-500 animate-pulse" />
                      </div>
                    )}
                  </div>
                  
                  {/* Progress ring */}
                  <svg className="absolute w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56" style={{ transform: 'rotate(-90deg)' }}>
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="3"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      fill="none"
                      stroke="url(#progressGradient)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={`${(virtueProgress / 100) * 283} 283`}
                      className="transition-all duration-500 ease-out"
                    />
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Cycle Progress */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Cycle {currentCycle} of {totalCycles}</span>
                    <span className="text-sm font-medium text-purple-600">{Math.round(virtueProgress)}% Complete</span>
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
                    <Button 
                      onClick={handleStart} 
                      size="lg" 
                      className="px-8 py-4 text-base bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg"
                      data-test="clickable"
                      data-clickable-name="start-temperance-session"
                      disabled={isLoadingAudio}
                    >
                      {isLoadingAudio ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Loading...
                        </div>
                      ) : (
                        <>
                          <Play className="h-5 w-5 mr-2" />
                          Begin Practice
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button 
                      onClick={handlePause} 
                      variant="outline" 
                      size="lg" 
                      className="px-8 py-4 text-base border-2 border-purple-300"
                      data-test="clickable"
                      data-clickable-name="pause-temperance-session"
                    >
                      <Pause className="h-5 w-5 mr-2" />
                      Pause
                    </Button>
                  )}
                  
                  <Button 
                    onClick={handleReset} 
                    variant="outline" 
                    size="lg" 
                    className="px-4 py-4 border-purple-300"
                    data-test="clickable"
                    data-clickable-name="reset-temperance-session"
                  >
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Audio Controls */}
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-purple-600" />
                  Audio Guidance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Audio Enabled</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAudioEnabled(!audioEnabled)}
                    className={audioEnabled ? "bg-purple-100 border-purple-300" : ""}
                  >
                    {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </Button>
                </div>
                
                <Button
                  onClick={testAudio}
                  variant="outline"
                  size="sm"
                  className="w-full"
                  disabled={!audioEnabled}
                >
                  Test Audio
                </Button>
              </CardContent>
            </Card>

            {/* Pattern Selection */}
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  Temperance Practices
                </CardTitle>
                <CardDescription>
                  Choose a breathing pattern aligned with the virtue of temperance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {temperanceBreathPatterns.map((pattern) => (
                    <div
                      key={pattern.name}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        selectedPattern.name === pattern.name
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                      }`}
                      onClick={() => setSelectedPattern(pattern)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{pattern.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{pattern.description}</p>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedPattern(expandedPattern === pattern.name ? null : pattern.name);
                            }}
                            className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1"
                          >
                            {expandedPattern === pattern.name ? (
                              <>
                                <ChevronUp className="w-3 h-3" />
                                Hide details
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-3 h-3" />
                                Show details
                              </>
                            )}
                          </button>
                          
                          {expandedPattern === pattern.name && (
                            <div className="mt-3 space-y-2">
                              <div className="text-xs text-gray-500">
                                <strong>Philosophical Context:</strong> {pattern.philosophicalContext}
                              </div>
                              <div className="text-xs text-gray-500">
                                <strong>Benefits:</strong> {pattern.benefits.join(', ')}
                              </div>
                              <div className="text-xs text-gray-500">
                                <strong>Pattern:</strong> {pattern.pattern.inhale}-{pattern.pattern.hold}-{pattern.pattern.exhale}-{pattern.pattern.hold2} for {pattern.pattern.cycles} cycles
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${pattern.color}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Virtue Benefits */}
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Temperance Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-sm">Self-Control</h4>
                      <p className="text-xs text-gray-600">Master your impulses and desires</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-sm">Moderation</h4>
                      <p className="text-xs text-gray-600">Find balance in all aspects of life</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-sm">Inner Harmony</h4>
                      <p className="text-xs text-gray-600">Cultivate peace within yourself</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-sm">Discipline</h4>
                      <p className="text-xs text-gray-600">Build consistent, virtuous habits</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="auto" />
    </div>
  );
} 