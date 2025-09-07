'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Trophy, TrendingUp, Clock, Activity, Zap } from 'lucide-react';
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
    
    if (stats.currentStreak >= 3) {
      return `Great streak! ${stats.currentStreak} days in a row!`;
    }
    
    if (stats.bestStableSeconds >= goalSeconds) {
      return "You've mastered this challenge!";
    }
    
    return "Keep practicing to improve your balance!";
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={className}
    >
      <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm">
        {/* Header with Animated Icon */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div 
              className="p-3 rounded-xl bg-blue-500/20"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Activity className="w-6 h-6 text-blue-400" />
            </motion.div>
            <div>
              <h3 className="font-bold text-white text-lg">{title}</h3>
              <p className="text-sm text-gray-400">
                Test your balance and mindfulness
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-400">
              {stats.totalSessions > 0 ? Math.round((stats.bestStableSeconds / 60) * 100) : 0}
            </div>
            <div className="text-xs text-gray-400">Best Score</div>
          </div>
        </div>
        {/* Motivational Message */}
        <motion.div 
          className="text-center mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-sm text-gray-300 mb-2">
            {getMotivationalMessage()}
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-blue-400">
            <Zap className="w-3 h-3" />
            <span>Score up to 100 points in 60 seconds</span>
          </div>
        </motion.div>
        
        {/* Main Balance Interface */}
        <div className="mb-4">
          <BalanceMeterView
            goalSeconds={goalSeconds}
            onComplete={handleComplete}
          />
        </div>
      
        {/* Stats Toggle */}
        <motion.div 
          className="flex justify-center mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={() => setShowStats(!showStats)}
            className="flex items-center gap-2 px-3 py-2 text-xs text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 hover:bg-blue-500/20 rounded-lg border border-blue-500/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <TrendingUp className="w-3 h-3" />
            {showStats ? 'Hide Stats' : 'Show Stats'}
          </motion.button>
        </motion.div>
      
        {/* Stats Panel */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          {showStats && (
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
              <h3 className="text-white font-medium mb-3 flex items-center gap-2 text-sm">
                <Trophy className="w-4 h-4 text-yellow-400" />
                Your Progress
              </h3>
          
              <div className="grid grid-cols-2 gap-4 text-xs">
                <motion.div 
                  className="flex items-center gap-2 p-2 bg-white/5 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <div>
                    <div className="text-gray-400">Best Score</div>
                    <div className="text-white font-medium">
                      {stats.totalSessions > 0 ? Math.round((stats.bestStableSeconds / 60) * 100) : 0}/100
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center gap-2 p-2 bg-white/5 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <Clock className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="text-gray-400">Sessions</div>
                    <div className="text-white font-medium">
                      {stats.totalSessions}
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center gap-2 p-2 bg-white/5 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <div>
                    <div className="text-gray-400">Avg Score</div>
                    <div className="text-white font-medium">
                      {stats.totalSessions > 0 ? Math.round((stats.averageStableSeconds / 60) * 100) : 0}/100
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center gap-2 p-2 bg-white/5 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <Target className="w-4 h-4 text-purple-400" />
                  {stats.currentStreak >= 3 && (
                    <div>
                      <div className="text-gray-400">Streak</div>
                      <div className="text-white font-medium">
                        {stats.currentStreak} days
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
          
              {/* Recent Sessions */}
              {recentSessions.length > 0 && (
                <div className="mt-4 pt-3 border-t border-blue-500/20">
                  <h4 className="text-white font-medium mb-2 text-xs flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    Recent Sessions
                  </h4>
                  <div className="space-y-2">
                    {recentSessions.slice(0, 3).map((session, index) => (
                      <motion.div 
                        key={session.id} 
                        className="flex justify-between items-center text-xs p-2 bg-white/5 rounded-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <span className="text-gray-400">
                          {session.date.toLocaleDateString()}
                        </span>
                        <span className="text-white font-medium">
                          {Math.round((session.secondsStable / session.goal) * 100)}/100
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
        
        {/* Instructions */}
        <motion.div 
          className="text-center text-xs text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="mb-1">Hold steady for 60 seconds to score up to 100 points</p>
          <p>The ring fills as you maintain perfect balance</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
