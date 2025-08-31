'use client';

import { Leaf, Target, TrendingUp, BookOpen, Zap, Lightbulb, ArrowLeft, Users, Star, Clock, Activity, BarChart3, Compass, Play, MessageSquare, Brain, Shield, Scale, ArrowRight, Heart, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import enhanced widgets
import { HedonicAwarenessWidget } from '../../components/HedonicAwarenessWidget';
import { MoodTrackerWidget } from '../../components/MoodTrackerWidget';
import { BreathworkWidgetNew } from '../../components/BreathworkWidgetNew';
import { HydrationWidget } from '../../components/ModuleWidgets';

interface TemperancePractice {
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

const temperancePractices: TemperancePractice[] = [
  {
    id: "1",
    title: "Mindful Consumption",
    description: "Practice awareness and moderation in all areas of consumption - food, media, shopping, and more.",
    duration: 10,
    difficulty: "beginner",
    benefits: ["Reduced stress", "Better health", "Financial savings", "Mental clarity"],
    category: "Mindfulness Practice",
    instructions: [
      "Pause before consuming anything",
      "Ask if this truly serves you",
      "Practice gratitude for what you have",
      "Set clear boundaries",
      "Reflect on the impact"
    ],
    aiEnhanced: true,
    interactiveElements: ["Consumption tracking", "Mindfulness prompts", "Boundary setting", "Impact analysis"],
    progressTracking: true,
    communityFeatures: true
  },
  {
    id: "2",
    title: "Emotional Regulation",
    description: "Learn to manage emotions with balance and wisdom, avoiding extremes of excess or suppression.",
    duration: 15,
    difficulty: "intermediate",
    benefits: ["Emotional stability", "Better relationships", "Reduced reactivity", "Inner peace"],
    category: "Emotional Practice",
    instructions: [
      "Recognize emotional triggers",
      "Pause and breathe deeply",
      "Observe without judgment",
      "Choose balanced responses",
      "Practice self-compassion"
    ],
    aiEnhanced: true,
    interactiveElements: ["Emotion tracking", "Breathing guidance", "Response coaching", "Pattern recognition"],
    progressTracking: true,
    communityFeatures: true
  },
  {
    id: "3",
    title: "Digital Wellness",
    description: "Create healthy boundaries with technology and digital media consumption.",
    duration: 20,
    difficulty: "intermediate",
    benefits: ["Better focus", "Improved sleep", "Real connections", "Mental clarity"],
    category: "Digital Practice",
    instructions: [
      "Audit your digital habits",
      "Set specific time limits",
      "Create tech-free zones",
      "Practice intentional use",
      "Monitor your well-being"
    ],
    aiEnhanced: true,
    interactiveElements: ["Usage tracking", "Boundary reminders", "Wellness monitoring", "Habit coaching"],
    progressTracking: true,
    communityFeatures: false
  }
];

export default function TemperancePage() {
  const [temperanceStats, setTemperanceStats] = useState({
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0,
    averageScore: 0
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'practices' | 'balance' | 'progress'>('overview');

  useEffect(() => {
    loadTemperanceStats();
  }, []);

  const loadTemperanceStats = async () => {
    // Mock stats for now
    setTemperanceStats({
      totalSessions: 42,
      totalMinutes: 980,
      currentStreak: 15,
      averageScore: 8.7
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
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
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Temperance</h1>
                  <p className="text-gray-600 dark:text-gray-300">The virtue of balance and moderation</p>
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
            <div className="p-6 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-500/20 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{temperanceStats.totalSessions}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Sessions</div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">{temperanceStats.totalMinutes}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Minutes Practiced</div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{temperanceStats.currentStreak}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{temperanceStats.averageScore}</div>
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
                    ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg'
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
                    ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Target className="w-4 h-4" />
                  Practices
                </div>
              </button>
              <button
                onClick={() => setActiveTab('balance')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'balance'
                    ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Leaf className="w-4 h-4" />
                  Balance
                </div>
              </button>
              <button
                onClick={() => setActiveTab('progress')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'progress'
                    ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg'
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
                    {/* Temperance Quote */}
                    <div className="p-8 bg-gradient-to-br from-purple-500/10 via-violet-500/10 to-indigo-500/10 border border-purple-500/20 rounded-2xl backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                          <Lightbulb className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Temperance</h2>
                          <p className="text-gray-600 dark:text-gray-300">Today's reflection on balance</p>
                        </div>
                      </div>

                      <blockquote className="text-xl md:text-2xl font-serif italic text-gray-900 dark:text-white leading-relaxed border-l-4 border-purple-500 pl-6 mb-6">
                        "Moderation in all things, including moderation."
                      </blockquote>

                      <div className="flex items-center justify-between mb-6">
                        <cite className="text-purple-600 dark:text-purple-400 font-medium">— Ralph Waldo Emerson</cite>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Daily reflection</span>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 rounded-xl p-4 border border-purple-500/20">
                        <h4 className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2 flex items-center gap-2">
                          <Compass className="w-4 h-4" />
                          Temperance Challenge
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                          Today, identify one area where you tend to overindulge and practice moderation. Whether it's food, screen time, or emotions, find the middle way.
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
                    {/* Temperance Practices */}
                    <div className="grid grid-cols-1 gap-6">
                      {temperancePractices.map((practice, index) => (
                        <motion.div
                          key={practice.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          className="p-6 bg-white/80 dark:bg-slate-800/80 rounded-2xl backdrop-blur-sm border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                                <Leaf className="w-6 h-6 text-white" />
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
                                  <span key={idx} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                                    {benefit}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Features</h4>
                              <div className="flex flex-wrap gap-2">
                                {practice.interactiveElements.map((element, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs rounded-full">
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
                            <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white rounded-lg font-medium transition-all duration-200">
                              <Play className="w-4 h-4" />
                              Start Practice
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'balance' && (
                  <motion.div
                    key="balance"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Balance Principles */}
                    <div className="p-6 bg-white/80 dark:bg-slate-800/80 rounded-2xl backdrop-blur-sm border border-gray-200 dark:border-slate-700">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Principles of Balance</h2>
                      <p className="text-gray-600 dark:text-gray-300">Understanding the foundations of moderation and harmony.</p>
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
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{temperanceStats.totalSessions}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Practices</div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl border border-violet-200 dark:border-violet-700">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{temperanceStats.currentStreak}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl border border-violet-200 dark:border-violet-700">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Recent Achievements</div>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div>✅ Practiced mindful consumption</div>
                      <div>✅ Maintained emotional balance</div>
                      <div>✅ Reduced digital screen time</div>
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
                  <button className="w-full text-left p-3 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white rounded-xl font-medium transition-all duration-200">
                    <div className="flex items-center gap-2">
                      <Leaf className="w-4 h-4" />
                      Mindful Consumption
                    </div>
                  </button>
                  <button className="w-full text-left p-3 bg-white/10 hover:bg-white/20 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all duration-200">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Emotional Balance
                    </div>
                  </button>
                  <button className="w-full text-left p-3 bg-white/10 hover:bg-white/20 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all duration-200">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Digital Wellness
                    </div>
                  </button>
                </div>
              </div>

              {/* Quote */}
              <div className="bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl p-6 text-white">
                <blockquote className="text-lg italic mb-4">
                  "The greatest wealth is to live content with little."
                </blockquote>
                <cite className="text-sm opacity-90">— Plato</cite>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 