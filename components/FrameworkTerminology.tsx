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
  monastic: {
    overview: "The Monastic Rule emphasizes rhythm, order, and service as the foundation of spiritual growth. It teaches that consistent daily practices and community service create the conditions for inner peace and wisdom.",
    coreConcepts: [
      "Rhythm roots the soul",
      "Keep the rhythm of prayer and work",
      "Silence reveals the voice within",
      "Service is the highest calling"
    ],
    terminology: [
      {
        term: "Rule of Life",
        definition: "A structured daily rhythm that balances prayer, work, and rest in a sustainable pattern.",
        category: "concept",
        icon: Target
      },
      {
        term: "Bell Schedule",
        definition: "The seven canonical hours that structure the monastic day with prayer and work.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Silence Practice",
        definition: "Intentional periods of quiet to hear the inner voice and cultivate inner peace.",
        category: "technique",
        icon: Zap
      },
      {
        term: "Humility Acts",
        definition: "Small, unnoticed acts of service that cultivate humility and selflessness.",
        category: "principle",
        icon: Target
      },
      {
        term: "Community Chores",
        definition: "Service to others as a spiritual practice that builds character and connection.",
        category: "practice",
        icon: Users
      },
      {
        term: "Ocean Breathing",
        definition: "A slow, rhythmic breathing pattern that mimics the natural flow of ocean waves.",
        category: "technique",
        icon: Zap
      }
    ]
  },
  yogic: {
    overview: "The Yogic Path integrates body, breath, and mind through ancient practices that cultivate balance, awareness, and spiritual growth. It teaches that alignment of these three elements leads to harmony and wisdom.",
    coreConcepts: [
      "Align body, breath, and mind",
      "Find balance in body and mind",
      "Stillness reveals the warrior within",
      "Move with awareness and grace"
    ],
    terminology: [
      {
        term: "Asana",
        definition: "Physical postures that strengthen the body and prepare it for meditation and spiritual practice.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Pranayama",
        definition: "Breath control techniques that regulate life force energy and calm the mind.",
        category: "technique",
        icon: Zap
      },
      {
        term: "Chakra",
        definition: "Energy centers in the body that correspond to different aspects of consciousness and life.",
        category: "concept",
        icon: Target
      },
      {
        term: "Mindful Movement",
        definition: "Moving with full awareness and presence, treating movement as meditation.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Alt-Nostril Breathing",
        definition: "A breathing technique that balances the left and right energies of the body.",
        category: "technique",
        icon: Zap
      },
      {
        term: "Sun Salutation",
        definition: "A flowing sequence of postures that energizes the body and honors the sun.",
        category: "practice",
        icon: BookOpen
      }
    ]
  },
  indigenous: {
    overview: "Indigenous wisdom traditions emphasize deep connection with the natural world, community, and ancestral knowledge. They teach that all life is interconnected and that wisdom comes from living in harmony with nature.",
    coreConcepts: [
      "All life is interconnected",
      "Honor the ancestors and traditions",
      "Learn from the natural world",
      "Community is the foundation"
    ],
    terminology: [
      {
        term: "Ancestral Wisdom",
        definition: "Knowledge passed down through generations, connecting us to our roots and traditions.",
        category: "concept",
        icon: Target
      },
      {
        term: "Nature Connection",
        definition: "Deepening our relationship with the natural world as a source of wisdom and healing.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Community Ceremony",
        definition: "Rituals and practices that strengthen community bonds and honor shared values.",
        category: "practice",
        icon: Users
      },
      {
        term: "Sacred Plants",
        definition: "Medicinal and spiritual plants used for healing, wisdom, and connection to the earth.",
        category: "concept",
        icon: Target
      },
      {
        term: "Storytelling",
        definition: "The oral tradition of sharing wisdom, history, and values through stories.",
        category: "technique",
        icon: Zap
      },
      {
        term: "Seasonal Awareness",
        definition: "Living in harmony with the natural cycles and rhythms of the earth.",
        category: "principle",
        icon: Lightbulb
      }
    ]
  },
  martial: {
    overview: "Martial arts traditions teach discipline, respect, and the development of both physical and mental strength. They emphasize that true mastery comes from consistent practice and inner development.",
    coreConcepts: [
      "Discipline through practice",
      "Respect for tradition and teachers",
      "Physical and mental development",
      "Mastery through repetition"
    ],
    terminology: [
      {
        term: "Kata",
        definition: "Pre-arranged sequences of movements that develop technique, focus, and discipline.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Dojo",
        definition: "The training hall - a sacred space for learning, practice, and personal development.",
        category: "concept",
        icon: Target
      },
      {
        term: "Sensei",
        definition: "Teacher or master who guides students in their martial and spiritual development.",
        category: "concept",
        icon: Users
      },
      {
        term: "Ki/Qi",
        definition: "Life force energy that can be cultivated and directed through practice.",
        category: "concept",
        icon: Zap
      },
      {
        term: "Meditation in Motion",
        definition: "Moving meditation practices that develop focus and awareness.",
        category: "technique",
        icon: Zap
      },
      {
        term: "Bushido",
        definition: "The way of the warrior - ethical principles that guide martial practice.",
        category: "principle",
        icon: Target
      }
    ]
  },
  sufi: {
    overview: "Sufism is the mystical dimension of Islam, emphasizing love, devotion, and direct experience of the divine. It teaches that the heart is the seat of wisdom and that love is the path to union with God.",
    coreConcepts: [
      "Love is the path to God",
      "The heart is the seat of wisdom",
      "Devotion through practice",
      "Union through surrender"
    ],
    terminology: [
      {
        term: "Dhikr",
        definition: "Remembrance of God through repetition of sacred phrases or names.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Sama",
        definition: "Sacred music and dance that opens the heart and creates spiritual ecstasy.",
        category: "technique",
        icon: Zap
      },
      {
        term: "Whirling",
        definition: "A form of moving meditation that symbolizes the rotation of the universe.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Fana",
        definition: "Annihilation of the ego and union with the divine presence.",
        category: "concept",
        icon: Target
      },
      {
        term: "Baqa",
        definition: "Subsistence in God - living in the world while remaining connected to the divine.",
        category: "concept",
        icon: Target
      },
      {
        term: "Heart Opening",
        definition: "Cultivating love, compassion, and receptivity to divine guidance.",
        category: "principle",
        icon: Lightbulb
      }
    ]
  },
  ubuntu: {
    overview: "Ubuntu philosophy emphasizes the interconnectedness of all people and the importance of community. It teaches that 'I am because we are' - our humanity is defined by our relationships with others.",
    coreConcepts: [
      "I am because we are",
      "Community is the foundation",
      "Service to others",
      "Interconnectedness of all life"
    ],
    terminology: [
      {
        term: "Ubuntu",
        definition: "A philosophy that emphasizes the interconnectedness of all people and the importance of community.",
        category: "concept",
        icon: Target
      },
      {
        term: "Community Building",
        definition: "Creating and strengthening connections between people for mutual support and growth.",
        category: "practice",
        icon: Users
      },
      {
        term: "Collective Wisdom",
        definition: "The wisdom that emerges when people come together to share knowledge and experience.",
        category: "concept",
        icon: Lightbulb
      },
      {
        term: "Service Leadership",
        definition: "Leading by serving others and putting the needs of the community first.",
        category: "principle",
        icon: Target
      },
      {
        term: "Story Circle",
        definition: "A practice of sharing personal stories to build understanding and connection.",
        category: "technique",
        icon: Zap
      },
      {
        term: "Intergenerational Learning",
        definition: "Learning from elders and passing wisdom to younger generations.",
        category: "practice",
        icon: BookOpen
      }
    ]
  },
  systems: {
    overview: "Systems thinking approaches complex problems by understanding the relationships and patterns that connect different parts of a system. It teaches that everything is interconnected and that solutions must address the whole system.",
    coreConcepts: [
      "Everything is interconnected",
      "Patterns reveal solutions",
      "Whole systems thinking",
      "Emergence from complexity"
    ],
    terminology: [
      {
        term: "Systems Thinking",
        definition: "A way of understanding how different parts of a system interact and influence each other.",
        category: "concept",
        icon: Target
      },
      {
        term: "Emergence",
        definition: "Properties that arise from the interaction of system components that aren't present in individual parts.",
        category: "concept",
        icon: Lightbulb
      },
      {
        term: "Feedback Loops",
        definition: "Circular processes where outputs become inputs, creating self-reinforcing or balancing patterns.",
        category: "technique",
        icon: Zap
      },
      {
        term: "Leverage Points",
        definition: "Strategic places in a system where small changes can create large effects.",
        category: "principle",
        icon: Target
      },
      {
        term: "Pattern Recognition",
        definition: "Identifying recurring structures and relationships that help understand system behavior.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Holistic Solutions",
        definition: "Approaches that address the whole system rather than just individual parts.",
        category: "principle",
        icon: Target
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