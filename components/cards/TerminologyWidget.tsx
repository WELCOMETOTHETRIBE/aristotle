'use client';

import { useState, useEffect } from 'react';
import { BookOpen, ChevronDown, Shuffle, Search, Target, Users, Heart, Brain, Zap, Shield, Sword, Leaf, Star, Moon, Sun, Flame, Mountain, ArrowRight, SkipForward } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Term {
  term: string;
  definition: string;
  category: 'technique' | 'concept' | 'practice' | 'principle';
  origin: string;
  tradition: string;
  icon: any;
}

interface Framework {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
}

const frameworks: Framework[] = [
  {
    id: 'all',
    name: 'All Traditions',
    emoji: '🌍',
    color: 'from-purple-500 to-indigo-600',
    description: 'Comprehensive terminology from all philosophical traditions'
  },
  {
    id: 'stoic',
    name: 'Stoicism',
    emoji: '🧱',
    color: 'from-blue-500 to-cyan-600',
    description: 'Ancient Greek philosophy of virtue and rationality'
  },
  {
    id: 'spartan',
    name: 'Spartan Agōgē',
    emoji: '🛡️',
    color: 'from-red-500 to-orange-600',
    description: 'Discipline through hardship and physical excellence'
  },
  {
    id: 'bushido',
    name: 'Samurai Bushidō',
    emoji: '🗡️',
    color: 'from-gray-500 to-slate-600',
    description: 'Way of the warrior emphasizing honor and loyalty'
  },
  {
    id: 'daoist',
    name: 'Daoism',
    emoji: '☯️',
    color: 'from-teal-500 to-green-600',
    description: 'Harmony with the natural way and effortless action'
  },
  {
    id: 'confucian',
    name: 'Confucianism',
    emoji: '📚',
    color: 'from-orange-500 to-red-600',
    description: 'Moral cultivation and social harmony'
  },
  {
    id: 'buddhist',
    name: 'Buddhism',
    emoji: '🧘',
    color: 'from-yellow-500 to-orange-600',
    description: 'Path to enlightenment and inner peace'
  },
  {
    id: 'aristotelian',
    name: 'Aristotelian',
    emoji: '🏛️',
    color: 'from-indigo-500 to-purple-600',
    description: 'Virtue ethics and human flourishing'
  },
  {
    id: 'sufi',
    name: 'Sufi Practice',
    emoji: '🕊️',
    color: 'from-pink-500 to-rose-600',
    description: 'Islamic mysticism and spiritual development'
  },
  {
    id: 'indigenous',
    name: 'Indigenous Wisdom',
    emoji: '🌿',
    color: 'from-green-500 to-emerald-600',
    description: 'Traditional knowledge and connection to nature'
  }
];

