'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getToneGradient, getToneTextColor } from '../../lib/tone';
import { getAllFrameworks, type FrameworkConfig } from '../../lib/frameworks.config';
import Link from 'next/link';
import { 
  Sparkles, BookOpen, Target, Users, Star, ArrowRight, 
  Brain, Shield, Scale, Leaf, Flame, Wind, Moon, Sun,
  TrendingUp, Activity, Award, Compass
} from 'lucide-react';

export default function FrameworksPage() {
  const [frameworks, setFrameworks] = useState<FrameworkConfig[]>([]);
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);

  useEffect(() => {
    // Load frameworks from config
    const allFrameworks = getAllFrameworks();
    setFrameworks(allFrameworks);
  }, []);

  const getFrameworkIcon = (slug: string) => {
    switch (slug) {
      case 'spartan':
        return <Shield className="w-6 h-6 text-white" />;
      case 'stoic':
        return <Brain className="w-6 h-6 text-white" />;
      case 'bushido':
        return <Target className="w-6 h-6 text-white" />;
      case 'monastic':
        return <Scale className="w-6 h-6 text-white" />;
      case 'yogic':
        return <Leaf className="w-6 h-6 text-white" />;
      case 'indigenous':
        return <Sun className="w-6 h-6 text-white" />;
      case 'martial':
        return <Target className="w-6 h-6 text-white" />;
      case 'sufi':
        return <Wind className="w-6 h-6 text-white" />;
      case 'zen':
        return <Moon className="w-6 h-6 text-white" />;
      case 'highperf':
        return <TrendingUp className="w-6 h-6 text-white" />;
      default:
        return <BookOpen className="w-6 h-6 text-white" />;
    }
  };

  const getFrameworkEmoji = (slug: string) => {
    switch (slug) {
      case 'spartan':
        return '🛡️';
      case 'stoic':
        return '🧱';
      case 'bushido':
        return '⚔️';
      case 'monastic':
        return '🙏';
      case 'yogic':
        return '🧘';
      case 'indigenous':
        return '🌿';
      case 'martial':
        return '🥋';
      case 'sufi':
        return '🕊️';
      case 'zen':
        return '☸️';
      case 'highperf':
        return '🚀';
      default:
        return '📚';
    }
  };

  const getFrameworkColor = (slug: string) => {
    switch (slug) {
      case 'spartan':
        return 'from-red-500 to-orange-500';
      case 'stoic':
        return 'from-blue-500 to-indigo-500';
      case 'bushido':
        return 'from-gray-700 to-gray-900';
      case 'monastic':
        return 'from-purple-500 to-violet-500';
      case 'yogic':
        return 'from-green-500 to-emerald-500';
      case 'indigenous':
        return 'from-amber-500 to-orange-500';
      case 'martial':
        return 'from-slate-500 to-gray-500';
      case 'sufi':
        return 'from-teal-500 to-cyan-500';
      case 'zen':
        return 'from-stone-500 to-neutral-500';
      case 'highperf':
        return 'from-blue-500 to-indigo-500';
      default:
        return 'from-blue-500 to-indigo-500';
    }
  };

  const getFrameworkGradient = (slug: string) => {
    const color = getFrameworkColor(slug);
    return `bg-gradient-to-br ${color}/10 border-${color.split('-')[1]}-500/20`;
  };

  const getFrameworkDescription = (framework: FrameworkConfig) => {
    const descriptions: Record<string, string> = {
      spartan: 'Embrace hardship and build unbreakable character through disciplined training and mental fortitude.',
      stoic: 'Find inner peace through rational thinking, self-control, and acceptance of what you cannot change.',
      bushido: 'Live with honor, loyalty, and courage. The way of the warrior emphasizes moral character and ethical behavior.',
      monastic: 'Seek spiritual growth through contemplation, simplicity, and devotion to higher principles.',
      yogic: 'Achieve harmony of body, mind, and spirit through conscious practice and spiritual awareness.',
      indigenous: 'Honor the interconnectedness of all life and live in harmony with nature and community.',
      martial: 'Develop mental and physical discipline through focused training and continuous improvement.',
      sufi: 'Seek divine love and spiritual transformation through mystical practices and inner awakening.',
      zen: 'Find enlightenment through meditation, mindfulness, and direct experience of reality.',
      highperf: 'Optimize your performance through systematic training, biofeedback, and continuous improvement.'
    };
    return descriptions[framework.slug] || 'A philosophical framework for personal growth and development.';
  };

  const getCoreModules = (framework: FrameworkConfig) => {
    const modules: Record<string, string[]> = {
      spartan: ['strength', 'discipline', 'courage'],
      stoic: ['wisdom', 'temperance', 'reflection'],
      bushido: ['honor', 'loyalty', 'courage'],
      monastic: ['contemplation', 'simplicity', 'devotion'],
      yogic: ['balance', 'awareness', 'unity'],
      indigenous: ['connection', 'stewardship', 'wisdom'],
      martial: ['focus', 'discipline', 'skill'],
      sufi: ['love', 'devotion', 'transformation'],
      zen: ['mindfulness', 'meditation', 'enlightenment'],
      highperf: ['optimization', 'biofeedback', 'improvement']
    };
    return modules[framework.slug] || ['growth', 'development', 'practice'];
  };

  const getFeaturedPractices = (framework: FrameworkConfig) => {
    const practices: Record<string, string[]> = {
      spartan: ['cold_exposure', 'adversity_training'],
      stoic: ['evening_reflection', 'memento_mori'],
      bushido: ['meditation', 'martial_arts'],
      monastic: ['prayer', 'meditation'],
      yogic: ['yoga', 'pranayama'],
      indigenous: ['nature_connection', 'ceremony'],
      martial: ['training', 'meditation'],
      sufi: ['dhikr', 'meditation'],
      zen: ['zazen', 'mindfulness'],
      highperf: ['flow_timer', 'biofeedback']
    };
    return practices[framework.slug] || ['meditation', 'reflection'];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <motion.div 
            className="mb-12 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Philosophical Frameworks</h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">Choose your path to wisdom and growth</p>
              </div>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Explore ancient and modern philosophical traditions that have guided humanity's greatest thinkers and practitioners. 
              Each framework offers unique insights and practices for personal development.
            </p>
          </motion.div>

          {/* Frameworks Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {frameworks.map((framework, index) => (
              <motion.div
                key={framework.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group cursor-pointer"
                onClick={() => setSelectedFramework(selectedFramework === framework.slug ? null : framework.slug)}
              >
                <div className={`h-full p-6 rounded-2xl ${getFrameworkGradient(framework.slug)} backdrop-blur-sm border transition-all duration-300 group-hover:shadow-xl`}>
                  
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-gradient-to-r ${getFrameworkColor(framework.slug)} rounded-xl flex items-center justify-center shadow-lg`}>
                        {getFrameworkIcon(framework.slug)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{framework.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getFrameworkEmoji(framework.slug)}</span>
                          <span className="text-sm text-gray-300">{framework.teachingChip}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400 uppercase tracking-wide">Framework</div>
                      <div className="text-sm text-white font-medium">{framework.tone}</div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    {getFrameworkDescription(framework)}
                  </p>

                  {/* Core Modules */}
                  <div className="mb-6">
                    <div className="text-xs text-gray-400 uppercase tracking-wide mb-3">Core Modules</div>
                    <div className="flex flex-wrap gap-2">
                      {getCoreModules(framework).map((module) => (
                        <span
                          key={module}
                          className="px-3 py-1 bg-white/10 text-white text-xs rounded-full border border-white/20"
                        >
                          {module}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Featured Practices */}
                  <div className="mb-6">
                    <div className="text-xs text-gray-400 uppercase tracking-wide mb-3">Featured Practices</div>
                    <div className="flex flex-wrap gap-2">
                      {getFeaturedPractices(framework).map((practice) => (
                        <span
                          key={practice}
                          className="px-3 py-1 bg-white/5 text-gray-300 text-xs rounded-full border border-white/10"
                        >
                          {practice.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/frameworks/${framework.slug}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 group-hover:scale-105"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span className="text-sm font-medium">Explore</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-400">4.8</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action */}
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 backdrop-blur-sm">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/25">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Ready to Begin Your Journey?
              </h2>
              <p className="text-gray-300 mb-6">
                Take our personality assessment to discover which framework aligns best with your values and goals.
              </p>
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105"
              >
                <Award className="w-5 h-5" />
                Start Assessment
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 