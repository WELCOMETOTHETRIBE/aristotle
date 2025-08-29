'use client';

import AuroraBackground from "@/components/AuroraBackground";
import { GlassCard } from "@/components/GlassCard";
import { Brain, BookOpen, Target, Users, ArrowLeft, Play, Clock, Star } from "lucide-react";
import Link from "next/link";

const practices = [
  {
    id: "1",
    title: "Socratic Dialogue",
    description: "Engage in self-examination through structured questioning to uncover deeper truths and challenge assumptions.",
    duration: 15,
    difficulty: "beginner",
    benefits: ["Critical thinking", "Self-awareness", "Clarity of thought"],
    category: "Philosophical Practice",
    culturalContext: "Rooted in Socrates' method of inquiry, this practice helps develop intellectual humility and deeper understanding.",
    scientificValidation: "Research shows that self-questioning improves metacognition and decision-making skills.",
    instructions: [
      "Choose a topic or belief you want to examine",
      "Ask yourself 'What do I really know about this?'",
      "Consider alternative perspectives",
      "Question your assumptions",
      "Reflect on what you've learned"
    ]
  },
  {
    id: "2",
    title: "Contemplative Reading",
    description: "Read philosophical texts slowly and reflectively, allowing ideas to sink in and transform your thinking.",
    duration: 30,
    difficulty: "intermediate",
    benefits: ["Deep understanding", "Intellectual growth", "Wisdom accumulation"],
    category: "Study Practice",
    culturalContext: "Ancient philosophers emphasized slow, contemplative reading as essential for true learning.",
    scientificValidation: "Studies show that slow reading improves comprehension and retention compared to speed reading.",
    instructions: [
      "Choose a philosophical text",
      "Read slowly, pausing after each paragraph",
      "Reflect on what you've read",
      "Write down key insights",
      "Consider how it applies to your life"
    ]
  },
  {
    id: "3",
    title: "Evening Reflection",
    description: "Review your day through the lens of wisdom, identifying learning opportunities and areas for growth.",
    duration: 10,
    difficulty: "beginner",
    benefits: ["Self-improvement", "Learning from experience", "Better decision-making"],
    category: "Daily Practice",
    culturalContext: "Marcus Aurelius practiced daily reflection as a cornerstone of Stoic wisdom.",
    scientificValidation: "Daily reflection has been shown to improve learning and personal development.",
    instructions: [
      "Find a quiet moment in the evening",
      "Review your day's events",
      "Identify what went well and why",
      "Consider what could have been done better",
      "Plan how to apply these lessons tomorrow"
    ]
  },
  {
    id: "4",
    title: "Cross-Cultural Study",
    description: "Explore wisdom traditions from different cultures to broaden your perspective and understanding.",
    duration: 45,
    difficulty: "advanced",
    benefits: ["Cultural understanding", "Broader perspective", "Comparative wisdom"],
    category: "Study Practice",
    culturalContext: "Ancient wisdom traditions from Greece, China, India, and beyond offer complementary insights.",
    scientificValidation: "Cross-cultural learning enhances cognitive flexibility and reduces bias.",
    instructions: [
      "Choose a wisdom tradition to explore",
      "Read primary texts and commentaries",
      "Compare with your existing knowledge",
      "Identify universal principles",
      "Integrate insights into your worldview"
    ]
  }
];