const allTerms: Record<string, Term[]> = {
  stoic: [
    {
      term: 'Ataraxia',
      definition: 'A state of serene calmness and freedom from emotional disturbance.',
      category: 'concept',
      origin: 'Ancient Greek',
      tradition: 'Stoic',
      icon: Shield
    },
    {
      term: 'Apatheia',
      definition: 'Freedom from passion or emotional disturbance through rational control.',
      category: 'concept',
      origin: 'Ancient Greek',
      tradition: 'Stoic',
      icon: Brain
    },
    {
      term: 'Logos',
      definition: 'The rational principle that governs the universe and human reason.',
      category: 'concept',
      origin: 'Ancient Greek',
      tradition: 'Stoic',
      icon: Star
    },
    {
      term: 'Amor Fati',
      definition: 'Love of fate - embracing and accepting everything that happens as necessary.',
      category: 'practice',
      origin: 'Latin',
      tradition: 'Stoic',
      icon: Heart
    },
    {
      term: 'Memento Mori',
      definition: 'Remember that you must die - a reminder of mortality to focus on what matters.',
      category: 'practice',
      origin: 'Latin',
      tradition: 'Stoic',
      icon: Moon
    }
  ],
  spartan: [
    {
      term: 'Agōgē',
      definition: 'The rigorous education and training system for Spartan citizens.',
      category: 'practice',
      origin: 'Ancient Greek',
      tradition: 'Spartan',
      icon: Shield
    },
    {
      term: 'Krypteia',
      definition: 'Secret police force that maintained social order through surveillance.',
      category: 'practice',
      origin: 'Ancient Greek',
      tradition: 'Spartan',
      icon: Sword
    },
    {
      term: 'Laconic',
      definition: 'Brief and concise speech, characteristic of Spartan communication.',
      category: 'concept',
      origin: 'Ancient Greek',
      tradition: 'Spartan',
      icon: Target
    },
    {
      term: 'Syssitia',
      definition: 'Common mess halls where Spartans ate together, fostering unity.',
      category: 'practice',
      origin: 'Ancient Greek',
      tradition: 'Spartan',
      icon: Users
    }
  ],
  bushido: [
    {
      term: 'Bushidō',
      definition: 'The way of the warrior - the samurai code of honor and conduct.',
      category: 'concept',
      origin: 'Japanese',
      tradition: 'Samurai',
      icon: Sword
    },
    {
      term: 'Seppuku',
      definition: 'Ritual suicide by disembowelment to preserve honor.',
      category: 'practice',
      origin: 'Japanese',
      tradition: 'Samurai',
      icon: Shield
    },
    {
      term: 'Giri',
      definition: 'Duty and obligation - the moral responsibility to others.',
      category: 'concept',
      origin: 'Japanese',
      tradition: 'Samurai',
      icon: Target
    },
    {
      term: 'Hara-kiri',
      definition: 'Another term for ritual suicide, literally "belly cutting".',
      category: 'practice',
      origin: 'Japanese',
      tradition: 'Samurai',
      icon: Sword
    }
  ],
  daoist: [
    {
      term: 'Wu Wei',
      definition: 'Non-action or effortless action that aligns with the natural flow.',
      category: 'concept',
      origin: 'Ancient Chinese',
      tradition: 'Daoist',
      icon: Leaf
    },
    {
      term: 'Dao',
      definition: 'The Way - the natural order and flow of the universe.',
      category: 'concept',
      origin: 'Ancient Chinese',
      tradition: 'Daoist',
      icon: Star
    },
    {
      term: 'Yin-Yang',
      definition: 'The complementary and interconnected forces that create harmony.',
      category: 'concept',
      origin: 'Ancient Chinese',
      tradition: 'Daoist',
      icon: Sun
    },
    {
      term: 'Ziran',
      definition: 'Naturalness or spontaneity - being true to one\'s nature.',
      category: 'concept',
      origin: 'Ancient Chinese',
      tradition: 'Daoist',
      icon: Leaf
    }
  ],
  confucian: [
    {
      term: 'Ren',
      definition: 'Humaneness, benevolence, or the highest virtue of compassion.',
      category: 'concept',
      origin: 'Ancient Chinese',
      tradition: 'Confucian',
      icon: Heart
    },
    {
      term: 'Li',
      definition: 'Ritual, propriety, or proper conduct that maintains social harmony.',
      category: 'concept',
      origin: 'Ancient Chinese',
      tradition: 'Confucian',
      icon: BookOpen
    },
    {
      term: 'Xiao',
      definition: 'Filial piety - respect, care, and devotion to parents and ancestors.',
      category: 'concept',
      origin: 'Ancient Chinese',
      tradition: 'Confucian',
      icon: Users
    },
    {
      term: 'Junzi',
      definition: 'The noble person who embodies moral excellence and proper conduct.',
      category: 'concept',
      origin: 'Ancient Chinese',
      tradition: 'Confucian',
      icon: Star
    }
  ],
  buddhist: [
    {
      term: 'Dharma',
      definition: 'The cosmic law, moral duty, or the way things are meant to be.',
      category: 'concept',
      origin: 'Sanskrit',
      tradition: 'Buddhist',
      icon: Star
    },
    {
      term: 'Karma',
      definition: 'Action and its consequences - the law of cause and effect.',
      category: 'concept',
      origin: 'Sanskrit',
      tradition: 'Buddhist',
      icon: Zap
    },
    {
      term: 'Satori',
      definition: 'Sudden enlightenment or awakening to the true nature of reality.',
      category: 'concept',
      origin: 'Japanese',
      tradition: 'Buddhist',
      icon: Moon
    },
    {
      term: 'Zen',
      definition: 'Meditation - the practice of direct insight into reality.',
      category: 'practice',
      origin: 'Japanese',
      tradition: 'Buddhist',
      icon: Brain
    }
  ],
  aristotelian: [
    {
      term: 'Eudaimonia',
      definition: 'Human flourishing or happiness achieved through virtuous activity.',
      category: 'concept',
      origin: 'Ancient Greek',
      tradition: 'Aristotelian',
      icon: Star
    },
    {
      term: 'Arete',
      definition: 'Excellence or virtue - the fulfillment of one\'s potential.',
      category: 'concept',
      origin: 'Ancient Greek',
      tradition: 'Aristotelian',
      icon: Shield
    },
    {
      term: 'Phronesis',
      definition: 'Practical wisdom or the ability to make good judgments.',
      category: 'concept',
      origin: 'Ancient Greek',
      tradition: 'Aristotelian',
      icon: Brain
    },
    {
      term: 'Telos',
      definition: 'Purpose, end, or goal - the final cause that explains existence.',
      category: 'concept',
      origin: 'Ancient Greek',
      tradition: 'Aristotelian',
      icon: Target
    }
  ],
  sufi: [
    {
      term: 'Dhikr',
      definition: 'Remembrance of God through repetitive prayer and meditation.',
      category: 'practice',
      origin: 'Arabic',
      tradition: 'Sufi',
      icon: Heart
    },
    {
      term: 'Sama',
      definition: 'Spiritual listening and music as a path to divine union.',
      category: 'practice',
      origin: 'Arabic',
      tradition: 'Sufi',
      icon: Star
    },
    {
      term: 'Fana',
      definition: 'Annihilation of the self in the divine presence.',
      category: 'concept',
      origin: 'Arabic',
      tradition: 'Sufi',
      icon: Moon
    },
    {
      term: 'Baqa',
      definition: 'Subsistence in God after the annihilation of the self.',
      category: 'concept',
      origin: 'Arabic',
      tradition: 'Sufi',
      icon: Sun
    }
  ],
  indigenous: [
    {
      term: 'Mitakuye Oyasin',
      definition: 'All my relations - the interconnectedness of all beings.',
      category: 'concept',
      origin: 'Lakota',
      tradition: 'Indigenous',
      icon: Users
    },
    {
      term: 'Hozho',
      definition: 'Beauty, harmony, and balance in all aspects of life.',
      category: 'concept',
      origin: 'Navajo',
      tradition: 'Indigenous',
      icon: Star
    },
    {
      term: 'Ubuntu',
      definition: 'I am because we are - the interconnected nature of humanity.',
      category: 'concept',
      origin: 'Bantu',
      tradition: 'Indigenous',
      icon: Heart
    },
    {
      term: 'Aloha',
      definition: 'Love, compassion, and the breath of life shared with others.',
      category: 'concept',
      origin: 'Hawaiian',
      tradition: 'Indigenous',
      icon: Leaf
    }
  ]
};

