'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Brain, Shield, Scale, Leaf, Info, Zap, Play, 
  BookOpen, Users, Lightbulb, Trophy, Clock, Heart, Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BreathworkWidgetNew } from '@/components/BreathworkWidgetNew';
import { MoodTrackerWidget } from '@/components/MoodTrackerWidget';
import { HedonicAwarenessWidget } from '@/components/HedonicAwarenessWidget';
import FrameworkTerminology from '@/components/FrameworkTerminology';

interface FrameworkDetailPageProps {
  params: {
    slug: string;
  };
}

interface Framework {
  id: string;
  slug: string;
  name: string;
  description: string;
  tone: string;
  virtuePrimary: string;
  virtueSecondary?: string;
  teachingChip: string;
  coreModules?: string[];
  featuredPractices?: string[];
  widgets?: any[];
}

export default function FrameworkDetailPage({ params }: FrameworkDetailPageProps) {
  const [framework, setFramework] = useState<Framework | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock framework data - replace with actual API call
    const mockFramework: Framework = {
      id: '1',
      slug: params.slug,
      name: 'Stoicism',
      description: 'A philosophy that teaches the development of self-control and fortitude as a means of overcoming destructive emotions.',
      tone: 'stoic',
      virtuePrimary: 'wisdom',
      virtueSecondary: 'courage',
      teachingChip: 'Virtue is the only good',
      coreModules: ['Meditation', 'Journaling', 'Mindfulness', 'Self-discipline'],
      featuredPractices: ['evening_reflection', 'critical_analysis', 'moral_courage'],
      widgets: []
    };
    
    setFramework(mockFramework);
    setLoading(false);
  }, [params.slug]);

  const getToneGradient = (tone: string) => {
    const gradients = {
      stoic: 'from-blue-500 to-indigo-600',
      spartan: 'from-red-500 to-orange-600',
      samurai: 'from-gray-500 to-gray-700',
      monastic: 'from-purple-500 to-violet-600',
      yogic: 'from-green-500 to-emerald-600',
      indigenous: 'from-amber-500 to-orange-600',
      martial: 'from-red-600 to-red-800',
      sufi: 'from-blue-600 to-cyan-600',
      ubuntu: 'from-green-600 to-teal-600',
      modern: 'from-indigo-500 to-purple-600'
    };
    return gradients[tone as keyof typeof gradients] || gradients.stoic;
  };

  const getFrameworkIcon = (slug: string) => {
    const icons = {
      stoicism: <Brain className="w-5 h-5 text-white" />,
      spartan: <Shield className="w-5 h-5 text-white" />,
      samurai: <Scale className="w-5 h-5 text-white" />,
      monastic: <Leaf className="w-5 h-5 text-white" />,
      yogic: <Heart className="w-5 h-5 text-white" />,
      indigenous: <Target className="w-5 h-5 text-white" />,
      martial: <Shield className="w-5 h-5 text-white" />,
      sufi: <Heart className="w-5 h-5 text-white" />,
      ubuntu: <Users className="w-5 h-5 text-white" />,
      modern: <Zap className="w-5 h-5 text-white" />
    };
    return icons[slug as keyof typeof icons] || <Brain className="w-5 h-5 text-white" />;
  };

  const renderWidget = (widget: any) => {
    // Widget rendering logic would go here
    return <div key={widget.id}>Widget: {widget.title}</div>;
  };

  const virtueTotals = {
    wisdom: 15,
    courage: 12,
    justice: 8,
    temperance: 10
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white font-medium">Loading framework...</p>
        </div>
      </div>
    );
  }

  if (!framework) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Framework Not Found</h1>
          <Link href="/frameworks" className="text-blue-400 hover:text-blue-300">
            Back to Frameworks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/frameworks"
              className="inline-flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-gray-300 rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Frameworks
            </Link>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-gradient-to-r ${getToneGradient(framework.tone)} rounded-xl flex items-center justify-center shadow-lg`}>
                {getFrameworkIcon(framework.slug)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{framework.name}</h1>
                <p className="text-gray-300 text-sm">{framework.teachingChip}</p>
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
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{virtueTotals.wisdom}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Wisdom</div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{virtueTotals.courage}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Courage</div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{virtueTotals.justice}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Justice</div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-500/20 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{virtueTotals.temperance}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Temperance</div>
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
          <div className="flex space-x-1 bg-white/10 rounded-xl p-1 backdrop-blur-sm">
            {[
              { id: 'overview', label: 'Overview', icon: Info },
              { id: 'practices', label: 'Practices', icon: Target },
              { id: 'resources', label: 'Resources', icon: BookOpen },
              { id: 'progress', label: 'Progress', icon: Trophy }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
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
                  {/* Framework Description */}
                  <div className="p-6 bg-white/80 dark:bg-slate-800/80 rounded-2xl backdrop-blur-sm border border-gray-200 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 bg-gradient-to-r ${getToneGradient(framework.tone)} rounded-xl flex items-center justify-center`}>
                        <Lightbulb className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">About {framework.name}</h2>
                        <p className="text-gray-600 dark:text-gray-300">Core principles and philosophy</p>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {framework.description}
                    </p>
                  </div>

                  {/* Core Modules */}
                  <div className="p-6 bg-white/80 dark:bg-slate-800/80 rounded-2xl backdrop-blur-sm border border-gray-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Core Modules</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {framework.coreModules?.map((module: string, index: number) => (
                        <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{module}</h3>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Featured Practices */}
                  <div className="p-6 bg-white/80 dark:bg-slate-800/80 rounded-2xl backdrop-blur-sm border border-gray-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Featured Practices</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {framework.featuredPractices?.map((practice: string, index: number) => (
                        <div key={index} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{practice.replace('_', ' ')}</h3>
                        </div>
                      ))}
                    </div>
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
                  {/* Enhanced Widgets */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <BreathworkWidgetNew frameworkTone={framework.tone} />
                    <MoodTrackerWidget frameworkTone={framework.tone} />
                    <HedonicAwarenessWidget frameworkTone={framework.tone} />
                  </div>

                  {/* Framework-specific widgets */}
                  {framework.widgets?.map((widget: any, index: number) => (
                    <motion.div
                      key={widget.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      {renderWidget(widget)}
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'resources' && (
                <motion.div
                  key="resources"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <FrameworkTerminology 
                    frameworkSlug={framework.slug}
                    frameworkName={framework.name}
                    frameworkTone={framework.tone}
                  />
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
                          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">12</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Sessions Completed</div>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl border border-violet-200 dark:border-violet-700">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">5</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
                        </div>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl border border-violet-200 dark:border-violet-700">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Recent Achievements</div>
                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                          <div>✅ Completed meditation practice</div>
                          <div>✅ Applied framework principles</div>
                          <div>✅ Shared insights with community</div>
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
            {/* Framework Info */}
            <div className="p-6 bg-white/80 dark:bg-slate-800/80 rounded-2xl backdrop-blur-sm border border-gray-200 dark:border-slate-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                Framework Info
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tone:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{framework.tone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Primary Virtue:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{framework.virtuePrimary}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Slug:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{framework.slug}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 bg-white/80 dark:bg-slate-800/80 rounded-2xl backdrop-blur-sm border border-gray-200 dark:border-slate-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-200">
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Start Practice
                  </div>
                </button>
                <button className="w-full text-left p-3 bg-white/10 hover:bg-white/20 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all duration-200">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    View Resources
                  </div>
                </button>
                <button className="w-full text-left p-3 bg-white/10 hover:bg-white/20 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all duration-200">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Join Community
                  </div>
                </button>
              </div>
            </div>

            {/* Quote */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
              <blockquote className="text-lg italic mb-4">
                "The journey of a thousand miles begins with one step."
              </blockquote>
              <cite className="text-sm opacity-90">— Lao Tzu</cite>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
