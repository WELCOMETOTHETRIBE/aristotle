'use client';

import { useState, useEffect, useRef } from 'react';
import { Target, RotateCcw, Play, Pause } from 'lucide-react';
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

export default function BalanceCard({ 
  title, 
  config, 
  onComplete, 
  virtueGrantPerCompletion 
}: BalanceCardProps) {
  const [isActive, setIsActive] = useState(false);
  const [balanceTime, setBalanceTime] = useState(0);
  const [motionDetected, setMotionDetected] = useState(false);
  const [lastMotion, setLastMotion] = useState({ x: 0, y: 0, z: 0 });
  const [isBalanced, setIsBalanced] = useState(true);
  const [motionCount, setMotionCount] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const motionThresholdRef = useRef<number>();
  const lastMotionTimeRef = useRef<number>();

  // Get motion threshold based on sensitivity
  const getMotionThreshold = () => {
    switch (config.sensitivity) {
      case 'low': return 0.5;    // Very sensitive - small movements count
      case 'medium': return 1.0; // Moderate sensitivity
      case 'high': return 2.0;   // Less sensitive - only large movements count
      default: return 1.0;
    }
  };

  // Motion detection - only active during balance sessions
  useEffect(() => {
    if (!isActive || typeof window === 'undefined' || !('DeviceMotionEvent' in window)) {
      return;
    }

    console.log('✅ Starting motion detection for balance session');
    
    const handleMotion = (event: DeviceMotionEvent) => {
      const { accelerationIncludingGravity } = event;
      if (!accelerationIncludingGravity) return;

      const { x, y, z } = accelerationIncludingGravity;
      const currentMotion = { x: x || 0, y: y || 0, z: z || 0 };
      
      setLastMotion(currentMotion);
      setMotionDetected(true);
      
      // Calculate motion magnitude (deviation from gravity)
      const magnitude = Math.sqrt((x || 0) ** 2 + (y || 0) ** 2 + (z || 0) ** 2);
      const threshold = getMotionThreshold();
      
      // Check if motion exceeds threshold (user is not balanced)
      const isCurrentlyBalanced = magnitude < threshold;
      setIsBalanced(isCurrentlyBalanced);
      
      // Count motion events that exceed threshold
      if (!isCurrentlyBalanced) {
        setMotionCount(prev => prev + 1);
        lastMotionTimeRef.current = Date.now();
      }
      
      console.log('Motion data:', { 
        x: x?.toFixed(2), 
        y: y?.toFixed(2), 
        z: z?.toFixed(2), 
        magnitude: magnitude.toFixed(2),
        threshold,
        isBalanced: isCurrentlyBalanced,
        motionCount: motionCount + (!isCurrentlyBalanced ? 1 : 0)
      });
    };

    // Request permission for motion events (required on iOS 13+)
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      (DeviceMotionEvent as any).requestPermission().then((response: string) => {
        if (response === 'granted') {
          window.addEventListener('devicemotion', handleMotion);
        } else {
          console.log('❌ Motion permission denied');
        }
      });
    } else {
      window.addEventListener('devicemotion', handleMotion);
    }

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
      console.log('✅ Motion detection stopped');
    };
  }, [isActive, config.sensitivity]);

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
        setSessionComplete(true);
        console.log('🎉 Balance challenge completed successfully!');
        onComplete({
          duration: elapsed,
          motionCount,
          success: true,
          sensitivity: config.sensitivity
        });
        return;
      }

      // Check for excessive motion (optional failure condition)
      // Allow some motion but not too much
      if (motionCount > 50) { // Adjust threshold as needed
        setIsActive(false);
        console.log('❌ Balance challenge failed - too much motion');
        onComplete({
          duration: elapsed,
          motionCount,
          success: false,
          sensitivity: config.sensitivity,
          reason: 'excessive_motion'
        });
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
  }, [isActive, config.targetSec, motionCount, onComplete, config.sensitivity]);

  const startBalance = () => {
    setIsActive(true);
    setBalanceTime(0);
    setMotionCount(0);
    setIsBalanced(true);
    setSessionComplete(false);
    startTimeRef.current = Date.now();
    console.log('🚀 Starting balance challenge...');
  };

  const stopBalance = () => {
    setIsActive(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    console.log('⏹️ Balance challenge stopped manually');
  };

  const resetBalance = () => {
    setIsActive(false);
    setBalanceTime(0);
    setMotionCount(0);
    setIsBalanced(true);
    setSessionComplete(false);
    setMotionDetected(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    console.log('🔄 Balance challenge reset');
  };

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = Math.min(100, (balanceTime / (config.targetSec * 1000)) * 100);

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
          {sessionComplete ? '🎉' : isActive ? (isBalanced ? '⚖️' : '📱') : '⚪'}
        </div>
        
        <div className="text-2xl font-bold text-white mb-2">
          {formatTime(balanceTime)}
        </div>
        
        <div className="text-sm text-gray-400 mb-2">
          Target: {formatTime(config.targetSec * 1000)}
        </div>

        {/* Balance Status */}
        {isActive && (
          <div className={`text-sm font-medium mb-4 ${
            isBalanced ? 'text-green-400' : 'text-red-400'
          }`}>
            {isBalanced ? '✅ Balanced' : '⚠️ Moving'}
          </div>
        )}

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              sessionComplete 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                : isBalanced 
                  ? 'bg-gradient-to-r from-green-500 to-blue-500'
                  : 'bg-gradient-to-r from-yellow-500 to-red-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="text-xs text-gray-400 mb-4">
          {progress.toFixed(0)}% complete
        </div>
      </div>

      {/* Motion Data Display */}
      <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
        <div className="text-center mb-2">
          <span className="text-sm font-medium text-white">Motion Status</span>
        </div>
        {isActive ? (
          <div className="text-xs text-gray-400 space-y-1">
            <div className="flex justify-between">
              <span>Motion Events:</span>
              <span className={motionCount > 20 ? 'text-red-400' : motionCount > 10 ? 'text-yellow-400' : 'text-green-400'}>
                {motionCount}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Sensitivity:</span>
              <span className="text-blue-400 capitalize">{config.sensitivity}</span>
            </div>
            <div className="flex justify-between">
              <span>Threshold:</span>
              <span className="text-blue-400">{getMotionThreshold()}</span>
            </div>
            {motionDetected && (
              <div className="mt-2 pt-2 border-t border-gray-600">
                <div>X: {lastMotion.x.toFixed(2)}</div>
                <div>Y: {lastMotion.y.toFixed(2)}</div>
                <div>Z: {lastMotion.z.toFixed(2)}</div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-xs text-gray-500 space-y-1">
            <div>Motion detection inactive</div>
            <div className="text-blue-400 mt-2">Start session to begin monitoring</div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-4">
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
            Stop
          </button>
        )}
        <button
          onClick={resetBalance}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-gray-400">
        {sessionComplete ? (
          <p className="text-green-400">🎉 Challenge completed! Great balance!</p>
        ) : isActive ? (
          <div>
            <p>Hold your device steady to maintain balance</p>
            <p className="mt-1">Keep the ⚖️ icon to stay balanced</p>
          </div>
        ) : (
          <div>
            <p>Hold your device steady for {config.targetSec} seconds</p>
            <p className="mt-1">Motion detection will start when you begin</p>
          </div>
        )}
      </div>
    </GlassCard>
  );
} 