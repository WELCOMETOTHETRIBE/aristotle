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
        term: "Body-Mind Integration",
        definition: "Cultivating awareness of how physical and mental states influence each other for holistic well-being.",
        category: "concept",
        icon: Target
      },
      {
        term: "Breath Awareness",
        definition: "Using conscious breathing as a tool to calm the mind, reduce stress, and increase energy.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Mindful Movement",
        definition: "Moving with full awareness and presence, treating physical activity as meditation.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Energy Management",
        definition: "Understanding and optimizing your physical, mental, and emotional energy throughout the day.",
        category: "concept",
        icon: Target
      },
      {
        term: "Balance and Harmony",
        definition: "Finding equilibrium between different aspects of life and maintaining inner stability.",
        category: "principle",
        icon: Target
      },
      {
        term: "Present Moment Awareness",
        definition: "Cultivating the ability to stay fully engaged in the current moment without distraction.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Inner Stillness",
        definition: "Developing the capacity to find peace and clarity even in the midst of external chaos.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Graceful Action",
        definition: "Moving through life with ease, efficiency, and beauty in all your activities.",
        category: "principle",
        icon: Target
      },
      {
        term: "Self-Observation",
        definition: "Developing the ability to observe your thoughts, emotions, and behaviors without judgment.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Holistic Health",
        definition: "Caring for your physical, mental, emotional, and spiritual well-being as interconnected aspects.",
        category: "concept",
        icon: Target
      },
      {
        term: "Flow State",
        definition: "Entering a state of complete absorption where time seems to disappear and performance is optimal.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Spiritual Growth",
        definition: "Continuous development of your inner life and connection to something greater than yourself.",
        category: "principle",
        icon: Target
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
        term: "Interconnectedness",
        definition: "Understanding that all life is connected and that our actions affect the entire web of existence.",
        category: "concept",
        icon: Target
      },
      {
        term: "Nature as Teacher",
        definition: "Learning wisdom, patience, and resilience by observing and connecting with the natural world.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Community Wisdom",
        definition: "Valuing the collective knowledge and experience of the community over individual expertise.",
        category: "concept",
        icon: Users
      },
      {
        term: "Ancestral Connection",
        definition: "Honoring and learning from the wisdom and traditions passed down through generations.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Sacred Relationship",
        definition: "Treating all beings and the earth itself with reverence and respect.",
        category: "principle",
        icon: Target
      },
      {
        term: "Storytelling Wisdom",
        definition: "Using stories to share knowledge, values, and life lessons in memorable and meaningful ways.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Seasonal Awareness",
        definition: "Living in harmony with natural cycles and rhythms rather than fighting against them.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Gratitude for Life",
        definition: "Cultivating deep appreciation for the gifts of life, nature, and community.",
        category: "principle",
        icon: Target
      },
      {
        term: "Sustainable Living",
        definition: "Making choices that ensure the well-being of future generations and the earth.",
        category: "principle",
        icon: Target
      },
      {
        term: "Ceremonial Practice",
        definition: "Creating meaningful rituals and ceremonies to mark important moments and transitions.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Listening to the Land",
        definition: "Developing sensitivity to the wisdom and messages that come from the natural world.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Elders' Guidance",
        definition: "Seeking wisdom and counsel from those who have lived longer and gained deeper understanding.",
        category: "principle",
        icon: Users
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
        term: "Discipline Through Practice",
        definition: "Building character and skill through consistent, focused training and repetition.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Respect for Tradition",
        definition: "Honoring the wisdom and methods passed down through generations of practitioners.",
        category: "principle",
        icon: Target
      },
      {
        term: "Mind-Body Unity",
        definition: "Developing the integration of physical technique with mental focus and spiritual awareness.",
        category: "concept",
        icon: Target
      },
      {
        term: "Continuous Improvement",
        definition: "Embracing the journey of lifelong learning and refinement of skills and character.",
        category: "principle",
        icon: Target
      },
      {
        term: "Focus and Concentration",
        definition: "Cultivating the ability to maintain attention and awareness in all situations.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Self-Control",
        definition: "Developing mastery over your emotions, impulses, and reactions.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Adaptive Response",
        definition: "Learning to respond appropriately to changing circumstances rather than reacting automatically.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Inner Strength",
        definition: "Building resilience and fortitude that comes from within rather than external validation.",
        category: "concept",
        icon: Target
      },
      {
        term: "Harmony in Conflict",
        definition: "Finding balance and effectiveness even in challenging or confrontational situations.",
        category: "principle",
        icon: Target
      },
      {
        term: "Mastery Through Repetition",
        definition: "Understanding that excellence comes from consistent practice and refinement over time.",
        category: "principle",
        icon: Target
      },
      {
        term: "Spiritual Development",
        definition: "Using physical training as a path to deeper self-understanding and personal growth.",
        category: "concept",
        icon: Target
      },
      {
        term: "Warrior Spirit",
        definition: "Cultivating courage, determination, and the willingness to face challenges with integrity.",
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
        term: "Love as the Path",
        definition: "Using love and devotion as the primary means of spiritual growth and connection.",
        category: "principle",
        icon: Target
      },
      {
        term: "Heart-Centered Wisdom",
        definition: "Developing intuition and understanding through the heart rather than just the mind.",
        category: "concept",
        icon: Target
      },
      {
        term: "Divine Remembrance",
        definition: "Keeping awareness of the sacred in daily life through prayer, meditation, and mindful practice.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Surrender to Grace",
        definition: "Letting go of ego and control to allow divine guidance and wisdom to flow through you.",
        category: "principle",
        icon: Target
      },
      {
        term: "Sacred Music and Dance",
        definition: "Using movement and music as vehicles for spiritual experience and connection.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Ego Dissolution",
        definition: "Transcending the limited self to experience unity with the divine and all creation.",
        category: "concept",
        icon: Target
      },
      {
        term: "Living in the World",
        definition: "Maintaining spiritual connection while fully engaging in worldly responsibilities and relationships.",
        category: "principle",
        icon: Target
      },
      {
        term: "Mystical Experience",
        definition: "Opening to direct experience of the divine through meditation, prayer, and spiritual practice.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Compassionate Service",
        definition: "Expressing divine love through acts of kindness and service to others.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Inner Transformation",
        definition: "Allowing spiritual practice to fundamentally change your character and way of being.",
        category: "concept",
        icon: Target
      },
      {
        term: "Divine Intimacy",
        definition: "Cultivating a personal, loving relationship with the divine presence within and around you.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Spiritual Ecstasy",
        definition: "Experiencing moments of profound joy and connection that transcend ordinary consciousness.",
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
        term: "I Am Because We Are",
        definition: "Understanding that your identity and well-being are deeply connected to the community around you.",
        category: "principle",
        icon: Target
      },
      {
        term: "Community as Foundation",
        definition: "Building strong, supportive relationships as the basis for personal and collective growth.",
        category: "concept",
        icon: Users
      },
      {
        term: "Collective Wisdom",
        definition: "Valuing and drawing from the shared knowledge and experience of the community.",
        category: "concept",
        icon: Lightbulb
      },
      {
        term: "Service Leadership",
        definition: "Leading by serving others and putting the needs of the community before personal gain.",
        category: "principle",
        icon: Target
      },
      {
        term: "Interconnectedness",
        definition: "Recognizing that all people and all life are connected in a web of relationships.",
        category: "concept",
        icon: Users
      },
      {
        term: "Mutual Support",
        definition: "Creating systems and practices that ensure everyone in the community can thrive.",
        category: "practice",
        icon: Users
      },
      {
        term: "Shared Responsibility",
        definition: "Taking collective ownership of community challenges and working together on solutions.",
        category: "principle",
        icon: Target
      },
      {
        term: "Inclusive Participation",
        definition: "Ensuring that all voices are heard and valued in community decision-making.",
        category: "practice",
        icon: Users
      },
      {
        term: "Cultural Preservation",
        definition: "Honoring and maintaining the traditions, stories, and wisdom of the community.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Generational Connection",
        definition: "Building bridges between different age groups to share wisdom and maintain continuity.",
        category: "concept",
        icon: Users
      },
      {
        term: "Restorative Justice",
        definition: "Addressing harm through healing and reconciliation rather than punishment and isolation.",
        category: "principle",
        icon: Target
      },
      {
        term: "Sustainable Community",
        definition: "Creating communities that can thrive and support future generations.",
        category: "concept",
        icon: Users
      }
    ]
  },
  highperf: {
    overview: "Modern high-performance frameworks emphasize systematic approaches to excellence, deep work, and sustainable achievement. They teach that peak performance comes from focused effort, strategic planning, and continuous improvement.",
    coreConcepts: [
      "Deep Work",
      "Systems Thinking", 
      "Continuous Improvement",
      "Strategic Planning",
      "Performance Optimization"
    ],
    terminology: [
      {
        term: "Deep Work",
        definition: "The ability to focus without distraction on a cognitively demanding task, creating value that's hard to replicate.",
        category: "practice",
        icon: Target
      },
      {
        term: "Systems Thinking",
        definition: "Understanding how different elements interact to create outcomes and optimizing the whole system.",
        category: "concept",
        icon: Target
      },
      {
        term: "Continuous Improvement",
        definition: "Making small, incremental changes that compound over time to create significant improvements.",
        category: "principle",
        icon: Lightbulb
      }
    ]
  },
  celtic_druid: {
    overview: "The Celtic Druid tradition emphasizes wisdom through deep connection with nature, seasonal cycles, and oral tradition. It teaches that true wisdom comes from observing natural patterns and living in harmony with the earth's rhythms.",
    coreConcepts: [
      "Natural Wisdom",
      "Seasonal Cycles",
      "Oral Tradition",
      "Herbal Knowledge",
      "Nature Connection"
    ],
    terminology: [
      {
        term: "Natural Wisdom",
        definition: "Knowledge and insight gained through careful observation of natural patterns and cycles.",
        category: "concept",
        icon: BookOpen
      },
      {
        term: "Seasonal Cycles",
        definition: "Understanding and living in harmony with the natural rhythms of the earth and seasons.",
        category: "principle",
        icon: Target
      },
      {
        term: "Oral Tradition",
        definition: "Preserving and passing down wisdom through storytelling and spoken word across generations.",
        category: "practice",
        icon: BookOpen
      }
    ]
  },
  tibetan_monk: {
    overview: "Tibetan Buddhist monastic tradition emphasizes inner transformation through advanced meditation, philosophical inquiry, and compassion practice. It teaches that enlightenment comes through inner work, debate, and the cultivation of wisdom and compassion.",
    coreConcepts: [
      "Inner Transformation",
      "Philosophical Debate",
      "Compassion Practice",
      "Meditation Mastery",
      "Spiritual Enlightenment"
    ],
    terminology: [
      {
        term: "Inner Transformation",
        definition: "The process of fundamental change in consciousness and character through spiritual practice.",
        category: "concept",
        icon: Target
      },
      {
        term: "Philosophical Debate",
        definition: "Using logical argumentation and critical thinking to explore profound questions and reveal truth.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Compassion Practice",
        definition: "Systematically developing boundless love and compassion for all beings through meditation.",
        category: "practice",
        icon: BookOpen
      }
    ]
  },
  viking_berserker: {
    overview: "The Viking Berserker tradition emphasizes courage through controlled aggression, battle preparation, and rage mastery. It teaches that true strength comes from mastering one's inner fire and channeling it with discipline and strategy.",
    coreConcepts: [
      "Controlled Aggression",
      "Battle Preparation",
      "Rage Mastery",
      "Shield Wall Unity",
      "Strategic Courage"
    ],
    terminology: [
      {
        term: "Controlled Aggression",
        definition: "Channeling fierce energy and strength with discipline and strategic purpose.",
        category: "practice",
        icon: Target
      },
      {
        term: "Battle Preparation",
        definition: "Systematic preparation of mind, body, and strategy before facing challenges.",
        category: "practice",
        icon: BookOpen
      },
      {
        term: "Rage Mastery",
        definition: "Learning to control and direct powerful emotions for constructive purposes.",
        category: "principle",
        icon: Target
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