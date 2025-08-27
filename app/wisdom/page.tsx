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
          <div className="w-16 h-16 bg-gradient-to-r from-accent-primary to-blue-500 rounded-2xl flex items-center justify-center">
            <Brain size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-semibold text-white mb-2">Wisdom</h1>
            <p className="text-muted">
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
          <h2 className="text-2xl font-semibold text-white">Wisdom Practices</h2>
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
                        className="px-2 py-1 bg-accent-primary/20 text-accent-primary text-xs rounded-full"
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

      {/* Wisdom Quote */}
      <section className="mb-12">
        <GlassCard
          title="Wisdom Quote"
          subtitle="Ancient wisdom for modern reflection"
        >
          <div className="text-center space-y-4">
            <blockquote className="text-xl text-white italic">
              "The only true wisdom is in knowing you know nothing."
            </blockquote>
            <cite className="text-accent-primary">— Socrates</cite>
            <p className="text-sm text-muted max-w-2xl mx-auto">
              This famous quote from Socrates embodies the essence of wisdom: 
              intellectual humility and the recognition that true knowledge begins 
              with acknowledging our limitations and being open to learning.
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
                <BookOpen size={14} className="text-accent-primary" />
                <span className="text-white">"Meditations" by Marcus Aurelius</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <BookOpen size={14} className="text-accent-primary" />
                <span className="text-white">"The Republic" by Plato</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <BookOpen size={14} className="text-accent-primary" />
                <span className="text-white">"Nicomachean Ethics" by Aristotle</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard
            title="Teachers"
            subtitle="Wisdom guides"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Users size={14} className="text-accent-primary" />
                <span className="text-white">Socrates</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users size={14} className="text-accent-primary" />
                <span className="text-white">Plato</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users size={14} className="text-accent-primary" />
                <span className="text-white">Aristotle</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard
            title="Progress"
            subtitle="Your wisdom journey"
          >
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-semibold text-white">72%</div>
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