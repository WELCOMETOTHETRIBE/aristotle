'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getToneGradient, getToneTextColor } from '../../lib/tone';
import Link from 'next/link';
import { 
  Sparkles, BookOpen, Target, Users, Star, ArrowRight, 
  Brain, Shield, Scale, Leaf, Flame, Wind, Moon, Sun,
  TrendingUp, Activity, Award, Compass
} from 'lucide-react';

interface Framework {
  id: string;
  name: string;
  nav: {
    tone: string;
    badge: string;
    emoji: string;
  };
  coreModules: string[];
  featuredPractices: string[];
  description?: string;
  color?: string;
  gradient?: string;
}

const frameworkData: Framework[] = [
  {
    id: 'spartan',
    name: 'Spartan Agōgē',
    nav: { tone: 'gritty', badge: 'Discipline', emoji: '🛡️' },
    coreModules: ['strength', 'discipline', 'courage'],
    featuredPractices: ['cold_exposure', 'adversity_training'],
    description: 'Embrace hardship and build unbreakable character through disciplined training and mental fortitude.',
    color: 'from-red-500 to-orange-500',
    gradient: 'bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20'
  },
  {
    id: 'stoic',
    name: 'Stoicism',
    nav: { tone: 'calm', badge: 'Clarity', emoji: '🧱' },
    coreModules: ['wisdom', 'temperance', 'reflection'],
    featuredPractices: ['evening_reflection', 'memento_mori'],
    description: 'Find inner peace through rational thinking, self-control, and acceptance of what you cannot change.',
    color: 'from-blue-500 to-indigo-500',
    gradient: 'bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-500/20'
  },
  {
    id: 'bushido',
    name: 'Bushido',
    nav: { tone: 'honorable', badge: 'Honor', emoji: '⚔️' },
    coreModules: ['honor', 'loyalty', 'courage'],
    featuredPractices: ['meditation', 'martial_arts'],
    description: 'Live with honor, loyalty, and courage. The way of the warrior emphasizes moral character and ethical behavior.',
    color: 'from-gray-700 to-gray-900',
    gradient: 'bg-gradient-to-br from-gray-700/10 to-gray-900/10 border-gray-700/20'
  },
  {
    id: 'monastic',
    name: 'Monastic',
    nav: { tone: 'contemplative', badge: 'Wisdom', emoji: '🙏' },
    coreModules: ['contemplation', 'simplicity', 'devotion'],
    featuredPractices: ['prayer', 'meditation'],
    description: 'Seek spiritual growth through contemplation, simplicity, and devotion to higher principles.',
    color: 'from-purple-500 to-violet-500',
    gradient: 'bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/20'
  },
  {
    id: 'yogic',
    name: 'Yogic',
    nav: { tone: 'harmonious', badge: 'Balance', emoji: '🧘' },
    coreModules: ['balance', 'awareness', 'unity'],
    featuredPractices: ['yoga', 'pranayama'],
    description: 'Achieve harmony of body, mind, and spirit through conscious practice and spiritual awareness.',
    color: 'from-green-500 to-emerald-500',
    gradient: 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20'
  },
  {
    id: 'indigenous',
    name: 'Indigenous',
    nav: { tone: 'connected', badge: 'Connection', emoji: '🌿' },
    coreModules: ['connection', 'stewardship', 'wisdom'],
    featuredPractices: ['nature_connection', 'ceremony'],
    description: 'Honor the interconnectedness of all life and live in harmony with nature and community.',
    color: 'from-amber-500 to-orange-500',
    gradient: 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20'
  },
  {
    id: 'martial',
    name: 'Martial',
    nav: { tone: 'focused', badge: 'Focus', emoji: '🥋' },
    coreModules: ['focus', 'discipline', 'skill'],
    featuredPractices: ['training', 'meditation'],
    description: 'Develop mental and physical discipline through focused training and continuous improvement.',
    color: 'from-slate-500 to-gray-500',
    gradient: 'bg-gradient-to-br from-slate-500/10 to-gray-500/10 border-slate-500/20'
  },
  {
    id: 'sufi',
    name: 'Sufi',
    nav: { tone: 'mystical', badge: 'Love', emoji: '💫' },
    coreModules: ['love', 'devotion', 'mysticism'],
    featuredPractices: ['dhikr', 'meditation'],
    description: 'Seek divine love and spiritual enlightenment through devotion, prayer, and mystical practices.',
    color: 'from-rose-500 to-pink-500',
    gradient: 'bg-gradient-to-br from-rose-500/10 to-pink-500/10 border-rose-500/20'
  },
  {
    id: 'ubuntu',
    name: 'Ubuntu',
    nav: { tone: 'communal', badge: 'Community', emoji: '🤝' },
    coreModules: ['community', 'compassion', 'interconnectedness'],
    featuredPractices: ['service', 'dialogue'],
    description: 'Recognize that we are because others are. Build community through compassion and mutual support.',
    color: 'from-teal-500 to-cyan-500',
    gradient: 'bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border-teal-500/20'
  },
  {
    id: 'highperf',
    name: 'High Performance',
    nav: { tone: 'driven', badge: 'Excellence', emoji: '🚀' },
    coreModules: ['excellence', 'optimization', 'growth'],
    featuredPractices: ['goal_setting', 'optimization'],
    description: 'Achieve peak performance through systematic optimization, goal setting, and continuous growth.',
    color: 'from-indigo-500 to-purple-500',
    gradient: 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20'
  }
];

