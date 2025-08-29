'use client';

import { useState, useCallback } from 'react';
import { Plus, Minus, Target, RotateCcw } from 'lucide-react';
import { GlassCard } from '../GlassCard';

interface CounterCardProps {
  title: string;
  config: {
    target: number;
    unit: string;
    exercises?: string[];
    types?: string[];
    teaching: string;
  };
  onComplete: (payload: any) => void;
  virtueGrantPerCompletion: any;
}

export default function CounterCard({ title, config, onComplete, virtueGrantPerCompletion }: CounterCardProps) {
  const [count, setCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const increment = () => {
    setCount(prev => prev + 1);
  };

  const decrement = () => {
    setCount(prev => Math.max(0, prev - 1));
  };

  const reset = () => {
    setCount(0);
    setIsCompleted(false);
  };

  const handleComplete = useCallback(() => {
    const payload = {
      count,
      target: config.target,
      unit: config.unit,
      exercises: config.exercises,
      types: config.types,
      percentage: Math.min(100, (count / config.target) * 100)
    };

    onComplete({
      type: 'counter',
      payload,
      virtues: virtueGrantPerCompletion
    });
  }, [count, config, onComplete, virtueGrantPerCompletion]);

  const progress = Math.min(100, (count / config.target) * 100);

  return (
    <GlassCard 
      title={title}
      action={<Target className="w-5 h-5 text-gray-400" />}
      className="p-6"
    >
      <p className="text-sm text-gray-300 mb-4">{config.teaching}</p>

      {/* Progress Display */}
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-white mb-2">
          {count} / {config.target}
        </div>
        <div className="text-sm text-gray-400 mb-4">
          {config.unit}
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs text-gray-400 mt-2">
          {progress.toFixed(0)}% complete
        </div>
      </div>

      {/* Exercise/Type List */}
      {(config.exercises || config.types) && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-white mb-2">Options:</h4>
          <div className="flex flex-wrap gap-2">
            {(config.exercises || config.types)?.map((item, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={decrement}
          className="flex items-center justify-center w-12 h-12 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          <Minus className="w-5 h-5" />
        </button>
        
        <button
          onClick={increment}
          className="flex items-center justify-center w-12 h-12 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
        
        <button
          onClick={reset}
          className="flex items-center justify-center w-12 h-12 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Complete Button */}
      <div className="text-center">
        <button
          onClick={handleComplete}
          disabled={count === 0}
          className={`px-6 py-2 rounded-lg transition-colors ${
            count === 0 
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          Complete ({count} {config.unit})
        </button>
      </div>
    </GlassCard>
  );
} 