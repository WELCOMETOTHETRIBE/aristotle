import { 
  VirtueDimension, 
  WellnessDimension, 
  PracticeModule, 
  AncientPractice,
  DailyRoutine,
  LifeTransition,
  WisdomCircle,
  CertificationPath
} from './types';

// Enhanced Virtue Dimensions with Ancient Practices
export const enhancedVirtueDimensions: VirtueDimension[] = [
  {
    id: 'wisdom',
    name: 'Wisdom',
    description: 'Ancient Knowledge Practices - The virtue of knowledge and understanding',
    icon: 'Brain',
    color: 'from-blue-500 to-indigo-600',
    progress: 75,
    ancientPractices: [
      {
        id: 'socratic-dialogue',
        name: 'Socratic Dialogue',
        description: 'Question-based learning to discover truth through critical thinking',
        tradition: 'Ancient Greek Philosophy',
        difficulty: 'Intermediate',
        duration: '30-60 minutes',
        benefits: ['Critical thinking', 'Self-knowledge', 'Intellectual humility', 'Clear reasoning'],
        instructions: [
          'Formulate a question about a concept you want to understand',
          'Ask "What do I mean by X?" and define your terms',
          'Examine your assumptions and beliefs',
          'Consider counter-examples and exceptions',
          'Refine your understanding through dialogue'
        ],
        scientificValidation: 'Cognitive behavioral therapy uses Socratic questioning to challenge maladaptive thoughts',
        culturalContext: 'Developed by Socrates in 5th century BCE Athens, emphasizing intellectual humility and the pursuit of truth',
        resources: {
          books: ['The Apology by Plato', 'Socratic Method: A Practitioner\'s Handbook'],
          videos: ['Socratic Method Explained', 'Critical Thinking Skills'],
          articles: ['The Art of Socratic Questioning', 'Teaching Critical Thinking'],
          teachers: ['Dr. Richard Paul', 'Dr. Linda Elder']
        }
      },
      {
        id: 'stoic-contemplation',
        name: 'Stoic Contemplation',
        description: 'Marcus Aurelius\' daily reflection practice for wisdom and resilience',
        tradition: 'Stoic Philosophy',
        difficulty: 'Beginner',
        duration: '15-30 minutes',
        benefits: ['Emotional resilience', 'Perspective', 'Inner peace', 'Moral clarity'],
        instructions: [
          'Begin with morning reflection on what you can and cannot control',
          'Practice negative visualization - imagine losing what you value',
          'Examine your thoughts and emotions objectively',
          'Ask "Is this within my control?" for each concern',
          'End with evening review of your actions and character'
        ],
        scientificValidation: 'Cognitive reappraisal techniques in psychology mirror Stoic practices',
        culturalContext: 'Developed by Marcus Aurelius in his Meditations, written during military campaigns',
        resources: {
          books: ['Meditations by Marcus Aurelius', 'The Daily Stoic by Ryan Holiday'],
          videos: ['Stoicism 101', 'Marcus Aurelius Meditations'],
          articles: ['Stoic Practices for Modern Life', 'The Art of Living'],
          teachers: ['Ryan Holiday', 'Massimo Pigliucci']
        }
      },
      {
        id: 'buddhist-mindfulness',
        name: 'Buddhist Mindfulness',
        description: 'Vipassana meditation techniques for insight and awareness',
        tradition: 'Buddhist Philosophy',
        difficulty: 'Beginner',
        duration: '20-60 minutes',
        benefits: ['Present moment awareness', 'Emotional regulation', 'Insight', 'Compassion'],
        instructions: [
          'Sit comfortably with straight spine and closed eyes',
          'Focus on the natural breath without trying to change it',
          'Observe thoughts and emotions without judgment',
          'Return attention to breath when mind wanders',
          'Practice loving-kindness meditation for compassion'
        ],
        scientificValidation: 'Extensive research shows mindfulness reduces stress and improves mental health',
        culturalContext: 'Originated in ancient India with the Buddha, emphasizing the Four Noble Truths',
        resources: {
          books: ['Mindfulness in Plain English', 'The Heart of Buddhist Meditation'],
          videos: ['Mindfulness Meditation Guide', 'Vipassana Technique'],
          articles: ['Benefits of Mindfulness', 'Meditation Research'],
          teachers: ['Thich Nhat Hanh', 'Jon Kabat-Zinn']
        }
      },
      {
        id: 'taoist-flow',
        name: 'Taoist Flow',
        description: 'Wu Wei and natural alignment with the Tao',
        tradition: 'Taoist Philosophy',
        difficulty: 'Advanced',
        duration: 'Variable',
        benefits: ['Effortless action', 'Natural harmony', 'Intuition', 'Balance'],
        instructions: [
          'Observe natural patterns and rhythms in your environment',
          'Practice non-action (wu wei) - letting things happen naturally',
          'Cultivate softness and flexibility in your approach',
          'Trust your intuition and inner wisdom',
          'Find the path of least resistance'
        ],
        scientificValidation: 'Flow state research by Mihaly Csikszentmihalyi aligns with Taoist principles',
        culturalContext: 'Based on Lao Tzu\'s Tao Te Ching, emphasizing harmony with natural order',
        resources: {
          books: ['Tao Te Ching by Lao Tzu', 'The Way of Chuang Tzu'],
          videos: ['Taoist Philosophy Explained', 'Wu Wei Practice'],
          articles: ['The Art of Wu Wei', 'Taoist Wisdom'],
          teachers: ['Alan Watts', 'Deng Ming-Dao']
        }
      }
    ],
    modernApplications: [
      'Critical thinking in decision making',
      'Mindfulness in daily life',
      'Resilience in challenging situations',
      'Intellectual humility in learning'
    ],
    scientificBasis: [
      'Cognitive behavioral therapy',
      'Mindfulness-based stress reduction',
      'Flow state psychology',
      'Emotional intelligence research'
    ]
  },
  {
    id: 'courage',
    name: 'Courage',
    description: 'Warrior Traditions - The virtue of facing challenges with strength',
    icon: 'Shield',
    color: 'from-red-500 to-orange-600',
    progress: 60,
    ancientPractices: [
      {
        id: 'spartan-discipline',
        name: 'Spartan Discipline',
        description: 'Physical and mental toughness through rigorous training',
        tradition: 'Ancient Greek Warrior Culture',
        difficulty: 'Advanced',
        duration: 'Daily practice',
        benefits: ['Mental toughness', 'Physical strength', 'Discipline', 'Resilience'],
        instructions: [
          'Establish daily physical training routine',
          'Practice cold exposure (cold showers)',
          'Embrace discomfort and challenge',
          'Develop mental fortitude through hardship',
          'Cultivate warrior mindset'
        ],
        scientificValidation: 'Cold exposure increases norepinephrine and improves stress resilience',
        culturalContext: 'Spartan warriors were known for their rigorous training and mental toughness',
        resources: {
          books: ['Gates of Fire by Steven Pressfield', 'The Spartan Way'],
          videos: ['Spartan Training Methods', 'Mental Toughness'],
          articles: ['Spartan Discipline', 'Warrior Psychology'],
          teachers: ['Steven Pressfield', 'David Goggins']
        }
      },
      {
        id: 'samurai-bushido',
        name: 'Samurai Bushido',
        description: 'Honor, loyalty, and mastery through the warrior code',
        tradition: 'Japanese Samurai Culture',
        difficulty: 'Intermediate',
        duration: 'Lifetime practice',
        benefits: ['Honor', 'Loyalty', 'Mastery', 'Self-discipline'],
        instructions: [
          'Study the seven virtues of Bushido',
          'Practice daily meditation and martial arts',
          'Cultivate honor in all actions',
          'Develop loyalty to principles and people',
          'Pursue mastery in chosen discipline'
        ],
        scientificValidation: 'Martial arts training improves focus, discipline, and stress management',
        culturalContext: 'Bushido was the moral code of the samurai, emphasizing honor and loyalty',
        resources: {
          books: ['Hagakure by Yamamoto Tsunetomo', 'Bushido: The Soul of Japan'],
          videos: ['Samurai Philosophy', 'Bushido Code'],
          articles: ['The Way of the Warrior', 'Samurai Wisdom'],
          teachers: ['Miyamoto Musashi', 'Nitobe Inazo']
        }
      },
      {
        id: 'viking-resilience',
        name: 'Viking Resilience',
        description: 'Facing harsh conditions with determination and adaptability',
        tradition: 'Norse Warrior Culture',
        difficulty: 'Intermediate',
        duration: 'Daily practice',
        benefits: ['Adaptability', 'Determination', 'Resourcefulness', 'Courage'],
        instructions: [
          'Embrace challenging weather and conditions',
          'Develop resourcefulness in difficult situations',
          'Cultivate determination in the face of adversity',
          'Practice adaptability to changing circumstances',
          'Build physical and mental endurance'
        ],
        scientificValidation: 'Exposure to challenging conditions builds resilience and adaptability',
        culturalContext: 'Vikings were known for their ability to thrive in harsh environments',
        resources: {
          books: ['The Viking Way', 'Norse Mythology'],
          videos: ['Viking Culture', 'Norse Philosophy'],
          articles: ['Viking Resilience', 'Norse Wisdom'],
          teachers: ['Neil Price', 'Jackson Crawford']
        }
      }
    ],
    modernApplications: [
      'Facing career challenges',
      'Overcoming personal obstacles',
      'Building mental resilience',
      'Developing leadership courage'
    ],
    scientificBasis: [
      'Stress inoculation theory',
      'Resilience psychology',
      'Growth mindset research',
      'Post-traumatic growth'
    ]
  },
  {
    id: 'justice',
    name: 'Justice',
    description: 'Community & Service Traditions - The virtue of fairness and right relationships',
    icon: 'Scale',
    color: 'from-green-500 to-emerald-600',
    progress: 45,
    ancientPractices: [
      {
        id: 'confucian-relationships',
        name: 'Confucian Relationships',
        description: 'Five relationships framework for harmonious society',
        tradition: 'Confucian Philosophy',
        difficulty: 'Beginner',
        duration: 'Daily practice',
        benefits: ['Harmonious relationships', 'Social harmony', 'Moral character', 'Community'],
        instructions: [
          'Study the five relationships: ruler-subject, father-son, husband-wife, elder-younger, friend-friend',
          'Practice proper roles and responsibilities in each relationship',
          'Cultivate benevolence (ren) in all interactions',
          'Develop ritual propriety (li) in social conduct',
          'Seek harmony rather than conflict'
        ],
        scientificValidation: 'Social connection is one of the strongest predictors of happiness and longevity',
        culturalContext: 'Developed by Confucius in ancient China, emphasizing social harmony and moral character',
        resources: {
          books: ['The Analects by Confucius', 'Confucianism: A Very Short Introduction'],
          videos: ['Confucian Philosophy', 'Five Relationships'],
          articles: ['Confucian Ethics', 'Social Harmony'],
          teachers: ['Confucius', 'Dr. Bryan Van Norden']
        }
      },
      {
        id: 'indigenous-wisdom',
        name: 'Indigenous Wisdom',
        description: 'Seven generations thinking for sustainable community',
        tradition: 'Indigenous Cultures Worldwide',
        difficulty: 'Intermediate',
        duration: 'Lifetime practice',
        benefits: ['Sustainability', 'Intergenerational thinking', 'Community', 'Environmental stewardship'],
        instructions: [
          'Consider the impact of decisions on future generations',
          'Learn from elders and traditional knowledge',
          'Practice environmental stewardship',
          'Build community connections',
          'Honor traditional wisdom and practices'
        ],
        scientificValidation: 'Indigenous land management practices are often more sustainable than modern methods',
        culturalContext: 'Many indigenous cultures emphasize thinking seven generations ahead',
        resources: {
          books: ['Braiding Sweetgrass by Robin Wall Kimmerer', 'Indigenous Wisdom'],
          videos: ['Indigenous Knowledge', 'Seven Generations'],
          articles: ['Traditional Ecological Knowledge', 'Indigenous Wisdom'],
          teachers: ['Robin Wall Kimmerer', 'Wade Davis']
        }
      }
    ],
    modernApplications: [
      'Building inclusive communities',
      'Environmental sustainability',
      'Intergenerational relationships',
      'Social justice advocacy'
    ],
    scientificBasis: [
      'Social psychology research',
      'Environmental psychology',
      'Community development studies',
      'Intergenerational relationship research'
    ]
  },
  {
    id: 'temperance',
    name: 'Temperance',
    description: 'Balance & Harmony Practices - The virtue of self-control and moderation',
    icon: 'Leaf',
    color: 'from-purple-500 to-pink-600',
    progress: 80,
    ancientPractices: [
      {
        id: 'ayurvedic-living',
        name: 'Ayurvedic Living',
        description: 'Dosha balancing for optimal health and harmony',
        tradition: 'Ayurvedic Medicine',
        difficulty: 'Intermediate',
        duration: 'Daily practice',
        benefits: ['Balance', 'Health', 'Harmony', 'Self-awareness'],
        instructions: [
          'Identify your dosha type (Vata, Pitta, or Kapha)',
          'Adjust diet and lifestyle to balance your dosha',
          'Practice daily self-care routines',
          'Align activities with natural rhythms',
          'Cultivate awareness of body-mind connection'
        ],
        scientificValidation: 'Ayurvedic practices like meditation and yoga have proven health benefits',
        culturalContext: 'Ancient Indian system of medicine emphasizing balance and natural healing',
        resources: {
          books: ['The Complete Book of Ayurvedic Home Remedies', 'Ayurveda: The Science of Self-Healing'],
          videos: ['Ayurveda Basics', 'Dosha Balancing'],
          articles: ['Ayurvedic Living', 'Dosha Types'],
          teachers: ['Deepak Chopra', 'Vasant Lad']
        }
      },
      {
        id: 'zen-simplicity',
        name: 'Zen Simplicity',
        description: 'Minimalism and clarity through mindful living',
        tradition: 'Zen Buddhism',
        difficulty: 'Beginner',
        duration: 'Daily practice',
        benefits: ['Clarity', 'Simplicity', 'Mindfulness', 'Contentment'],
        instructions: [
          'Simplify your physical environment',
          'Practice mindful eating and daily activities',
          'Cultivate contentment with what you have',
          'Develop clarity of mind through meditation',
          'Embrace the beauty of simplicity'
        ],
        scientificValidation: 'Minimalism reduces stress and improves focus and well-being',
        culturalContext: 'Zen Buddhism emphasizes simplicity, mindfulness, and direct experience',
        resources: {
          books: ['Zen Mind, Beginner\'s Mind', 'The Art of Simple Living'],
          videos: ['Zen Philosophy', 'Minimalism'],
          articles: ['Zen Simplicity', 'Mindful Living'],
          teachers: ['Shunryu Suzuki', 'Thich Nhat Hanh']
        }
      }
    ],
    modernApplications: [
      'Digital minimalism',
      'Sustainable living',
      'Work-life balance',
      'Mindful consumption'
    ],
    scientificBasis: [
      'Minimalism psychology',
      'Mindfulness research',
      'Stress reduction studies',
      'Environmental psychology'
    ]
  }
];

