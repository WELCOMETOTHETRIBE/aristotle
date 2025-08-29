'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Heart, Timer, Target, Sparkles, ChevronDown, ChevronUp, Volume2, VolumeX, Leaf, Brain, Shield, Scale, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import PageLayout from '@/components/PageLayout';

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
        }
      } catch (error) {
        console.error('Error loading audio mapping:', error);
      }
    };

    loadAudioMapping();
  }, []);

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined' && !audioInitialized) {
      const initAudio = async () => {
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          setAudioInitialized(true);
          console.log('Audio context initialized');
        } catch (error) {
          console.error('Error initializing audio context:', error);
        }
      };

      initAudio();
    }
  }, [audioInitialized]);

  // Timer logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Move to next phase
            const phases: ('inhale' | 'hold' | 'exhale' | 'hold2')[] = ['inhale', 'hold', 'exhale', 'hold2'];
            const currentIndex = phases.indexOf(currentPhase);
            const nextIndex = (currentIndex + 1) % phases.length;
            const nextPhase = phases[nextIndex];
            
            setCurrentPhase(nextPhase);
            
            // Update cycle count
            if (nextPhase === 'inhale' && currentPhase === 'hold2') {
              setCurrentCycle((prev) => {
                if (prev >= totalCycles) {
                  // Session complete
                  setIsActive(false);
                  return prev;
                }
                return prev + 1;
              });
            }
            
            // Set time for next phase
            const pattern = selectedPattern.pattern;
            switch (nextPhase) {
              case 'inhale': return pattern.inhale;
              case 'hold': return pattern.hold;
              case 'exhale': return pattern.exhale;
              case 'hold2': return pattern.hold2;
              default: return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, currentPhase, selectedPattern, totalCycles, currentCycle]);

  // Session timer
  useEffect(() => {
    if (isActive && sessionStartTime) {
      sessionIntervalRef.current = setInterval(() => {
        const now = new Date();
        const duration = Math.floor((now.getTime() - sessionStartTime.getTime()) / 1000);
        setSessionDuration(duration);
      }, 1000);
    }

    return () => {
      if (sessionIntervalRef.current) {
        clearInterval(sessionIntervalRef.current);
      }
    };
  }, [isActive, sessionStartTime]);

  // Breath animation
  useEffect(() => {
    if (isActive) {
      const phase = currentPhase;
      if (phase === 'inhale') {
        setBreathScale(1.2);
      } else if (phase === 'exhale') {
        setBreathScale(0.8);
      } else {
        setBreathScale(1);
      }
    } else {
      setBreathScale(1);
    }
  }, [currentPhase, isActive]);

  const startSession = () => {
    setIsActive(true);
    setCurrentPhase('inhale');
    setTimeLeft(selectedPattern.pattern.inhale);
    setCurrentCycle(1);
    setSessionStartTime(new Date());
    setSessionDuration(0);
  };

  const pauseSession = () => {
    setIsActive(false);
  };

  const resetSession = () => {
    setIsActive(false);
    setCurrentPhase('inhale');
    setTimeLeft(selectedPattern.pattern.inhale);
    setCurrentCycle(1);
    setSessionStartTime(null);
    setSessionDuration(0);
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };

  const togglePatternExpansion = (patternName: string) => {
    setExpandedPattern(expandedPattern === patternName ? null : patternName);
  };

  return (
    <PageLayout title="Temperance" description="The Virtue of Moderation & Self-Control">
      {/* Header */}
      <section className="page-section">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
              <Leaf className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="headline bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Temperance
              </h1>
              <p className="subheadline mt-2">
                The Virtue of Moderation & Self-Control
              </p>
            </div>
          </div>
          <p className="body-text max-w-2xl mx-auto">
            Cultivate balance, self-control, and inner harmony through mindful breathing practices.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Breath Timer */}
          <section className="page-section">
            <div className="glass-card p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Timer className="w-6 h-6 text-purple-400" />
                <h2 className="section-title">Breath Timer</h2>
              </div>
              
              {/* Visual Breath Indicator */}
              <div className="flex justify-center mb-8">
                <div 
                  className="w-32 h-32 rounded-full border-4 border-purple-400/30 flex items-center justify-center transition-all duration-1000 ease-in-out"
                  style={{ 
                    transform: `scale(${breathScale})`,
                    backgroundColor: isActive ? 'rgba(168, 85, 247, 0.1)' : 'transparent'
                  }}
                >
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">
                      {isActive ? timeLeft : selectedPattern.pattern.inhale}
                    </div>
                    <div className="text-sm text-gray-400 uppercase tracking-wide">
                      {isActive ? currentPhase : 'Ready'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4 mb-6">
                {!isActive ? (
                  <button onClick={startSession} className="btn-primary">
                    <Play className="w-5 h-5 mr-2" />
                    Start Session
                  </button>
                ) : (
                  <>
                    <button onClick={pauseSession} className="btn-secondary">
                      <Pause className="w-5 h-5 mr-2" />
                      Pause
                    </button>
                    <button onClick={resetSession} className="btn-secondary">
                      <RotateCcw className="w-5 h-5 mr-2" />
                      Reset
                    </button>
                  </>
                )}
              </div>

              {/* Session Info */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">{currentCycle}</div>
                  <div className="text-sm text-gray-400">Cycle</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{totalCycles}</div>
                  <div className="text-sm text-gray-400">Total</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm text-gray-400">Duration</div>
                </div>
              </div>
            </div>
          </section>

          {/* Breath Patterns */}
          <section className="page-section">
            <div className="glass-card">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-purple-400" />
                <h2 className="section-title">Breath Patterns</h2>
              </div>
              
              <div className="space-y-4">
                {temperanceBreathPatterns.map((pattern) => {
                  const IconComponent = pattern.icon;
                  const isExpanded = expandedPattern === pattern.name;
                  const isSelected = selectedPattern.name === pattern.name;
                  
                  return (
                    <div
                      key={pattern.name}
                      className={`p-6 rounded-xl border transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r ' + pattern.color + ' text-white border-transparent'
                          : 'bg-white/5 text-white hover:bg-white/10 border-white/20'
                      }`}
                      onClick={() => setSelectedPattern(pattern)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <IconComponent className="w-6 h-6" />
                          <h3 className="text-lg font-semibold">{pattern.name}</h3>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePatternExpansion(pattern.name);
                          }}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      </div>
                      
                      <p className="body-text mb-4">
                        {pattern.description}
                      </p>
                      
                      {isExpanded && (
                        <div className="mt-4 space-y-4">
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Philosophical Context</h4>
                            <p className="body-text">{pattern.philosophicalContext}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Benefits</h4>
                            <div className="flex flex-wrap gap-2">
                              {pattern.benefits.map((benefit) => (
                                <span
                                  key={benefit}
                                  className="px-2 py-1 bg-white/20 text-xs rounded-full border border-white/30"
                                >
                                  {benefit}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Pattern</h4>
                            <div className="grid grid-cols-4 gap-2 text-sm">
                              <div className="text-center">
                                <div className="font-bold">{pattern.pattern.inhale}s</div>
                                <div className="text-xs opacity-70">Inhale</div>
                              </div>
                              <div className="text-center">
                                <div className="font-bold">{pattern.pattern.hold}s</div>
                                <div className="text-xs opacity-70">Hold</div>
                              </div>
                              <div className="text-center">
                                <div className="font-bold">{pattern.pattern.exhale}s</div>
                                <div className="text-xs opacity-70">Exhale</div>
                              </div>
                              <div className="text-center">
                                <div className="font-bold">{pattern.pattern.hold2}s</div>
                                <div className="text-xs opacity-70">Hold</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current Pattern Info */}
          <div className="glass-card">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h2 className="section-title">Current Pattern</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">{selectedPattern.name}</h3>
                <p className="body-text">{selectedPattern.description}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Time:</span>
                  <span className="text-white">
                    {Math.floor((selectedPattern.pattern.inhale + selectedPattern.pattern.hold + selectedPattern.pattern.exhale + selectedPattern.pattern.hold2) * selectedPattern.pattern.cycles / 60)}m
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Cycles:</span>
                  <span className="text-white">{selectedPattern.pattern.cycles}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Virtue:</span>
                  <span className="text-white">Temperance</span>
                </div>
              </div>
            </div>
          </div>

          {/* Temperance Quote */}
          <div className="glass-card bg-gradient-to-r from-purple-500/20 to-pink-600/20">
            <blockquote className="text-lg italic text-white mb-4 leading-relaxed">
              "Temperance is the virtue that moderates the attraction of pleasures and provides balance in the use of created goods."
            </blockquote>
            <cite className="text-sm text-purple-300">— Thomas Aquinas</cite>
          </div>

          {/* Progress Stats */}
          <div className="glass-card">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-5 h-5 text-purple-400" />
              <h2 className="section-title">Your Progress</h2>
            </div>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">82%</div>
                <div className="text-sm text-gray-400">Overall Temperance Score</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Sessions Completed</span>
                  <span className="text-white">24/30</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Streak</span>
                  <span className="text-white">15 days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Inner Balance</span>
                  <span className="text-white">High</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
} 