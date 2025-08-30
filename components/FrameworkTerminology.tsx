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
        term: "Discipline Through Hardship",
        definition: "Embracing difficult challenges as opportunities to build mental and physical strength, rather than avoiding discomfort.",
        category: "principle",
        icon: Target
      },
      {
        term: "Laconic Communication",
        definition: "Speaking with precision and brevity, avoiding unnecessary words and focusing on what truly matters.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Collective Strength",
        definition: "Understanding that individual excellence is amplified when working in unity with others toward common goals.",
        category: "concept",
        icon: Users
      },
      {
        term: "Austerity Mindset",
        definition: "Choosing simplicity over luxury, focusing on what is necessary rather than what is comfortable or impressive.",
        category: "principle",
        icon: Target
      },
      {
        term: "Physical Excellence",
        definition: "Maintaining peak physical condition as a foundation for mental clarity and emotional resilience.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Unwavering Resolve",
        definition: "Maintaining commitment to goals and principles even when faced with overwhelming obstacles or opposition.",
        category: "principle",
        icon: Target
      },
      {
        term: "Courage in Adversity",
        definition: "Facing difficult situations with calm determination rather than fear or avoidance.",
        category: "principle",
        icon: Target
      },
      {
        term: "Mental Toughness",
        definition: "Developing the ability to maintain focus and performance under pressure, stress, or discomfort.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Efficiency in Action",
        definition: "Eliminating waste in time, energy, and resources to achieve maximum impact with minimum effort.",
        category: "principle",
        icon: Target
      },
      {
        term: "Honor Through Deeds",
        definition: "Building reputation and respect through consistent actions that align with core values and principles.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Adaptive Rigor",
        definition: "Maintaining high standards while being flexible enough to adapt to changing circumstances and challenges.",
        category: "principle",
        icon: Target
      },
      {
        term: "Sustained Excellence",
        definition: "Consistently performing at a high level over time, rather than achieving temporary peaks followed by decline.",
        category: "principle",
        icon: Target
      }
    ]
  },
  bushido: {
    overview: "Bushidō, the way of the warrior, emphasizes honor, loyalty, and moral discipline. It teaches that true strength comes from living with integrity and serving others with unwavering dedication.",
    coreConcepts: [
      "Honor above all",
      "Loyalty to master",
      "Moral discipline",
      "Service to others"
    ],
    terminology: [
      {
        term: "Honor Above All",
        definition: "Maintaining personal integrity and moral character as the foundation of all actions and decisions.",
        category: "principle",
        icon: Target
      },
      {
        term: "Loyalty to Purpose",
        definition: "Remaining committed to core values and long-term goals even when faced with temptation or difficulty.",
        category: "principle",
        icon: Target
      },
      {
        term: "Moral Discipline",
        definition: "Consistently choosing what is right over what is easy, building character through daily choices.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Service to Others",
        definition: "Finding meaning and purpose through contributing to the well-being of others and the community.",
        category: "principle",
        icon: Users
      },
      {
        term: "Mindful Action",
        definition: "Acting with full awareness and intention, avoiding impulsive or thoughtless behavior.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Courage in Integrity",
        definition: "Standing up for what is right even when it requires personal sacrifice or facing opposition.",
        category: "principle",
        icon: Target
      },
      {
        term: "Respect for All",
        definition: "Treating every person with dignity and respect, regardless of their status or position.",
        category: "principle",
        icon: Users
      },
      {
        term: "Continuous Self-Improvement",
        definition: "Dedication to lifelong learning and personal development in all aspects of life.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Balance in Life",
        definition: "Maintaining harmony between different life areas while staying true to core principles.",
        category: "concept",
        icon: Target
      },
      {
        term: "Grace Under Pressure",
        definition: "Maintaining composure and effectiveness even in the most challenging circumstances.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Legacy of Character",
        definition: "Building a reputation and influence that outlasts your physical presence through consistent values.",
        category: "concept",
        icon: Target
      },
      {
        term: "Warrior Spirit",
        definition: "Cultivating inner strength, resilience, and determination to overcome life's challenges.",
        category: "principle",
        icon: Target
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
        term: "Focus on What You Control",
        definition: "Directing energy and attention only to things within your power to change, accepting what you cannot control.",
        category: "principle",
        icon: Target
      },
      {
        term: "Virtue as the Only Good",
        definition: "Understanding that true happiness comes from living with integrity, wisdom, courage, and justice.",
        category: "principle",
        icon: Target
      },
      {
        term: "Negative Visualization",
        definition: "Imagining the loss of what we value to appreciate it more and prepare for potential hardships.",
        category: "technique",
        icon: Zap
      },
      {
        term: "Emotional Mastery",
        definition: "Developing the ability to choose rational responses over emotional reactions in all situations.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Acceptance of Reality",
        definition: "Embracing life as it is rather than how we wish it to be, finding peace in what cannot be changed.",
        category: "principle",
        icon: Target
      },
      {
        term: "Memento Mori",
        definition: "Remembering that we will die, which helps us live more meaningfully and prioritize what truly matters.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Amor Fati",
        definition: "Loving your fate - embracing every experience as necessary for your growth and development.",
        category: "principle",
        icon: Target
      },
      {
        term: "Rational Thinking",
        definition: "Using logic and reason to make decisions rather than being driven by emotions or external pressures.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Inner Freedom",
        definition: "Finding liberation through self-discipline and mastery of your thoughts and desires.",
        category: "concept",
        icon: Target
      },
      {
        term: "Resilience Through Adversity",
        definition: "Using challenges as opportunities to strengthen character and develop wisdom.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Living According to Nature",
        definition: "Aligning your actions with universal principles and your own authentic nature.",
        category: "principle",
        icon: Target
      },
      {
        term: "Mindful Awareness",
        definition: "Cultivating present-moment awareness to make conscious choices rather than automatic reactions.",
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
        term: "Daily Rhythm",
        definition: "Creating a structured pattern of activities that balances work, rest, and reflection throughout the day.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Silence and Solitude",
        definition: "Regular periods of quiet to hear your inner voice and cultivate deeper self-awareness.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Service to Others",
        definition: "Finding meaning through contributing to the well-being of others and the community.",
        category: "principle",
        icon: Users
      },
      {
        term: "Humility in Action",
        definition: "Performing small, unnoticed acts of service that cultivate genuine humility and selflessness.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Mindful Work",
        definition: "Approaching all tasks with full attention and presence, treating work as a form of meditation.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Community Connection",
        definition: "Building meaningful relationships and supporting others in their growth and development.",
        category: "concept",
        icon: Users
      },
      {
        term: "Spiritual Practice",
        definition: "Regular activities that nurture your inner life and connection to something greater than yourself.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Simplicity of Life",
        definition: "Reducing complexity and distractions to focus on what truly matters and brings peace.",
        category: "principle",
        icon: Target
      },
      {
        term: "Gratitude Practice",
        definition: "Cultivating appreciation for the blessings in your life, both big and small.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Contemplative Reading",
        definition: "Engaging with wisdom texts slowly and reflectively to absorb their deeper meaning.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Sacred Time",
        definition: "Setting aside specific periods for reflection, prayer, or spiritual practice.",
        category: "concept",
        icon: Target
      },
      {
        term: "Inner Peace",
        definition: "Cultivating a calm and centered state of mind that remains steady regardless of external circumstances.",
        category: "principle",
        icon: Target
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
  highperf: {
    overview: "Modern High-Performance methodology combines cutting-edge psychology, neuroscience, and systems thinking to optimize human potential. It teaches that peak performance comes from understanding and leveraging the complex systems that drive human excellence.",
    coreConcepts: [
      "Systems-based optimization",
      "Evidence-driven practices",
      "Continuous improvement",
      "Peak state management"
    ],
    terminology: [
      {
        term: "Flow State",
        definition: "A state of complete absorption in an activity where time seems to disappear and performance is optimal.",
        category: "concept",
        icon: Target
      },
      {
        term: "Kaizen",
        definition: "Japanese philosophy of continuous improvement through small, incremental changes.",
        category: "principle",
        icon: Lightbulb
      },
      {
        term: "Biofeedback",
        definition: "Using real-time data about physiological processes to improve performance and well-being.",
        category: "technique",
        icon: Zap
      },
      {
        term: "Habit Stacking",
        definition: "Building new habits by attaching them to existing routines and behaviors.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Energy Management",
        definition: "Optimizing physical, mental, and emotional energy for peak performance throughout the day.",
        category: "practice",
        icon: Users
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

  const frameworkData = frameworkTerminologies[frameworkSlug];
  
  if (!frameworkData) {
    return null;
  }

  const currentTerm = frameworkData.terminology[currentTermIndex];
  const totalTerms = frameworkData.terminology.length;

  const nextTerm = () => {
    setCurrentTermIndex((prev) => (prev + 1) % totalTerms);
  };

  const prevTerm = () => {
    setCurrentTermIndex((prev) => (prev - 1 + totalTerms) % totalTerms);
  };

  return (
    <div className="page-section">
      <div className="max-w-2xl mx-auto">
        {/* Term Gallery */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          {/* Terminology Header */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-white mb-2">Terminology</h3>
            <p className="text-gray-400 text-sm">
              Key concepts and practices from the {frameworkName} tradition
            </p>
          </div>
          {/* Current Term Display */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <currentTerm.icon className="w-6 h-6 text-blue-400" />
              <span className={`text-sm font-medium px-3 py-1 rounded-full border ${getCategoryBg(currentTerm.category)} ${getCategoryColor(currentTerm.category)}`}>
                {currentTerm.category.charAt(0).toUpperCase() + currentTerm.category.slice(1)}
              </span>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4">{currentTerm.term}</h3>
            
            {/* Always Show Definition */}
            <div className="bg-white/10 rounded-lg p-4 mb-4">
              <p className="text-gray-200 leading-relaxed">{currentTerm.definition}</p>
            </div>
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
      </div>
    </div>
  );
} 