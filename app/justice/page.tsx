'use client';

import { Scale, Target, TrendingUp, BookOpen, Zap, Lightbulb, ArrowLeft, Users, Star, Clock, Activity, BarChart3, Compass, Play, MessageSquare, Brain, Shield, Leaf, ArrowRight, Heart, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import enhanced widgets
import { HedonicAwarenessWidget } from '../../components/HedonicAwarenessWidget';
import { MoodTrackerWidget } from '../../components/MoodTrackerWidget';
import { BreathworkWidgetNew } from '../../components/BreathworkWidgetNew';
import { HydrationWidget } from '../../components/ModuleWidgets';

interface JusticePractice {
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

const justicePractices: JusticePractice[] = [
  {
    id: "1",
    title: "Fairness Reflection",
    description: "Examine your decisions and actions through the lens of fairness and justice.",
    duration: 15,
    difficulty: "beginner",
    benefits: ["Better decision making", "Increased empathy", "Fair treatment", "Moral clarity"],
    category: "Reflection Practice",
    instructions: [
      "Review recent decisions you've made",
      "Consider how they affect others",
      "Ask if the outcome is fair",
      "Identify areas for improvement",
      "Plan more just future actions"
    ],
    aiEnhanced: true,
    interactiveElements: ["Guided reflection", "Decision analysis", "Fairness assessment", "Action planning"],
    progressTracking: true,
    communityFeatures: true
  },
  {
    id: "2",
    title: "Conflict Resolution Training",
    description: "Learn to mediate conflicts and find fair solutions that benefit all parties.",
    duration: 25,
    difficulty: "intermediate",
    benefits: ["Conflict resolution", "Communication skills", "Empathy development", "Leadership"],
    category: "Interpersonal Skills",
    instructions: [
      "Identify the core issues in a conflict",
      "Listen to all perspectives",
      "Find common ground",
      "Propose fair solutions",
      "Follow up on outcomes"
    ],
    aiEnhanced: true,
    interactiveElements: ["Scenario practice", "Role-playing", "Solution generation", "Outcome tracking"],
    progressTracking: true,
    communityFeatures: true
  },
  {
    id: "3",
    title: "Ethical Decision Framework",
    description: "Develop a systematic approach to making ethical decisions in complex situations.",
    duration: 20,
    difficulty: "advanced",
    benefits: ["Ethical clarity", "Consistent decision making", "Moral courage", "Leadership integrity"],
    category: "Ethical Practice",
    instructions: [
      "Identify the ethical dilemma",
      "Consider all stakeholders",
      "Apply ethical principles",
      "Evaluate consequences",
      "Choose the most just action"
    ],
    aiEnhanced: true,
    interactiveElements: ["Case studies", "Ethical analysis", "Principle application", "Outcome evaluation"],
    progressTracking: true,
    communityFeatures: false
  }
];

export default function JusticePage() {
  const [justiceStats, setJusticeStats] = useState({
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0,
    averageScore: 0
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'practices' | 'principles' | 'progress'>('overview');

  useEffect(() => {
    loadJusticeStats();
  }, []);

  const loadJusticeStats = async () => {
    // Mock stats for now
    setJusticeStats({
      totalSessions: 28,
      totalMinutes: 720,
      currentStreak: 6,
      averageScore: 8.2
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
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
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Justice</h1>
                  <p className="text-gray-600 dark:text-gray-300">The virtue of fairness and moral rightness</p>
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
            <div className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{justiceStats.totalSessions}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Sessions</div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{justiceStats.totalMinutes}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Minutes Practiced</div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border border-teal-500/20 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">{justiceStats.currentStreak}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-green-500/10 border border-cyan-500/20 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{justiceStats.averageScore}</div>
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
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
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
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Target className="w-4 h-4" />
                  Practices
                </div>
              </button>
              <button
                onClick={() => setActiveTab('principles')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'principles'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Scale className="w-4 h-4" />
                  Principles
                </div>
              </button>
              <button
                onClick={() => setActiveTab('progress')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'progress'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
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
                    {/* Justice Quote */}
                    <div className="p-8 bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 border border-green-500/20 rounded-2xl backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
                          <Lightbulb className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Justice</h2>
                          <p className="text-gray-600 dark:text-gray-300">Today's reflection on fairness</p>
                        </div>
                      </div>

                      <blockquote className="text-xl md:text-2xl font-serif italic text-gray-900 dark:text-white leading-relaxed border-l-4 border-green-500 pl-6 mb-6">
                        "Justice is the constant and perpetual will to allot to every man his due."
                      </blockquote>

                      <div className="flex items-center justify-between mb-6">
                        <cite className="text-green-600 dark:text-green-400 font-medium">— Justinian I</cite>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Daily reflection</span>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
                        <h4 className="text-sm font-semibold text-green-700 dark:text-green-300 mb-2 flex items-center gap-2">
                          <Compass className="w-4 h-4" />
                          Justice Challenge
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                          Today, examine one decision you made and ask yourself: "Was this fair to everyone involved?" Consider how you might have acted more justly.
                        </p>
                      </div>
                    </div>

                    {/* Enhanced Widgets */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <BreathworkWidgetNew frameworkTone="stoic" />
                      <MoodTrackerWidget frameworkTone="stoic" />
                      <HedonicAwarenessWidget frameworkTone="stoic" />
                      <HydrationWidget frameworkTone="stoic" />
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
                    {/* Justice Practices */}
                    <div className="grid grid-cols-1 gap-6">
                      {justicePractices.map((practice, index) => (
                        <motion.div
                          key={practice.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          className="p-6 bg-white/80 dark:bg-slate-800/80 rounded-2xl backdrop-blur-sm border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                <Scale className="w-6 h-6 text-white" />
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
                                  <span key={idx} className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
                                    {benefit}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Features</h4>
                              <div className="flex flex-wrap gap-2">
                                {practice.interactiveElements.map((element, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs rounded-full">
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
                            <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-medium transition-all duration-200">
                              <Play className="w-4 h-4" />
                              Start Practice
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'principles' && (
                  <motion.div
                    key="principles"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Justice Principles */}
                    <div className="p-6 bg-white/80 dark:bg-slate-800/80 rounded-2xl backdrop-blur-sm border border-gray-200 dark:border-slate-700">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Core Principles of Justice</h2>
                      <p className="text-gray-600 dark:text-gray-300">Understanding the foundations of fairness and moral rightness.</p>
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
                      <p className="text-gray-600 dark:text-gray-300">Detailed progress tracking and analytics coming soon.</p>
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
                  <button className="w-full text-left p-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-medium transition-all duration-200">
                    <div className="flex items-center gap-2">
                      <Scale className="w-4 h-4" />
                      Fairness Reflection
                    </div>
                  </button>
                  <button className="w-full text-left p-3 bg-white/10 hover:bg-white/20 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all duration-200">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Conflict Resolution
                    </div>
                  </button>
                  <button className="w-full text-left p-3 bg-white/10 hover:bg-white/20 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all duration-200">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Ethical Decision
                    </div>
                  </button>
                </div>
              </div>

              {/* Quote */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
                <blockquote className="text-lg italic mb-4">
                  "Justice will not be served until those who are unaffected are as outraged as those who are."
                </blockquote>
                <cite className="text-sm opacity-90">— Benjamin Franklin</cite>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 