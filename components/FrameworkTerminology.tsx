'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, Users, Zap } from 'lucide-react';

interface FrameworkTerminologyProps {
  frameworkSlug: string;
  frameworkName: string;
  frameworkTone: string;
}

interface TerminologyItem {
  term: string;
  definition: string;
  category: 'technique' | 'concept' | 'practice' | 'principle';
  icon: React.ComponentType<{ className?: string }>;
}

const frameworkTerminologies: Record<string, {
  overview: string;
  coreConcepts: string[];
  terminology: TerminologyItem[];
}> = {
  spartan: {
    overview: "The Spartan Agōgē is a rigorous training system focused on building mental and physical resilience through deliberate hardship. It emphasizes that strength is forged through chosen adversity, teaching practitioners to embrace discomfort as a path to growth.",
    coreConcepts: [
      "Embrace discomfort to build mental fortitude",
      "Physical strength builds mental resilience", 
      "Discipline is the foundation of freedom",
      "Master your breath to master your mind"
    ],
    terminology: [
      {
        term: "Agōgē",
        definition: "The rigorous education and training system of ancient Sparta, designed to produce disciplined warriors and citizens.",
        category: "concept",
        icon: Target
      },
      {
        term: "Cold Exposure",
        definition: "Intentional exposure to cold temperatures to build mental resilience and improve stress response.",
        category: "technique",
        icon: Zap
      },
      {
        term: "RPE (Rate of Perceived Exertion)",
        definition: "A subjective scale to measure workout intensity, teaching you to listen to your body's signals.",
        category: "practice",
        icon: Lightbulb
      },
      {
        term: "Boundary Setting",
        definition: "The practice of clearly defining and communicating your limits, essential for maintaining discipline.",
        category: "principle",
        icon: Target
      },
      {
        term: "Wim Hof Method",
        definition: "A breathing technique that combines controlled hyperventilation with cold exposure for enhanced performance.",
        category: "technique",
        icon: Zap
      },
      {
        term: "Adversity Log",
        definition: "A reflective practice of documenting challenges and your responses to build mental toughness.",
        category: "practice",
        icon: BookOpen
      }
    ]
  },
  samurai: {
    overview: "Samurai Bushidō is the way of the warrior, emphasizing honor, justice, and ethical conduct. It teaches that honor is clarity in action, guiding practitioners to live with integrity and purpose in every decision.",
    coreConcepts: [
      "Honor is clarity in action",
      "Choose your guiding virtue for today",
      "Control your breath to control your power",
      "Seek understanding before being understood"
    ],
    terminology: [
      {
        term: "Bushidō",
        definition: "The way of the warrior - a code of conduct emphasizing honor, loyalty, courage, and ethical behavior.",
        category: "concept",
        icon: Target
      },
      {
        term: "Rectitude",
        definition: "Righteousness and moral integrity; the ability to make decisions with unwavering ethical clarity.",
        category: "principle",
        icon: Target
      },
      {
        term: "Benevolence",
        definition: "Compassion and kindness; the warrior's duty to protect and serve others with mercy.",
        category: "principle",
        icon: Users
      },
      {
        term: "Box Breathing",
        definition: "A controlled breathing pattern (4-4-4-4) to maintain calm and focus in any situation.",
        category: "technique",
        icon: Zap
      },
      {
        term: "Oath Journal",
        definition: "A practice of declaring daily duties and commitments to maintain honor and accountability.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Conflict Simulator",
        definition: "A method for practicing ethical decision-making in complex situations before they arise.",
        category: "technique",
        icon: Lightbulb
      }
    ]
  },
  stoic: {
    overview: "Stoicism is a philosophy of personal ethics that teaches the development of self-control and fortitude to overcome destructive emotions. It emphasizes focusing on what you can control and accepting what you cannot.",
    coreConcepts: [
      "Focus on what you can control",
      "Accept what you cannot change",
      "Practice negative visualization",
      "Live according to nature"
    ],
    terminology: [
      {
        term: "Dichotomy of Control",
        definition: "The fundamental Stoic principle that some things are within our control and others are not.",
        category: "concept",
        icon: Target
      },
      {
        term: "Negative Visualization",
        definition: "Imagining the worst-case scenario to appreciate what you have and prepare for adversity.",
        category: "technique",
        icon: Lightbulb
      },
      {
        term: "Amor Fati",
        definition: "Love of fate - embracing everything that happens as necessary and beneficial for your growth.",
        category: "principle",
        icon: Target
      },
      {
        term: "Memento Mori",
        definition: "Remember that you must die - a practice to live each day with purpose and urgency.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Premeditatio Malorum",
        definition: "The premeditation of evils - preparing mentally for potential difficulties.",
        category: "technique",
        icon: Zap
      },
      {
        term: "Stoic Journal",
        definition: "Daily reflection on your thoughts, actions, and adherence to Stoic principles.",
        category: "practice",
        icon: BookOpen
      }
    ]
  },
  buddhist: {
    overview: "Buddhist mindfulness practices focus on developing awareness, compassion, and inner peace. They teach that suffering comes from attachment and that liberation comes through understanding the nature of reality.",
    coreConcepts: [
      "Mindfulness in every moment",
      "Compassion for all beings",
      "Non-attachment to outcomes",
      "Understanding impermanence"
    ],
    terminology: [
      {
        term: "Mindfulness",
        definition: "Present-moment awareness without judgment; observing thoughts and sensations as they arise.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Metta",
        definition: "Loving-kindness meditation; cultivating unconditional love and compassion for all beings.",
        category: "technique",
        icon: Users
      },
      {
        term: "Impermanence",
        definition: "The understanding that all things are constantly changing; nothing lasts forever.",
        category: "concept",
        icon: Target
      },
      {
        term: "Non-Attachment",
        definition: "Freedom from clinging to outcomes, possessions, or identities that cause suffering.",
        category: "principle",
        icon: Target
      },
      {
        term: "Vipassana",
        definition: "Insight meditation; developing clear seeing into the true nature of reality.",
        category: "technique",
        icon: Zap
      },
      {
        term: "Compassion Practice",
        definition: "Cultivating empathy and kindness toward yourself and others in daily interactions.",
        category: "practice",
        icon: Users
      }
    ]
  },
  taoist: {
    overview: "Taoism emphasizes living in harmony with the natural flow of life (the Tao). It teaches the principle of wu-wei - effortless action - and finding balance between opposing forces.",
    coreConcepts: [
      "Flow with the natural way",
      "Balance yin and yang",
      "Practice effortless action",
      "Embrace simplicity"
    ],
    terminology: [
      {
        term: "Tao",
        definition: "The way or path; the natural order of the universe that cannot be fully described in words.",
        category: "concept",
        icon: Target
      },
      {
        term: "Wu-Wei",
        definition: "Effortless action; doing without doing, acting in harmony with the natural flow.",
        category: "principle",
        icon: Target
      },
      {
        term: "Yin-Yang",
        definition: "The balance of opposing forces; understanding that everything contains its opposite.",
        category: "concept",
        icon: Lightbulb
      },
      {
        term: "Qi Gong",
        definition: "Energy cultivation practices that harmonize body, breath, and mind with the Tao.",
        category: "technique",
        icon: Zap
      },
      {
        term: "Te",
        definition: "Virtue or power that comes from living in accordance with the Tao.",
        category: "principle",
        icon: Target
      },
      {
        term: "Flow State",
        definition: "A state of complete absorption where action feels effortless and time seems to disappear.",
        category: "practice",
        icon: BookOpen
      }
    ]
  },
  vedic: {
    overview: "Vedic wisdom encompasses ancient Indian philosophical traditions that explore consciousness, karma, and the nature of reality. It teaches that true knowledge leads to liberation and self-realization.",
    coreConcepts: [
      "Self-realization through knowledge",
      "Karma and dharma in action",
      "Meditation for consciousness",
      "Service to others"
    ],
    terminology: [
      {
        term: "Dharma",
        definition: "Righteous duty or cosmic law; living in accordance with your true nature and purpose.",
        category: "concept",
        icon: Target
      },
      {
        term: "Karma",
        definition: "Action and its consequences; understanding that your actions shape your future.",
        category: "concept",
        icon: Lightbulb
      },
      {
        term: "Meditation",
        definition: "Techniques to quiet the mind and experience pure consciousness beyond thought.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Seva",
        definition: "Selfless service; helping others without expectation of reward or recognition.",
        category: "practice",
        icon: Users
      },
      {
        term: "Pranayama",
        definition: "Breath control techniques to regulate life force energy and calm the mind.",
        category: "technique",
        icon: Zap
      },
      {
        term: "Self-Realization",
        definition: "Understanding your true nature beyond the ego and temporary identities.",
        category: "principle",
        icon: Target
      }
    ]
  },
  shamanic: {
    overview: "Shamanic practices connect with the natural world and spiritual realms through ritual, ceremony, and altered states of consciousness. They emphasize healing, transformation, and deep connection with all of creation.",
    coreConcepts: [
      "Connection with nature and spirit",
      "Healing through ceremony",
      "Transformation through ritual",
      "Honoring all life"
    ],
    terminology: [
      {
        term: "Shamanic Journey",
        definition: "An altered state of consciousness to access spiritual wisdom and healing insights.",
        category: "technique",
        icon: Zap
      },
      {
        term: "Power Animal",
        definition: "A spiritual guide in animal form that offers protection, wisdom, and strength.",
        category: "concept",
        icon: Target
      },
      {
        term: "Sacred Space",
        definition: "Creating a protected environment for spiritual work and healing ceremonies.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Ritual Practice",
        definition: "Intentional ceremonies that honor the cycles of nature and spiritual forces.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Energy Healing",
        definition: "Working with life force energy to restore balance and promote healing.",
        category: "technique",
        icon: Zap
      },
      {
        term: "Nature Connection",
        definition: "Deepening your relationship with the natural world as a source of wisdom and healing.",
        category: "principle",
        icon: Users
      }
    ]
  },
  hermetic: {
    overview: "Hermetic philosophy explores the relationship between the microcosm (human) and macrocosm (universe). It teaches that 'as above, so below' - the principles governing the universe also govern human consciousness.",
    coreConcepts: [
      "As above, so below",
      "Mentalism - all is mind",
      "Correspondence between levels",
      "Transmutation of energy"
    ],
    terminology: [
      {
        term: "Mentalism",
        definition: "The principle that the universe is mental in nature - all is mind, and reality is shaped by consciousness.",
        category: "concept",
        icon: Target
      },
      {
        term: "Correspondence",
        definition: "The principle that there are correspondences between different levels of reality - patterns repeat across scales.",
        category: "principle",
        icon: Lightbulb
      },
      {
        term: "Vibration",
        definition: "Everything in the universe vibrates at different frequencies; understanding this allows for transformation.",
        category: "concept",
        icon: Zap
      },
      {
        term: "Polarity",
        definition: "Everything has its opposite; understanding polarity allows for transmutation and balance.",
        category: "principle",
        icon: Target
      },
      {
        term: "Rhythm",
        definition: "Everything flows in cycles and rhythms; working with these natural patterns brings harmony.",
        category: "concept",
        icon: BookOpen
      },
      {
        term: "Transmutation",
        definition: "The process of changing one form of energy into another through understanding and application of principles.",
        category: "technique",
        icon: Zap
      }
    ]
  },
  alchemical: {
    overview: "Alchemy is the art of transformation - both physical and spiritual. It teaches the process of turning base materials into gold, symbolizing the transformation of the human soul from ignorance to wisdom.",
    coreConcepts: [
      "Transformation through process",
      "Purification leads to perfection",
      "Unity of opposites",
      "The philosopher's stone"
    ],
    terminology: [
      {
        term: "Nigredo",
        definition: "The blackening phase - breaking down old structures and confronting the shadow self.",
        category: "concept",
        icon: Target
      },
      {
        term: "Albedo",
        definition: "The whitening phase - purification and clarification of consciousness.",
        category: "concept",
        icon: Lightbulb
      },
      {
        term: "Citrinitas",
        definition: "The yellowing phase - the dawn of spiritual understanding and wisdom.",
        category: "concept",
        icon: Zap
      },
      {
        term: "Rubedo",
        definition: "The reddening phase - the final integration and perfection of the soul.",
        category: "concept",
        icon: Target
      },
      {
        term: "Philosopher's Stone",
        definition: "The ultimate goal of alchemy - the perfected state of consciousness and being.",
        category: "principle",
        icon: Target
      },
      {
        term: "Solve et Coagula",
        definition: "Dissolve and coagulate - the process of breaking down and rebuilding for transformation.",
        category: "technique",
        icon: Zap
      }
    ]
  },
  neoplatonic: {
    overview: "Neoplatonism explores the nature of reality through the concept of the One - the ultimate source from which all existence flows. It teaches the soul's journey back to unity through contemplation and virtue.",
    coreConcepts: [
      "The One as ultimate reality",
      "Soul's journey to unity",
      "Contemplation of the divine",
      "Virtue as purification"
    ],
    terminology: [
      {
        term: "The One",
        definition: "The ultimate, ineffable source of all existence - beyond being and non-being.",
        category: "concept",
        icon: Target
      },
      {
        term: "Nous",
        definition: "Divine intellect - the realm of pure thought and eternal forms.",
        category: "concept",
        icon: Lightbulb
      },
      {
        term: "Psyche",
        definition: "The soul - the intermediary between the material and spiritual realms.",
        category: "concept",
        icon: Target
      },
      {
        term: "Contemplation",
        definition: "The practice of turning inward to experience the divine and achieve union with the One.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Purification",
        definition: "The process of cleansing the soul of material attachments to ascend toward the divine.",
        category: "principle",
        icon: Zap
      },
      {
        term: "Theurgy",
        definition: "Sacred rituals and practices that help the soul ascend to higher levels of reality.",
        category: "technique",
        icon: Zap
      }
    ]
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'technique': return 'from-blue-500 to-cyan-500';
    case 'concept': return 'from-purple-500 to-pink-500';
    case 'practice': return 'from-green-500 to-emerald-500';
    case 'principle': return 'from-orange-500 to-red-500';
    default: return 'from-gray-500 to-gray-600';
  }
};

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'technique': return 'Technique';
    case 'concept': return 'Concept';
    case 'practice': return 'Practice';
    case 'principle': return 'Principle';
    default: return 'Term';
  }
};