// Wellness Dimensions
export const wellnessDimensions: WellnessDimension[] = [
  {
    id: 'physical-mastery',
    name: 'Physical Mastery',
    description: 'Ancient movement arts and physical practices',
    icon: 'Activity',
    color: 'from-emerald-500 to-teal-600',
    practices: [
      {
        id: 'tai-chi',
        name: 'Tai Chi',
        description: 'Moving meditation for balance and harmony',
        tradition: 'Chinese Martial Arts',
        difficulty: 'Beginner',
        duration: '20-60 minutes',
        benefits: ['Balance', 'Flexibility', 'Stress reduction', 'Mind-body connection'],
        instructions: [
          'Learn basic Tai Chi forms',
          'Practice slow, mindful movements',
          'Focus on breath and body awareness',
          'Cultivate internal energy (qi)',
          'Practice regularly for best results'
        ],
        scientificValidation: 'Tai Chi improves balance, reduces falls in elderly, and reduces stress',
        culturalContext: 'Developed in ancient China as both martial art and health practice',
        resources: {
          books: ['The Essence of Tai Chi Chuan', 'Tai Chi Classics'],
          videos: ['Tai Chi for Beginners', 'Tai Chi Forms'],
          articles: ['Benefits of Tai Chi', 'Tai Chi Research'],
          teachers: ['Cheng Man-ch\'ing', 'Yang Chengfu']
        }
      }
    ],
    dailyRoutines: ['Morning movement practice', 'Breathwork exercises', 'Posture awareness'],
    weeklyPractices: ['Strength training', 'Flexibility work', 'Endurance activities'],
    seasonalAlignments: ['Spring: Renewal practices', 'Summer: Active movement', 'Autumn: Harvest energy', 'Winter: Restorative practices']
  },
  {
    id: 'mental-fortitude',
    name: 'Mental Fortitude',
    description: 'Cognitive enhancement and mental resilience',
    icon: 'Brain',
    color: 'from-blue-500 to-indigo-600',
    practices: [
      {
        id: 'memory-palace',
        name: 'Memory Palace',
        description: 'Ancient mnemonic technique for enhanced memory',
        tradition: 'Ancient Greek and Roman',
        difficulty: 'Intermediate',
        duration: '15-30 minutes',
        benefits: ['Memory enhancement', 'Creativity', 'Focus', 'Mental organization'],
        instructions: [
          'Create a familiar location in your mind',
          'Place vivid images representing information in specific locations',
          'Walk through the palace to recall information',
          'Practice regularly to strengthen the technique',
          'Expand your palace as you learn more'
        ],
        scientificValidation: 'Spatial memory techniques activate multiple brain regions and improve recall',
        culturalContext: 'Used by ancient orators and scholars to memorize speeches and texts',
        resources: {
          books: ['Moonwalking with Einstein', 'The Memory Palace'],
          videos: ['Memory Palace Technique', 'Mnemonic Methods'],
          articles: ['Memory Techniques', 'Spatial Memory'],
          teachers: ['Joshua Foer', 'Tony Buzan']
        }
      }
    ],
    dailyRoutines: ['Morning mental exercises', 'Reading and study', 'Problem-solving practice'],
    weeklyPractices: ['Learning new skills', 'Mental challenges', 'Creative projects'],
    seasonalAlignments: ['Spring: New learning', 'Summer: Active thinking', 'Autumn: Deep study', 'Winter: Reflection and integration']
  }
];

