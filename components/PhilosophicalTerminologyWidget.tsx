'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Star, Sparkles, Quote, ArrowRight, SkipForward } from 'lucide-react';

interface PhilosophicalTerm {
  id: string;
  term: string;
  pronunciation?: string;
  origin: string;
  tradition: string;
  definition: string;
  example: string;
  significance: string;
  relatedTerms: string[];
  color: string;
  icon: string;
}

const PHILOSOPHICAL_TERMS: PhilosophicalTerm[] = [
  {
    id: 'eudaimonia',
    term: 'Eudaimonia',
    pronunciation: 'yoo-die-MO-nee-ah',
    origin: 'Ancient Greek',
    tradition: 'Aristotelian',
    definition: 'Human flourishing or happiness achieved through virtuous activity and the fulfillment of one\'s potential.',
    example: 'Living a life of wisdom, courage, justice, and temperance leads to eudaimonia.',
    significance: 'The highest human good and ultimate purpose of human life according to Aristotle.',
    relatedTerms: ['Virtue Ethics', 'Telos', 'Arete', 'Phronesis'],
    color: 'from-blue-500 to-indigo-600',
    icon: '🏛️'
  },
  {
    id: 'wu-wei',
    term: 'Wu Wei',
    pronunciation: 'woo-way',
    origin: 'Ancient Chinese',
    tradition: 'Daoist',
    definition: 'Non-action or effortless action that aligns with the natural flow of the universe.',
    example: 'A skilled musician playing without conscious effort, flowing with the music naturally.',
    significance: 'Represents the ideal state of being where action becomes spontaneous and harmonious.',
    relatedTerms: ['Dao', 'Yin-Yang', 'Ziran', 'Naturalness'],
    color: 'from-teal-500 to-cyan-600',
    icon: '☯️'
  },
  {
    id: 'ataraxia',
    term: 'Ataraxia',
    pronunciation: 'ah-tah-RAK-see-ah',
    origin: 'Ancient Greek',
    tradition: 'Stoic/Epicurean',
    definition: 'A state of serene calmness and freedom from emotional disturbance.',
    example: 'Maintaining inner peace regardless of external circumstances or challenges.',
    significance: 'The ultimate goal of Stoic philosophy - achieving tranquility through reason.',
    relatedTerms: ['Apatheia', 'Tranquility', 'Inner Peace', 'Stoic Serenity'],
    color: 'from-purple-500 to-pink-600',
    icon: '🧘'
  },
  {
    id: 'ren',
    term: 'Ren',
    pronunciation: 'ren',
    origin: 'Ancient Chinese',
    tradition: 'Confucian',
    definition: 'Humaneness, benevolence, or the highest virtue of compassion and moral excellence.',
    example: 'Treating others with kindness, respect, and genuine care for their well-being.',
    significance: 'The central virtue in Confucianism that guides all human relationships.',
    relatedTerms: ['Li', 'Xiao', 'Junzi', 'Humaneness'],
    color: 'from-orange-500 to-red-600',
    icon: '📚'
  },
  {
    id: 'logos',
    term: 'Logos',
    pronunciation: 'LOH-gohs',
    origin: 'Ancient Greek',
    tradition: 'Stoic/Christian',
    definition: 'The rational principle that governs the universe and human reason.',
    example: 'Understanding that everything happens according to a rational, ordered plan.',
    significance: 'The foundation of Stoic cosmology and the source of human rationality.',
    relatedTerms: ['Reason', 'Universal Law', 'Divine Reason', 'Cosmic Order'],
    color: 'from-amber-500 to-yellow-600',
    icon: '👑'
  },
  {
    id: 'dharma',
    term: 'Dharma',
    pronunciation: 'DAR-mah',
    origin: 'Sanskrit',
    tradition: 'Hindu/Buddhist',
    definition: 'The cosmic law, moral duty, or the way things are meant to be.',
    example: 'Fulfilling one\'s responsibilities while living in harmony with natural laws.',
    significance: 'The fundamental principle that maintains cosmic and social order.',
    relatedTerms: ['Karma', 'Artha', 'Kama', 'Moksha'],
    color: 'from-indigo-500 to-purple-600',
    icon: '⚖️'
  },
  {
    id: 'phronesis',
    term: 'Phronesis',
    pronunciation: 'froh-NEE-sis',
    origin: 'Ancient Greek',
    tradition: 'Aristotelian',
    definition: 'Practical wisdom or the ability to make good judgments in particular situations.',
    example: 'Knowing when to be courageous and when to be cautious in different circumstances.',
    significance: 'The intellectual virtue that guides moral action and practical decision-making.',
    relatedTerms: ['Practical Wisdom', 'Prudence', 'Moral Judgment', 'Situational Ethics'],
    color: 'from-blue-500 to-indigo-600',
    icon: '🏛️'
  },
  {
    id: 'satori',
    term: 'Satori',
    pronunciation: 'sah-TOH-ree',
    origin: 'Japanese',
    tradition: 'Zen Buddhist',
    definition: 'Sudden enlightenment or awakening to the true nature of reality.',
    example: 'The moment of realization that all things are interconnected and impermanent.',
    significance: 'The direct experience of ultimate truth beyond conceptual understanding.',
    relatedTerms: ['Enlightenment', 'Kensho', 'Awakening', 'Zen'],
    color: 'from-green-500 to-emerald-600',
    icon: '🦟'
  },
  {
    id: 'amor-fati',
    term: 'Amor Fati',
    pronunciation: 'AH-mor FAH-tee',
    origin: 'Latin',
    tradition: 'Stoic/Nietzschean',
    definition: 'Love of fate - embracing and accepting everything that happens as necessary.',
    example: 'Finding meaning and purpose even in suffering and difficult circumstances.',
    significance: 'The Stoic attitude of accepting reality while maintaining inner freedom.',
    relatedTerms: ['Acceptance', 'Fate', 'Stoic Serenity', 'Necessity'],
    color: 'from-purple-500 to-pink-600',
    icon: '🧘'
  },
  {
    id: 'dao',
    term: 'Dao',
    pronunciation: 'dow',
    origin: 'Ancient Chinese',
    tradition: 'Daoist',
    definition: 'The Way - the natural order and flow of the universe that cannot be fully described.',
    example: 'The natural rhythm of seasons, the flow of rivers, the growth of plants.',
    significance: 'The fundamental principle of Daoism - the source and pattern of all existence.',
    relatedTerms: ['Wu Wei', 'Yin-Yang', 'Naturalness', 'The Way'],
    color: 'from-teal-500 to-cyan-600',
    icon: '☯️'
  },
  {
    id: 'arete',
    term: 'Arete',
    pronunciation: 'ah-REH-tay',
    origin: 'Ancient Greek',
    tradition: 'Classical Greek',
    definition: 'Excellence or virtue - the fulfillment of one\'s potential and purpose.',
    example: 'A craftsman achieving mastery in their art, or a person living virtuously.',
    significance: 'The ideal of human excellence that guides moral and practical development.',
    relatedTerms: ['Virtue', 'Excellence', 'Potential', 'Human Flourishing'],
    color: 'from-blue-500 to-indigo-600',
    icon: '🏛️'
  },
  {
    id: 'karma',
    term: 'Karma',
    pronunciation: 'KAR-mah',
    origin: 'Sanskrit',
    tradition: 'Hindu/Buddhist',
    definition: 'Action and its consequences - the law of cause and effect in moral life.',
    example: 'Kind actions leading to positive outcomes, harmful actions to suffering.',
    significance: 'The moral law that governs the cycle of rebirth and spiritual progress.',
    relatedTerms: ['Dharma', 'Rebirth', 'Moral Law', 'Consequences'],
    color: 'from-indigo-500 to-purple-600',
    icon: '⚖️'
  },
  {
    id: 'elenchus',
    term: 'Elenchus',
    pronunciation: 'eh-LEN-kus',
    origin: 'Ancient Greek',
    tradition: 'Socratic',
    definition: 'The Socratic method of questioning to expose contradictions and false beliefs.',
    example: 'Asking probing questions to help someone realize their assumptions are flawed.',
    significance: 'Socrates\' method for leading others to self-discovery and truth.',
    relatedTerms: ['Socratic Method', 'Questioning', 'Dialectic', 'Self-Examination'],
    color: 'from-green-500 to-emerald-600',
    icon: '🦟'
  },
  {
    id: 'li',
    term: 'Li',
    pronunciation: 'lee',
    origin: 'Ancient Chinese',
    tradition: 'Confucian',
    definition: 'Ritual, propriety, or proper conduct that maintains social harmony.',
    example: 'Showing respect to elders, following cultural customs, maintaining decorum.',
    significance: 'The external expression of inner virtue that creates social order.',
    relatedTerms: ['Ren', 'Propriety', 'Ritual', 'Social Harmony'],
    color: 'from-orange-500 to-red-600',
    icon: '📚'
  },
  {
    id: 'apatheia',
    term: 'Apatheia',
    pronunciation: 'ah-pah-THEE-ah',
    origin: 'Ancient Greek',
    tradition: 'Stoic',
    definition: 'Freedom from passion or emotional disturbance through rational control.',
    example: 'Remaining calm and rational even when facing anger, fear, or desire.',
    significance: 'The Stoic ideal of emotional mastery and inner tranquility.',
    relatedTerms: ['Ataraxia', 'Emotional Control', 'Stoic Serenity', 'Rational Mastery'],
    color: 'from-purple-500 to-pink-600',
    icon: '🧘'
  },
  {
    id: 'telos',
    term: 'Telos',
    pronunciation: 'TEH-lohs',
    origin: 'Ancient Greek',
    tradition: 'Aristotelian',
    definition: 'Purpose, end, or goal - the final cause that explains why something exists.',
    example: 'The telos of an acorn is to become an oak tree; the telos of humans is eudaimonia.',
    significance: 'The teleological view that everything has a purpose and natural end.',
    relatedTerms: ['Purpose', 'Final Cause', 'End', 'Natural Goal'],
    color: 'from-blue-500 to-indigo-600',
    icon: '🏛️'
  },
  {
    id: 'yin-yang',
    term: 'Yin-Yang',
    pronunciation: 'yin-yang',
    origin: 'Ancient Chinese',
    tradition: 'Daoist',
    definition: 'The complementary and interconnected forces that create harmony in the universe.',
    example: 'Day and night, light and dark, active and passive - all interconnected opposites.',
    significance: 'The fundamental principle of balance and harmony in Daoist cosmology.',
    relatedTerms: ['Dao', 'Balance', 'Harmony', 'Complementarity'],
    color: 'from-teal-500 to-cyan-600',
    icon: '☯️'
  },
  {
    id: 'sophrosyne',
    term: 'Sophrosyne',
    pronunciation: 'soh-FROH-sih-nee',
    origin: 'Ancient Greek',
    tradition: 'Classical Greek',
    definition: 'Temperance, moderation, and self-control - knowing one\'s limits.',
    example: 'Balancing work and rest, pleasure and duty, without excess or deficiency.',
    significance: 'One of the four cardinal virtues, essential for moral excellence.',
    relatedTerms: ['Temperance', 'Moderation', 'Self-Control', 'Balance'],
    color: 'from-blue-500 to-indigo-600',
    icon: '🏛️'
  },
  {
    id: 'junzi',
    term: 'Junzi',
    pronunciation: 'joon-zee',
    origin: 'Ancient Chinese',
    tradition: 'Confucian',
    definition: 'The noble person or gentleman who embodies moral excellence and proper conduct.',
    example: 'Someone who cultivates virtue, treats others with respect, and serves society.',
    significance: 'The Confucian ideal of moral cultivation and social responsibility.',
    relatedTerms: ['Noble Person', 'Moral Excellence', 'Character', 'Virtue'],
    color: 'from-orange-500 to-red-600',
    icon: '📚'
  },
  {
    id: 'stoicism',
    term: 'Stoicism',
    pronunciation: 'STOH-ih-siz-um',
    origin: 'Ancient Greek',
    tradition: 'Stoic',
    definition: 'A philosophy emphasizing virtue, reason, and acceptance of what cannot be controlled.',
    example: 'Focusing on developing character while accepting external circumstances.',
    significance: 'A practical philosophy for living with wisdom, courage, and tranquility.',
    relatedTerms: ['Virtue', 'Reason', 'Acceptance', 'Inner Freedom'],
    color: 'from-purple-500 to-pink-600',
    icon: '🧘'
  },
  {
    id: 'maat',
    term: 'Maat',
    pronunciation: 'mah-aht',
    origin: 'Ancient Egyptian',
    tradition: 'Egyptian',
    definition: 'Truth, justice, and cosmic order - the fundamental principle of the universe.',
    example: 'Living in harmony with natural laws and treating others with fairness.',
    significance: 'The Egyptian concept of divine order and moral truth.',
    relatedTerms: ['Truth', 'Justice', 'Cosmic Order', 'Harmony'],
    color: 'from-amber-500 to-yellow-600',
    icon: '👑'
  },
  {
    id: 'ziran',
    term: 'Ziran',
    pronunciation: 'zih-rahn',
    origin: 'Ancient Chinese',
    tradition: 'Daoist',
    definition: 'Naturalness or spontaneity - being true to one\'s nature without artificiality.',
    example: 'A child\'s natural curiosity or a flower growing without conscious effort.',
    significance: 'The Daoist ideal of living authentically and naturally.',
    relatedTerms: ['Naturalness', 'Spontaneity', 'Authenticity', 'Wu Wei'],
    color: 'from-teal-500 to-cyan-600',
    icon: '☯️'
  },
  {
    id: 'agape',
    term: 'Agape',
    pronunciation: 'ah-GAH-pay',
    origin: 'Ancient Greek',
    tradition: 'Christian/Philosophical',
    definition: 'Unconditional love, charity, or selfless concern for others.',
    example: 'Loving others not for what they can give, but for their inherent worth.',
    significance: 'The highest form of love that transcends personal interest.',
    relatedTerms: ['Love', 'Charity', 'Compassion', 'Selflessness'],
    color: 'from-green-500 to-emerald-600',
    icon: '🦟'
  },
  {
    id: 'xiao',
    term: 'Xiao',
    pronunciation: 'shyow',
    origin: 'Ancient Chinese',
    tradition: 'Confucian',
    definition: 'Filial piety - respect, care, and devotion to parents and ancestors.',
    example: 'Honoring parents, caring for them in old age, and continuing family traditions.',
    significance: 'The foundation of social harmony and moral development in Confucianism.',
    relatedTerms: ['Filial Piety', 'Respect', 'Family', 'Ancestors'],
    color: 'from-orange-500 to-red-600',
    icon: '📚'
  },
  {
    id: 'ataraxia',
    term: 'Ataraxia',
    pronunciation: 'ah-tah-RAK-see-ah',
    origin: 'Ancient Greek',
    tradition: 'Epicurean',
    definition: 'Freedom from worry and mental disturbance - inner tranquility.',
    example: 'Finding peace of mind through simple pleasures and avoiding unnecessary desires.',
    significance: 'The Epicurean goal of achieving mental tranquility and freedom from anxiety.',
    relatedTerms: ['Tranquility', 'Peace of Mind', 'Freedom from Worry', 'Mental Calm'],
    color: 'from-indigo-500 to-purple-600',
    icon: '⚖️'
  }
];

