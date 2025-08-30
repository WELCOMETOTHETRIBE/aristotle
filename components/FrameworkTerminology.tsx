'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Target, Zap, Users, Lightbulb } from 'lucide-react';

interface FrameworkTerminologyProps {
  frameworkSlug: string;
  frameworkName: string;
  frameworkTone: string;
}

interface Term {
  term: string;
  definition: string;
  category: 'technique' | 'concept' | 'practice' | 'principle';
  icon: any;
}

const frameworkTerminologies: Record<string, {
  overview: string;
  coreConcepts: string[];
  terminology: Term[];
}> = {
  spartan: {
    overview: "The Spartan Agōgē emphasizes discipline, courage, and physical excellence. It teaches that true strength comes from overcoming adversity and maintaining unwavering resolve in the face of challenges.",
    coreConcepts: [
      "Discipline through hardship",
      "Courage in adversity",
      "Physical and mental strength",
      "Unwavering resolve"
    ],
    terminology: [
      {
        term: "Agōgē",
        definition: "The rigorous education and training system that transformed Spartan boys into warriors. It emphasized discipline, physical fitness, and mental toughness.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Krypteia",
        definition: "A secret police force of young Spartan men who tested their skills through stealth missions and survival challenges.",
        category: "technique",
        icon: Zap
      },
      {
        term: "Laconic Speech",
        definition: "Brevity and conciseness in speech, reflecting Spartan values of efficiency and directness.",
        category: "principle",
        icon: Target
      },
      {
        term: "Phalanx Formation",
        definition: "A military formation where soldiers stand shoulder to shoulder, emphasizing unity and collective strength.",
        category: "concept",
        icon: Users
      },
      {
        term: "Ephors",
        definition: "Five elected officials who oversaw the Spartan government and ensured adherence to Spartan law and customs.",
        category: "concept",
        icon: Target
      }
    ]
  },
  samurai: {
    overview: "Bushidō, the way of the warrior, emphasizes honor, loyalty, and moral discipline. It teaches that true strength comes from living with integrity and serving others with unwavering dedication.",
    coreConcepts: [
      "Honor above all",
      "Loyalty to master",
      "Moral discipline",
      "Service to others"
    ],
    terminology: [
      {
        term: "Bushidō",
        definition: "The code of conduct for samurai warriors, emphasizing honor, loyalty, courage, and moral discipline.",
        category: "principle",
        icon: Target
      },
      {
        term: "Seppuku",
        definition: "Ritual suicide by disembowelment, performed to preserve honor or atone for failure.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Katana",
        definition: "The curved, single-edged sword that symbolizes the samurai's soul and commitment to their code.",
        category: "concept",
        icon: Target
      },
      {
        term: "Daimyō",
        definition: "A powerful feudal lord who ruled over territories and commanded samurai warriors.",
        category: "concept",
        icon: Users
      },
      {
        term: "Zen Meditation",
        definition: "Mindfulness practice that cultivates focus, clarity, and the ability to act without hesitation.",
        category: "technique",
        icon: Zap
      }
    ]
  },
  stoic: {
    overview: "Stoicism teaches that virtue is the only good and that we should focus on what we can control while accepting what we cannot. It emphasizes rational thinking and emotional resilience.",
    coreConcepts: [
      "Virtue is the only good",
      "Focus on what you control",
      "Accept what you cannot change",
      "Live according to nature"
    ],
    terminology: [
      {
        term: "Logos",
        definition: "The rational principle that governs the universe and human nature. Living in accordance with logos brings harmony.",
        category: "concept",
        icon: Target
      },
      {
        term: "Apatheia",
        definition: "Freedom from destructive emotions, achieved through rational thinking and self-discipline.",
        category: "principle",
        icon: Lightbulb
      },
      {
        term: "Negative Visualization",
        definition: "Imagining the loss of what we value to appreciate it more and prepare for potential hardships.",
        category: "technique",
        icon: Zap
      },
      {
        term: "Dichotomy of Control",
        definition: "Distinguishing between what we can control (our thoughts, actions) and what we cannot (external events).",
        category: "concept",
        icon: Target
      },
      {
        term: "Memento Mori",
        definition: "Remembering that we will die, which helps us live more meaningfully and prioritize what truly matters.",
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
        definition: "Circular processes where outputs become inputs, creating self-reinforcing or self-correcting patterns.",
        category: "concept",
        icon: Target
      },
      {
        term: "Leverage Points",
        definition: "Strategic places in a system where small changes can create large, lasting improvements.",
        category: "technique",
        icon: Zap
      },
      {
        term: "Pattern Recognition",
        definition: "Identifying recurring structures and relationships that help understand system behavior.",
        category: "practice",
        icon: BookOpen
      }
    ]
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'technique': return 'text-blue-400';
    case 'concept': return 'text-purple-400';
    case 'practice': return 'text-green-400';
    case 'principle': return 'text-orange-400';
    default: return 'text-gray-400';
  }
};