export function TerminologyWidget() {
  const [selectedFramework, setSelectedFramework] = useState('all');
  const [currentTermIndex, setCurrentTermIndex] = useState(0);
  const [showFrameworkDropdown, setShowFrameworkDropdown] = useState(false);

  // Get all terms for the selected framework
  const getCurrentTerms = () => {
    if (selectedFramework === 'all') {
      return Object.values(allTerms).flat();
    }
    return allTerms[selectedFramework] || [];
  };

  const currentTerms = getCurrentTerms();
  const currentTerm = currentTerms[currentTermIndex];
  const totalTerms = currentTerms.length;

  const nextTerm = () => {
    setCurrentTermIndex((prev) => (prev + 1) % totalTerms);
  };

  const getFrameworkColor = (frameworkId: string) => {
    const framework = frameworks.find(f => f.id === frameworkId);
    return framework?.color || 'from-gray-500 to-gray-600';
  };

  const getFrameworkEmoji = (frameworkId: string) => {
    const framework = frameworks.find(f => f.id === frameworkId);
    return framework?.emoji || '🌍';
  };

  return (
    <motion.div 
      className="p-6 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div 
            className="p-3 rounded-xl bg-indigo-500/20"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <BookOpen className="w-6 h-6 text-indigo-400" />
          </motion.div>
          <div>
            <h3 className="font-bold text-white text-lg">Philosophical Terminology</h3>
            <p className="text-sm text-gray-400">Term {currentTermIndex + 1} of {totalTerms}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-indigo-400">
            {totalTerms}
          </div>
          <div className="text-xs text-gray-400">Terms</div>
        </div>
      </div>

      {/* Framework Selector */}
      <div className="mb-4">
        <div className="relative">
          <button
            onClick={() => setShowFrameworkDropdown(!showFrameworkDropdown)}
            className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            <span className="text-lg">{getFrameworkEmoji(selectedFramework)}</span>
            <span className="text-sm">
              {frameworks.find(f => f.id === selectedFramework)?.name || 'All Traditions'}
            </span>
            <motion.div
              animate={{ rotate: showFrameworkDropdown ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </button>
          
          <AnimatePresence>
            {showFrameworkDropdown && (
              <motion.div 
                className="absolute top-full left-0 mt-1 w-56 bg-surface border border-border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto"
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
              >
                {frameworks.map((framework) => (
                  <button
                    key={framework.id}
                    onClick={() => {
                      setSelectedFramework(framework.id);
                      setCurrentTermIndex(0);
                      setShowFrameworkDropdown(false);
                    }}
                    className={`w-full p-2 text-left hover:bg-surface-2 transition-colors border-b border-border last:border-b-0 ${
                      selectedFramework === framework.id ? 'bg-primary/10 text-primary' : 'text-text'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{framework.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{framework.name}</div>
                        <div className="text-xs text-muted truncate">{framework.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Single Term Card */}
      {currentTerm && (
        <AnimatePresence mode="wait">
          <motion.div 
            key={`${selectedFramework}-${currentTermIndex}`}
            className="p-5 bg-white/5 border border-white/10 rounded-xl"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getFrameworkColor(selectedFramework)} flex items-center justify-center text-white`}>
                <currentTerm.icon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-white text-lg">{currentTerm.term}</h4>
                </div>
                <div className="flex items-center gap-2 mb-3 text-xs">
                  <span className={`px-2 py-1 rounded-full bg-gradient-to-r ${getFrameworkColor(selectedFramework)} text-white`}>
                    {currentTerm.tradition}
                  </span>
                  <span className="text-gray-400">{currentTerm.origin}</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <h5 className="text-sm font-medium text-white mb-1 flex items-center gap-2">
                      <Star className="w-4 h-4" /> Definition
                    </h5>
                    <p className="text-sm text-gray-300 leading-relaxed">{currentTerm.definition}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Controls */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-gray-400">
          {currentTerm?.tradition} • {currentTerm?.origin}
        </div>
        <div className="flex items-center justify-end">
          <button
            onClick={nextTerm}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/30 transition-colors"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
} 