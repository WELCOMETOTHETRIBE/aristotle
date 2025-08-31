'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/nav/Header';
import { TabBar } from '@/components/nav/TabBar';
import { GuideFAB } from '@/components/ai/GuideFAB';
import { Search, BookOpen, Clock, Target, Shield, Brain, Heart, Users, Zap, Leaf, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Framework {
  id: string;
  name: string;
  nav: {
    tone: string;
    badge: string;
    emoji: string;
  };
  coreModules: string[];
  supportModules: string[];
  featuredPractices: string[];
}

const frameworks: Framework[] = [
  {
    id: 'spartan',
    name: 'Spartan Agōgē',
    nav: { tone: 'gritty', badge: 'Discipline', emoji: '🛡️' },
    coreModules: ['cold_heat', 'strength', 'fasting', 'focus_deepwork', 'movement_posture', 'virtue_cultivation'],
    supportModules: ['sleep_circadian', 'hydration', 'mood_regulation', 'tribal_challenges', 'longevity', 'meditation'],
    featuredPractices: ['spartan_discipline', 'cold_exposure_training', 'adversity_training', 'failure_resilience', 'leadership_development']
  },
  {
    id: 'bushido',
    name: 'Samurai Bushidō',
    nav: { tone: 'honor', badge: 'Rectitude', emoji: '🗡️' },
    coreModules: ['etiquette_presence', 'meditation', 'movement_posture', 'conflict_debate', 'focus_deepwork'],
    supportModules: ['gratitude_awe', 'mentorship_teaching', 'virtue_cultivation', 'sleep_circadian', 'strength', 'breathwork'],
    featuredPractices: ['samurai_bushido', 'bushido_attentiveness', 'bushido_mediation', 'bushido_justice', 'contemplative_reading']
  },
  {
    id: 'stoic',
    name: 'Stoicism',
    nav: { tone: 'calm', badge: 'Clarity', emoji: '🧱' },
    coreModules: ['memento_mori', 'mood_regulation', 'virtue_cultivation', 'focus_deepwork', 'philosophy_capsules'],
    supportModules: ['meditation', 'service_contribution', 'sleep_circadian', 'fasting', 'resource_library', 'gratitude_awe'],
    featuredPractices: ['evening_reflection', 'critical_analysis', 'intellectual_humility', 'socratic_dialogue', 'moral_courage']
  },
  {
    id: 'monastic',
    name: 'Monastic Rule',
    nav: { tone: 'order', badge: 'Stability', emoji: '⛪' },
    coreModules: ['meditation', 'service_contribution', 'focus_deepwork', 'gratitude_awe', 'sleep_circadian'],
    supportModules: ['fasting', 'etiquette_presence', 'resource_library', 'philosophy_capsules', 'mood_regulation', 'longevity'],
    featuredPractices: ['contemplative_reading', 'evening_reflection', 'community_service', 'ocean_breath_harmony', 'mindful_observation']
  },
  {
    id: 'yogic',
    name: 'Yogic Path',
    nav: { tone: 'embodied', badge: 'Union', emoji: '🧘' },
    coreModules: ['flexibility', 'breathwork', 'meditation', 'movement_posture', 'mood_regulation'],
    supportModules: ['hydration', 'sleep_circadian', 'gratitude_awe', 'creative_spark', 'longevity', 'virtue_cultivation'],
    featuredPractices: ['coherent_breathing_balance', 'ocean_breath_harmony', 'triangle_breathing_simplicity', 'box_breathing_temperance', 'mindful_observation']
  },
  {
    id: 'indigenous',
    name: 'Indigenous Wisdom',
    nav: { tone: 'stewardship', badge: 'Cycles', emoji: '🌿' },
    coreModules: ['gratitude_awe', 'service_contribution', 'longevity', 'tribal_challenges', 'etiquette_presence'],
    supportModules: ['hydration', 'movement_posture', 'resource_library', 'virtue_cultivation', 'sleep_circadian'],
    featuredPractices: ['indigenous_wisdom_sharing', 'indigenous_attentiveness', 'indigenous_mediation', 'indigenous_mentorship', 'indigenous_justice']
  },
  {
    id: 'martial',
    name: 'Martial Arts Code',
    nav: { tone: 'disciplined', badge: 'Etiquette', emoji: '🥋' },
    coreModules: ['movement_posture', 'breathwork', 'conflict_debate', 'focus_deepwork', 'strength'],
    supportModules: ['meditation', 'mood_regulation', 'hydration', 'sleep_circadian', 'flexibility', 'virtue_cultivation'],
    featuredPractices: ['adversity_training', 'boundary_setting', 'box_breathing_temperance', 'coherent_breathing_balance', 'public_speaking']
  },
  {
    id: 'sufi',
    name: 'Sufi Practice',
    nav: { tone: 'devotional', badge: 'Remembrance', emoji: '🕊️' },
    coreModules: ['mood_regulation', 'meditation', 'gratitude_awe', 'service_contribution', 'philosophy_capsules'],
    supportModules: ['breathwork', 'creative_spark', 'sleep_circadian', 'virtue_cultivation', 'resource_library'],
    featuredPractices: ['mindful_observation', 'wisdom_journaling', 'evening_reflection', 'sufi_guidance', 'sufi_remembrance']
  },
  {
    id: 'ubuntu',
    name: 'Ubuntu',
    nav: { tone: 'communal', badge: 'Humanity', emoji: '🤝' },
    coreModules: ['service_contribution', 'active_listening', 'tribal_challenges', 'mentorship_teaching', 'etiquette_presence'],
    supportModules: ['gratitude_awe', 'conflict_debate', 'resource_library', 'virtue_cultivation', 'language_memory', 'creative_spark'],
    featuredPractices: ['ubuntu_attentiveness', 'ubuntu_mediation', 'ubuntu_compassion', 'ubuntu_justice', 'leadership_development']
  },
  {
    id: 'highperf',
    name: 'Modern High-Performance',
    nav: { tone: 'crisp', badge: 'Systems', emoji: '🚀' },
    coreModules: ['focus_deepwork', 'sleep_circadian', 'hydration', 'skill_builder', 'resource_library'],
    supportModules: ['breathwork', 'mood_regulation', 'movement_posture', 'fasting', 'language_memory', 'creative_spark'],
    featuredPractices: ['risk_assessment', 'leadership_development', 'boundary_setting', 'public_speaking', 'lifelong_learning']
  }
];

const getFrameworkIcon = (id: string) => {
  const icons = {
    spartan: <Shield className="w-5 h-5" />,
    bushido: <Scale className="w-5 h-5" />,
    stoic: <Brain className="w-5 h-5" />,
    monastic: <Leaf className="w-5 h-5" />,
    yogic: <Heart className="w-5 h-5" />,
    indigenous: <Target className="w-5 h-5" />,
    martial: <Shield className="w-5 h-5" />,
    sufi: <Heart className="w-5 h-5" />,
    ubuntu: <Users className="w-5 h-5" />,
    highperf: <Zap className="w-5 h-5" />
  };
  return icons[id as keyof typeof icons] || <BookOpen className="w-5 h-5" />;
};

const getToneGradient = (tone: string) => {
  const gradients = {
    gritty: 'from-red-500 to-orange-600',
    honor: 'from-gray-500 to-gray-700',
    calm: 'from-blue-500 to-indigo-600',
    order: 'from-purple-500 to-violet-600',
    embodied: 'from-green-500 to-emerald-600',
    stewardship: 'from-amber-500 to-orange-600',
    disciplined: 'from-red-600 to-red-800',
    devotional: 'from-blue-600 to-cyan-600',
    communal: 'from-green-600 to-teal-600',
    crisp: 'from-indigo-500 to-purple-600'
  };
  return gradients[tone as keyof typeof gradients] || 'from-gray-500 to-gray-600';
};

const getTimeToLearn = (modules: string[]) => {
  const totalModules = modules.length;
  if (totalModules <= 5) return '2-3 weeks';
  if (totalModules <= 8) return '3-4 weeks';
  return '4-6 weeks';
};

export default function FrameworksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTone, setSelectedTone] = useState<string | null>(null);

  const filteredFrameworks = frameworks.filter(framework => {
    const matchesSearch = framework.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         framework.nav.badge.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTone = !selectedTone || framework.nav.tone === selectedTone;
    return matchesSearch && matchesTone;
  });

  const tones = Array.from(new Set(frameworks.map(f => f.nav.tone)));

  return (
    <div className="min-h-screen bg-bg pb-20">
      <Header />
      
      <main className="px-4 py-6 space-y-6">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-text">Frameworks</h1>
          <p className="text-muted">Choose your path to flourishing</p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search frameworks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-lg text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>

          {/* Tone Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTone(null)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                !selectedTone
                  ? 'bg-primary text-white'
                  : 'bg-surface-2 text-muted hover:text-text'
              )}
            >
              All
            </button>
            {tones.map(tone => (
              <button
                key={tone}
                onClick={() => setSelectedTone(selectedTone === tone ? null : tone)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-colors capitalize',
                  selectedTone === tone
                    ? 'bg-primary text-white'
                    : 'bg-surface-2 text-muted hover:text-text'
                )}
              >
                {tone}
              </button>
            ))}
          </div>
        </div>

        {/* Frameworks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {filteredFrameworks.map((framework, index) => (
              <motion.div
                key={framework.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link href={`/frameworks/${framework.id}`}>
                  <div className="bg-surface border border-border rounded-lg p-4 hover:bg-surface-2 transition-all duration-200 hover:shadow-lg group">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center text-white',
                          `bg-gradient-to-r ${getToneGradient(framework.nav.tone)}`
                        )}>
                          {getFrameworkIcon(framework.id)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-text group-hover:text-primary transition-colors">
                            {framework.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{framework.nav.emoji}</span>
                            <span className="text-sm text-muted">{framework.nav.badge}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center">
                        <div className="text-sm font-medium text-text">
                          {framework.coreModules.length}
                        </div>
                        <div className="text-xs text-muted">Core</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-text">
                          {framework.supportModules.length}
                        </div>
                        <div className="text-xs text-muted">Support</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-text">
                          {getTimeToLearn([...framework.coreModules, ...framework.supportModules])}
                        </div>
                        <div className="text-xs text-muted">Duration</div>
                      </div>
                    </div>

                    {/* Core Modules Preview */}
                    <div className="space-y-2">
                      <div className="text-xs text-muted font-medium">Core Modules</div>
                      <div className="flex flex-wrap gap-1">
                        {framework.coreModules.slice(0, 3).map((module, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                          >
                            {module.replace('_', ' ')}
                          </span>
                        ))}
                        {framework.coreModules.length > 3 && (
                          <span className="px-2 py-1 bg-surface-2 text-muted text-xs rounded-full">
                            +{framework.coreModules.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Hover Effect */}
                    <div className="mt-3 flex items-center justify-between text-xs text-muted">
                      <span className="capitalize">{framework.nav.tone} approach</span>
                      <span className="group-hover:text-primary transition-colors">Explore →</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredFrameworks.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text mb-2">No frameworks found</h3>
            <p className="text-muted">Try adjusting your search or filters</p>
          </div>
        )}
      </main>

      <TabBar />
      <GuideFAB />
    </div>
  );
} 