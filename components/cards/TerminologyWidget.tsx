'use client';

import { useState, useEffect } from 'react';
import { BookOpen, ChevronDown, Shuffle, Search, Target, Users, Heart, Brain, Zap, Shield, Sword, Leaf, Star, Moon, Sun, Flame, Mountain } from 'lucide-react';
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
      icon: Brain
    },
    {
      term: 'Logos',
      definition: 'The rational principle that governs the universe and human reason.',
      category: 'concept',
      origin: 'Ancient Greek',
      tradition: 'Stoic',
      icon: Target
    },
    {
      term: 'Memento Mori',
      definition: 'Remember that you must die - a practice to contemplate mortality.',
      category: 'practice',
      origin: 'Latin',
      tradition: 'Stoic',
      icon: Moon
    },
    {
      term: 'Amor Fati',
      definition: 'Love of fate - embracing everything that happens as necessary.',
      category: 'principle',
      origin: 'Latin',
      tradition: 'Stoic',
      icon: Heart
    },
    {
      term: 'Dichotomy of Control',
      definition: 'Distinguishing between what we can control and what we cannot.',
      category: 'principle',
      origin: 'Stoic',
      tradition: 'Stoic',
      icon: Target
    }
  ],
  spartan: [
    {
      term: 'Discipline Through Hardship',
      definition: 'Embracing difficult challenges as opportunities to build mental and physical strength.',
      category: 'principle',
      origin: 'Ancient Sparta',
      tradition: 'Spartan',
      icon: Shield
    },
    {
      term: 'Laconic Communication',
      definition: 'Speaking with precision and brevity, avoiding unnecessary words.',
      category: 'practice',
      origin: 'Ancient Sparta',
      tradition: 'Spartan',
      icon: Target
    },
    {
      term: 'Collective Strength',
      definition: 'Understanding that individual excellence is amplified when working in unity.',
      category: 'concept',
      origin: 'Ancient Sparta',
      tradition: 'Spartan',
      icon: Users
    },
    {
      term: 'Austerity Mindset',
      definition: 'Choosing simplicity over luxury, focusing on what is necessary.',
      category: 'principle',
      origin: 'Ancient Sparta',
      tradition: 'Spartan',
      icon: Shield
    }
  ],
  bushido: [
    {
      term: 'Bushidō',
      definition: 'The way of the warrior - the samurai code of honor and conduct.',
      category: 'principle',
      origin: 'Japanese',
      tradition: 'Bushido',
      icon: Sword
    },
    {
      term: 'Seppuku',
      definition: 'Ritual suicide to preserve honor and atone for failure.',
      category: 'practice',
      origin: 'Japanese',
      tradition: 'Bushido',
      icon: Sword
    },
    {
      term: 'Giri',
      definition: 'Duty and obligation - the moral responsibility to others.',
      category: 'concept',
      origin: 'Japanese',
      tradition: 'Bushido',
      icon: Heart
    },
    {
      term: 'Makoto',
      definition: 'Sincerity and truthfulness in all actions and words.',
      category: 'principle',
      origin: 'Japanese',
      tradition: 'Bushido',
      icon: Target
    }
  ],
  daoist: [
    {
      term: 'Wu Wei',
      definition: 'Non-action or effortless action that aligns with the natural flow.',
      category: 'principle',
      origin: 'Ancient Chinese',
      tradition: 'Daoist',
      icon: Zap
    },
    {
      term: 'Dao',
      definition: 'The way or path - the fundamental principle underlying the universe.',
      category: 'concept',
      origin: 'Ancient Chinese',
      tradition: 'Daoist',
      icon: Mountain
    },
    {
      term: 'Yin-Yang',
      definition: 'The complementary forces that make up the universe and all phenomena.',
      category: 'concept',
      origin: 'Ancient Chinese',
      tradition: 'Daoist',
      icon: Star
    },
    {
      term: 'Ziran',
      definition: 'Naturalness or spontaneity - being in harmony with one\'s true nature.',
      category: 'principle',
      origin: 'Ancient Chinese',
      tradition: 'Daoist',
      icon: Leaf
    }
  ],
  confucian: [
    {
      term: 'Ren',
      definition: 'Humaneness, benevolence, or the highest virtue of compassion.',
      category: 'principle',
      origin: 'Ancient Chinese',
      tradition: 'Confucian',
      icon: Heart
    },
    {
      term: 'Li',
      definition: 'Ritual propriety and proper conduct in social relationships.',
      category: 'practice',
      origin: 'Ancient Chinese',
      tradition: 'Confucian',
      icon: Target
    },
    {
      term: 'Xiao',
      definition: 'Filial piety - respect and care for parents and ancestors.',
      category: 'principle',
      origin: 'Ancient Chinese',
      tradition: 'Confucian',
      icon: Heart
    },
    {
      term: 'Junzi',
      definition: 'The noble person or exemplary individual who embodies virtue.',
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
      icon: Target
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
      term: 'Nirvana',
      definition: 'Liberation from suffering and the cycle of rebirth.',
      category: 'concept',
      origin: 'Sanskrit',
      tradition: 'Buddhist',
      icon: Sun
    },
    {
      term: 'Mindfulness',
      definition: 'Present-moment awareness without judgment or attachment.',
      category: 'practice',
      origin: 'Pali',
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
      category: 'principle',
      origin: 'Ancient Greek',
      tradition: 'Aristotelian',
      icon: Target
    },
    {
      term: 'Phronesis',
      definition: 'Practical wisdom - the ability to make good judgments.',
      category: 'concept',
      origin: 'Ancient Greek',
      tradition: 'Aristotelian',
      icon: Brain
    },
    {
      term: 'Telos',
      definition: 'Purpose or end goal - the ultimate aim of human life.',
      category: 'concept',
      origin: 'Ancient Greek',
      tradition: 'Aristotelian',
      icon: Target
    }
  ],
  sufi: [
    {
      term: 'Dhikr',
      definition: 'Remembrance of God through prayer, meditation, and chanting.',
      category: 'practice',
      origin: 'Arabic',
      tradition: 'Sufi',
      icon: Moon
    },
    {
      term: 'Tawhid',
      definition: 'The oneness of God and the unity of all existence.',
      category: 'concept',
      origin: 'Arabic',
      tradition: 'Sufi',
      icon: Star
    },
    {
      term: 'Fana',
      definition: 'Annihilation of the ego in the divine presence.',
      category: 'concept',
      origin: 'Arabic',
      tradition: 'Sufi',
      icon: Flame
    },
    {
      term: 'Baqa',
      definition: 'Subsistence in God - remaining in divine consciousness.',
      category: 'concept',
      origin: 'Arabic',
      tradition: 'Sufi',
      icon: Sun
    }
  ],
  indigenous: [
    {
      term: 'Ubuntu',
      definition: 'I am because we are - the interconnectedness of all humanity.',
      category: 'principle',
      origin: 'Bantu',
      tradition: 'Indigenous',
      icon: Users
    },
    {
      term: 'Seventh Generation',
      definition: 'Considering the impact of decisions on seven generations to come.',
      category: 'principle',
      origin: 'Iroquois',
      tradition: 'Indigenous',
      icon: Leaf
    },
    {
      term: 'Two-Eyed Seeing',
      definition: 'Integrating indigenous and western ways of knowing.',
      category: 'practice',
      origin: 'Mi\'kmaq',
      tradition: 'Indigenous',
      icon: Brain
    },
    {
      term: 'Land-Based Learning',
      definition: 'Learning through direct connection with the natural world.',
      category: 'practice',
      origin: 'Indigenous',
      tradition: 'Indigenous',
      icon: Mountain
    }
  ]
};