export default function FrameworkTerminology({ frameworkSlug, frameworkName, frameworkTone }: FrameworkTerminologyProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const frameworkData = frameworkTerminologies[frameworkSlug];
  
  if (!frameworkData) {
    return null;
  }

  const categories = ['all', ...Array.from(new Set(frameworkData.terminology.map(item => item.category)))];
  
  const filteredTerminology = selectedCategory === 'all' 
    ? frameworkData.terminology 
    : frameworkData.terminology.filter(item => item.category === selectedCategory);

  return (
    <div className="glass-card mb-8">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Framework Terminology</h2>
            <p className="text-gray-300 text-sm">Core concepts and practices of {frameworkName}</p>
          </div>
        </div>

        {/* Overview */}
        <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <h3 className="text-lg font-medium text-white mb-2">Overview</h3>
          <p className="text-gray-300 leading-relaxed">{frameworkData.overview}</p>
        </div>

        {/* Core Concepts */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-white mb-3">Core Concepts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {frameworkData.coreConcepts.map((concept, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300 text-sm">{concept}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-amber-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {category === 'all' ? 'All' : getCategoryLabel(category)}
              </button>
            ))}
          </div>
        </div>

        {/* Terminology List */}
        <div className="space-y-3">
          {filteredTerminology.slice(0, isExpanded ? undefined : 3).map((item, index) => (
            <motion.div
              key={item.term}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 bg-gradient-to-r ${getCategoryColor(item.category)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <item.icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-white">{item.term}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${getCategoryColor(item.category)} text-white`}>
                      {getCategoryLabel(item.category)}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{item.definition}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Expand/Collapse Button */}
        {frameworkData.terminology.length > 3 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Show More ({frameworkData.terminology.length - 3} more)
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 