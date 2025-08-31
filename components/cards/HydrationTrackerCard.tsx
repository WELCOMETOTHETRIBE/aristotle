'use client';

import { useState, useEffect } from 'react';
import { Droplets, Plus, Target, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HydrationTrackerCardProps {
  className?: string;
}

interface HydrationEntry {
  id: string;
  amount: number;
  timestamp: Date;
}

const waterAmounts = [250, 500, 750, 1000]; // ml
const dailyTarget = 2000; // ml

export function HydrationTrackerCard({ className }: HydrationTrackerCardProps) {
  const [hydrationEntries, setHydrationEntries] = useState<HydrationEntry[]>([]);
  const [showAddWater, setShowAddWater] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(500);

  // Load saved hydration data
  useEffect(() => {
    const saved = localStorage.getItem('hydrationTrackerEntries');
    if (saved) {
      const parsed = JSON.parse(saved);
      setHydrationEntries(parsed.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      })));
    }
  }, []);

  // Save hydration data
  const saveHydrationData = (entries: HydrationEntry[]) => {
    setHydrationEntries(entries);
    localStorage.setItem('hydrationTrackerEntries', JSON.stringify(entries));
  };

  const addWaterEntry = () => {
    const newEntry: HydrationEntry = {
      id: Date.now().toString(),
      amount: selectedAmount,
      timestamp: new Date(),
    };

    const updatedEntries = [newEntry, ...hydrationEntries];
    saveHydrationData(updatedEntries);
    
    setShowAddWater(false);
  };

  const todayEntries = hydrationEntries.filter(entry => {
    const today = new Date();
    const entryDate = new Date(entry.timestamp);
    return entryDate.toDateString() === today.toDateString();
  });

  const todayTotal = todayEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const progress = Math.min((todayTotal / dailyTarget) * 100, 100);
  const remaining = Math.max(dailyTarget - todayTotal, 0);

  const getHydrationStatus = () => {
    if (todayTotal >= dailyTarget) return { status: 'Goal reached!', color: 'text-success' };
    if (todayTotal >= dailyTarget * 0.75) return { status: 'Almost there!', color: 'text-warning' };
    if (todayTotal >= dailyTarget * 0.5) return { status: 'Halfway there', color: 'text-primary' };
    return { status: 'Keep going!', color: 'text-muted' };
  };

  const getWeeklyAverage = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weekEntries = hydrationEntries.filter(entry => 
      new Date(entry.timestamp) > weekAgo
    );
    
    if (weekEntries.length === 0) return 0;
    
    const total = weekEntries.reduce((sum, entry) => sum + entry.amount, 0);
    return Math.round(total / 7);
  };

  return (
    <div className={cn('bg-surface border border-border rounded-lg p-4', className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
            <Droplets className="w-4 h-4 text-cyan-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text">Hydration</h3>
            <p className="text-xs text-muted">Track your water intake</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-text">{todayEntries.length}</div>
          <div className="text-xs text-muted">Glasses</div>
        </div>
      </div>

      {/* Progress Circle */}
      <div className="mb-4">
        <div className="relative w-20 h-20 mx-auto mb-3">
          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-surface-2"
            />
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 36}`}
              strokeDashoffset={`${2 * Math.PI * 36 * (1 - progress / 100)}`}
              className="text-cyan-500 transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-text">{Math.round(progress)}%</span>
            <span className="text-xs text-muted">{Math.round(todayTotal / 1000)}L</span>
          </div>
        </div>
        
        <div className="text-center">
          <div className={cn('text-sm font-medium', getHydrationStatus().color)}>
            {getHydrationStatus().status}
          </div>
          <div className="text-xs text-muted">
            {remaining > 0 ? `${Math.round(remaining)}ml remaining` : 'Goal reached!'}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-surface-2 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-3 h-3 text-muted" />
              <span className="text-xs text-muted">Target</span>
            </div>
            <div className="text-lg font-bold text-text">
              {Math.round(dailyTarget / 1000)}L
            </div>
          </div>
          <div className="bg-surface-2 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-3 h-3 text-muted" />
              <span className="text-xs text-muted">Weekly avg</span>
            </div>
            <div className="text-lg font-bold text-text">
              {Math.round(getWeeklyAverage() / 1000)}L
            </div>
          </div>
        </div>
      </div>

      {/* Add Water Button */}
      {!showAddWater ? (
        <button
          onClick={() => setShowAddWater(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-150"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Add Water</span>
        </button>
      ) : (
        <div className="space-y-3">
          {/* Amount Selector */}
          <div>
            <label className="text-xs text-muted mb-2 block">Amount to add</label>
            <div className="grid grid-cols-2 gap-2">
              {waterAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setSelectedAmount(amount)}
                  className={cn(
                    'p-3 rounded-lg border transition-all duration-150',
                    selectedAmount === amount
                      ? 'bg-cyan-500/20 border-cyan-500/30'
                      : 'bg-surface-2 border-border hover:border-cyan-500/30'
                  )}
                >
                  <div className="text-sm font-medium text-text">{amount}ml</div>
                  <div className="text-xs text-muted">{Math.round(amount / 250)} glasses</div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddWater(false)}
              className="flex-1 px-3 py-2 bg-surface-2 border border-border text-text rounded-lg hover:bg-surface transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              onClick={addWaterEntry}
              className="flex-1 px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-150"
            >
              Add {selectedAmount}ml
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 