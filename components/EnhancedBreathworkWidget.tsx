'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Settings, Timer, Wind } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { breathworkAudioManager } from '@/lib/breathwork-audio-manager';
import { useBreathworkTimer } from '@/lib/hooks/useBreathworkTimer';

interface BreathPattern {
  id: string;
  name: string;
  description: string;
  ratio: string;
  phases: {
    name: string;
    duration: number;
    color: string;
    instruction: string;
  }[];
  cycles: number;
  totalDuration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  benefits: string[];
  framework: string;
}

const breathPatterns: BreathPattern[] = [
  {
    id: 'box-breathing',
    name: 'Box Breathing',
    description: 'Equal inhale, hold, exhale, hold - perfect for focus and calm',
    ratio: '4:4:4:4',
    phases: [
      { name: 'inhale', duration: 4, color: 'bg-blue-500', instruction: 'Breathe in slowly' },
      { name: 'hold', duration: 4, color: 'bg-green-500', instruction: 'Hold your breath' },
      { name: 'exhale', duration: 4, color: 'bg-orange-500', instruction: 'Breathe out gently' },
      { name: 'hold2', duration: 4, color: 'bg-purple-500', instruction: 'Hold empty' }
    ],
    cycles: 10,
    totalDuration: 160,
    difficulty: 'beginner',
    benefits: ['Focus', 'Calm', 'Stress Relief'],
    framework: 'stoic'
  },
  {
    id: '4-7-8',
    name: '4-7-8 Breathing',
    description: 'Inhale for 4, hold for 7, exhale for 8 - promotes deep relaxation',
    ratio: '4:7:8:0',
    phases: [
      { name: 'inhale', duration: 4, color: 'bg-blue-500', instruction: 'Breathe in slowly' },
      { name: 'hold', duration: 7, color: 'bg-green-500', instruction: 'Hold your breath' },
      { name: 'exhale', duration: 8, color: 'bg-orange-500', instruction: 'Breathe out slowly' },
      { name: 'hold2', duration: 0, color: 'bg-purple-500', instruction: 'Rest' }
    ],
    cycles: 8,
    totalDuration: 152,
    difficulty: 'intermediate',
    benefits: ['Relaxation', 'Sleep', 'Anxiety Relief'],
    framework: 'stoic'
  },
  {
    id: 'triangle-breathing',
    name: 'Triangle Breathing',
    description: 'Equal inhale, hold, exhale - simple and effective',
    ratio: '4:4:4:0',
    phases: [
      { name: 'inhale', duration: 4, color: 'bg-blue-500', instruction: 'Breathe in slowly' },
      { name: 'hold', duration: 4, color: 'bg-green-500', instruction: 'Hold your breath' },
      { name: 'exhale', duration: 4, color: 'bg-orange-500', instruction: 'Breathe out gently' },
      { name: 'hold2', duration: 0, color: 'bg-purple-500', instruction: 'Rest' }
    ],
    cycles: 12,
    totalDuration: 144,
    difficulty: 'beginner',
    benefits: ['Balance', 'Focus', 'Calm'],
    framework: 'stoic'
  }
];

interface EnhancedBreathworkWidgetProps {
  frameworkTone?: string;
  className?: string;
}

