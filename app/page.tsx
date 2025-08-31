'use client';

import { useState, useEffect } from 'react';

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-2xl font-bold mb-4">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-white">
            Welcome to Aristotle
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Your philosophical journey begins here.
          </p>
        </div>
        
        <div className="text-center text-white">
          <p>Embark on a transformative journey through ancient wisdom and modern practices.</p>
        </div>
      </div>
    </div>
  );
} 