// Practice Modules
export const practiceModules: PracticeModule[] = [
  {
    id: 'ancient-wisdom-foundations',
    title: 'Ancient Wisdom Foundations',
    description: 'Core practices from the world\'s wisdom traditions',
    category: 'virtue',
    difficulty: 'Beginner',
    duration: '8 weeks',
    lessons: 24,
    rating: 4.9,
    students: 2156,
    practices: enhancedVirtueDimensions[0].ancientPractices.slice(0, 2),
    prerequisites: ['Open mind', 'Commitment to practice'],
    outcomes: ['Understanding of wisdom traditions', 'Practical tools for daily life', 'Enhanced self-awareness'],
    certification: true
  },
  {
    id: 'warrior-mindset',
    title: 'Warrior Mindset Development',
    description: 'Building courage and resilience through ancient warrior traditions',
    category: 'virtue',
    difficulty: 'Intermediate',
    duration: '12 weeks',
    lessons: 36,
    rating: 4.8,
    students: 1432,
    practices: enhancedVirtueDimensions[1].ancientPractices,
    prerequisites: ['Basic fitness level', 'Mental preparation'],
    outcomes: ['Enhanced mental toughness', 'Improved discipline', 'Greater resilience'],
    certification: true
  }
];

// Daily Routines
export const dailyRoutines: DailyRoutine[] = [
  {
    id: 'morning-wisdom',
    name: 'Morning Wisdom Practice',
    timeOfDay: 'morning',
    duration: '30 minutes',
    practices: ['Stoic contemplation', 'Mindfulness meditation', 'Gratitude practice'],
    description: 'Start your day with ancient wisdom practices for clarity and purpose',
    benefits: ['Mental clarity', 'Emotional balance', 'Purposeful mindset']
  },
  {
    id: 'evening-reflection',
    name: 'Evening Reflection',
    timeOfDay: 'evening',
    duration: '20 minutes',
    practices: ['Daily review', 'Gratitude journaling', 'Preparation for tomorrow'],
    description: 'End your day with reflection and preparation for tomorrow',
    benefits: ['Better sleep', 'Learning integration', 'Mindful closure']
  }
];

