'use client';

import { BalanceCardNew } from '@/components/balance/BalanceCardNew';
import { SessionSummary } from '@/lib/session-store';

export default function BalanceTestPage() {
  const handleComplete = (session: SessionSummary) => {
    console.log('Balance test completed:', session);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">🧘 Balance Widget Test</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <BalanceCardNew
            title="30-Second Challenge"
            goalSeconds={30}
            onComplete={handleComplete}
            virtueGrantPerCompletion={{ temperance: 1, wisdom: 1 }}
          />
          
          <BalanceCardNew
            title="60-Second Challenge"
            goalSeconds={60}
            onComplete={handleComplete}
            virtueGrantPerCompletion={{ temperance: 2, wisdom: 2 }}
          />
        </div>
        
        <div className="mt-8 bg-white/10 p-6 rounded-xl text-white">
          <h2 className="text-2xl font-bold mb-4">New Balance Widget Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-green-400">✅ What's New</h3>
              <ul className="space-y-1 text-sm">
                <li>• Real-time motion detection with smoothing</li>
                <li>• Visual dot that moves based on device orientation</li>
                <li>• Safe zone with clear visual feedback</li>
                <li>• Haptic feedback for balance states</li>
                <li>• Progress ring that fills as you stay balanced</li>
                <li>• Session persistence and statistics</li>
                <li>• Calibration phase for accurate detection</li>
                <li>• Audio cues (optional)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-blue-400">🎯 How It Works</h3>
              <ul className="space-y-1 text-sm">
                <li>• Hold device steady to keep dot in center</li>
                <li>• Green dot = stable, Red = out of balance</li>
                <li>• Ring fills only when you're balanced</li>
                <li>• 0.5s calibration before each session</li>
                <li>• Progress decays when you move too much</li>
                <li>• Haptic feedback guides you back to center</li>
                <li>• All data stored locally for privacy</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 