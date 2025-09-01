'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Brain, Shield, Scale, Leaf, Info, Zap, Play, 
  BookOpen, Users, Lightbulb, Trophy, Clock, Heart, Target,
  Sparkles, Target as TargetIcon, Wind, Activity, Droplets
} from 'lucide-react';
import { Header } from '@/components/nav/Header';
import { TabBar } from '@/components/nav/TabBar';
import { GuideFAB } from '@/components/ai/GuideFAB';
import { cn } from '@/lib/utils';

interface FrameworkDetailPageProps {
  params: {
    slug: string;
  };
}

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

const getModuleIcon = (moduleId: string) => {
  const icons = {
    meditation: <Brain className="w-4 h-4" />,
    breathwork: <Wind className="w-4 h-4" />,
    strength: <TargetIcon className="w-4 h-4" />,
    movement_posture: <Activity className="w-4 h-4" />,
    hydration: <Droplets className="w-4 h-4" />,
    sleep_circadian: <Clock className="w-4 h-4" />,
    focus_deepwork: <Target className="w-4 h-4" />,
    mood_regulation: <Heart className="w-4 h-4" />,
    virtue_cultivation: <Shield className="w-4 h-4" />,
    service_contribution: <Users className="w-4 h-4" />,
    gratitude_awe: <Sparkles className="w-4 h-4" />,
    philosophy_capsules: <BookOpen className="w-4 h-4" />,
    resource_library: <BookOpen className="w-4 h-4" />,
    fasting: <Clock className="w-4 h-4" />,
    etiquette_presence: <Scale className="w-4 h-4" />,
    mentorship_teaching: <Users className="w-4 h-4" />,
    conflict_debate: <Scale className="w-4 h-4" />,
    tribal_challenges: <Target className="w-4 h-4" />,
    longevity: <Heart className="w-4 h-4" />,
    creative_spark: <Lightbulb className="w-4 h-4" />,
    flexibility: <Leaf className="w-4 h-4" />,
    memento_mori: <Brain className="w-4 h-4" />,
    cold_heat: <Activity className="w-4 h-4" />,
    active_listening: <Users className="w-4 h-4" />,
    language_memory: <Brain className="w-4 h-4" />,
    skill_builder: <Target className="w-4 h-4" />
  };
  return icons[moduleId as keyof typeof icons] || <BookOpen className="w-4 h-4" />;
};

const getModuleDescription = (moduleId: string) => {
  const descriptions = {
    meditation: 'Cultivate mindfulness and inner peace through focused practice',
    breathwork: 'Master breathing techniques for energy and calm',
    strength: 'Build physical and mental resilience through training',
    movement_posture: 'Develop graceful movement and proper alignment',
    hydration: 'Maintain optimal hydration for peak performance',
    sleep_circadian: 'Optimize sleep patterns and circadian rhythms',
    focus_deepwork: 'Achieve deep concentration and flow states',
    mood_regulation: 'Develop emotional intelligence and stability',
    virtue_cultivation: 'Build character through virtuous practices',
    service_contribution: 'Serve others and contribute to community',
    gratitude_awe: 'Cultivate appreciation and wonder for life',
    philosophy_capsules: 'Learn timeless wisdom through philosophical study',
    resource_library: 'Access curated knowledge and insights',
    fasting: 'Practice disciplined eating and metabolic health',
    etiquette_presence: 'Develop social grace and confident presence',
    mentorship_teaching: 'Learn from others and share your wisdom',
    conflict_debate: 'Navigate disagreements with skill and respect',
    tribal_challenges: 'Face adversity with community support',
    longevity: 'Optimize health for a long, vibrant life',
    creative_spark: 'Ignite creativity and innovative thinking',
    flexibility: 'Develop physical and mental adaptability',
    memento_mori: 'Remember mortality to live more fully',
    cold_heat: 'Build resilience through temperature extremes',
    active_listening: 'Listen deeply to understand and connect',
    language_memory: 'Enhance cognitive function through language study',
    skill_builder: 'Systematically develop new capabilities'
  };
  return descriptions[moduleId as keyof typeof descriptions] || 'Develop this essential skill';
};

