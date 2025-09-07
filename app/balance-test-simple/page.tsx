'use client';

import { BalanceCardNew } from '@/components/balance/BalanceCardNew';
import { SessionSummary } from '@/lib/session-store';

export default function BalanceTestSimplePage() {
  const handleComplete = (session: SessionSummary) => {
    console.log('✅ Balance session completed:', session);
    alert(`Great job! You held steady for ${Math.floor(session.secondsStable)} seconds!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          🧘 Balance Widget Test
        </h1>
        
        <div className="text-center mb-8">
          <p className="text-gray-300 mb-4">
            Test the new balance widget functionality
          </p>
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
            <p className="font-medium mb-2">📱 Mobile Device Recommended</p>
            <p>For best experience, use this on a mobile device with motion sensors.</p>
            <p className="mt-2">Grant motion permissions when prompted for full functionality.</p>
          </div>
        </div>
        
        <BalanceCardNew
          title="Balance Challenge"
          goalSeconds={60}
          onComplete={handleComplete}
          virtueGrantPerCompletion={{ temperance: 2, wisdom: 2 }}
        />
        
        <div className="mt-8 bg-white/10 p-6 rounded-xl text-white">
          <h2 className="text-xl font-bold mb-4">🎯 How to Use</h2>
          <ol className="space-y-2 text-sm">
            <li>1. Click "Start" to begin the challenge</li>
            <li>2. Hold your device steady for 0.5s calibration</li>
            <li>3. Keep the green dot in the center circle</li>
            <li>4. The ring fills as you maintain balance</li>
            <li>5. Score up to 100 points in 60 seconds</li>
          </ol>
          
          <div className="mt-4 p-3 bg-green-900/30 border border-green-500/30 rounded text-sm">
            <p className="text-green-200">
              <strong>✅ Success!</strong> The balance widget is now fully functional with:
            </p>
            <ul className="mt-2 space-y-1 text-green-100">
              <li>• 60-second countdown timer</li>
              <li>• 100-point scoring system</li>
              <li>• Real-time motion detection</li>
              <li>• Visual feedback system</li>
              <li>• Haptic feedback</li>
              <li>• Session persistence</li>
              <li>• Statistics tracking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
