'use client';

import BalanceCard from '@/components/widgets/BalanceCard';

export default function BalanceTestPage() {
  const handleComplete = (payload: any) => {
    console.log('Balance test completed:', payload);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">🧘 Balance Widget Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BalanceCard
            title="Test Balance Widget"
            config={{
              targetSec: 30,
              sensitivity: 'medium',
              teaching: 'Test the balance widget functionality'
            }}
            onComplete={handleComplete}
            virtueGrantPerCompletion={{ temperance: 1, wisdom: 1 }}
          />
          
          <div className="bg-white/10 p-6 rounded-xl text-white">
            <h2 className="text-2xl font-bold mb-4">Debug Info</h2>
            <p>This page tests if the Balance widget can be rendered properly.</p>
            <p className="mt-4">If you can see the Balance widget above, it means:</p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>✅ BalanceCard component is working</li>
              <li>✅ Motion sensors are accessible</li>
              <li>✅ Widget can be rendered</li>
            </ul>
            <p className="mt-4">If the widget gallery still doesn't show it, the issue is in the gallery component.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 