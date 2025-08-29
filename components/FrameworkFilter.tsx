"use client";
import { useEffect, useState } from "react";
import { FrameworkRecord } from "@/lib/types/framework";

interface FrameworkFilterProps {
  onFrameworkChange: (frameworkId: string | null) => void;
}

export default function FrameworkFilter({ onFrameworkChange }: FrameworkFilterProps) {
  const [frameworks, setFrameworks] = useState<FrameworkRecord[]>([]);
  const [selectedFramework, setSelectedFramework] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFrameworks = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/frameworks');
        if (response.ok) {
          const data = await response.json();
          setFrameworks(data);
        }
      } catch (error) {
        console.error('Error loading frameworks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFrameworks();
  }, []);

  const handleFrameworkChange = (frameworkId: string) => {
    setSelectedFramework(frameworkId);
    onFrameworkChange(frameworkId || null);
  };

  if (loading) {
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Framework
        </label>
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Filter by Framework
      </label>
      <select
        value={selectedFramework}
        onChange={(e) => handleFrameworkChange(e.target.value)}
        className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">All Frameworks</option>
        {frameworks.map((framework) => (
          <option key={framework.id} value={framework.id}>
            {framework.nav.emoji} {framework.name} ({framework.nav.badge})
          </option>
        ))}
      </select>
      {selectedFramework && (
        <button
          onClick={() => handleFrameworkChange("")}
          className="ml-2 text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Clear filter
        </button>
      )}
    </div>
  );
} 