export function PhilosophicalTerminologyWidget() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const term = PHILOSOPHICAL_TERMS[currentIndex % PHILOSOPHICAL_TERMS.length];

  const nextTerm = () => {
    setCurrentIndex((prev) => (prev + 1) % PHILOSOPHICAL_TERMS.length);
  };

  const skipTerm = () => {
    setCurrentIndex((prev) => (prev + 1) % PHILOSOPHICAL_TERMS.length);
  };

  const getTraditionColor = (tradition: string) => {
    const colors: Record<string, string> = {
      'Aristotelian': 'from-blue-500 to-indigo-600',
      'Stoic': 'from-purple-500 to-pink-600',
      'Daoist': 'from-teal-500 to-cyan-600',
      'Confucian': 'from-orange-500 to-red-600',
      'Socratic': 'from-green-500 to-emerald-600',
      'Buddhist': 'from-indigo-500 to-purple-600',
      'Classical Greek': 'from-blue-500 to-indigo-600',
      'Christian': 'from-green-500 to-emerald-600'
    };
    return colors[tradition] || 'from-gray-500 to-gray-600';
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
            <h3 className="font-bold text-white text-lg">Terminology</h3>
            <p className="text-sm text-gray-400">Term {currentIndex + 1} of {PHILOSOPHICAL_TERMS.length}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-indigo-400">
            {PHILOSOPHICAL_TERMS.length}
          </div>
          <div className="text-xs text-gray-400">Terms</div>
        </div>
      </div>

      {/* Single Term Card */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={term.id}
          className="p-5 bg-white/5 border border-white/10 rounded-xl"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${term.color} flex items-center justify-center text-2xl`}>
              {term.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-white text-lg">{term.term}</h4>
                {term.pronunciation && (
                  <span className="text-sm text-gray-400">({term.pronunciation})</span>
                )}
              </div>
              <div className="flex items-center gap-2 mb-3 text-xs">
                <span className={`px-2 py-1 rounded-full bg-gradient-to-r ${getTraditionColor(term.tradition)} text-white`}>
                  {term.tradition}
                </span>
                <span className="text-gray-400">{term.origin}</span>
              </div>
              <div className="space-y-3">
                <div>
                  <h5 className="text-sm font-medium text-white mb-1 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Definition
                  </h5>
                  <p className="text-sm text-gray-300 leading-relaxed">{term.definition}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-gray-400">
          {term.tradition} • {term.origin}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={skipTerm}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-500/20 border border-gray-500/30 text-gray-300 hover:bg-gray-500/30 transition-colors"
            title="Skip to next term"
          >
            <SkipForward className="w-4 h-4" />
            Skip
          </button>
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