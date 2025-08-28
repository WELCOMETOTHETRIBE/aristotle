'use client';

import AuroraBackground from "@/components/AuroraBackground";
import { GlassCard } from "@/components/GlassCard";
import { Brain, Shield, Scale, Leaf, ArrowRight, BookOpen, Target, Users } from "lucide-react";
import Link from "next/link";

const pillars = [
  {
    name: "Wisdom",
    description: "The virtue of knowledge, understanding, and sound judgment",
    icon: Brain,
    color: "from-accent-primary to-blue-500",
    practices: ["Philosophical Study", "Critical Thinking", "Reflection", "Learning"],
    path: "/wisdom",
    quote: "Wisdom begins in wonder.",
    author: "Socrates"
  },
  {
    name: "Courage",
    description: "The virtue of facing challenges with strength and determination",
    icon: Shield,
    color: "from-red-500 to-orange-500",
    practices: ["Action", "Challenge", "Growth", "Resilience"],
    path: "/courage",
    quote: "Courage is the first of human qualities because it is the quality which guarantees the others.",
    author: "Aristotle"
  },
  {
    name: "Justice",
    description: "The virtue of fairness, right relationships, and social harmony",
    icon: Scale,
    color: "from-green-500 to-emerald-500",
    practices: ["Relationships", "Community", "Service", "Balance"],
    path: "/justice",
    quote: "Justice is the constant and perpetual will to allot to every man his due.",
    author: "Justinian"
  },
  {
    name: "Temperance",
    description: "The virtue of self-control, moderation, and inner harmony",
    icon: Leaf,
    color: "from-accent-secondary to-purple-500",
    practices: ["Mindfulness", "Discipline", "Balance", "Harmony"],
    path: "/temperance",
    quote: "Temperance is the noblest gift of the gods.",
    author: "Euripides"
  }
];

const features = [
  {
    title: "Ancient Wisdom",
    description: "Rooted in 2,400 years of philosophical tradition",
    icon: BookOpen,
    color: "from-accent-primary to-blue-500"
  },
  {
    title: "Modern Science",
    description: "Validated by contemporary research and neuroscience",
    icon: Target,
    color: "from-green-500 to-emerald-500"
  },
  {
    title: "Community",
    description: "Connect with fellow seekers on the path to flourishing",
    icon: Users,
    color: "from-accent-secondary to-purple-500"
  }
];

export default function AcademyPage() {
  return (
    <main className="container-academy">
      <AuroraBackground />
      
      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-semibold text-white mb-4">
          Ancient Wisdom Academy
        </h1>
        <h2 className="text-xl text-accent font-medium mb-4">Overview</h2>
        <p className="text-xl text-muted max-w-2xl mx-auto">
          A comprehensive system for cultivating the four cardinal virtues through 
          ancient practices and modern science.
        </p>
      </header>

      {/* Features */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <GlassCard
                key={feature.title}
                title={feature.title}
                subtitle={feature.description}
                action={
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center`}>
                    <IconComponent size={20} className="text-white" />
                  </div>
                }
              >
                <div className="h-32 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-white mb-2">
                      {feature.title}
                    </div>
                    <p className="text-sm text-muted">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* Pillars */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-white mb-4">
            The Four Cardinal Virtues
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Aristotle identified these four virtues as essential for achieving eudaimonia - 
            human flourishing and happiness. Each virtue represents a different aspect of 
            human excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((pillar) => {
            const IconComponent = pillar.icon;
            return (
              <Link key={pillar.name} href={pillar.path}>
                <GlassCard
                  title={pillar.name}
                  subtitle={pillar.description}
                  action={
                    <div className={`w-12 h-12 bg-gradient-to-r ${pillar.color} rounded-xl flex items-center justify-center`}>
                      <IconComponent size={20} className="text-white" />
                    </div>
                  }
                  className="group hover:scale-105 transition-transform duration-300 cursor-pointer"
                >
                  <div className="space-y-6">
                    {/* Practices */}
                    <div>
                      <h4 className="text-sm font-medium text-white mb-3">Key Practices</h4>
                      <div className="flex flex-wrap gap-2">
                        {pillar.practices.map((practice) => (
                          <span
                            key={practice}
                            className="px-3 py-1 bg-white/10 text-white text-xs rounded-full border border-white/20"
                          >
                            {practice}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Quote */}
                    <div className="border-l-2 border-accent-primary pl-4">
                      <blockquote className="text-sm text-muted italic mb-2">
                        "{pillar.quote}"
                      </blockquote>
                      <cite className="text-xs text-accent-primary">
                        — {pillar.author}
                      </cite>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-between pt-4">
                      <span className="text-sm text-accent-primary font-medium">
                        Explore {pillar.name}
                      </span>
                      <ArrowRight size={16} className="text-accent-primary group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </GlassCard>
              </Link>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-white mb-4">
            How the System Works
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Our approach combines ancient philosophical wisdom with modern scientific 
            understanding to create a comprehensive wellness system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-accent-primary to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Learn</h3>
            <p className="text-muted">
              Study the philosophical foundations and scientific research behind each virtue.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Target size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Practice</h3>
            <p className="text-muted">
              Engage in daily practices and rituals designed to cultivate each virtue.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-accent-secondary to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Reflect</h3>
            <p className="text-muted">
              Track your progress and reflect on how virtues manifest in your daily life.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <GlassCard
          title="Begin Your Journey"
          subtitle="Start with the virtue that calls to you most"
          className="max-w-2xl mx-auto"
        >
          <div className="space-y-6">
            <p className="text-muted">
              Each virtue offers a unique path to personal growth and flourishing. 
              Choose the one that resonates with your current needs and aspirations.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <Link href="/temperance">
                <button className="btn-primary w-full">
                  Start with Temperance
                </button>
              </Link>
              <Link href="/wisdom">
                <button className="btn-secondary w-full">
                  Begin with Wisdom
                </button>
              </Link>
            </div>
          </div>
        </GlassCard>
      </section>
    </main>
  );
} 