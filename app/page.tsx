'use client';

import AuroraBackground from "@/components/AuroraBackground";
import { GlassCard } from "@/components/GlassCard";
import VirtueRadar from "@/components/VirtueRadar";
import RadialMeter from "@/components/RadialMeter";
import BreathTimer from "@/components/BreathTimer";
import SunPath from "@/components/SunPath";
import { MoreHorizontal, Target, Flame, Droplets, Clock, Heart, Sun, BookOpen, Settings } from "lucide-react";
import { getVirtueRadarData, getCurrentHydration, getFastingTimeRemaining, getCurrentMood, mockUserProfile } from "@/lib/demo-state";

export default function DashboardPage() {
  const virtueData = getVirtueRadarData();
  const currentHydration = getCurrentHydration();
  const hydrationProgress = currentHydration / mockUserProfile.goals.dailyHydration;
  const fastingTimeRemaining = getFastingTimeRemaining();
  const currentMood = getCurrentMood();

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

  return (
    <main className="container-academy">
      <AuroraBackground />
      
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-white mb-2">
          {getGreeting()}, {mockUserProfile.name}
        </h1>
        <p className="text-muted">
          Your day at the Academy begins with presence and practice.
        </p>
      </header>

      {/* Widget Grid */}
      <section className="widget-grid">
        {/* Virtue Radar */}
        <GlassCard 
          title="Virtue Balance" 
          subtitle="Weekly radar"
          action={
            <button className="text-muted hover:text-white transition-colors">
              <MoreHorizontal size={16} />
            </button>
          }
        >
          <VirtueRadar data={virtueData} />
        </GlassCard>

        {/* Morning Ritual */}
        <GlassCard 
          title="Morning Ritual" 
          subtitle={`${mockUserProfile.streaks.morningRoutine} day streak`}
          action={
            <div className="flex items-center gap-2">
              <Target size={16} className="text-accent-primary" />
              <span className="text-xs text-muted">7/7</span>
            </div>
          }
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">Breathwork (10m)</span>
              <div className="w-4 h-4 rounded-full bg-accent-primary"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">Movement (20m)</span>
              <div className="w-4 h-4 rounded-full bg-accent-primary"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">Gratitude (3m)</span>
              <div className="w-4 h-4 rounded-full bg-white/20"></div>
            </div>
          </div>
        </GlassCard>

        {/* Breathwork Timer */}
        <GlassCard 
          title="Breathwork" 
          subtitle="Box 4-4-4-4"
          action={
            <button className="text-muted hover:text-white transition-colors">
              <Settings size={16} />
            </button>
          }
        >
          <BreathTimer />
        </GlassCard>

        {/* Cold Exposure */}
        <GlassCard 
          title="Cold Exposure" 
          subtitle="Weekly: 45 minutes"
          action={
            <Flame size={16} className="text-accent-primary" />
          }
        >
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-semibold text-white">3</div>
              <div className="text-sm text-muted">Day streak</div>
            </div>
            <div className="flex gap-2">
              <button className="btn-primary flex-1">Start Timer</button>
              <button className="btn-secondary">Log Session</button>
            </div>
            <div className="text-xs text-muted text-center">
              Start with 30 seconds cold shower
            </div>
          </div>
        </GlassCard>

        {/* Fasting Tracker */}
        <GlassCard 
          title="Fasting" 
          subtitle="16:8 Protocol"
          action={
            <Clock size={16} className="text-accent-primary" />
          }
        >
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-semibold text-white">
                {formatTime(fastingTimeRemaining)}
              </div>
              <div className="text-sm text-muted">Remaining</div>
            </div>
            <div className="flex gap-2">
              <button className="btn-primary flex-1">Start</button>
              <button className="btn-secondary">Stop</button>
            </div>
            <div className="text-xs text-muted text-center">
              {mockUserProfile.streaks.fasting} day streak
            </div>
          </div>
        </GlassCard>

        {/* Mood & Reflection */}
        <GlassCard 
          title="Mood & Reflection" 
          subtitle="How are you feeling?"
          action={
            <Heart size={16} className="text-accent-primary" />
          }
        >
          <div className="space-y-4">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((mood) => (
                <button
                  key={mood}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${
                    currentMood?.mood === mood 
                      ? 'bg-accent-primary text-black' 
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>
            <button className="btn-secondary w-full">
              1-minute reflection
            </button>
          </div>
        </GlassCard>

        {/* Sun Path */}
        <GlassCard 
          title="Circadian Rhythm" 
          subtitle="Sleep cycle"
          action={
            <Sun size={16} className="text-accent-primary" />
          }
        >
          <SunPath />
        </GlassCard>

        {/* Hydration Ring */}
        <GlassCard 
          title="Hydration" 
          subtitle="Daily target"
          action={
            <Droplets size={16} className="text-accent-primary" />
          }
        >
          <div className="space-y-4">
            <RadialMeter 
              value={hydrationProgress} 
              label={`${currentHydration} / ${mockUserProfile.goals.dailyHydration} ml`}
            />
            <div className="flex gap-2">
              <button className="btn-secondary flex-1">+250ml</button>
              <button className="btn-secondary flex-1">+500ml</button>
            </div>
          </div>
        </GlassCard>

        {/* Focus / Flow Block */}
        <GlassCard 
          title="Focus Block" 
          subtitle="50/10 Deep Work"
          action={
            <button className="text-muted hover:text-white transition-colors">
              <Settings size={16} />
            </button>
          }
        >
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-semibold text-white">25:00</div>
              <div className="text-sm text-muted">Focus time remaining</div>
            </div>
            <div className="flex gap-2">
              <button className="btn-primary flex-1">Start</button>
              <button className="btn-secondary">Pause</button>
            </div>
            <div className="flex items-center justify-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-xs text-muted">Zen particles</span>
            </div>
          </div>
        </GlassCard>

        {/* Resource Spotlight */}
        <GlassCard 
          title="Resource Spotlight" 
          subtitle="Today's wisdom"
          action={
            <BookOpen size={16} className="text-accent-primary" />
          }
          className="col-span-full"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
              <BookOpen size={24} className="text-black" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-1">
                "Meditations" by Marcus Aurelius
              </h3>
              <p className="text-sm text-muted line-clamp-2">
                Ancient wisdom for modern living. Learn how to cultivate inner peace and resilience through Stoic philosophy.
              </p>
              <div className="flex gap-2 mt-2">
                <button className="btn-primary text-xs">Add to Library</button>
                <button className="btn-secondary text-xs">Learn More</button>
              </div>
            </div>
          </div>
        </GlassCard>
      </section>
    </main>
  );
} 