'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Target, RotateCcw, Play, Pause, TrendingUp } from 'lucide-react';
import { GlassCard } from '../GlassCard';

interface BalanceCardProps {
  title: string;
  config: {
    targetSec: number;
    sensitivity: 'low' | 'medium' | 'high';
    teaching: string;
  };
  onComplete: (payload: any) => void;
  virtueGrantPerCompletion: any;
}

interface MotionData {
  x: number;
  y: number;
  z: number;
  timestamp: number;
}

export default function BalanceCard({ 
  title, 
  config, 
  onComplete, 
  virtueGrantPerCompletion 
}: BalanceCardProps) {
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [balanceTime, setBalanceTime] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [motionHistory, setMotionHistory] = useState<MotionData[]>([]);
  const [isDeviceMotionSupported, setIsDeviceMotionSupported] = useState(false);
  
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const lastMotionTimeRef = useRef<number>();

  // Check device motion support
  useEffect(() => {
    if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      setIsDeviceMotionSupported(true);
      console.log('Device motion supported');
    } else {
      console.log('Device motion not supported');
    }
  }, []);

  // Handle device motion - always active for testing
  useEffect(() => {
    if (!isDeviceMotionSupported) return;

    const handleMotion = (event: DeviceMotionEvent) => {
      const { accelerationIncludingGravity } = event;
      if (!accelerationIncludingGravity) {
        console.log('No acceleration data');
        return;
      }

      const { x, y, z } = accelerationIncludingGravity;
      const timestamp = Date.now();

      // Calculate motion magnitude
      const magnitude = Math.sqrt((x || 0) ** 2 + (y || 0) ** 2 + (z || 0) ** 2);
      
      console.log('Motion detected:', { x, y, z, magnitude });
      
      // Get sensitivity threshold
      const sensitivityThresholds = {
        low: 0.5,
        medium: 0.3,
        high: 0.15
      };
      const threshold = sensitivityThresholds[config.sensitivity];

      // Check if motion is within acceptable range
      const isBalanced = magnitude < threshold;
      
      if (isBalanced) {
        setCurrentStreak(prev => prev + 1);
        if (currentStreak + 1 > bestStreak) {
          setBestStreak(currentStreak + 1);
        }
      } else {
        setCurrentStreak(0);
      }

      // Store motion data
      setMotionHistory(prev => [...prev.slice(-50), { x: x || 0, y: y || 0, z: z || 0, timestamp }]);
      lastMotionTimeRef.current = timestamp;
    };

    // Add motion event listener directly (iOS doesn't need permission for DeviceMotionEvent)
    window.addEventListener('devicemotion', handleMotion);
    console.log('Motion event listener added');

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [isActive, isDeviceMotionSupported, config.sensitivity, currentStreak, bestStreak]);

  // Animation loop for balance time tracking
  useEffect(() => {
    if (!isActive) return;

    const updateBalanceTime = () => {
      if (!startTimeRef.current) return;

      const elapsed = Date.now() - startTimeRef.current;
      setBalanceTime(elapsed);

      // Check if target time reached
      if (elapsed >= config.targetSec * 1000) {
        setIsActive(false);
        setIsCompleted(true);
        return;
      }

      animationFrameRef.current = requestAnimationFrame(updateBalanceTime);
    };

    animationFrameRef.current = requestAnimationFrame(updateBalanceTime);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, config.targetSec]);

  const startBalance = () => {
    setIsActive(true);
    setBalanceTime(0);
    setCurrentStreak(0);
    setMotionHistory([]);
    startTimeRef.current = Date.now();
    lastMotionTimeRef.current = Date.now();
  };

  // Test motion detection with sample data
  const testMotionDetection = () => {
    const testData = [
      { x: 0.1, y: 0.05, z: 9.81, timestamp: Date.now() },
      { x: 0.15, y: -0.02, z: 9.79, timestamp: Date.now() + 100 },
      { x: 0.08, y: 0.12, z: 9.82, timestamp: Date.now() + 200 }
    ];
    setMotionHistory(testData);
    console.log('Test motion data added:', testData);
  };

  const stopBalance = () => {
    setIsActive(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const resetBalance = () => {
    setIsActive(false);
    setIsCompleted(false);
    setBalanceTime(0);
    setCurrentStreak(0);
    setMotionHistory([]);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const handleComplete = useCallback(() => {
    const payload = {
      balanceTime: balanceTime / 1000,
      targetTime: config.targetSec,
      bestStreak,
      sensitivity: config.sensitivity,
      motionDataPoints: motionHistory.length,
      percentage: Math.min(100, (balanceTime / (config.targetSec * 1000)) * 100)
    };

    onComplete({
      type: 'balance_gyro',
      payload,
      virtues: virtueGrantPerCompletion
    });
  }, [balanceTime, config, bestStreak, motionHistory.length, onComplete, virtueGrantPerCompletion]);

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = Math.min(100, (balanceTime / (config.targetSec * 1000)) * 100);

  // Visual balance indicator
  const getBalanceIndicator = () => {
    if (!isActive) return '⚪';
    
    const motionLevel = motionHistory.length > 0 ? 
      Math.sqrt(
        motionHistory[motionHistory.length - 1].x ** 2 + 
        motionHistory[motionHistory.length - 1].y ** 2 + 
        motionHistory[motionHistory.length - 1].z ** 2
      ) : 0;
    
    const sensitivityThresholds = {
      low: 0.5,
      medium: 0.3,
      high: 0.15
    };
    const threshold = sensitivityThresholds[config.sensitivity];
    
    if (motionLevel < threshold * 0.5) return '🟢'; // Very stable
    if (motionLevel < threshold) return '🟡'; // Stable
    return '🔴'; // Unstable
  };

  if (!isDeviceMotionSupported) {
    return (
      <GlassCard 
        title={title}
        action={<Target className="w-5 h-5 text-gray-400" />}
        className="p-6"
      >
        <p className="text-sm text-gray-300 mb-4">{config.teaching}</p>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📱</div>
          <p className="text-gray-400 mb-2">Device motion not supported</p>
          <p className="text-sm text-gray-500">
            This widget requires a device with motion sensors (iPhone, iPad, etc.)
          </p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard 
      title={title}
      action={<Target className="w-5 h-5 text-gray-400" />}
      className="p-6"
    >
      <p className="text-sm text-gray-300 mb-4">{config.teaching}</p>

      {/* Balance Status Display */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">
          {getBalanceIndicator()}
        </div>
        
        <div className="text-2xl font-bold text-white mb-2">
          {formatTime(balanceTime)}
        </div>
        
        <div className="text-sm text-gray-400 mb-4">
          Target: {formatTime(config.targetSec * 1000)}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
          <div 
            className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="text-xs text-gray-400 mb-4">
          {progress.toFixed(0)}% complete
        </div>

        {/* Streak Display */}
        <div className="flex justify-center gap-6 text-sm">
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-400">{currentStreak}</div>
            <div className="text-gray-400">Current</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-400">{bestStreak}</div>
            <div className="text-gray-400">Best</div>
          </div>
        </div>
      </div>

      {/* Real-time Motion Data */}
      <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-white">Motion Data (Always Active)</span>
        </div>
        {motionHistory.length > 0 ? (
          <div className="text-xs text-gray-400 space-y-1">
            <div>X: {motionHistory[motionHistory.length - 1]?.x?.toFixed(2) || '0.00'}</div>
            <div>Y: {motionHistory[motionHistory.length - 1]?.y?.toFixed(2) || '0.00'}</div>
            <div>Z: {motionHistory[motionHistory.length - 1]?.z?.toFixed(2) || '0.00'}</div>
            <div>Magnitude: {motionHistory[motionHistory.length - 1] ? 
              Math.sqrt(
                (motionHistory[motionHistory.length - 1].x || 0) ** 2 + 
                (motionHistory[motionHistory.length - 1].y || 0) ** 2 + 
                (motionHistory[motionHistory.length - 1].z || 0) ** 2
              ).toFixed(2) : '0.00'
            }</div>
            <div className="text-green-400 mt-2">✅ Motion detection active</div>
          </div>
        ) : (
          <div className="text-xs text-red-400 space-y-1">
            <div>No motion data received</div>
            <div>Check console for motion events</div>
            <div className="text-yellow-400 mt-2">⚠️ Try moving your device</div>
          </div>
        )}
      </div>

      {/* Sensitivity Info */}
      <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-white">Sensitivity: {config.sensitivity}</span>
        </div>
        <p className="text-xs text-gray-400">
          {config.sensitivity === 'low' && 'Forgiving - allows more movement'}
          {config.sensitivity === 'medium' && 'Balanced - moderate stability required'}
          {config.sensitivity === 'high' && 'Precise - requires very stable balance'}
        </p>
      </div>

      {/* Test Controls */}
      <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
        <div className="text-center mb-2">
          <span className="text-sm font-medium text-yellow-400">Motion Detection Test</span>
        </div>
        <div className="flex justify-center gap-2">
          <button
            onClick={testMotionDetection}
            className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-xs text-white transition-colors"
          >
            Test Motion Data
          </button>
          <button
            onClick={() => setMotionHistory([])}
            className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-xs text-white transition-colors"
          >
            Clear Data
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-4">
        {!isCompleted ? (
          <>
            {!isActive ? (
              <button
                onClick={startBalance}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                <Play className="w-4 h-4" />
                Start
              </button>
            ) : (
              <button
                onClick={stopBalance}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
              >
                <Pause className="w-4 h-4" />
                Pause
              </button>
            )}
            <button
              onClick={resetBalance}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </>
        ) : (
          <button
            onClick={handleComplete}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Complete
          </button>
        )}
      </div>

      {/* Instructions */}
      {!isActive && !isCompleted && (
        <div className="text-center text-sm text-gray-400">
          <p>Hold your device steady to maintain balance</p>
          <p className="mt-1">Green = stable, Yellow = acceptable, Red = too much motion</p>
        </div>
      )}
    </GlassCard>
  );
} 