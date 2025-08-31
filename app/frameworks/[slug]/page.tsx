'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getToneGradient, getToneTextColor } from '../../../lib/tone';
import { getFrameworkBySlug } from '../../../lib/frameworks.config';
import { getPersonaByKey } from '../../../lib/ai/personas';
import { VirtueTotals } from '../../../lib/virtue';
import { Quest } from '../../../lib/quest-engine';
import Link from 'next/link';
import { 
  Trophy, Target, TrendingUp, BookOpen, Zap, Info, Brain, Shield, Scale, Leaf, 
  ArrowLeft, Users, Star, Clock, Activity, BarChart3, Compass, Lightbulb,
  ChevronRight, ChevronDown, Play, Pause, SkipForward, Heart, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import WidgetGuard from '../../../components/WidgetGuard';
import FrameworkTerminology from '../../../components/FrameworkTerminology';
import MilestonesDropdown from '../../../components/MilestonesDropdown';
import { getVirtueEmoji, getVirtueColor, getVirtueGradient } from '../../../lib/virtue';

// Import enhanced widgets
import { HedonicAwarenessWidget } from '../../../components/HedonicAwarenessWidget';
import { MoodTrackerWidget } from '../../../components/MoodTrackerWidget';
import { BreathworkWidgetNew } from '../../../components/BreathworkWidgetNew';
import { HydrationWidget, NaturePhotoLogWidget } from '../../../components/ModuleWidgets';
import TimerCard from '../../../components/widgets/TimerCard';
import CounterCard from '../../../components/widgets/CounterCard';

interface FrameworkDetailPageProps {
  params: { slug: string };
}

export default function FrameworkDetailPage({ params }: FrameworkDetailPageProps) {
  const [framework, setFramework] = useState<any>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [completedWidgets, setCompletedWidgets] = useState<string[]>([]);
  const [virtueTotals, setVirtueTotals] = useState<VirtueTotals>({
    wisdom: 45,
    justice: 32,
    courage: 28,
    temperance: 38
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWidgetInfo, setShowWidgetInfo] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'practices' | 'resources' | 'progress'>('overview');

  useEffect(() => {
    const loadFrameworkData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load framework config
        const frameworkConfig = getFrameworkBySlug(params.slug);
        if (!frameworkConfig) {
          throw new Error('Framework not found');
        }
        setFramework(frameworkConfig);

        // Load quests
        const questResponse = await fetch(`/api/plan/today?frameworkSlug=${params.slug}`);
        if (questResponse.ok) {
          const questData = await questResponse.json();
          setQuests(questData.quests);
          setVirtueTotals(questData.userVirtues);
        }

        // Load progress summary
        const progressResponse = await fetch(`/api/progress/summary?frameworkSlug=${params.slug}`);
        if (progressResponse.ok) {
          const progressData = await progressResponse.json();
          setVirtueTotals(progressData.virtueTotals);
        }

      } catch (err) {
        console.error('Error loading framework data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load framework');
      } finally {
        setLoading(false);
      }
    };

    loadFrameworkData();
  }, [params.slug]);

  const handleWidgetComplete = async (widgetId: string, payload: any) => {
    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          widgetId,
          frameworkSlug: params.slug,
          payload
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCompletedWidgets(prev => [...prev, widgetId]);
        
        // Update virtue totals
        if (data.checkin.virtues) {
          setVirtueTotals(prev => ({
            wisdom: prev.wisdom + (data.checkin.virtues.wisdom || 0),
            justice: prev.justice + (data.checkin.virtues.justice || 0),
            courage: prev.courage + (data.checkin.virtues.courage || 0),
            temperance: prev.temperance + (data.checkin.virtues.temperance || 0)
          }));
        }
      }
    } catch (error) {
      console.error('Error completing widget:', error);
    }
  };

  const getVirtueIcon = (virtue: string) => {
    switch (virtue.toLowerCase()) {
      case 'wisdom':
        return Brain;
      case 'courage':
        return Shield;
      case 'justice':
        return Scale;
      case 'temperance':
        return Leaf;
      default:
        return Brain;
    }
  };

  const getVirtueIconColor = (virtue: string) => {
    switch (virtue.toLowerCase()) {
      case 'wisdom':
        return 'from-blue-400 to-cyan-400';
      case 'courage':
        return 'from-red-400 to-orange-400';
      case 'justice':
        return 'from-green-400 to-emerald-400';
      case 'temperance':
        return 'from-purple-400 to-violet-400';
      default:
        return 'from-blue-400 to-cyan-400';
    }
  };

  const renderWidget = (widget: any) => {
    return (
      <WidgetGuard
        widget={widget}
        framework={framework}
        onComplete={(payload) => handleWidgetComplete(widget.id, payload)}
      >
        {(normalizedWidget: any, onComplete: any) => {
          const commonProps = {
            title: normalizedWidget.title,
            config: normalizedWidget.config,
            onComplete,
            virtueGrantPerCompletion: normalizedWidget.virtueGrantPerCompletion
          };

          const widgetComponent = (() => {
            switch (normalizedWidget.kind) {
              case 'TIMER':
                return <TimerCard {...commonProps} />;
              case 'COUNTER':
                return <CounterCard {...commonProps} />;
              case 'BREATH':
                return <BreathworkWidgetNew frameworkTone={framework.tone} />;
              case 'HYDRATION':
                return <HydrationWidget frameworkTone={framework.tone} />;
              case 'PHOTO':
                return <NaturePhotoLogWidget frameworkTone={framework.tone} />;
              case 'JOURNAL':
              case 'AUDIO_NOTE':
              case 'WHEEL':
              case 'DRAG_BOARD':
              case 'CHECKLIST':
              case 'BALANCE_GYRO':
              case 'SLIDERS':
                return (
                  <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-white/10">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">{normalizedWidget.title}</h3>
                        <p className="text-sm text-gray-400">{normalizedWidget.config.teaching}</p>
                      </div>
                    </div>
                    <div className="text-center py-8 text-gray-400">
                      <div className="text-sm mb-4">
                        <p className="mb-2"><strong>Widget Type:</strong> {normalizedWidget.kind}</p>
                        {normalizedWidget.config.prompt && (
                          <p className="mb-2"><strong>Prompt:</strong> {normalizedWidget.config.prompt}</p>
                        )}
                        {normalizedWidget.config.minWords && (
                          <p className="mb-2"><strong>Min Words:</strong> {normalizedWidget.config.minWords}</p>
                        )}
                      </div>
                      <Button
                        onClick={() => onComplete({ completed: true })}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      >
                        Complete Practice
                      </Button>
                    </div>
                  </div>
                );
              default:
                return (
                  <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                    <div className="text-center py-8 text-gray-400">
                      <p>Widget type "{normalizedWidget.kind}" not implemented yet.</p>
                      <Button
                        onClick={() => onComplete({ completed: true })}
                        className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      >
                        Mark Complete
                      </Button>
                    </div>
                  </div>
                );
            }
          })();

          return (
            <motion.div
              key={normalizedWidget.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="h-full"
            >
              {widgetComponent}
            </motion.div>
          );
        }}
      </WidgetGuard>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-white/20 rounded mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="h-64 bg-white/10 rounded-xl"></div>
                  <div className="h-48 bg-white/10 rounded-xl"></div>
                </div>
                <div className="space-y-6">
                  <div className="h-48 bg-white/10 rounded-xl"></div>
                  <div className="h-64 bg-white/10 rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !framework) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="p-8 bg-white/80 dark:bg-slate-800/80 rounded-2xl backdrop-blur-sm border border-gray-200 dark:border-slate-700">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Framework Not Found</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{error || 'The requested framework could not be found.'}</p>
              <Link
                href="/frameworks"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Frameworks
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
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
                href="/frameworks"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </Link>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 bg-gradient-to-r ${getToneGradient(framework.tone)} rounded-xl flex items-center justify-center shadow-lg`}>
                  <span className="text-2xl">{framework.nav.emoji}</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{framework.name}</h1>
                  <p className="text-gray-600 dark:text-gray-300">{framework.description}</p>
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
            <div className="flex gap-1 bg-white/80 dark:bg-slate-800/80 rounded-xl p-1 backdrop-blur-sm border border-gray-200 dark:border-slate-700">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'overview'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
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
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Target className="w-4 h-4" />
                  Practices
                </div>
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'resources'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Resources
                </div>
              </button>
              <button
                onClick={() => setActiveTab('progress')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'progress'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
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
                      <HydrationWidget frameworkTone={framework.tone} />
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
                    {/* FrameworkResourceSpotlight framework={framework} /> */}
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
                    <span className="text-sm text-gray-600 dark:text-gray-400">Badge:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{framework.nav.badge}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Emoji:</span>
                    <span className="text-2xl">{framework.nav.emoji}</span>
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
    </div>
  );
} 