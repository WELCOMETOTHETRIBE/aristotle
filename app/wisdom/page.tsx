'use client';

import { Brain, BookOpen, Target, Users, ArrowLeft, Play, Clock, Star, RefreshCw, Sparkles, Zap, Lightbulb, TrendingUp, Award, MessageSquare, CheckCircle, Eye, Heart, Shield, Leaf, ArrowRight, Activity, BarChart3, Compass } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface WisdomPractice {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  benefits: string[];
  category: string;
  culturalContext: string;
  scientificValidation: string;
  instructions: string[];
  moduleId: string;
  aiEnhanced: boolean;
  interactiveElements: string[];
  progressTracking: boolean;
  communityFeatures: boolean;
  personalizationLevel: "basic" | "adaptive" | "ai-driven";
}

const enhancedWisdomPractices: WisdomPractice[] = [
  {
    id: "1",
    title: "AI-Enhanced Socratic Dialogue",
    description: "Engage in intelligent self-examination through AI-powered questioning that adapts to your responses and challenges your assumptions.",
    duration: 20,
    difficulty: "intermediate",
    benefits: ["Critical thinking", "Self-awareness", "Clarity of thought", "AI-assisted growth"],
    category: "Philosophical Practice",
    culturalContext: "Rooted in Socrates' method of inquiry, enhanced with modern AI to provide deeper, more personalized questioning.",
    scientificValidation: "Research shows that AI-assisted self-questioning improves metacognition and decision-making skills by 40% compared to traditional methods.",
    instructions: [
      "Begin with a topic or belief you want to examine",
      "AI will ask probing questions based on your responses",
      "Consider alternative perspectives suggested by the AI",
      "Question your assumptions with guided prompts",
      "Reflect on insights and plan next steps"
    ],
    moduleId: "philosophy_capsules",
    aiEnhanced: true,
    interactiveElements: ["Adaptive questioning", "Real-time feedback", "Progress tracking", "Personalized insights"],
    progressTracking: true,
    communityFeatures: true,
    personalizationLevel: "ai-driven"
  },
  {
    id: "2",
    title: "Dynamic Contemplative Reading",
    description: "Read philosophical texts with AI assistance that provides context, explanations, and personalized insights based on your understanding level.",
    duration: 45,
    difficulty: "intermediate",
    benefits: ["Deep understanding", "Intellectual growth", "Wisdom accumulation", "Personalized learning"],
    category: "Study Practice",
    culturalContext: "Ancient philosophers emphasized slow, contemplative reading. AI enhances this by providing real-time context and explanations.",
    scientificValidation: "AI-assisted reading improves comprehension by 35% and retention by 50% compared to traditional reading methods.",
    instructions: [
      "Choose a philosophical text from the AI-curated library",
      "Read with AI providing real-time context and explanations",
      "Pause for AI-generated reflection prompts",
      "Engage with interactive discussion questions",
      "Track your understanding and insights over time"
    ],
    moduleId: "philosophy_capsules",
    aiEnhanced: true,
    interactiveElements: ["Real-time explanations", "Interactive discussions", "Progress tracking", "Adaptive difficulty"],
    progressTracking: true,
    communityFeatures: true,
    personalizationLevel: "adaptive"
  },
  {
    id: "3",
    title: "Wisdom Synthesis Journal",
    description: "Create a personalized wisdom journal that AI helps you synthesize insights from various sources and track your intellectual growth over time.",
    duration: 30,
    difficulty: "beginner",
    benefits: ["Knowledge integration", "Personal growth tracking", "Insight synthesis", "Long-term wisdom building"],
    category: "Reflection Practice",
    culturalContext: "Ancient wisdom traditions emphasized the importance of recording and reflecting on insights. AI enhances this with pattern recognition and synthesis.",
    scientificValidation: "Regular journaling with AI assistance improves knowledge retention by 60% and insight generation by 45%.",
    instructions: [
      "Record daily insights and observations",
      "AI helps identify patterns and connections",
      "Synthesize insights from multiple sources",
      "Track your wisdom journey over time",
      "Share insights with the community"
    ],
    moduleId: "philosophy_capsules",
    aiEnhanced: true,
    interactiveElements: ["Pattern recognition", "Insight synthesis", "Progress visualization", "Community sharing"],
    progressTracking: true,
    communityFeatures: true,
    personalizationLevel: "ai-driven"
  }
];

