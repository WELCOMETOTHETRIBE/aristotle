'use client';

import { useState, useEffect } from 'react';
import { getAllFrameworks } from '@/lib/frameworkMap';

interface FrameworkFilterProps {
  onFrameworkChange: (frameworkId: string | null) => void;
}

export function FrameworkFilter({ onFrameworkChange }: FrameworkFilterProps) {
  const [frameworks, setFrameworks] = useState<any[]>([]);
  const [selectedFramework, setSelectedFramework] = useState<string>('');

  useEffect(() => {
    async function loadFrameworks() {
      try {
        const response = await fetch('/api/frameworks');
        if (response.ok) {
          const data = await response.json();
          setFrameworks(data);
        }
      } catch (error) {
        console.error('Failed to load frameworks:', error);
      }
    }

    loadFrameworks();
  }, []);

  const handleFrameworkChange = (frameworkId: string) => {
    setSelectedFramework(frameworkId);
    onFrameworkChange(frameworkId || null);
  };

  return (
    <div className="mb-6">
      <label htmlFor="framework-filter" className="block text-sm font-medium text-gray-700 mb-2">
        Filter by Framework
      </label>
      <select
        id="framework-filter"
        value={selectedFramework}
        onChange={(e) => handleFrameworkChange(e.target.value)}
        className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">All Frameworks</option>
        {frameworks.map((framework) => (
          <option key={framework.id} value={framework.id}>
            {framework.nav.emoji} {framework.name}
          </option>
        ))}
      </select>
    </div>
  );
} 