export function EnhancedBreathworkWidget({ frameworkTone = "stoic", className }: EnhancedBreathworkWidgetProps) {
  const [selectedPattern, setSelectedPattern] = useState<BreathPattern>(breathPatterns[0]);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [showSettings, setShowSettings] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);

  // Use the breathwork timer hook
  const {
    isActive,
    isPreparing,
    currentPhase,
    timeLeft,
    currentCycle,
    prepCountdown,
    startSession,
    pauseSession,
    resetSession,
    toggleSession
  } = useBreathworkTimer({
    pattern: selectedPattern,
    onPhaseChange: (phase) => {
      console.log('Phase changed to:', phase);
    },
    onCycleComplete: (cycle) => {
      console.log('Cycle completed:', cycle);
    },
    onSessionComplete: () => {
      console.log('Session completed');
    },
    audioEnabled,
    hapticEnabled
  });

  const getPhaseInfo = (phaseName: string) => {
    return selectedPattern.phases.find(p => p.name === phaseName) || selectedPattern.phases[0];
  };

  const getPhaseProgress = () => {
    const phaseInfo = getPhaseInfo(currentPhase);
    return ((phaseInfo.duration - timeLeft) / phaseInfo.duration) * 100;
  };

  const getSessionProgress = () => {
    const totalTime = selectedPattern.totalDuration;
    const elapsedTime = (selectedPattern.cycles - currentCycle) * selectedPattern.phases.reduce((sum, phase) => sum + phase.duration, 0) + 
                       selectedPattern.phases.reduce((sum, phase) => sum + phase.duration, 0) - timeLeft;
    return (elapsedTime / totalTime) * 100;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseColor = (phase: string) => {
    const phaseInfo = getPhaseInfo(phase);
    return phaseInfo.color;
  };

  const getPhaseInstruction = (phase: string) => {
    const phaseInfo = getPhaseInfo(phase);
    return phaseInfo.instruction;
  };

  return (
    <Card className={cn("bg-surface border border-border", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-text flex items-center gap-2">
              <Wind className="w-5 h-5 text-primary" />
              Enhanced Breathwork
            </CardTitle>
            <CardDescription className="text-muted">
              Perfect audio-visual synchronization
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
              className="text-muted hover:text-text"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="text-muted hover:text-text"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Pattern Selection */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-text">Breathing Pattern</h3>
          <div className="grid grid-cols-1 gap-2">
            {breathPatterns.map((pattern) => (
              <button
                key={pattern.id}
                onClick={() => setSelectedPattern(pattern)}
                className={cn(
                  "p-3 rounded-lg border text-left transition-all duration-200",
                  selectedPattern.id === pattern.id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-surface-2 hover:bg-surface-3"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-text">{pattern.name}</h4>
                    <p className="text-xs text-muted">{pattern.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {pattern.ratio}
                    </Badge>
                    <Badge 
                      variant={pattern.difficulty === 'beginner' ? 'default' : pattern.difficulty === 'intermediate' ? 'secondary' : 'destructive'}
                      className="text-xs"
                    >
                      {pattern.difficulty}
                    </Badge>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 p-4 bg-surface-2 rounded-lg border border-border"
            >
              <h3 className="text-sm font-medium text-text">Settings</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text">Audio Guidance</span>
                  <button
                    onClick={() => setAudioEnabled(!audioEnabled)}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200",
                      audioEnabled ? "bg-primary" : "bg-surface-3"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200",
                        audioEnabled ? "translate-x-6" : "translate-x-1"
                      )}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-text">Haptic Feedback</span>
                  <button
                    onClick={() => setHapticEnabled(!hapticEnabled)}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200",
                      hapticEnabled ? "bg-primary" : "bg-surface-3"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200",
                        hapticEnabled ? "translate-x-6" : "translate-x-1"
                      )}
                    />
                  </button>
                </div>

                <div className="space-y-2">
                  <span className="text-sm text-text">Volume</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Breath Circle */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Outer Circle - Session Progress */}
            <div className="w-64 h-64 rounded-full border-4 border-surface-3 relative">
              {/* Inner Circle - Phase Progress */}
              <div className="absolute inset-4 rounded-full border-4 border-surface-2 flex items-center justify-center">
                {/* Phase Circle */}
                <div className="w-48 h-48 rounded-full flex items-center justify-center relative overflow-hidden">
                  <motion.div
                    key={`${currentPhase}-${timeLeft}`}
                    className={cn(
                      "absolute inset-0 rounded-full",
                      getPhaseColor(currentPhase)
                    )}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Content */}
                  <div className="relative z-10 text-center text-white">
                    {isPreparing ? (
                      <div className="space-y-2">
                        <div className="text-4xl font-bold">{prepCountdown}</div>
                        <div className="text-sm">Get Ready</div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-4xl font-bold">{timeLeft}</div>
                        <div className="text-sm capitalize">{currentPhase}</div>
                        <div className="text-xs opacity-80">
                          {getPhaseInstruction(currentPhase)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text">Phase Progress</span>
            <span className="text-muted">{Math.round(getPhaseProgress())}%</span>
          </div>
          <Progress value={getPhaseProgress()} className="h-2" />
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-text">Session Progress</span>
            <span className="text-muted">{Math.round(getSessionProgress())}%</span>
          </div>
          <Progress value={getSessionProgress()} className="h-2" />
        </div>

        {/* Session Info */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-text">{currentCycle}</div>
            <div className="text-xs text-muted">Cycle</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-text">{selectedPattern.cycles}</div>
            <div className="text-xs text-muted">Total</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-text">{formatTime(selectedPattern.totalDuration)}</div>
            <div className="text-xs text-muted">Duration</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3">
          <Button
            onClick={resetSession}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
          
          <Button
            onClick={toggleSession}
            className={cn(
              "flex items-center gap-2",
              isActive ? "bg-orange-500 hover:bg-orange-600" : "bg-primary hover:bg-primary/90"
            )}
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                {isPreparing ? 'Preparing...' : 'Start'}
              </>
            )}
          </Button>
        </div>

        {/* Pattern Benefits */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-text">Benefits</h3>
          <div className="flex flex-wrap gap-2">
            {selectedPattern.benefits.map((benefit, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {benefit}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
