'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Settings, Target } from 'lucide-react';
import { BalanceEngine, MotionData } from '@/lib/balance-engine';
import { SessionStore, SessionSummary } from '@/lib/session-store';
import { HapticFeedback, HapticEvent } from '@/lib/haptic-feedback';
import { ProgressRing, AnimatedProgressRing } from './ProgressRing';
import { logToJournal } from '@/lib/journal-logger';

interface BalanceMeterViewProps {
  goalSeconds?: number;
  onComplete?: (session: SessionSummary) => void;
  className?: string;
}

export function BalanceMeterView({ 
  goalSeconds = 30, 
  onComplete,
  className = ''
}: BalanceMeterViewProps) {
  // State
  const [engine] = useState(() => new BalanceEngine({ goalSeconds }));
  const [haptic] = useState(() => new HapticFeedback());
  const [motionData, setMotionData] = useState<MotionData>({
    pitch: 0,
    roll: 0,
    isStable: false,
    stableSeconds: 0
  });
  const [state, setState] = useState<'idle' | 'calibrating' | 'running' | 'completed'>('idle');
  const [balanceState, setBalanceState] = useState<'stable' | 'borderline' | 'out'>('stable');
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    hapticsEnabled: true,
    audioEnabled: false,
    highContrast: false
  });
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const breathingTimerRef = useRef<NodeJS.Timeout>();
  const lastBalanceStateRef = useRef<'stable' | 'borderline' | 'out'>('stable');
  
  // Initialize
  useEffect(() => {
    // Set up motion data callback
    engine.onMotionUpdateCallback((data) => {
      setMotionData(data);
      setBalanceState(engine.getBalanceState());
    });
    
    // Set up state change callback
    engine.onStateChangeCallback((newState) => {
      setState(newState);
      
      if (newState === 'completed') {
        handleSessionComplete();
      }
    });
    
    // Set up haptic feedback
    haptic.updateConfig({
      enabled: settings.hapticsEnabled,
      volume: settings.audioEnabled ? 0.5 : 0
    });
    
    return () => {
      engine.stop();
      haptic.destroy();
      if (breathingTimerRef.current) {
        clearInterval(breathingTimerRef.current);
      }
    };
  }, [engine, haptic, settings]);
  
  // Handle balance state changes for haptics
  useEffect(() => {
    if (state !== 'running') return;
    
    const currentState = balanceState;
    const lastState = lastBalanceStateRef.current;
    
    if (currentState !== lastState) {
      if (currentState === 'stable' && lastState !== 'stable') {
        haptic.trigger('enter_stable');
      } else if (currentState === 'out' && lastState !== 'out') {
        haptic.trigger('exit_zone');
      }
      
      lastBalanceStateRef.current = currentState;
    }
    
    // Stable tick haptic
    if (currentState === 'stable') {
      haptic.trigger('stable_tick');
    }
  }, [balanceState, state, haptic]);
  
  // Breathing reminder audio
  useEffect(() => {
    if (state === 'running' && settings.audioEnabled) {
      breathingTimerRef.current = setInterval(() => {
        haptic.playBreathingReminder();
      }, 10000); // Every 10 seconds
      
      return () => {
        if (breathingTimerRef.current) {
          clearInterval(breathingTimerRef.current);
        }
      };
    }
  }, [state, settings.audioEnabled, haptic]);
  
  // Handlers
  const handleStart = useCallback(async () => {
    const success = await engine.start();
    if (success) {
      setSessionStartTime(Date.now());
      haptic.trigger('calibration_complete');
    }
  }, [engine, haptic]);
  
  const handleStop = useCallback(() => {
    engine.stop();
    if (breathingTimerRef.current) {
      clearInterval(breathingTimerRef.current);
    }
  }, [engine]);
  
  const handleReset = useCallback(() => {
    engine.reset();
    setSessionStartTime(0);
    haptic.reset();
  }, [engine, haptic]);
  
  const handleSessionComplete = useCallback(async () => {
    const totalDuration = Date.now() - sessionStartTime;
    const session: SessionSummary = {
      id: '',
      date: new Date(),
      goal: goalSeconds,
      secondsStable: Math.floor(motionData.stableSeconds),
      totalDuration,
      balanceState,
      motionData: {
        maxPitch: Math.abs(motionData.pitch),
        maxRoll: Math.abs(motionData.roll),
        avgDeviation: (Math.abs(motionData.pitch) + Math.abs(motionData.roll)) / 2
      }
    };
    
    const savedSession = SessionStore.saveSession(session);
    haptic.trigger('completion');
    
    // Log successful balance session to journal
    try {
      await logToJournal({
        type: 'activity',
        content: `Completed ${goalSeconds}-second balance challenge! Held steady for ${Math.floor(motionData.stableSeconds)} seconds.`,
        category: 'balance_training',
        metadata: {
          goalSeconds,
          stableSeconds: Math.floor(motionData.stableSeconds),
          totalDuration,
          balanceState,
          maxPitch: Math.abs(motionData.pitch),
          maxRoll: Math.abs(motionData.roll),
          avgDeviation: (Math.abs(motionData.pitch) + Math.abs(motionData.roll)) / 2,
          sessionId: savedSession.id,
          timestamp: new Date().toISOString()
        },
        moduleId: 'balance_gyro',
        widgetId: 'balance_challenge'
      });
    } catch (error) {
      console.error('Error logging balance session to journal:', error);
    }
    
    onComplete?.(savedSession);
  }, [sessionStartTime, goalSeconds, motionData, balanceState, haptic, onComplete]);
  
  // Get screen coordinates for the dot
  const getDotPosition = useCallback(() => {
    if (!containerRef.current) return { x: 0, y: 0 };
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const coords = engine.mapToScreenCoordinates(rect.width, rect.height);
    
    return {
      x: centerX + coords.x,
      y: centerY + coords.y
    };
  }, [engine, motionData]);
  
  // Get colors based on state
  const getColors = () => {
    const baseColors = {
      stable: '#16A34A',      // green-600
      borderline: '#F59E0B',  // amber-500
      out: '#EF4444',         // red-500
      completed: '#10B981'    // emerald-500
    };
    
    if (settings.highContrast) {
      return {
        stable: '#22C55E',      // green-500
        borderline: '#F59E0B',  // amber-500
        out: '#DC2626',         // red-600
        completed: '#059669'    // emerald-600
      };
    }
    
    return baseColors;
  };
  
  const colors = getColors();
  const dotPosition = getDotPosition();
  const progress = engine.progress;
  const remainingTime = engine.remainingTime;
  
  // Get status text
  const getStatusText = () => {
    switch (state) {
      case 'idle':
        return 'Ready to begin';
      case 'calibrating':
        return 'Calibrating...';
      case 'running':
        switch (balanceState) {
          case 'stable':
            return 'Hold steady...';
          case 'borderline':
            return 'Find center';
          case 'out':
            return 'Find center';
        }
        break;
      case 'completed':
        return 'Challenge complete!';
    }
  };
  
  return (
    <div className={`flex flex-col items-center justify-center w-full max-w-sm mx-auto ${className}`}>
      {/* Main Balance Display */}
      <div 
        ref={containerRef}
        className="relative w-full max-w-[280px] aspect-square mb-4"
      >
        {/* Safe Zone Circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="border-2 border-dashed rounded-full transition-all duration-300"
            style={{
              width: '72%', // 36% radius * 2
              height: '72%',
              borderColor: balanceState === 'borderline' ? colors.borderline : 'rgba(156, 163, 175, 0.3)',
              boxShadow: balanceState === 'borderline' ? `0 0 20px ${colors.borderline}40` : 'none'
            }}
          />
        </div>
        
        {/* Progress Ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatedProgressRing
            size={Math.min(280, containerRef.current?.offsetWidth || 280)}
            targetProgress={progress}
            color={state === 'completed' ? 'completed' : balanceState}
            isAnimating={state === 'running'}
          >
            {/* Countdown Timer */}
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                {state === 'running' ? Math.ceil(remainingTime) : Math.floor(motionData.stableSeconds)}
              </div>
              <div className="text-xs sm:text-sm text-gray-400">
                {state === 'running' ? 'remaining' : 'stable'}
              </div>
            </div>
          </AnimatedProgressRing>
        </div>
        
        {/* Balance Dot */}
        <div
          className="absolute w-6 h-6 rounded-full transition-all duration-200 ease-out"
          style={{
            left: dotPosition.x - 12,
            top: dotPosition.y - 12,
            backgroundColor: colors[balanceState],
            boxShadow: balanceState === 'out' ? `0 0 20px ${colors.out}80` : 'none',
            transform: 'translate3d(0, 0, 0)' // Hardware acceleration
          }}
        />
        
        {/* Out of Zone Pulse Effect */}
        {balanceState === 'out' && (
          <div 
            className="absolute inset-0 rounded-full animate-pulse"
            style={{
              border: `2px solid ${colors.out}`,
              opacity: 0.3
            }}
          />
        )}
      </div>
      
      {/* Status Text */}
      <div className="text-center mb-4">
        <div className="text-base sm:text-lg font-medium text-white mb-2">
          {getStatusText()}
        </div>
        <div className="text-xs sm:text-sm text-gray-400">
          Goal: {goalSeconds}s • Target: {Math.floor(motionData.stableSeconds)}s stable
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 justify-center">
        {state === 'idle' ? (
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-white font-medium text-sm sm:text-base"
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5" />
            Start
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors text-white font-medium text-sm sm:text-base"
          >
            <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
            Stop
          </button>
        )}
        
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors text-white font-medium text-sm sm:text-base"
        >
          <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
          Reset
        </button>
        
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors text-white font-medium text-sm sm:text-base"
        >
          <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          Settings
        </button>
      </div>
      
      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 w-full max-w-sm">
          <h3 className="text-white font-medium mb-3">Settings</h3>
          
          <div className="space-y-3">
            <label className="flex items-center justify-between text-white">
              <span>Haptic Feedback</span>
              <input
                type="checkbox"
                checked={settings.hapticsEnabled}
                onChange={(e) => {
                  const newSettings = { ...settings, hapticsEnabled: e.target.checked };
                  setSettings(newSettings);
                  haptic.updateConfig({ enabled: e.target.checked });
                }}
                className="w-4 h-4"
              />
            </label>
            
            <label className="flex items-center justify-between text-white">
              <span>Audio Cues</span>
              <input
                type="checkbox"
                checked={settings.audioEnabled}
                onChange={(e) => {
                  const newSettings = { ...settings, audioEnabled: e.target.checked };
                  setSettings(newSettings);
                  haptic.updateConfig({ volume: e.target.checked ? 0.5 : 0 });
                }}
                className="w-4 h-4"
              />
            </label>
            
            <label className="flex items-center justify-between text-white">
              <span>High Contrast</span>
              <input
                type="checkbox"
                checked={settings.highContrast}
                onChange={(e) => setSettings({ ...settings, highContrast: e.target.checked })}
                className="w-4 h-4"
              />
            </label>
          </div>
        </div>
      )}
      
      {/* Debug Info (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-800/30 rounded text-xs text-gray-400">
          <div>Pitch: {motionData.pitch.toFixed(3)}</div>
          <div>Roll: {motionData.roll.toFixed(3)}</div>
          <div>State: {state}</div>
          <div>Balance: {balanceState}</div>
        </div>
      )}
    </div>
  );
}
