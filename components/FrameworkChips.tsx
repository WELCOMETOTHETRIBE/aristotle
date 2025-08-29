'use client';

import { useEffect, useState } from 'react';
import { getFrameworksByModule } from '@/lib/frameworkMap';
import { getToneGradient, getToneTextColor } from '@/lib/tone';

interface FrameworkChipsProps {
  moduleId: string;
}

interface Framework {
  id: string;
  name: string;
  nav: {
    tone: string;
    badge: string;
    emoji: string;
  };
}

interface FrameworkByModule {
  core: Framework[];
  support: Framework[];
}

export function FrameworkChips({ moduleId }: FrameworkChipsProps) {
  const [frameworks, setFrameworks] = useState<FrameworkByModule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFrameworks() {
      try {
        const response = await fetch(`/api/frameworks/by-module/${moduleId}`);
        if (response.ok) {
          const data = await response.json();
          setFrameworks(data);
        }
      } catch (error) {
        console.error('Failed to load frameworks:', error);
      } finally {
        setLoading(false);
      }
    }

    loadFrameworks();
  }, [moduleId]);

  if (loading) {
    return <div className="text-sm text-gray-500">Loading frameworks...</div>;
  }

  if (!frameworks || (frameworks.core.length === 0 && frameworks.support.length === 0)) {
    return null;
  }

  return (
    <div className="space-y-2">
      {frameworks.core.length > 0 && (
        <div>
          <h4 className="font-medium text-sm mb-2 text-green-700">Core Frameworks:</h4>
          <div className="flex flex-wrap gap-1">
            {frameworks.core.map((framework) => (
              <div
                key={framework.id}
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getToneGradient(framework.nav.tone)} ${getToneTextColor(framework.nav.tone)}`}
              >
                <span className="mr-1">{framework.nav.emoji}</span>
                {framework.nav.badge}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {frameworks.support.length > 0 && (
        <div>
          <h4 className="font-medium text-sm mb-2 text-gray-600">Support Frameworks:</h4>
          <div className="flex flex-wrap gap-1">
            {frameworks.support.map((framework) => (
              <div
                key={framework.id}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
              >
                <span className="mr-1">{framework.nav.emoji}</span>
                {framework.nav.badge}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 