'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Settings, Heart, Timer, Target, Sparkles } from 'lucide-react';

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
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
            
            return getPhaseDuration(nextPhase);
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
  }, [isActive, currentPhase, currentCycle, totalCycles]);

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
    setIsActive(true);
    setCurrentPhase('inhale');
    setTimeLeft(selectedPattern.pattern.inhale);
    setCurrentCycle(1);
    setSessionStartTime(new Date());
    setSessionDuration(0);

    // Log breathwork session start
    try {
      await fetch('/api/skills/invoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skill: 'breathwork.start',
          args: {
            pattern: selectedPattern.name,
            cycles: selectedPattern.pattern.cycles,
          },
        }),
      });
    } catch (error) {
      console.error('Error logging breathwork session:', error);
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

  const handleSessionComplete = () => {
    setIsActive(false);
    setCurrentPhase('inhale');
    setTimeLeft(0);
    
    // Log session completion
    console.log('Breathwork session completed:', {
      pattern: selectedPattern.name,
      duration: sessionDuration,
      cycles: totalCycles,
    });
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Timer Widget */}
            <div>
              <Card className="glass-effect border-0 shadow-2xl bg-white/80 backdrop-blur-xl h-full">
                <CardHeader className="text-center pb-6">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="text-3xl">{selectedPattern.icon}</span>
                    <CardTitle className="text-2xl">{selectedPattern.name}</CardTitle>
                  </div>
                  <CardDescription className="text-base">{selectedPattern.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="text-center pb-8">
                  {/* Animated Breath Circle */}
                  <div className="flex justify-center mb-8">
                    <div className="relative">
                      {/* Outer ring */}
                      <div className={`w-48 h-48 rounded-full border-4 border-gray-200 flex items-center justify-center transition-all duration-1000 ease-in-out`}
                           style={{ transform: `scale(${breathScale})` }}>
                        
                        {/* Inner circle with gradient */}
                        <div className={`w-36 h-36 rounded-full bg-gradient-to-r ${selectedPattern.color} flex items-center justify-center shadow-lg`}>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-white mb-2">
                              {formatTime(timeLeft)}
                            </div>
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getPhaseColor(currentPhase)}`}>
                              <Heart className="h-3 w-3" />
                              {getPhaseLabel(currentPhase)}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress ring */}
                      <div className="absolute inset-0 w-48 h-48">
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
                        <h4 className="font-medium">Follow the timer</h4>
                        <p className="text-muted-foreground">Breathe according to the visual cues</p>
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
            <div>
              <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Choose Pattern
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {breathPatterns.map((pattern) => (
                      <div
                        key={pattern.name}
                        className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                          selectedPattern.name === pattern.name
                            ? `border-primary bg-gradient-to-r ${pattern.color} bg-opacity-10 shadow-lg`
                            : 'border-gray-200 hover:border-primary/50 bg-white/50'
                        }`}
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
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm mb-1">{pattern.name}</h4>
                            <p className="text-xs text-muted-foreground mb-2">
                              {pattern.description}
                            </p>
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
                        </div>
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