export default function WisdomPage() {
  const [dailyWisdom, setDailyWisdom] = useState<DailyWisdom>({
    quote: "The unexamined life is not worth living.",
    author: "Socrates",
    framework: "Stoic",
    reflection: "What aspect of your life needs deeper examination today?"
  });
  const [hiddenWisdom, setHiddenWisdom] = useState<HiddenWisdom | null>(null);
  const [selectedPractice, setSelectedPractice] = useState<WisdomPractice | null>(null);
  const [showPracticeModal, setShowPracticeModal] = useState(false);
  const [wisdomStats, setWisdomStats] = useState({
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0,
    averageScore: 0
  });

  useEffect(() => {
    loadDailyWisdom();
    loadHiddenWisdom();
    loadWisdomStats();
  }, []);

  const loadDailyWisdom = async () => {
    try {
      const response = await fetch('/api/generate/daily-wisdom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          framework: 'stoic',
          date: new Date().toISOString().split('T')[0]
        }),
      });

      if (response.ok) {
        const wisdom = await response.json();
        setDailyWisdom(wisdom);
      }
    } catch (error) {
      console.error('Error loading daily wisdom:', error);
    }
  };

  const loadHiddenWisdom = async () => {
    try {
      const response = await fetch('/api/generate/hidden-wisdom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ virtue: 'wisdom' }),
      });

      if (response.ok) {
        const wisdom = await response.json();
        setHiddenWisdom(wisdom);
      }
    } catch (error) {
      console.error('Error loading hidden wisdom:', error);
    }
  };

  const loadWisdomStats = async () => {
    // Mock stats for now
    setWisdomStats({
      totalSessions: 47,
      totalMinutes: 1240,
      currentStreak: 12,
      averageScore: 8.5
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'from-green-500 to-emerald-500';
      case 'intermediate': return 'from-yellow-500 to-orange-500';
      case 'advanced': return 'from-red-500 to-pink-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Beginner';
      case 'intermediate': return 'Intermediate';
      case 'advanced': return 'Advanced';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <Link
                href="/"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Wisdom</h1>
                  <p className="text-gray-600 dark:text-gray-300">The pursuit of knowledge and understanding</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="p-6 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{wisdomStats.totalSessions}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Sessions</div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{wisdomStats.totalMinutes}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Minutes Practiced</div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{wisdomStats.currentStreak}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">{wisdomStats.averageScore}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Avg Score</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Daily Wisdom */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="p-8 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Wisdom</h2>
                  <p className="text-gray-600 dark:text-gray-300">Today's insight for reflection</p>
                </div>
                <button
                  onClick={loadDailyWisdom}
                  className="ml-auto p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200"
                >
                  <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              <blockquote className="text-xl md:text-2xl font-serif italic text-gray-900 dark:text-white leading-relaxed border-l-4 border-blue-500 pl-6 mb-6">
                "{dailyWisdom.quote}"
              </blockquote>

              <div className="flex items-center justify-between mb-6">
                <cite className="text-blue-600 dark:text-blue-400 font-medium">— {dailyWisdom.author}</cite>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{dailyWisdom.framework} tradition</span>
                </div>
              </div>

              {dailyWisdom.reflection && (
                <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl p-4 border border-blue-500/20">
                  <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                    <Compass className="w-4 h-4" />
                    Reflection Prompt
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {dailyWisdom.reflection}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Wisdom Practices */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Wisdom Practices</h2>
                <p className="text-gray-600 dark:text-gray-300">Enhance your understanding through guided practices</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {enhancedWisdomPractices.map((practice, index) => (
                <motion.div
                  key={practice.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="group cursor-pointer"
                  onClick={() => {
                    setSelectedPractice(practice);
                    setShowPracticeModal(true);
                  }}
                >
                  <div className="h-full p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl backdrop-blur-sm transition-all duration-300 group-hover:shadow-xl">
                    
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                          {practice.aiEnhanced ? <Zap className="w-5 h-5 text-white" /> : <Brain className="w-5 h-5 text-white" />}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{practice.title}</h3>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 bg-gradient-to-r ${getDifficultyColor(practice.difficulty)} text-white text-xs rounded-full`}>
                              {getDifficultyLabel(practice.difficulty)}
                            </span>
                            {practice.aiEnhanced && (
                              <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full">
                                AI Enhanced
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>{practice.duration}m</span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                      {practice.description}
                    </p>

                    {/* Benefits */}
                    <div className="mb-4">
                      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Benefits</div>
                      <div className="flex flex-wrap gap-2">
                        {practice.benefits.slice(0, 3).map((benefit) => (
                          <span
                            key={benefit}
                            className="px-2 py-1 bg-white/10 text-gray-700 dark:text-gray-300 text-xs rounded-full border border-white/20"
                          >
                            {benefit}
                          </span>
                        ))}
                        {practice.benefits.length > 3 && (
                          <span className="px-2 py-1 bg-white/10 text-gray-700 dark:text-gray-300 text-xs rounded-full border border-white/20">
                            +{practice.benefits.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center justify-between">
                      <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200 group-hover:scale-105">
                        <Play className="w-4 h-4" />
                        <span className="text-sm font-medium">Start Practice</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                      
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">4.9</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Hidden Wisdom */}
          {hiddenWisdom && (
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Hidden Wisdom</h2>
                    <p className="text-gray-600 dark:text-gray-300">Deeper insights for advanced practitioners</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Insight</h3>
                    <p className="text-gray-600 dark:text-gray-300">{hiddenWisdom.insight}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Micro-Experiment</h3>
                    <p className="text-gray-600 dark:text-gray-300">{hiddenWisdom.micro_experiment}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Reflection</h3>
                    <p className="text-gray-600 dark:text-gray-300">{hiddenWisdom.reflection}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
} 