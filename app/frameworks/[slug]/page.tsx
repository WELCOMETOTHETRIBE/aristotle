'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function FrameworkPage() {
  const params = useParams();
  const slug = params.slug as string;
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
          <div className="text-white text-2xl font-bold mb-4">Loading framework...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-white">
            {slug.charAt(0).toUpperCase() + slug.slice(1)} Framework
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore the wisdom and practices of this ancient tradition.
          </p>
        </div>
        
        <div className="text-center text-white">
          <p>Discover the timeless principles and practical applications of this philosophical framework.</p>
        </div>
      </div>
    </div>
  );
} 