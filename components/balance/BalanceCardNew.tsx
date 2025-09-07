'use client';

import React, { useState } from 'react';
import { Target, Trophy, TrendingUp, Clock } from 'lucide-react';
import { GlassCard } from '../GlassCard';
import { BalanceMeterView } from './BalanceMeterView';
import { SessionStore, SessionSummary, BalanceStats } from '@/lib/session-store';

interface BalanceCardNewProps {
  title?: string;
  goalSeconds?: number;
  onComplete?: (session: SessionSummary) => void;
  virtueGrantPerCompletion?: any;
  className?: string;
}

export function BalanceCardNew({ 
  title = "Balance Challenge",
  goalSeconds = 60,
  onComplete,
  virtueGrantPerCompletion,
  className = ""
}: BalanceCardNewProps) {
  const [stats, setStats] = useState<BalanceStats>(() => SessionStore.getStats());
  const [recentSessions, setRecentSessions] = useState<SessionSummary[]>(() => 
    SessionStore.getRecentSessions(7)
  );
  const [showStats, setShowStats] = useState(false);
  
  const handleComplete = (session: SessionSummary) => {
    // Update local state
    setStats(SessionStore.getStats());
    setRecentSessions(SessionStore.getRecentSessions(7));
    
    // Call parent callback
    onComplete?.(session);
    
    console.log('🎉 Balance challenge completed!', session);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getMotivationalMessage = () => {
    if (stats.totalSessions === 0) {
      return "Start your balance journey today!";
    }
    
    if (stats.currentStreak > 0) {
      return `Great streak! ${stats.currentStreak} days in a row!`;
    }
    
    if (stats.bestStableSeconds >= goalSeconds) {
      return "You've mastered this challenge!";
    }
    
    return "Keep practicing to improve your balance!";
  };
  
  return (
    <GlassCard 
      title={title}
      action={<Target className="w-5 h-5 text-gray-400" />}
      className={`p-6 ${className}`}
    >
      {/* Motivational Message */}
      <p className="text-xs text-gray-300 mb-3 text-center">
        {getMotivationalMessage()}
      </p>
      
      {/* Main Balance Interface */}
      <div className="mb-3">
        <BalanceMeterView
          goalSeconds={goalSeconds}
          onComplete={handleComplete}
        />
      </div>
      
      {/* Stats Toggle */}
      <div className="flex justify-center mb-2">
        <button
          onClick={() => setShowStats(!showStats)}
          className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          {showStats ? 'Hide Stats' : 'Show Stats'}
        </button>
      </div>
      
      {/* Stats Panel */}
      {showStats && (
        <div className="bg-gray-800/30 rounded-lg p-3 mb-3">
          <h3 className="text-white font-medium mb-2 flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4" />
            Your Progress
          </h3>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Trophy className="w-3 h-3 text-yellow-400" />
              <div>
                <div className="text-gray-400">Best Time</div>
                <div className="text-white font-medium">
                  {formatTime(stats.bestStableSeconds)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-blue-400" />
              <div>
                <div className="text-gray-400">Sessions</div>
                <div className="text-white font-medium">
                  {stats.totalSessions}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <div>
                <div className="text-gray-400">Average</div>
                <div className="text-white font-medium">
                  {formatTime(stats.averageStableSeconds)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Target className="w-3 h-3 text-purple-400" />
              <div>
                <div className="text-gray-400">Streak</div>
                <div className="text-white font-medium">
                  {stats.currentStreak} days
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Sessions */}
          {recentSessions.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-700">
              <h4 className="text-white font-medium mb-2 text-xs">Recent Sessions</h4>
              <div className="space-y-1">
                {recentSessions.slice(0, 3).map((session) => (
                  <div key={session.id} className="flex justify-between text-xs">
                    <span className="text-gray-400">
                      {session.date.toLocaleDateString()}
                    </span>
                    <span className="text-white">
                      {formatTime(session.secondsStable)} / {formatTime(session.goal)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Instructions */}
      <div className="text-center text-xs text-gray-400">
        <p>Hold steady for 60 seconds to score up to 100 points</p>
        <p className="mt-1">The ring fills as you maintain perfect balance</p>
      </div>
    </GlassCard>
  );
}