export default function WisdomPage() {
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
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg">
              <Brain size={32} className="text-white drop-shadow-sm" />
            </div>
            <div>
              <h1 className="text-4xl font-semibold text-white mb-2 drop-shadow-sm">Wisdom</h1>
              <h2 className="text-xl text-blue-300 font-medium drop-shadow-sm">The Virtue of Knowledge & Understanding</h2>
              <p className="text-white/80 drop-shadow-sm">
                The virtue of knowledge, understanding, and sound judgment
              </p>
            </div>
          </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-2xl font-semibold text-white">4</div>
            <div className="text-sm text-muted">Practices</div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-2xl font-semibold text-white">72%</div>
            <div className="text-sm text-muted">Progress</div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-2xl font-semibold text-white">15</div>
            <div className="text-sm text-muted">Day Streak</div>
          </div>
        </div>
      </header>

      {/* Practices Grid */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-white drop-shadow-sm">Wisdom Practices</h2>
          <div className="flex gap-2">
            <button className="bg-white/25 hover:bg-white/35 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 border border-white/30 hover:border-white/40 text-sm shadow-md hover:shadow-lg">All</button>
            <button className="bg-white/25 hover:bg-white/35 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 border border-white/30 hover:border-white/40 text-sm shadow-md hover:shadow-lg">Beginner</button>
            <button className="bg-white/25 hover:bg-white/35 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 border border-white/30 hover:border-white/40 text-sm shadow-md hover:shadow-lg">Advanced</button>
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
                  <Clock size={14} className="text-white/70" />
                  <span className="text-xs text-white/70">{practice.duration}m</span>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    practice.difficulty === 'beginner' ? 'bg-green-500/30 text-green-300 border border-green-400/30' :
                    practice.difficulty === 'intermediate' ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-400/30' :
                    'bg-red-500/30 text-red-300 border border-red-400/30'
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
                  <h4 className="text-sm font-medium text-white mb-2 drop-shadow-sm">Benefits</h4>
                  <div className="flex flex-wrap gap-2">
                    {practice.benefits.map((benefit) => (
                      <span
                        key={benefit}
                        className="px-2 py-1 bg-blue-500/30 text-blue-300 text-xs rounded-full border border-blue-400/30 font-medium"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Cultural Context */}
                <div>
                  <h4 className="text-sm font-medium text-white mb-2 drop-shadow-sm">Cultural Context</h4>
                  <p className="text-xs text-white/80 line-clamp-2 drop-shadow-sm">
                    {practice.culturalContext}
                  </p>
                </div>

                {/* Action */}
                <div className="flex items-center justify-between pt-2">
                  <button className="btn-primary-light text-sm">
                    <Play size={14} className="mr-1" />
                    Start Practice
                  </button>
                  <button className="text-white/70 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
                    <BookOpen size={14} />
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Wisdom Quote */}
      <section className="mb-12">
        <GlassCard
          title="Wisdom Quote"
          subtitle="Ancient wisdom for modern reflection"
        >
          <div className="text-center space-y-4">
                      <blockquote className="text-xl text-white italic drop-shadow-sm">
            "The only true wisdom is in knowing you know nothing."
          </blockquote>
          <cite className="text-blue-300 font-medium drop-shadow-sm">— Socrates</cite>
          <p className="text-sm text-white/80 max-w-2xl mx-auto drop-shadow-sm">
            This famous quote from Socrates embodies the essence of wisdom: 
            intellectual humility and the recognition that true knowledge begins 
            with acknowledging our limitations and being open to learning.
          </p>
          </div>
        </GlassCard>
      </section>

      {/* Related Resources */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-6 drop-shadow-sm">Related Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard
            title="Books"
            subtitle="Essential readings"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <BookOpen size={14} className="text-blue-300" />
                <span className="text-white drop-shadow-sm">"Meditations" by Marcus Aurelius</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <BookOpen size={14} className="text-blue-300" />
                <span className="text-white drop-shadow-sm">"The Republic" by Plato</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <BookOpen size={14} className="text-blue-300" />
                <span className="text-white drop-shadow-sm">"Nicomachean Ethics" by Aristotle</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard
            title="Teachers"
            subtitle="Wisdom guides"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Users size={14} className="text-blue-300" />
                <span className="text-white drop-shadow-sm">Socrates</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users size={14} className="text-blue-300" />
                <span className="text-white drop-shadow-sm">Plato</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users size={14} className="text-blue-300" />
                <span className="text-white drop-shadow-sm">Aristotle</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard
            title="Progress"
            subtitle="Your wisdom journey"
          >
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-semibold text-white drop-shadow-sm">72%</div>
                <div className="text-sm text-white/80 drop-shadow-sm">Overall Progress</div>
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