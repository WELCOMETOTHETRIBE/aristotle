'use client';

import AuroraBackground from "@/components/AuroraBackground";
import { GlassCard } from "@/components/GlassCard";
import { Shield, BookOpen, Target, Users, ArrowLeft, Play, Clock, Star, Flame, Zap, Mountain } from "lucide-react";
import Link from "next/link";

const practices = [
  {
    id: "1",
    title: "Spartan Discipline",
    description: "Build mental and physical toughness through structured training and self-control.",
    duration: 30,
    difficulty: "intermediate",
    benefits: ["Mental toughness", "Physical strength", "Self-discipline"],
    category: "Warrior Practice",
    culturalContext: "Rooted in ancient Spartan military training, emphasizing discipline, courage, and resilience.",
    scientificValidation: "Research shows that structured physical training improves mental resilience and stress tolerance.",
    instructions: [
      "Begin with basic physical conditioning",
      "Practice mental focus during physical exertion",
      "Gradually increase challenge levels",
      "Maintain consistent daily practice",
      "Reflect on your growing strength"
    ]
  },
  {
    id: "2",
    title: "Samurai Bushido",
    description: "Cultivate honor, loyalty, and mastery through the way of the warrior.",
    duration: 45,
    difficulty: "advanced",
    benefits: ["Honor", "Loyalty", "Mastery", "Focus"],
    category: "Philosophical Practice",
    culturalContext: "The samurai code of Bushido emphasizes honor, loyalty, and the pursuit of mastery in all endeavors.",
    scientificValidation: "Studies show that having a strong moral code improves decision-making and reduces stress.",
    instructions: [
      "Study the seven virtues of Bushido",
      "Practice honor in daily interactions",
      "Develop loyalty to your commitments",
      "Pursue mastery in your chosen field",
      "Maintain focus and presence"
    ]
  },
  {
    id: "3",
    title: "Cold Exposure Training",
    description: "Build resilience through controlled exposure to challenging conditions.",
    duration: 15,
    difficulty: "beginner",
    benefits: ["Resilience", "Stress tolerance", "Mental strength"],
    category: "Physical Practice",
    culturalContext: "Ancient warrior traditions used cold exposure to build mental and physical resilience.",
    scientificValidation: "Cold exposure has been shown to improve stress tolerance and immune function.",
    instructions: [
      "Start with cold showers (30 seconds)",
      "Gradually increase duration",
      "Focus on controlled breathing",
      "Embrace the discomfort",
      "Build mental resilience"
    ]
  },
  {
    id: "4",
    title: "Challenge Response",
    description: "Transform stress into strength by viewing challenges as opportunities for growth.",
    duration: 20,
    difficulty: "intermediate",
    benefits: ["Growth mindset", "Stress transformation", "Adaptability"],
    category: "Mental Practice",
    culturalContext: "Warrior traditions teach that challenges are opportunities to demonstrate courage and grow stronger.",
    scientificValidation: "Research shows that viewing stress as enhancing rather than harmful improves performance.",
    instructions: [
      "Identify a current challenge",
      "Reframe it as an opportunity",
      "Develop a growth mindset",
      "Take action despite fear",
      "Learn from the experience"
    ]
  }
];

export default function CouragePage() {
  return (
    <main className="container-academy">
      <AuroraBackground />
      
      {/* Header */}
      <header className="mb-8">
        <Link href="/academy" className="inline-flex items-center gap-2 text-muted hover:text-white transition-colors mb-4">
          <ArrowLeft size={16} />
          Back to Academy
        </Link>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center">
            <Shield size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-semibold text-white mb-2">Courage</h1>
            <p className="text-muted">
              The virtue of facing challenges with strength and determination
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-2xl font-semibold text-white">4</div>
            <div className="text-sm text-muted">Practices</div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-2xl font-semibold text-white">64%</div>
            <div className="text-sm text-muted">Progress</div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-2xl font-semibold text-white">12</div>
            <div className="text-sm text-muted">Day Streak</div>
          </div>
        </div>
      </header>

      {/* Practices Grid */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-white">Courage Practices</h2>
          <div className="flex gap-2">
            <button className="btn-secondary text-sm">All</button>
            <button className="btn-secondary text-sm">Beginner</button>
            <button className="btn-secondary text-sm">Advanced</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {practices.map((practice) => (
            <GlassCard
              key={practice.id}
              title={practice.title}
              subtitle={practice.description}
              action={
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-muted" />
                  <span className="text-xs text-muted">{practice.duration}m</span>
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    practice.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                    practice.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {practice.difficulty}
                  </div>
                </div>
              }
              className="group hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <div className="space-y-4">
                {/* Benefits */}
                <div>
                  <h4 className="text-sm font-medium text-white mb-2">Benefits</h4>
                  <div className="flex flex-wrap gap-2">
                    {practice.benefits.map((benefit) => (
                      <span
                        key={benefit}
                        className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Cultural Context */}
                <div>
                  <h4 className="text-sm font-medium text-white mb-2">Cultural Context</h4>
                  <p className="text-xs text-muted line-clamp-2">
                    {practice.culturalContext}
                  </p>
                </div>

                {/* Action */}
                <div className="flex items-center justify-between pt-2">
                  <button className="btn-primary text-sm">
                    <Play size={14} className="mr-1" />
                    Start Practice
                  </button>
                  <button className="text-muted hover:text-white transition-colors">
                    <BookOpen size={14} />
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Courage Quote */}
      <section className="mb-12">
        <GlassCard
          title="Courage Quote"
          subtitle="Ancient wisdom for modern bravery"
        >
          <div className="text-center space-y-4">
            <blockquote className="text-xl text-white italic">
              "Courage is the first of human qualities because it is the quality which guarantees the others."
            </blockquote>
            <cite className="text-red-400">— Aristotle</cite>
            <p className="text-sm text-muted max-w-2xl mx-auto">
              This quote from Aristotle emphasizes that courage is foundational to all other virtues. 
              Without the courage to act, to change, and to face challenges, we cannot develop 
              wisdom, justice, or temperance.
            </p>
          </div>
        </GlassCard>
      </section>

      {/* Related Resources */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-6">Related Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard
            title="Books"
            subtitle="Essential readings"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <BookOpen size={14} className="text-red-400" />
                <span className="text-white">"The Art of War" by Sun Tzu</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <BookOpen size={14} className="text-red-400" />
                <span className="text-white">"Bushido: The Soul of Japan"</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <BookOpen size={14} className="text-red-400" />
                <span className="text-white">"Gates of Fire" by Steven Pressfield</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard
            title="Teachers"
            subtitle="Courage guides"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Users size={14} className="text-red-400" />
                <span className="text-white">Sun Tzu</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users size={14} className="text-red-400" />
                <span className="text-white">Miyamoto Musashi</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users size={14} className="text-red-400" />
                <span className="text-white">King Leonidas</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard
            title="Progress"
            subtitle="Your courage journey"
          >
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-semibold text-white">64%</div>
                <div className="text-sm text-muted">Overall Progress</div>
              </div>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={star <= 4 ? "text-yellow-400 fill-current" : "text-muted"}
                  />
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      </section>
    </main>
  );
} 