const getCategoryBg = (category: string) => {
  switch (category) {
    case 'technique': return 'bg-blue-500/10 border-blue-500/30';
    case 'concept': return 'bg-purple-500/10 border-purple-500/30';
    case 'practice': return 'bg-green-500/10 border-green-500/30';
    case 'principle': return 'bg-orange-500/10 border-orange-500/30';
    default: return 'bg-gray-500/10 border-gray-500/30';
  }
};

export default function FrameworkTerminology({ frameworkSlug, frameworkName, frameworkTone }: FrameworkTerminologyProps) {
  const [currentTermIndex, setCurrentTermIndex] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);

  const frameworkData = frameworkTerminologies[frameworkSlug];
  
  if (!frameworkData) {
    return null;
  }

  const currentTerm = frameworkData.terminology[currentTermIndex];
  const totalTerms = frameworkData.terminology.length;

  const nextTerm = () => {
    setCurrentTermIndex((prev) => (prev + 1) % totalTerms);
    setShowDefinition(false);
  };

  const prevTerm = () => {
    setCurrentTermIndex((prev) => (prev - 1 + totalTerms) % totalTerms);
    setShowDefinition(false);
  };

  const handleDefine = () => {
    setShowDefinition(!showDefinition);
  };

  return (
    <div className="page-section">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="section-title mb-2">Framework Terminology</h2>
          <p className="section-description">
            Key concepts and practices from the {frameworkName} tradition
          </p>
        </div>

        {/* Term Gallery */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          {/* Current Term Display */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <currentTerm.icon className="w-6 h-6 text-blue-400" />
              <span className={`text-sm font-medium px-3 py-1 rounded-full border ${getCategoryBg(currentTerm.category)} ${getCategoryColor(currentTerm.category)}`}>
                {currentTerm.category.charAt(0).toUpperCase() + currentTerm.category.slice(1)}
              </span>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4">{currentTerm.term}</h3>
            
            {showDefinition ? (
              <div className="bg-white/10 rounded-lg p-4 mb-4">
                <p className="text-gray-200 leading-relaxed">{currentTerm.definition}</p>
              </div>
            ) : (
              <div className="h-16 flex items-center justify-center">
                <p className="text-gray-400 italic">Click "Define" to learn more</p>
              </div>
            )}
            
            <button
              onClick={handleDefine}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
            >
              {showDefinition ? 'Hide Definition' : 'Define'}
            </button>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={prevTerm}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              disabled={totalTerms <= 1}
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            
            {/* Progress Slider */}
            <div className="flex-1 mx-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">
                  {currentTermIndex + 1} of {totalTerms}
                </span>
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentTermIndex + 1) / totalTerms) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            
            <button
              onClick={nextTerm}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              disabled={totalTerms <= 1}
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Overview */}
        <div className="mt-6 text-center">
          <h4 className="text-lg font-semibold text-white mb-2">About {frameworkName}</h4>
          <p className="text-gray-300 leading-relaxed">{frameworkData.overview}</p>
        </div>
      </div>
    </div>
  );
} 