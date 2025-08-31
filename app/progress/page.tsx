'use client';

import { useState } from 'react';
import { Header } from '@/components/nav/Header';
import { TabBar } from '@/components/nav/TabBar';
import { GuideFAB } from '@/components/ai/GuideFAB';
import { TrendingUp, Flame, Target, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Streak {
  name: string;
  count: number;
  target: number;
  lastActivity: Date;
}

interface VirtueScore {
  virtue: string;
  score: number;
  maxScore: number;
}

const streaks: Streak[] = [
  {
    name: 'Meditation',
    count: 7,
    target: 7,
    lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    name: 'Reading',
    count: 5,
    target: 7,
    lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    name: 'Exercise',
    count: 3,
    target: 5,
    lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    name: 'Breathwork',
    count: 12,
    target: 7,
    lastActivity: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
];

const virtueScores: VirtueScore[] = [
  { virtue: 'Wisdom', score: 8, maxScore: 10 },
  { virtue: 'Courage', score: 7, maxScore: 10 },
  { virtue: 'Justice', score: 6, maxScore: 10 },
  { virtue: 'Temperance', score: 9, maxScore: 10 },
];

const timeRanges = ['week', 'month', 'quarter'];

export default function ProgressPage() {
  const [selectedRange, setSelectedRange] = useState('week');

  const totalStreaks = streaks.length;
  const completedStreaks = streaks.filter(s => s.count >= s.target).length;
  const adherencePercentage = Math.round((completedStreaks / totalStreaks) * 100);

  const averageVirtueScore = Math.round(
    virtueScores.reduce((sum, v) => sum + v.score, 0) / virtueScores.length
  );

  const flourishingIndex = Math.round((adherencePercentage + averageVirtueScore * 10) / 2);

  return (
    <div className="min-h-screen bg-bg pb-20">
      <Header />
      
      <main className="px-4 py-6 space-y-6">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-text">Progress</h1>
          <p className="text-muted">Track your journey to flourishing</p>
        </div>

        {/* Time Range Selector */}
        <div className="flex space-x-2">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150',
                selectedRange === range
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-surface-2 border border-border text-muted hover:text-text'
              )}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Flame className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-semibold text-text">Streaks</h3>
            </div>
            <div className="text-2xl font-bold text-text">{completedStreaks}/{totalStreaks}</div>
            <div className="text-xs text-muted">Active streaks</div>
          </div>

          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5 text-success" />
              <h3 className="text-sm font-semibold text-text">Adherence</h3>
            </div>
            <div className="text-2xl font-bold text-text">{adherencePercentage}%</div>
            <div className="text-xs text-muted">Goal completion</div>
          </div>
        </div>

        {/* Flourishing Index */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-semibold text-text">Flourishing Index</h3>
          </div>
          <div className="text-3xl font-bold text-primary mb-2">{flourishingIndex}</div>
          <div className="text-xs text-muted mb-3">
            Composite score based on streaks and virtue development
          </div>
          <div className="w-full bg-surface-2 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${flourishingIndex}%` }}
            />
          </div>
        </div>

        {/* Virtue Radar */}
        <div className="bg-surface border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold text-text mb-4">Virtue Development</h3>
          <div className="space-y-3">
            {virtueScores.map((virtue) => {
              const percentage = (virtue.score / virtue.maxScore) * 100;
              return (
                <div key={virtue.virtue} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text">{virtue.virtue}</span>
                    <span className="text-sm text-muted">{virtue.score}/{virtue.maxScore}</span>
                  </div>
                  <div className="w-full bg-surface-2 rounded-full h-2">
                    <div
                      className={cn(
                        'h-2 rounded-full transition-all duration-500',
                        virtue.virtue === 'Wisdom' && 'bg-primary',
                        virtue.virtue === 'Courage' && 'bg-courage',
                        virtue.virtue === 'Justice' && 'bg-justice',
                        virtue.virtue === 'Temperance' && 'bg-temperance'
                      )}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Streak Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text">Your Streaks</h3>
          <div className="space-y-3">
            {streaks.map((streak) => {
              const progress = Math.min((streak.count / streak.target) * 100, 100);
              const isOnTrack = streak.count >= streak.target;
              
              return (
                <div key={streak.name} className="bg-surface border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-semibold text-text">{streak.name}</h4>
                      <p className="text-xs text-muted">
                        Last: {streak.lastActivity.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={cn(
                        'text-lg font-bold',
                        isOnTrack ? 'text-success' : 'text-primary'
                      )}>
                        {streak.count}
                      </div>
                      <div className="text-xs text-muted">days</div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-surface-2 rounded-full h-2">
                      <div
                        className={cn(
                          'h-2 rounded-full transition-all duration-500',
                          isOnTrack ? 'bg-success' : 'bg-primary'
                        )}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-surface border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold text-text mb-3">This {selectedRange}'s summary</h3>
          <div className="text-sm text-muted space-y-2">
            <p>• You've maintained {completedStreaks} active streaks</p>
            <p>• Your strongest virtue is Temperance (9/10)</p>
            <p>• You're on track to complete {Math.round(adherencePercentage * 0.8)}% of your goals</p>
            <p>• Consider focusing on Justice (6/10) for balanced growth</p>
          </div>
        </div>
      </main>

      <GuideFAB />
      <TabBar />
    </div>
  );
} 