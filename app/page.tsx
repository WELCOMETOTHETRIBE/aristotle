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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load all dashboard data in parallel with credentials
        const [virtueResponse, hydrationResponse, fastingResponse, moodResponse, habitsResponse] = await Promise.all([
          fetch('/api/progress/virtues?days=7', { credentials: 'include' }),
          fetch('/api/hydration/current', { credentials: 'include' }),
          fetch('/api/fasting/status', { credentials: 'include' }),
          fetch('/api/mood/current', { credentials: 'include' }),
          fetch('/api/habits/today', { credentials: 'include' })
        ]);

        const [virtueData, hydrationData, fastingData, moodData, habitsData] = await Promise.all([
          virtueResponse.ok ? virtueResponse.json() : { scores: { wisdom: 7, courage: 6, justice: 8, temperance: 7 } },
          hydrationResponse.ok ? hydrationResponse.json() : { current: 1200, target: 2000 },
          fastingResponse.ok ? fastingResponse.json() : { isActive: false, timeRemaining: 0, protocol: '16:8' },
          moodResponse.ok ? moodResponse.json() : { current: 4, trend: [3, 4, 4, 5, 4, 3, 4] },
          habitsResponse.ok ? habitsResponse.json() : { completed: ['breathwork'], total: ['breathwork', 'movement', 'gratitude'] }
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
        setError('Failed to load dashboard data');
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
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <PageLayout title="Dashboard" description="Your wellness command center">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">Loading your dashboard...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="Dashboard" description="Your wellness command center">
        <div className="text-center py-12">
          <p className="body-text text-red-400">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary mt-4"
          >
            Retry
          </button>
        </div>
      </PageLayout>
    );
  }

  if (!data) {
    return (
      <PageLayout title="Dashboard" description="Your wellness command center">
        <div className="text-center py-12">
          <p className="body-text">No data available</p>
        </div>
      </PageLayout>
    );
  }

  const renderDashboard = () => {
    try {
      return (
        <>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{getGreeting()}, {data.virtueScores ? 'Warrior' : 'Friend'}!</h1>
            <p className="text-gray-300">Your wellness journey continues...</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Virtue Radar */}
            <GlassCard title="Virtue Progress" subtitle="This week's growth" className="p-6">
              <VirtueRadar data={[
                { virtue: 'Wisdom', score: data.virtueScores.wisdom },
                { virtue: 'Courage', score: data.virtueScores.courage },
                { virtue: 'Justice', score: data.virtueScores.justice },
                { virtue: 'Temperance', score: data.virtueScores.temperance }
              ]} />
            </GlassCard>

            {/* Habits Tracker */}
            <GlassCard title="Daily Habits" subtitle="Track your progress" className="p-6">
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

            {/* Hydration Ring */}
            <GlassCard title="Hydration" subtitle="Daily water intake" className="p-6">
              <RadialMeter 
                value={data.hydration.current / data.hydration.target} 
                label={`${data.hydration.current}/${data.hydration.target} ml`}
                size={120}
              />
              <div className="flex gap-2 mt-4">
                <button className="btn-secondary btn-small flex-1">Add Water</button>
                <button className="btn-secondary btn-small flex-1">View Log</button>
              </div>
            </GlassCard>

            {/* Fasting Status */}
            <GlassCard title="Fasting" subtitle={data.fasting.isActive ? "Active fast" : "No active fast"} className="p-6">
              {data.fasting.isActive ? (
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-2">
                    {formatTime(data.fasting.timeRemaining)}
                  </div>
                  <p className="text-sm text-gray-300 mb-4">{data.fasting.protocol}</p>
                  <button className="btn-primary btn-small w-full">End Fast</button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-300 mb-4">Ready to begin your fast?</p>
                  <button className="btn-primary btn-small w-full">Start Fast</button>
                </div>
              )}
            </GlassCard>

            {/* Mood Tracker */}
            <GlassCard title="Mood" subtitle="How are you feeling?" className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">{data.mood.current}/5</div>
                <p className="text-sm text-gray-300 mb-4">Current mood</p>
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      className={`w-8 h-8 rounded-full ${
                        rating <= data.mood.current ? 'bg-yellow-400' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Breathwork Timer */}
            <GlassCard title="Breath of the Path" subtitle="Guided breathing practice" className="p-6">
              <BreathTimer />
            </GlassCard>

            {/* Sun Path */}
            <GlassCard title="Sun Path" subtitle="Daily rhythm tracker" className="p-6">
              <SunPath />
            </GlassCard>

            {/* Resource Spotlight */}
            <GlassCard title="Wisdom Spotlight" subtitle="Featured resource" className="p-6">
              <ResourceSpotlight />
            </GlassCard>

            {/* Focus Timer */}
            <GlassCard title="Focus Session" subtitle="Deep work timer" className="p-6">
              <FocusTimer />
            </GlassCard>
          </div>
        </>
      );
    } catch (error) {
      console.error('Dashboard render error:', error);
      return (
        <div className="text-center py-12">
          <p className="body-text">Something went wrong while rendering the dashboard.</p>
          <p className="text-red-400 mt-2">Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary mt-4"
          >
            Refresh Page
          </button>
        </div>
      );
    }
  };

  return (
    <PageLayout title="Dashboard" description="Your wellness command center">
      {renderDashboard()}
    </PageLayout>
  );
} 