// Life Transitions
export const lifeTransitions: LifeTransition[] = [
  {
    id: 'career-change',
    name: 'Career Transition',
    description: 'Navigating career changes with ancient wisdom',
    practices: enhancedVirtueDimensions[0].ancientPractices.slice(0, 2),
    guidance: [
      'Use Socratic dialogue to clarify your values and goals',
      'Practice Stoic contemplation to manage uncertainty',
      'Build resilience through warrior practices',
      'Seek community support and mentorship'
    ],
    communitySupport: ['Career transition groups', 'Mentorship programs', 'Skill development workshops'],
    duration: '3-12 months'
  }
];

// Wisdom Circles
export const wisdomCircles: WisdomCircle[] = [
  {
    id: 'stoic-practitioners',
    name: 'Stoic Practitioners Circle',
    description: 'Weekly gathering for Stoic philosophy and practice',
    focus: 'Stoic wisdom and resilience',
    meetingFrequency: 'Weekly',
    maxParticipants: 20,
    currentParticipants: 15,
    practices: ['Stoic contemplation', 'Negative visualization', 'Evening review'],
    mentors: ['Dr. Massimo Pigliucci', 'Ryan Holiday']
  }
];

// Certification Paths
export const certificationPaths: CertificationPath[] = [
  {
    id: 'ancient-wisdom-practitioner',
    name: 'Ancient Wisdom Practitioner',
    description: 'Comprehensive certification in ancient wisdom practices',
    requirements: ['Complete all core modules', 'Demonstrate practice consistency', 'Pass assessment'],
    duration: '12 months',
    cost: '$2,400',
    benefits: ['Professional certification', 'Teaching opportunities', 'Community leadership'],
    curriculum: ['Wisdom traditions', 'Practice methodology', 'Teaching skills', 'Community building']
  }
]; 