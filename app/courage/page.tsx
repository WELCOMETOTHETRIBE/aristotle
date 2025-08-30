'use client';

import AuroraBackground from "@/components/AuroraBackground";
import { GlassCard } from "@/components/GlassCard";
import { Shield, BookOpen, Target, Users, ArrowLeft, Play, Clock, Star, Flame, Zap, Mountain, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from 'react';
import PageLayout from '@/components/PageLayout';
import PracticeSessionModal from '@/components/PracticeSessionModal';
import { usePracticeSession } from '@/lib/hooks/usePracticeSession';

interface HiddenWisdom {
  insight: string;
  micro_experiment: string;
  reflection: string;
}

interface PracticeDetail {
  title: string;
  body: string;
  bullets: string[];
  coach_prompts: string[];
  safety_reminders: string[];
  est_time_min: number;
}

interface DailyWisdom {
  quote: string;
  author: string;
  framework: string;
  reflection: string;
}

const staticPractices = [
  {
    id: "1",
    title: "Cold Exposure",
    description: "Build mental resilience through controlled exposure to discomfort, starting with cold showers and progressing to ice baths.",
    duration: 5,
    difficulty: "beginner",
    benefits: ["Mental toughness", "Stress resilience", "Improved focus"],
    category: "Physical Challenge",
    culturalContext: "Ancient Spartan warriors used cold exposure to build discipline and mental fortitude.",
    scientificValidation: "Cold exposure increases norepinephrine and reduces inflammation, improving mental clarity and resilience.",
    instructions: [
      "Start with 30 seconds of cold water at the end of your shower",
      "Gradually increase duration to 2-3 minutes",
      "Focus on steady breathing throughout",
      "Embrace the discomfort as a mental challenge",
      "Reflect on your growing resilience"
    ],
    moduleId: "cold_heat"
  },
  {
    id: "2",
    title: "Public Speaking Practice",
    description: "Develop confidence and overcome fear through structured public speaking exercises.",
    duration: 20,
    difficulty: "intermediate",
    benefits: ["Confidence", "Communication skills", "Fear management"],
    category: "Social Challenge",
    culturalContext: "Ancient Greek philosophers emphasized rhetoric and public speaking as essential skills for leadership.",
    scientificValidation: "Public speaking practice reduces anxiety and improves self-confidence through systematic desensitization.",
    instructions: [
      "Choose a topic you're passionate about",
      "Practice in front of a mirror first",
      "Record yourself and review",
      "Present to a small group of friends",
      "Gradually increase audience size"
    ],
    moduleId: "focus_deepwork"
  },
  {
    id: "3",
    title: "Boundary Setting",
    description: "Practice asserting your needs and setting healthy boundaries in relationships and work.",
    duration: 15,
    difficulty: "beginner",
    benefits: ["Self-respect", "Better relationships", "Reduced stress"],
    category: "Social Practice",
    culturalContext: "Stoic philosophy teaches the importance of knowing what you can and cannot control.",
    scientificValidation: "Setting boundaries improves mental health and relationship satisfaction.",
    instructions: [
      "Identify areas where you need boundaries",
      "Practice saying 'no' to small requests",
      "Use 'I' statements to express needs",
      "Stay firm but respectful",
      "Reflect on how it feels to assert yourself"
    ],
    moduleId: "mood_regulation"
  },
  {
    id: "4",
    title: "Fear Journaling",
    description: "Confront and analyze your fears through structured reflection and planning.",
    duration: 25,
    difficulty: "intermediate",
    benefits: ["Self-awareness", "Fear management", "Personal growth"],
    category: "Mental Practice",
    culturalContext: "Ancient warriors used fear as a teacher rather than an enemy.",
    scientificValidation: "Writing about fears reduces their power and helps develop coping strategies.",
    instructions: [
      "Write down your biggest fears",
      "Analyze what triggers each fear",
      "Consider the worst-case scenario",
      "Plan how you would handle it",
      "Reflect on past fears you've overcome"
    ],
    moduleId: "visualization"
  }
];

export default function CouragePage() {
  const [hiddenWisdom, setHiddenWisdom] = useState<HiddenWisdom | null>(null);
  const [dailyWisdom, setDailyWisdom] = useState<DailyWisdom | null>(null);
  const [generatedPractice, setGeneratedPractice] = useState<PracticeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const { isModalOpen, currentPractice, startPractice, closeModal } = usePracticeSession();

  useEffect(() => {
    loadCourageContent();
  }, []);

  const loadCourageContent = async () => {
    try {
      setLoading(true);
      
      // Load hidden wisdom
      const dateBucket = new Date().toISOString().split('T')[0];
      const wisdomResponse = await fetch(
        `/api/generate/hidden-wisdom?dateBucket=${dateBucket}&style=spartan&locale=en`
      );
      if (wisdomResponse.ok) {
        const wisdom = await wisdomResponse.json();
        setHiddenWisdom(wisdom);
      }

      // Load daily wisdom
      const dailyResponse = await fetch('/api/generate/daily-wisdom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ framework: 'spartan' })
      });
      if (dailyResponse.ok) {
        const daily = await dailyResponse.json();
        setDailyWisdom(daily);
      }

      // Load generated practice
      const practiceResponse = await fetch(
        `/api/generate/practice?moduleId=courage&level=Beginner&style=spartan&locale=en`
      );
      if (practiceResponse.ok) {
        const practice = await practiceResponse.json();
        setGeneratedPractice(practice);
      }
    } catch (error) {
      console.error('Error loading courage content:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshContent = async () => {
    setRefreshing(true);
    await loadCourageContent();
    setRefreshing(false);
  };

  const handleStartPractice = (practice: any) => {
    // Convert practice to the format expected by the modal
    const practiceData = {
      id: practice.id,
      title: practice.title,
      description: practice.description,
      duration: practice.duration,
      difficulty: practice.difficulty,
      benefits: practice.benefits,
      instructions: practice.instructions,
      moduleId: practice.moduleId || 'strength',
      frameworkId: 'spartan'
    };
    startPractice(practiceData);
  };

  const handleStartGeneratedPractice = () => {
    if (generatedPractice) {
      const practiceData = {
        id: 'ai-generated-courage',
        title: generatedPractice.title,
        description: generatedPractice.body,
        duration: Math.ceil(generatedPractice.est_time_min / 5) * 5, // Round to nearest 5 minutes
        difficulty: 'beginner',
        benefits: ['AI-generated courage', 'Personalized practice', 'Daily growth'],
        instructions: generatedPractice.bullets,
        moduleId: 'strength',
        frameworkId: 'spartan'
      };
      startPractice(practiceData);
    }
  };

  if (loading) {
    return (
      <PageLayout title="Courage" description="The Virtue of Bravery & Strength">
        <div className="page-section">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded mb-8"></div>
            <div className="space-y-6">
              <div className="h-64 bg-white/10 rounded-lg"></div>
              <div className="h-48 bg-white/10 rounded-lg"></div>
              <div className="h-48 bg-white/10 rounded-lg"></div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Courage" description="The Virtue of Bravery & Strength">
      {/* Header */}
      <div className="page-section">
        <Link href="/academy" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
          <ArrowLeft size={16} />
          Back to Academy
        </Link>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg">
            <Shield size={32} className="text-white drop-shadow-sm" />
          </div>
          <div>
            <h1 className="headline">Courage</h1>
            <p className="subheadline mt-2">
              The Virtue of Bravery & Strength
            </p>
            <p className="body-text mt-2">
              The virtue of facing fear, adversity, and challenges with bravery
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card-base text-center">
            <div className="text-2xl font-semibold text-white">4</div>
            <div className="text-sm text-gray-400">Practices</div>
          </div>
          <div className="card-base text-center">
            <div className="text-2xl font-semibold text-white">68%</div>
            <div className="text-sm text-gray-400">Progress</div>
          </div>
          <div className="card-base text-center">
            <div className="text-2xl font-semibold text-white">12</div>
            <div className="text-sm text-gray-400">Day Streak</div>
          </div>
        </div>
      </div>

      {/* AI-Generated Hidden Wisdom */}
      {hiddenWisdom && (
        <div className="page-section">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title">⚔️ Today's Warrior Wisdom</h2>
            <button 
              onClick={refreshContent}
              disabled={refreshing}
              className="btn-secondary text-sm px-3 py-1 flex items-center gap-2"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
          
          <div className="card-base bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-400/30">
            <h3 className="text-xl font-semibold text-white mb-4">{hiddenWisdom.insight}</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-red-300 mb-2">Challenge</h4>
                <p className="text-gray-300">{hiddenWisdom.micro_experiment}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-orange-300 mb-2">Reflection</h4>
                <p className="text-gray-300">{hiddenWisdom.reflection}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI-Generated Practice */}
      {generatedPractice && (
        <div className="page-section">
          <h2 className="section-title">🎯 AI-Generated Courage Practice</h2>
          <div className="card-base">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-lg">{generatedPractice.title}</h3>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-gray-400" />
                <span className="text-xs text-gray-400">{generatedPractice.est_time_min}m</span>
              </div>
            </div>
            
            <p className="body-text mb-4">{generatedPractice.body}</p>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-white mb-2">Steps</h4>
                <ul className="space-y-2">
                  {generatedPractice.bullets.map((bullet, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300">
                      <span className="text-red-300 mt-1">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {generatedPractice.coach_prompts.length > 0 && (
                <div>
                  <h4 className="font-semibold text-white mb-2">Coach Prompts</h4>
                  <ul className="space-y-2">
                    {generatedPractice.coach_prompts.map((prompt, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <span className="text-orange-300 mt-1">💭</span>
                        <span>{prompt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {generatedPractice.safety_reminders.length > 0 && (
                <div>
                  <h4 className="font-semibold text-white mb-2">Safety Reminders</h4>
                  <ul className="space-y-2">
                    {generatedPractice.safety_reminders.map((reminder, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <span className="text-yellow-300 mt-1">⚠️</span>
                        <span>{reminder}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button 
                  className="btn-primary text-sm px-3 py-1"
                  onClick={handleStartGeneratedPractice}
                >
                  <Play size={14} className="mr-1" />
                  Start Practice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Static Practices Grid */}
      <div className="page-section">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title">Courage Practices</h2>
          <div className="flex gap-2">
            <button className="btn-secondary text-sm px-3 py-1">All</button>
            <button className="btn-secondary text-sm px-3 py-1">Beginner</button>
            <button className="btn-secondary text-sm px-3 py-1">Advanced</button>
          </div>
        </div>

        <div className="page-grid page-grid-cols-2">
          {staticPractices.map((practice) => (
            <div
              key={practice.id}
              className="card-base hover-lift cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-lg">{practice.title}</h3>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-gray-400" />
                  <span className="text-xs text-gray-400">{practice.duration}m</span>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    practice.difficulty === 'beginner' ? 'bg-green-500/30 text-green-300 border border-green-400/30' :
                    practice.difficulty === 'intermediate' ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-400/30' :
                    'bg-red-500/30 text-red-300 border border-red-400/30'
                  }`}>
                    {practice.difficulty}
                  </div>
                </div>
              </div>
              
              <p className="body-text mb-4">{practice.description}</p>
              
              <div className="space-y-4">
                {/* Benefits */}
                <div>
                  <h4 className="font-semibold text-white mb-2">Benefits</h4>
                  <div className="flex flex-wrap gap-2">
                    {practice.benefits.map((benefit) => (
                      <span
                        key={benefit}
                        className="px-2 py-1 bg-red-500/30 text-red-300 text-xs rounded-full border border-red-400/30 font-medium"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Cultural Context */}
                <div>
                  <h4 className="font-semibold text-white mb-2">Cultural Context</h4>
                  <p className="body-text line-clamp-2">
                    {practice.culturalContext}
                  </p>
                </div>

                {/* Action */}
                <div className="flex items-center justify-between pt-2">
                  <button 
                    className="btn-primary text-sm px-3 py-1"
                    onClick={() => handleStartPractice(practice)}
                  >
                    <Play size={14} className="mr-1" />
                    Start Practice
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
                    <BookOpen size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI-Generated Daily Wisdom Quote */}
      {dailyWisdom && (
        <div className="page-section">
          <div className="card-base">
            <h3 className="font-bold text-white text-lg mb-2">Daily Courage Quote</h3>
            <p className="body-text mb-4">AI-generated wisdom for modern bravery</p>
            
            <div className="text-center space-y-4">
              <blockquote className="text-xl text-white italic">
                "{dailyWisdom.quote}"
              </blockquote>
              <cite className="text-red-300 font-medium">— {dailyWisdom.author}</cite>
              <p className="body-text max-w-2xl mx-auto">
                {dailyWisdom.reflection}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Related Resources */}
      <div className="page-section">
        <h2 className="section-title">Related Resources</h2>
        <div className="page-grid page-grid-cols-3">
          <div className="card-base">
            <h3 className="font-bold text-white text-lg mb-2">Books</h3>
            <p className="body-text mb-4">Essential readings</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <BookOpen size={14} className="text-red-300" />
                <span className="text-white">"The Art of War" by Sun Tzu</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <BookOpen size={14} className="text-red-300" />
                <span className="text-white">"Gates of Fire" by Steven Pressfield</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <BookOpen size={14} className="text-red-300" />
                <span className="text-white">"The Warrior Ethos" by Steven Pressfield</span>
              </div>
            </div>
          </div>

          <div className="card-base">
            <h3 className="font-bold text-white text-lg mb-2">Teachers</h3>
            <p className="body-text mb-4">Courage guides</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Users size={14} className="text-red-300" />
                <span className="text-white">Leonidas of Sparta</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users size={14} className="text-red-300" />
                <span className="text-white">Sun Tzu</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users size={14} className="text-red-300" />
                <span className="text-white">Marcus Aurelius</span>
              </div>
            </div>
          </div>

          <div className="card-base">
            <h3 className="font-bold text-white text-lg mb-2">Progress</h3>
            <p className="body-text mb-4">Your courage journey</p>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-semibold text-white">68%</div>
                <div className="text-sm text-gray-400">Overall Progress</div>
              </div>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={star <= 3 ? "text-yellow-400 fill-current" : "text-gray-600"}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Practice Session Modal */}
      {currentPractice && (
        <PracticeSessionModal
          isOpen={isModalOpen}
          onClose={closeModal}
          practice={currentPractice}
        />
      )}
    </PageLayout>
  );
} 