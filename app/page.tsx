'use client';

import AuroraBackground from "@/components/AuroraBackground";
import { GlassCard } from "@/components/GlassCard";
import VirtueRadar from "@/components/VirtueRadar";
import RadialMeter from "@/components/RadialMeter";
import BreathTimer from "@/components/BreathTimer";
import SunPath from "@/components/SunPath";
import { ResourceSpotlight } from "@/components/ResourceSpotlight";
import FocusTimer from "@/components/FocusTimer";
import { MoreHorizontal, Target, Flame, Droplets, Clock, Heart, Sun, BookOpen, Settings, TrendingUp, Zap } from "lucide-react";
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
      
      {/* Enhanced Header with better hierarchy */}
      <header className="mb-12">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {getGreeting()}, {mockUserProfile.name}
            </h1>
            <h2 className="text-xl text-accent font-medium">Dashboard</h2>
          </div>
          <div className="hidden md:flex items-center gap-3 text-sm text-muted">
            <span className="flex items-center gap-1">
              <TrendingUp size={16} />
              Day {mockUserProfile.streaks.morningRoutine}
            </span>
            <span className="w-1 h-1 bg-muted rounded-full"></span>
            <span className="flex items-center gap-1">
              <Zap size={16} />
              {mockUserProfile.streaks.morningRoutine} day streak
            </span>
          </div>
        </div>
        <p className="text-lg text-secondary max-w-2xl">
          Your day at the Academy begins with presence and practice. 
          <span className="text-accent font-medium"> Focus on one virtue at a time.</span>
        </p>
      </header>

      {/* Enhanced Widget Grid with better proportions */}
      <section className="widget-grid">
        {/* Virtue Radar - Larger, more prominent */}
        <GlassCard 
          title="Virtue Balance" 
          subtitle="Weekly radar"
          className="col-span-full lg:col-span-2"
          action={
            <button className="text-muted hover:text-white transition-colors interactive">
              <MoreHorizontal size={18} />
            </button>
          }
        >
          <div className="h-80">
            <VirtueRadar data={virtueData} />
          </div>
        </GlassCard>

        {/* Morning Ritual - Enhanced with better visual hierarchy */}
        <GlassCard 
          title="Morning Ritual" 
          subtitle={`${mockUserProfile.streaks.morningRoutine} day streak`}
          action={
            <div className="flex items-center gap-2">
              <Target size={18} className="text-accent" />
              <span className="text-sm font-medium text-white">7/7</span>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-success animate-pulse-soft"></div>
                <span className="font-medium text-white">Breathwork</span>
              </div>
              <span className="text-sm text-muted">10m</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-success animate-pulse-soft"></div>
                <span className="font-medium text-white">Movement</span>
              </div>
              <span className="text-sm text-muted">20m</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-muted"></div>
                <span className="font-medium text-secondary">Gratitude</span>
              </div>
              <span className="text-sm text-muted">3m</span>
            </div>
          </div>
        </GlassCard>

        {/* Breathwork Timer - Enhanced sizing */}
        <GlassCard 
          title="Breathwork" 
          subtitle="Box 4-4-4-4"
          action={
            <button className="text-muted hover:text-white transition-colors interactive">
              <Settings size={18} />
            </button>
          }
        >
          <div className="flex justify-center py-4">
            <BreathTimer />
          </div>
        </GlassCard>

        {/* Cold Exposure - Enhanced with better contrast */}
        <GlassCard 
          title="Cold Exposure" 
          subtitle="Weekly: 45 minutes"
          action={
            <Flame size={18} className="text-accent" />
          }
        >
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">3</div>
              <div className="text-sm text-muted">Day streak</div>
            </div>
            <div className="flex gap-3">
              <button className="btn-primary flex-1">Start Timer</button>
              <button className="btn-secondary flex-1">Log Session</button>
            </div>
            <div className="text-xs text-muted text-center bg-white/5 rounded-lg p-3">
              Start with 30 seconds cold shower
            </div>
          </div>
        </GlassCard>

        {/* Fasting Tracker - Enhanced typography */}
        <GlassCard 
          title="Fasting" 
          subtitle="16:8 Protocol"
          action={
            <Clock size={18} className="text-accent" />
          }
        >
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">
                {formatTime(fastingTimeRemaining)}
              </div>
              <div className="text-sm text-muted">Remaining</div>
            </div>
            <div className="flex gap-3">
              <button className="btn-primary flex-1">Start</button>
              <button className="btn-secondary flex-1">Stop</button>
            </div>
            <div className="text-xs text-muted text-center bg-white/5 rounded-lg p-3">
              {mockUserProfile.streaks.fasting} day streak
            </div>
          </div>
        </GlassCard>

        {/* Mood & Reflection - Enhanced interaction */}
        <GlassCard 
          title="Mood & Reflection" 
          subtitle="How are you feeling?"
          action={
            <Heart size={18} className="text-accent" />
          }
        >
          <div className="space-y-6">
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map((mood) => (
                <button
                  key={mood}
                  className={`w-10 h-10 rounded-full text-sm font-semibold transition-all interactive ${
                    currentMood?.mood === mood 
                      ? 'bg-accent text-black shadow-lg' 
                      : 'bg-white/10 text-white hover:bg-white/20 hover:scale-110'
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

        {/* Sun Path - Enhanced sizing */}
        <GlassCard 
          title="Circadian Rhythm" 
          subtitle="Sleep cycle"
          action={
            <Sun size={18} className="text-accent" />
          }
        >
          <div className="flex justify-center py-4">
            <SunPath />
          </div>
        </GlassCard>

        {/* Hydration Ring - Enhanced with better proportions */}
        <GlassCard 
          title="Hydration" 
          subtitle="Daily target"
          action={
            <Droplets size={18} className="text-accent" />
          }
        >
          <div className="space-y-6">
            <div className="flex justify-center">
              <RadialMeter 
                value={hydrationProgress} 
                label={`${currentHydration} / ${mockUserProfile.goals.dailyHydration} ml`}
              />
            </div>
            <div className="flex gap-3">
              <button className="btn-secondary flex-1">+250ml</button>
              <button className="btn-secondary flex-1">+500ml</button>
            </div>
          </div>
        </GlassCard>

        {/* Focus / Flow Block - Enhanced with better hierarchy */}
        <GlassCard 
          title="Focus Block" 
          subtitle="50/10 Deep Work"
          action={
            <button className="text-muted hover:text-white transition-colors interactive">
              <Settings size={18} />
            </button>
          }
        >
          <FocusTimer 
            defaultDuration={25}
            onComplete={() => {
              // Could trigger notification or update stats
              console.log('Focus session completed!');
            }}
          />
        </GlassCard>

        {/* Resource Spotlight - Enhanced with better layout */}
        <ResourceSpotlight className="col-span-full" />
      </section>
    </main>
  );
} 