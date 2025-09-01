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
  
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>();

  // Check device motion support
  useEffect(() => {
    if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      console.log('✅ Device motion supported');
      
      const handleMotion = (event: DeviceMotionEvent) => {
        const { accelerationIncludingGravity } = event;
        if (accelerationIncludingGravity) {
          const { x, y, z } = accelerationIncludingGravity;
          setLastMotion({ x: x || 0, y: y || 0, z: z || 0 });
          setMotionDetected(true);
          
          // Calculate motion magnitude
          const magnitude = Math.sqrt((x || 0) ** 2 + (y || 0) ** 2 + (z || 0) ** 2);
          console.log('Motion detected:', { x, y, z, magnitude });
        }
      };

      window.addEventListener('devicemotion', handleMotion);
      console.log('✅ Motion event listener added');

      return () => {
        window.removeEventListener('devicemotion', handleMotion);
      };
    } else {
      console.log('❌ Device motion not supported');
    }
  }, []);

  // Animation loop for balance time tracking
  useEffect(() => {
    if (!isActive) return;

    const updateBalanceTime = () => {
      if (!startTimeRef.current) return;

      const elapsed = Date.now() - startTimeRef.current;
      setBalanceTime(elapsed);

      if (elapsed >= config.targetSec * 1000) {
        setIsActive(false);
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
    startTimeRef.current = Date.now();
  };

  const stopBalance = () => {
    setIsActive(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const resetBalance = () => {
    setIsActive(false);
    setBalanceTime(0);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
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
          {motionDetected ? '📱' : '⚪'}
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
      </div>

      {/* Motion Data Display */}
      <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
        <div className="text-center mb-2">
          <span className="text-sm font-medium text-white">Motion Status</span>
        </div>
        {motionDetected ? (
          <div className="text-xs text-gray-400 space-y-1">
            <div>X: {lastMotion.x.toFixed(2)}</div>
            <div>Y: {lastMotion.y.toFixed(2)}</div>
            <div>Z: {lastMotion.z.toFixed(2)}</div>
            <div className="text-green-400 mt-2">✅ Motion detection active</div>
          </div>
        ) : (
          <div className="text-xs text-red-400 space-y-1">
            <div>No motion data received</div>
            <div className="text-yellow-400 mt-2">⚠️ Try moving your device</div>
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
        <p>Hold your device steady to maintain balance</p>
        <p className="mt-1">Check console for motion events</p>
      </div>
    </GlassCard>
  );
} 