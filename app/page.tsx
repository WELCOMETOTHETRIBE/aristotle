'use client';

import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { GlassCard } from '@/components/GlassCard';
import VirtueRadar from '@/components/VirtueRadar';
import RadialMeter from '@/components/RadialMeter';
import BreathTimer from '@/components/BreathTimer';
import SunPath from '@/components/SunPath';
import { ResourceSpotlight } from '@/components/ResourceSpotlight';
import FocusTimer from '@/components/FocusTimer';
import { MoreHorizontal, Target, Flame, Droplets, Clock, Heart, Sun, BookOpen, Settings, TrendingUp, Zap } from "lucide-react";

interface DashboardData {
  virtueScores: {
    wisdom: number;
    courage: number;
    justice: number;
    temperance: number;
  };
  hydration: {
    current: number;
    target: number;
  };
  fasting: {
    isActive: boolean;
    timeRemaining: number;
    protocol: string;
  };
  mood: {
    current: number;
    trend: number[];
  };
  habits: {
    completed: string[];
    total: string[];
  };
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Load all dashboard data in parallel
        const [virtueResponse, hydrationResponse, fastingResponse, moodResponse, habitsResponse] = await Promise.all([
          fetch('/api/progress/virtues?days=7'),
          fetch('/api/hydration/current'),
          fetch('/api/fasting/status'),
          fetch('/api/mood/current'),
          fetch('/api/habits/today')
        ]);

        const [virtueData, hydrationData, fastingData, moodData, habitsData] = await Promise.all([
          virtueResponse.json(),
          hydrationResponse.json(),
          fastingResponse.json(),
          moodResponse.json(),
          habitsResponse.json()
        ]);

        setData({
          virtueScores: virtueData.scores || { wisdom: 7, courage: 6, justice: 8, temperance: 7 },
          hydration: hydrationData || { current: 1200, target: 2000 },
          fasting: fastingData || { isActive: false, timeRemaining: 0, protocol: '16:8' },
          mood: moodData || { current: 4, trend: [3, 4, 4, 5, 4, 3, 4] },
          habits: habitsData || { completed: ['breathwork'], total: ['breathwork', 'movement', 'gratitude'] }
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Set fallback data
        setData({
          virtueScores: { wisdom: 7, courage: 6, justice: 8, temperance: 7 },
          hydration: { current: 1200, target: 2000 },
          fasting: { isActive: false, timeRemaining: 0, protocol: '16:8' },
          mood: { current: 4, trend: [3, 4, 4, 5, 4, 3, 4] },
          habits: { completed: ['breathwork'], total: ['breathwork', 'movement', 'gratitude'] }
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (loading) {
    return (
      <PageLayout title="Dashboard" description="Your wellness command center">
        <div className="page-grid page-grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="card-base">
              <div className="loading-pulse h-32 rounded-lg"></div>
            </div>
          ))}
        </div>
      </PageLayout>
    );
  }

  if (!data) {
    return (
      <PageLayout title="Dashboard" description="Your wellness command center">
        <div className="text-center py-12">
          <p className="body-text">Unable to load dashboard data. Please try refreshing the page.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Dashboard" description="Your wellness command center">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="subheadline mb-2">{getGreeting()}, seeker</h2>
        <p className="body-text">Your daily practice awaits. Choose your path to flourishing.</p>
      </div>

      {/* Main Dashboard Grid */}
      <div className="page-grid page-grid-cols-3">
        {/* Virtue Balance Radar */}
        <GlassCard title="Virtue Balance" subtitle="Weekly virtue alignment" className="p-6">
          <VirtueRadar data={[
            { virtue: 'Wisdom', score: data.virtueScores.wisdom },
            { virtue: 'Courage', score: data.virtueScores.courage },
            { virtue: 'Justice', score: data.virtueScores.justice },
            { virtue: 'Temperance', score: data.virtueScores.temperance }
          ]} />
        </GlassCard>

        {/* Morning Ritual Tracker */}
        <GlassCard title="Morning Ritual" subtitle="Daily practice checklist" className="p-6">
          <div className="space-y-3">
            {data.habits.total.map((habit) => (
              <div key={habit} className="flex items-center justify-between">
                <span className="text-white capitalize">{habit}</span>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  data.habits.completed.includes(habit) 
                    ? 'bg-green-500 border-green-500' 
                    : 'border-gray-400'
                }`} />
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Breathwork Timer */}
        <GlassCard title="Breath of the Path" subtitle="Guided breathing practice" className="p-6">
          <BreathTimer />
        </GlassCard>

        {/* Hydration Ring */}
        <GlassCard title="Hydration" subtitle="Daily water intake" className="p-6">
          <RadialMeter 
            value={data.hydration.current / data.hydration.target} 
            label={`${data.hydration.current}/${data.hydration.target} ml`}
            size={120}
          />
          <div className="flex gap-2 mt-4">
            <button className="btn-secondary text-sm px-3 py-1">+250ml</button>
            <button className="btn-secondary text-sm px-3 py-1">+500ml</button>
          </div>
        </GlassCard>

        {/* Fasting Tracker */}
        <GlassCard title="Fasting" subtitle="Intermittent fasting timer" className="p-6">
          {data.fasting.isActive ? (
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">
                {formatTime(data.fasting.timeRemaining)}
              </div>
              <p className="text-sm text-gray-400 mb-4">{data.fasting.protocol}</p>
              <button className="btn-primary text-sm">Stop Fasting</button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-400 mb-4">No active fast</p>
              <button className="btn-primary text-sm">Start Fasting</button>
            </div>
          )}
        </GlassCard>

        {/* Focus Timer */}
        <GlassCard title="Focus Block" subtitle="Deep work timer" className="p-6">
          <FocusTimer />
        </GlassCard>

        {/* Mood & Reflection */}
        <GlassCard title="Mood & Reflection" subtitle="Daily emotional check-in" className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {data.mood.current}/5
            </div>
            <p className="text-sm text-gray-400 mb-4">Current mood</p>
            <button className="btn-secondary text-sm">Log Mood</button>
          </div>
        </GlassCard>

        {/* Circadian Sun Path */}
        <GlassCard title="Circadian Rhythm" subtitle="Daily energy cycles" className="p-6">
          <SunPath />
        </GlassCard>

        {/* Resource Spotlight */}
        <GlassCard title="Wisdom Spotlight" subtitle="Daily wisdom resource" className="p-6">
          <ResourceSpotlight />
        </GlassCard>
      </div>
    </PageLayout>
  );
} 