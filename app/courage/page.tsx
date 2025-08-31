'use client';

import { Shield, Target, TrendingUp, BookOpen, Zap, Lightbulb, ArrowLeft, Users, Star, Clock, Activity, BarChart3, Compass, Play, MessageSquare, Brain, Scale, Leaf, ArrowRight, Heart, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import enhanced widgets
import { HedonicAwarenessWidget } from '../../components/HedonicAwarenessWidget';
import { MoodTrackerWidget } from '../../components/MoodTrackerWidget';
import { BreathworkWidgetNew } from '../../components/BreathworkWidgetNew';
import { HydrationWidget } from '../../components/ModuleWidgets';

interface CouragePractice {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  benefits: string[];
  category: string;
  instructions: string[];
  aiEnhanced: boolean;
  interactiveElements: string[];
  progressTracking: boolean;
  communityFeatures: boolean;
}

const couragePractices: CouragePractice[] = [
  {
    id: "1",
    title: "Fear Exposure Training",
    description: "Systematically face your fears through guided exposure exercises designed to build resilience and confidence.",
    duration: 15,
    difficulty: "intermediate",
    benefits: ["Reduced anxiety", "Increased confidence", "Emotional resilience", "Mental strength"],
    category: "Exposure Therapy",
    instructions: [
      "Identify a specific fear or anxiety",
      "Start with small, manageable exposures",
      "Gradually increase difficulty",
      "Practice mindfulness during exposure",
      "Reflect on your progress"
    ],
    aiEnhanced: true,
    interactiveElements: ["Guided exposure", "Progress tracking", "Personalized challenges", "Community support"],
    progressTracking: true,
    communityFeatures: true
  },
  {
    id: "2",
    title: "Adversity Simulation",
    description: "Practice handling difficult situations through realistic simulations that prepare you for real-world challenges.",
    duration: 20,
    difficulty: "advanced",
    benefits: ["Mental preparation", "Stress management", "Decision making", "Crisis handling"],
    category: "Mental Training",
    instructions: [
      "Choose a challenging scenario",
      "Visualize the situation in detail",
      "Practice your response",
      "Review and refine your approach",
      "Apply lessons to real life"
    ],
    aiEnhanced: true,
    interactiveElements: ["Scenario generation", "Response coaching", "Performance analysis", "Adaptive difficulty"],
    progressTracking: true,
    communityFeatures: false
  },
  {
    id: "3",
    title: "Boundary Setting Practice",
    description: "Learn to set and maintain healthy boundaries through guided exercises and real-world applications.",
    duration: 10,
    difficulty: "beginner",
    benefits: ["Self-respect", "Better relationships", "Reduced stress", "Personal empowerment"],
    category: "Interpersonal Skills",
    instructions: [
      "Identify areas where boundaries are needed",
      "Practice clear communication",
      "Learn to say no gracefully",
      "Maintain consistency",
      "Evaluate and adjust"
    ],
    aiEnhanced: true,
    interactiveElements: ["Role-playing", "Communication coaching", "Boundary tracking", "Relationship insights"],
    progressTracking: true,
    communityFeatures: true
  }
];

export default function CouragePage() {
  const [courageStats, setCourageStats] = useState({
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0,
    averageScore: 0
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'practices' | 'challenges' | 'progress'>('overview');

  useEffect(() => {
    loadCourageStats();
  }, []);

  const loadCourageStats = async () => {
    // Mock stats for now
    setCourageStats({
      totalSessions: 34,
      totalMinutes: 890,
      currentStreak: 8,
      averageScore: 7.8
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
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
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/25">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Courage</h1>
                  <p className="text-gray-600 dark:text-gray-300">The strength to face fear and adversity</p>
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
            <div className="p-6 bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">{courageStats.totalSessions}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Sessions</div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{courageStats.totalMinutes}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Minutes Practiced</div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/20 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{courageStats.currentStreak}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{courageStats.averageScore}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Avg Score</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex gap-1 bg-white/80 dark:bg-slate-800/80 rounded-xl p-1 backdrop-blur-sm border border-gray-200 dark:border-slate-700">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'overview'
                    ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Compass className="w-4 h-4" />
                  Overview
                </div>
              </button>
              <button
                onClick={() => setActiveTab('practices')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'practices'
                    ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Target className="w-4 h-4" />
                  Practices
                </div>
              </button>
              <button
                onClick={() => setActiveTab('challenges')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'challenges'
                    ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4" />
                  Challenges
                </div>
              </button>
              <button
                onClick={() => setActiveTab('progress')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'progress'
                    ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Progress
                </div>
              </button>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Courage Quote */}
                    <div className="p-8 bg-gradient-to-br from-red-500/10 via-orange-500/10 to-amber-500/10 border border-red-500/20 rounded-2xl backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/25">
                          <Lightbulb className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Courage</h2>
                          <p className="text-gray-600 dark:text-gray-300">Today's inspiration for bravery</p>
                        </div>
                      </div>

                      <blockquote className="text-xl md:text-2xl font-serif italic text-gray-900 dark:text-white leading-relaxed border-l-4 border-red-500 pl-6 mb-6">
                        "Courage is not the absence of fear, but the triumph over it."
                      </blockquote>

                      <div className="flex items-center justify-between mb-6">
                        <cite className="text-red-600 dark:text-red-400 font-medium">— Nelson Mandela</cite>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Daily inspiration</span>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-xl p-4 border border-red-500/20">
                        <h4 className="text-sm font-semibold text-red-700 dark:text-red-300 mb-2 flex items-center gap-2">
                          <Compass className="w-4 h-4" />
                          Courage Challenge
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                          Today, identify one small fear you can face. It doesn't have to be big - even making an uncomfortable phone call or trying something new counts as an act of courage.
                        </p>
                      </div>
                    </div>

                    {/* Enhanced Widgets */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <BreathworkWidgetNew frameworkTone="spartan" />
                      <MoodTrackerWidget frameworkTone="spartan" />
                      <HedonicAwarenessWidget frameworkTone="spartan" />
                      <HydrationWidget frameworkTone="spartan" />
                    </div>
                  </motion.div>
                )}

                {activeTab === 'practices' && (
                  <motion.div
                    key="practices"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Courage Practices */}
                    <div className="grid grid-cols-1 gap-6">
                      {couragePractices.map((practice, index) => (
                        <motion.div
                          key={practice.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          className="p-6 bg-white/80 dark:bg-slate-800/80 rounded-2xl backdrop-blur-sm border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl flex items-center justify-center">
                                <Shield className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{practice.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300">{practice.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1 bg-gradient-to-r ${getDifficultyColor(practice.difficulty)} text-white text-xs rounded-full font-medium`}>
                                {getDifficultyLabel(practice.difficulty)}
                              </span>
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Clock className="w-4 h-4" />
                                <span>{practice.duration}m</span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Benefits</h4>
                              <div className="flex flex-wrap gap-2">
                                {practice.benefits.map((benefit, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded-full">
                                    {benefit}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Features</h4>
                              <div className="flex flex-wrap gap-2">
                                {practice.interactiveElements.map((element, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs rounded-full">
                                    {element}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {practice.aiEnhanced && (
                                <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs rounded-full">
                                  AI Enhanced
                                </span>
                              )}
                              {practice.communityFeatures && (
                                <span className="px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs rounded-full">
                                  Community
                                </span>
                              )}
                            </div>
                            <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white rounded-lg font-medium transition-all duration-200">
                              <Play className="w-4 h-4" />
                              Start Practice
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'challenges' && (
                  <motion.div
                    key="challenges"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Courage Challenges */}
                    <div className="p-6 bg-white/80 dark:bg-slate-800/80 rounded-2xl backdrop-blur-sm border border-gray-200 dark:border-slate-700">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Daily Courage Challenges</h2>
                      <p className="text-gray-600 dark:text-gray-300">Face your fears one step at a time.</p>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'progress' && (
                  <motion.div
                    key="progress"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Progress tracking and analytics would go here */}
                    <div className="p-6 bg-white/80 dark:bg-slate-800/80 rounded-2xl backdrop-blur-sm border border-gray-200 dark:border-slate-700">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Progress Overview</h2>
                      <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl border border-violet-200 dark:border-violet-700">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{courageStats.totalSessions}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Practices</div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl border border-violet-200 dark:border-violet-700">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{courageStats.currentStreak}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl border border-violet-200 dark:border-violet-700">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Recent Achievements</div>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div>✅ Faced fear of public speaking</div>
                      <div>✅ Started difficult conversation</div>
                      <div>✅ Tried new challenging activity</div>
                    </div>
                  </div>
                </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="p-6 bg-white/80 dark:bg-slate-800/80 rounded-2xl backdrop-blur-sm border border-gray-200 dark:border-slate-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white rounded-xl font-medium transition-all duration-200">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Start Fear Exposure
                    </div>
                  </button>
                  <button className="w-full text-left p-3 bg-white/10 hover:bg-white/20 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all duration-200">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Take Challenge
                    </div>
                  </button>
                  <button className="w-full text-left p-3 bg-white/10 hover:bg-white/20 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all duration-200">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Share Victory
                    </div>
                  </button>
                </div>
              </div>

              {/* Quote */}
              <div className="bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl p-6 text-white">
                <blockquote className="text-lg italic mb-4">
                  "The only thing we have to fear is fear itself."
                </blockquote>
                <cite className="text-sm opacity-90">— Franklin D. Roosevelt</cite>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 