export default function FrameworkDetailPage({ params }: FrameworkDetailPageProps) {
  const [framework, setFramework] = useState<Framework | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundFramework = frameworks.find(f => f.id === params.slug);
    if (foundFramework) {
      setFramework(foundFramework);
    }
    setLoading(false);
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted">Loading framework...</p>
        </div>
      </div>
    );
  }

  if (!framework) {
    return (
      <div className="min-h-screen bg-bg">
        <Header />
        <main className="px-4 py-6">
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-muted mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-text mb-2">Framework Not Found</h1>
            <p className="text-muted mb-6">The framework you're looking for doesn't exist.</p>
            <Link href="/frameworks">
              <button className="px-4 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-primary/90 transition-colors">
                Browse All Frameworks
              </button>
            </Link>
          </div>
        </main>
        <TabBar />
      </div>
    );
  }

  const allModules = [...framework.coreModules, ...framework.supportModules];

  return (
    <div className="min-h-screen bg-bg pb-20">
      <Header />
      
      <main className="px-4 py-6 space-y-6">
        {/* Back Button */}
        <Link href="/frameworks">
          <button className="flex items-center gap-2 text-muted hover:text-text transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Frameworks</span>
          </button>
        </Link>

        {/* Hero Section */}
        <div className={cn(
          'bg-gradient-to-r rounded-2xl p-6 text-white',
          `bg-gradient-to-r ${getToneGradient(framework.nav.tone)}`
        )}>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl">{framework.nav.emoji}</div>
            <div>
              <h1 className="text-2xl font-bold">{framework.name}</h1>
              <p className="text-white/80">{framework.nav.badge} • {framework.nav.tone} approach</p>
            </div>
          </div>
          <p className="text-white/90 text-sm">
            A comprehensive framework for developing {framework.nav.tone} excellence through {framework.coreModules.length} core modules and {framework.supportModules.length} supporting practices.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-surface-2 rounded-lg p-1">
          {['overview', 'modules', 'practices'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize',
                activeTab === tab
                  ? 'bg-primary text-black font-semibold shadow-sm'
                  : 'text-muted hover:text-text'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-surface border border-border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-text">{framework.coreModules.length}</div>
                  <div className="text-sm text-muted">Core Modules</div>
                </div>
                <div className="bg-surface border border-border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-text">{framework.supportModules.length}</div>
                  <div className="text-sm text-muted">Support Modules</div>
                </div>
                <div className="bg-surface border border-border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-text">{framework.featuredPractices.length}</div>
                  <div className="text-sm text-muted">Practices</div>
                </div>
              </div>

              {/* Framework Description */}
              <div className="bg-surface border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-text mb-3">About {framework.name}</h3>
                <p className="text-muted leading-relaxed">
                  The {framework.name} framework offers a {framework.nav.tone} approach to personal development, 
                  emphasizing {framework.nav.badge.toLowerCase()} as its core principle. This comprehensive system 
                  combines ancient wisdom with modern practices to help you cultivate excellence in all areas of life.
                </p>
              </div>

              {/* Key Benefits */}
              <div className="bg-surface border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-text mb-4">Key Benefits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-text mb-1">Structured Learning</h4>
                      <p className="text-sm text-muted">Follow a proven path with clear milestones and progress tracking</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Heart className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-text mb-1">Holistic Development</h4>
                      <p className="text-sm text-muted">Develop mind, body, and spirit in harmony</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-text mb-1">Community Support</h4>
                      <p className="text-sm text-muted">Connect with others on the same path</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-text mb-1">Timeless Wisdom</h4>
                      <p className="text-sm text-muted">Learn from proven traditions and practices</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'modules' && (
            <motion.div
              key="modules"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Core Modules */}
              <div>
                <h3 className="text-lg font-semibold text-text mb-4">Core Modules</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {framework.coreModules.map((moduleId, index) => (
                    <motion.div
                      key={moduleId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-surface border border-border rounded-lg p-4 hover:bg-surface-2 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          {getModuleIcon(moduleId)}
                        </div>
                        <div>
                          <h4 className="font-medium text-text mb-1">
                            {moduleId.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </h4>
                          <p className="text-sm text-muted">{getModuleDescription(moduleId)}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Support Modules */}
              <div>
                <h3 className="text-lg font-semibold text-text mb-4">Support Modules</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {framework.supportModules.map((moduleId, index) => (
                    <motion.div
                      key={moduleId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-surface border border-border rounded-lg p-4 hover:bg-surface-2 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-surface-2 rounded-lg flex items-center justify-center flex-shrink-0">
                          {getModuleIcon(moduleId)}
                        </div>
                        <div>
                          <h4 className="font-medium text-text mb-1">
                            {moduleId.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </h4>
                          <p className="text-sm text-muted">{getModuleDescription(moduleId)}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'practices' && (
            <motion.div
              key="practices"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-text mb-4">Featured Practices</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {framework.featuredPractices.map((practice, index) => (
                    <motion.div
                      key={practice}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-surface border border-border rounded-lg p-4 hover:bg-surface-2 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-text mb-1">
                            {practice.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </h4>
                          <p className="text-sm text-muted">Practice this skill regularly</p>
                        </div>
                        <Play className="w-4 h-4 text-muted" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Start Learning Button */}
        <div className="bg-surface border border-border rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-text mb-2">Ready to Begin?</h3>
          <p className="text-muted mb-4">Start your journey with the {framework.name} framework</p>
          <button className="px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg hover:from-primary/90 hover:to-primary/70 transition-all duration-200 font-medium">
            Start Learning
          </button>
        </div>
      </main>

      <TabBar />
      <GuideFAB />
    </div>
  );
}