export function TerminologyWidget() {
  const [selectedFramework, setSelectedFramework] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [randomTerm, setRandomTerm] = useState<Term | null>(null);

  // Get all terms for the selected framework
  const getTerms = () => {
    if (selectedFramework === 'all') {
      return Object.values(allTerms).flat();
    }
    return allTerms[selectedFramework] || [];
  };

  // Filter terms based on search
  const filteredTerms = getTerms().filter(term =>
    term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.origin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get random term
  const getRandomTerm = () => {
    const terms = getTerms();
    if (terms.length > 0) {
      const randomIndex = Math.floor(Math.random() * terms.length);
      setRandomTerm(terms[randomIndex]);
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technique': return 'text-blue-400';
      case 'concept': return 'text-purple-400';
      case 'practice': return 'text-green-400';
      case 'principle': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const selectedFrameworkData = frameworks.find(f => f.id === selectedFramework);

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20">
            <BookOpen className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="font-bold text-text text-lg">Philosophical Terminology</h3>
            <p className="text-sm text-muted">Explore wisdom from all traditions</p>
          </div>
        </div>
        <button
          onClick={getRandomTerm}
          className="p-2 bg-surface-2 rounded-lg text-muted hover:text-text transition-all"
          title="Get Random Term"
        >
          <Shuffle className="w-5 h-5" />
        </button>
      </div>

      {/* Framework Selector */}
      <div className="relative mb-6">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-full flex items-center justify-between p-3 bg-surface-2 border border-border rounded-lg text-text hover:bg-surface transition-all"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{selectedFrameworkData?.emoji}</span>
            <div className="text-left">
              <div className="font-medium">{selectedFrameworkData?.name}</div>
              <div className="text-xs text-muted">{selectedFrameworkData?.description}</div>
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
            >
              {frameworks.map((framework) => (
                <button
                  key={framework.id}
                  onClick={() => {
                    setSelectedFramework(framework.id);
                    setShowDropdown(false);
                    setSelectedTerm(null);
                    setRandomTerm(null);
                  }}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-surface-2 transition-all border-b border-border last:border-b-0"
                >
                  <span className="text-xl">{framework.emoji}</span>
                  <div>
                    <div className="font-medium text-text">{framework.name}</div>
                    <div className="text-xs text-muted">{framework.description}</div>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          type="text"
          placeholder="Search terms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-surface-2 border border-border rounded-lg text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        />
      </div>

      {/* Random Term Display */}
      {randomTerm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-lg"
        >
          <div className="flex items-center gap-3 mb-3">
            <randomTerm.icon className="w-5 h-5 text-purple-400" />
            <div>
              <h4 className="font-semibold text-text">{randomTerm.term}</h4>
              <div className="text-xs text-muted">{randomTerm.origin} • {randomTerm.tradition}</div>
            </div>
          </div>
          <p className="text-sm text-text mb-2">{randomTerm.definition}</p>
          <span className={`text-xs px-2 py-1 rounded-full bg-surface-2 ${getCategoryColor(randomTerm.category)}`}>
            {randomTerm.category}
          </span>
        </motion.div>
      )}

      {/* Terms List */}
      <div className="space-y-3">
        <div className="text-sm text-muted mb-2">
          {filteredTerms.length} terms found
        </div>
        {filteredTerms.length === 0 ? (
          <div className="text-center py-8 text-muted">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No terms found. Try a different search or framework.</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {filteredTerms.slice(0, 10).map((term, index) => (
              <motion.button
                key={index}
                onClick={() => setSelectedTerm(selectedTerm?.term === term.term ? null : term)}
                className="w-full text-left p-3 bg-surface-2 border border-border rounded-lg hover:bg-surface transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <term.icon className="w-5 h-5 text-muted" />
                  <div className="flex-1">
                    <div className="font-medium text-text">{term.term}</div>
                    <div className="text-xs text-muted">{term.origin} • {term.tradition}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full bg-surface ${getCategoryColor(term.category)}`}>
                    {term.category}
                  </span>
                </div>
                
                <AnimatePresence>
                  {selectedTerm?.term === term.term && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-border"
                    >
                      <p className="text-sm text-text">{term.definition}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 p-3 bg-surface-2 rounded-lg">
        <div className="text-xs text-muted mb-1">Tip:</div>
        <div className="text-sm text-text">
          Use the random button to discover new philosophical concepts and expand your wisdom vocabulary.
        </div>
      </div>
    </div>
  );
} 