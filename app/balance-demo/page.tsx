'use client';

import { useState } from 'react';
import BalanceCard from '@/components/widgets/BalanceCard';
import { GlassCard } from '@/components/GlassCard';
import { Target, TrendingUp, Zap } from 'lucide-react';

export default function BalanceDemoPage() {
  const [completedSessions, setCompletedSessions] = useState<any[]>([]);

  const handleComplete = (payload: any) => {
    console.log('Balance session completed:', payload);
    setCompletedSessions(prev => [...prev, { ...payload, timestamp: new Date().toISOString() }]);
  };

  const balanceConfigs = [
    {
      id: 'beginner',
      title: 'Beginner Balance',
      config: {
        targetSec: 30,
        sensitivity: 'low' as const,
        teaching: 'Start your balance journey with gentle guidance'
      },
      virtueGrantPerCompletion: { temperance: 1, wisdom: 1 }
    },
    {
      id: 'intermediate',
      title: 'Intermediate Balance',
      config: {
        targetSec: 60,
        sensitivity: 'medium' as const,
        teaching: 'Challenge your stability with moderate precision'
      },
      virtueGrantPerCompletion: { temperance: 2, wisdom: 1 }
    },
    {
      id: 'advanced',
      title: 'Advanced Balance',
      config: {
        targetSec: 120,
        sensitivity: 'high' as const,
        teaching: 'Master stillness with surgical precision'
      },
      virtueGrantPerCompletion: { temperance: 3, wisdom: 2 }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">🧘 Balance Widget Demo</h1>
          <p className="text-xl text-gray-300 mb-6">
            Test your device's motion sensors and challenge your balance
          </p>
          <div className="flex justify-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span>Hold device steady</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>Build streaks</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Earn virtue XP</span>
            </div>
          </div>
        </div>

        {/* Widget Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {balanceConfigs.map((config) => (
            <BalanceCard
              key={config.id}
              title={config.title}
              config={config.config}
              onComplete={handleComplete}
              virtueGrantPerCompletion={config.virtueGrantPerCompletion}
            />
          ))}
        </div>

        {/* Instructions */}
        <GlassCard
          title="How to Use"
          action={<Target className="w-5 h-5 text-gray-400" />}
          className="mb-8"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                <div className="text-2xl mb-2">📱</div>
                <h3 className="font-semibold text-white mb-2">1. Hold Device</h3>
                <p className="text-sm text-gray-300">Grip your phone/tablet firmly in both hands</p>
              </div>
              <div className="text-center p-4 bg-green-500/10 rounded-lg">
                <div className="text-2xl mb-2">🎯</div>
                <h3 className="font-semibold text-white mb-2">2. Find Balance</h3>
                <p className="text-sm text-gray-300">Keep the device as still as possible</p>
              </div>
              <div className="text-center p-4 bg-purple-500/10 rounded-lg">
                <div className="text-2xl mb-2">🏆</div>
                <h3 className="font-semibold text-white mb-2">3. Build Streaks</h3>
                <p className="text-sm text-gray-300">Maintain stability to increase your score</p>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-500/10 rounded-lg">
              <h4 className="font-semibold text-white mb-2">💡 Pro Tips:</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Rest your elbows on a stable surface for better control</li>
                <li>• Breathe slowly and steadily to reduce hand tremors</li>
                <li>• Start with low sensitivity and work your way up</li>
                <li>• Use both hands for maximum stability</li>
              </ul>
            </div>
          </div>
        </GlassCard>

        {/* Completed Sessions */}
        {completedSessions.length > 0 && (
          <GlassCard
            title="Completed Sessions"
            action={<TrendingUp className="w-5 h-5 text-gray-400" />}
          >
            <div className="space-y-3">
              {completedSessions.map((session, index) => (
                <div key={index} className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">
                      {new Date(session.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="text-xs text-green-400">
                      {session.percentage.toFixed(0)}% complete
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div>
                      <span className="text-gray-400">Time:</span>
                      <span className="text-white ml-2">{session.balanceTime.toFixed(1)}s</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Target:</span>
                      <span className="text-white ml-2">{session.targetTime}s</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Best Streak:</span>
                      <span className="text-white ml-2">{session.bestStreak}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Sensitivity:</span>
                      <span className="text-white ml-2 capitalize">{session.sensitivity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
} 