export default function FrameworksPage() {
  const [frameworks, setFrameworks] = useState<Framework[]>(frameworkData);
  const [loading, setLoading] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);

  useEffect(() => {
    const loadFrameworks = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('/api/frameworks');
        if (response.ok) {
          const data = await response.json();
          setFrameworks(data);
        }
      } catch (err) {
        console.error('Error loading frameworks:', err);
        // Keep using fallback frameworks
      } finally {
        setLoading(false);
      }
    };

    loadFrameworks();
  }, []);

  const getFrameworkIcon = (frameworkId: string) => {
    const icons: Record<string, React.ReactNode> = {
      spartan: <Shield className="w-6 h-6" />,
      stoic: <Brain className="w-6 h-6" />,
      bushido: <Scale className="w-6 h-6" />,
      monastic: <Leaf className="w-6 h-6" />,
      yogic: <Wind className="w-6 h-6" />,
      indigenous: <Sun className="w-6 h-6" />,
      martial: <Target className="w-6 h-6" />,
      sufi: <Moon className="w-6 h-6" />,
      ubuntu: <Users className="w-6 h-6" />,
      highperf: <TrendingUp className="w-6 h-6" />
    };
    return icons[frameworkId] || <Star className="w-6 h-6" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Compass className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Ancient Wisdom Frameworks
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover timeless philosophical traditions and choose the path that resonates with your journey toward flourishing and intentional living.
            </p>
          </motion.div>

          {/* Frameworks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {frameworks.map((framework, index) => (
              <motion.div
                key={framework.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group cursor-pointer"
                onClick={() => setSelectedFramework(selectedFramework === framework.id ? null : framework.id)}
              >
                <div className={`h-full p-6 rounded-2xl ${framework.gradient} backdrop-blur-sm border transition-all duration-300 group-hover:shadow-xl`}>
                  
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-gradient-to-r ${framework.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        {getFrameworkIcon(framework.id)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{framework.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{framework.nav.emoji}</span>
                          <span className="text-sm text-gray-300">{framework.nav.badge}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400 uppercase tracking-wide">Framework</div>
                      <div className="text-sm text-white font-medium">{framework.nav.tone}</div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    {framework.description}
                  </p>

                  {/* Core Modules */}
                  <div className="mb-6">
                    <div className="text-xs text-gray-400 uppercase tracking-wide mb-3">Core Modules</div>
                    <div className="flex flex-wrap gap-2">
                      {framework.coreModules.map((module) => (
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
                      {framework.featuredPractices.map((practice) => (
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
                      href={`/frameworks/${framework.id}`}
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
          </div>

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