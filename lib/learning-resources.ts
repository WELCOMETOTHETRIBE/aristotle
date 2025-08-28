import { LearningResource, Lesson, Badge, ReflectionQuestion, Practice } from './types';

export const learningResources: LearningResource[] = [
  {
    id: 'meditations-marcus-aurelius',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    category: 'wisdom',
    description: 'Ancient wisdom for modern living. Learn how to cultivate inner peace and resilience through Stoic philosophy.',
    difficulty: 'intermediate',
    estimatedTime: 120,
    tags: ['stoicism', 'philosophy', 'resilience', 'inner-peace'],
    lessons: [
      {
        id: 'med-1',
        title: 'The Power of Perception',
        content: `"The happiness of your life depends upon the quality of your thoughts." - Marcus Aurelius

In this lesson, we explore how our thoughts shape our reality. Marcus Aurelius teaches us that external events are neutral - it's our interpretation that gives them meaning.

Key Principles:
• Events themselves don't disturb us, only our judgments about them
• We have control over our thoughts, even when we can't control circumstances
• The quality of our life depends on the quality of our thinking

Practice: For the next 24 hours, whenever you encounter a challenging situation, pause and ask: "What story am I telling myself about this?" Then consider alternative interpretations.`,
        type: 'reading',
        duration: 15,
        isCompleted: false,
        questions: [
          {
            id: 'med-1-q1',
            question: 'Think of a recent challenging situation. What was your initial interpretation? How might you view it differently?',
            type: 'text'
          },
          {
            id: 'med-1-q2',
            question: 'How often do you find yourself blaming external circumstances for your mood?',
            type: 'rating'
          }
        ]
      },
      {
        id: 'med-2',
        title: 'The Art of Acceptance',
        content: `"Accept the things to which fate binds you, and love the people with whom fate brings you together." - Marcus Aurelius

Acceptance doesn't mean passivity - it means recognizing what we can and cannot control. This lesson teaches us to focus our energy where it matters most.

Key Principles:
• Amor fati - love your fate
• Focus on what you can control: your thoughts, actions, and responses
• Resistance to reality only creates suffering

Practice: Create a "Circle of Control" exercise. Draw two circles: one for things you can control, one for things you can't. Spend your energy only on the inner circle.`,
        type: 'practice',
        duration: 20,
        isCompleted: false,
        practices: [
          {
            id: 'med-2-p1',
            title: 'Circle of Control Exercise',
            description: 'Visualize and categorize what you can and cannot control',
            duration: 10,
            instructions: [
              'Draw two concentric circles on paper',
              'In the inner circle, list things you can control (thoughts, actions, responses)',
              'In the outer circle, list things you cannot control (weather, others\' opinions, past events)',
              'Reflect on how much energy you spend on the outer circle',
              'Commit to focusing your energy on the inner circle'
            ],
            isCompleted: false
          }
        ]
      }
    ],
    badges: [
      {
        id: 'stoic-sage',
        name: 'Stoic Sage',
        description: 'Mastered the fundamentals of Stoic philosophy',
        icon: '🧘',
        category: 'wisdom',
        isEarned: false,
        requirements: ['Complete all Meditations lessons', 'Practice daily reflection for 7 days']
      }
    ]
  },
  {
    id: 'art-of-war-sun-tzu',
    title: 'The Art of War',
    author: 'Sun Tzu',
    category: 'courage',
    description: 'Ancient strategies for modern challenges. Learn to approach life\'s battles with wisdom and courage.',
    difficulty: 'intermediate',
    estimatedTime: 90,
    tags: ['strategy', 'leadership', 'courage', 'tactics'],
    lessons: [
      {
        id: 'aow-1',
        title: 'Know Yourself, Know Your Enemy',
        content: `"If you know the enemy and know yourself, you need not fear the result of a hundred battles." - Sun Tzu

This lesson teaches us the importance of self-awareness and understanding our challenges. True courage comes from preparation and knowledge.

Key Principles:
• Self-awareness is the foundation of courage
• Understanding your challenges reduces fear
• Preparation builds confidence

Practice: Conduct a "Personal SWOT Analysis" - identify your Strengths, Weaknesses, Opportunities, and Threats in a current challenge.`,
        type: 'reading',
        duration: 15,
        isCompleted: false,
        questions: [
          {
            id: 'aow-1-q1',
            question: 'What are your greatest strengths when facing challenges?',
            type: 'text'
          },
          {
            id: 'aow-1-q2',
            question: 'What fears or weaknesses hold you back?',
            type: 'text'
          }
        ]
      }
    ],
    badges: [
      {
        id: 'strategic-warrior',
        name: 'Strategic Warrior',
        description: 'Mastered the art of strategic thinking',
        icon: '⚔️',
        category: 'courage',
        isEarned: false,
        requirements: ['Complete Art of War lessons', 'Apply strategic thinking to 3 challenges']
      }
    ]
  },
  {
    id: 'republic-plato',
    title: 'The Republic',
    author: 'Plato',
    category: 'justice',
    description: 'Explore the nature of justice, governance, and the ideal society. Learn to apply principles of justice in daily life.',
    difficulty: 'advanced',
    estimatedTime: 150,
    tags: ['justice', 'philosophy', 'governance', 'ethics'],
    lessons: [
      {
        id: 'rep-1',
        title: 'What is Justice?',
        content: `"Justice is doing one's own work and not meddling with what isn't one's own." - Plato

This foundational lesson explores the nature of justice and how it applies to our daily interactions and responsibilities.

Key Principles:
• Justice involves fulfilling our proper role
• Each person has unique talents and responsibilities
• Justice creates harmony in society and within ourselves

Practice: Reflect on your roles in life (family member, friend, colleague, citizen). Are you fulfilling each role justly?`,
        type: 'reflection',
        duration: 20,
        isCompleted: false,
        questions: [
          {
            id: 'rep-1-q1',
            question: 'What are your primary roles in life? How well do you fulfill each?',
            type: 'text'
          },
          {
            id: 'rep-1-q2',
            question: 'When have you seen injustice in your daily life? How did you respond?',
            type: 'text'
          }
        ]
      }
    ],
    badges: [
      {
        id: 'guardian-of-justice',
        name: 'Guardian of Justice',
        description: 'Demonstrated understanding of justice principles',
        icon: '⚖️',
        category: 'justice',
        isEarned: false,
        requirements: ['Complete Republic lessons', 'Practice just behavior for 7 days']
      }
    ]
  },
  {
    id: 'nicomachean-ethics-aristotle',
    title: 'Nicomachean Ethics',
    author: 'Aristotle',
    category: 'temperance',
    description: 'Discover the path to eudaimonia (flourishing) through virtue and moderation. Learn the golden mean in all things.',
    difficulty: 'intermediate',
    estimatedTime: 120,
    tags: ['virtue', 'moderation', 'happiness', 'ethics'],
    lessons: [
      {
        id: 'ne-1',
        title: 'The Golden Mean',
        content: `"Virtue is a mean between two vices, one of excess and one of deficiency." - Aristotle

This lesson teaches us about temperance and finding balance in all aspects of life. Virtue lies not in extremes, but in moderation.

Key Principles:
• Virtue is found in the middle ground between extremes
• Courage is between cowardice and recklessness
• Generosity is between stinginess and extravagance
• Every virtue has corresponding vices of excess and deficiency

Practice: Identify areas in your life where you tend toward extremes. How can you find the golden mean?`,
        type: 'reading',
        duration: 15,
        isCompleted: false,
        questions: [
          {
            id: 'ne-1-q1',
            question: 'What areas of your life tend toward excess or deficiency?',
            type: 'text'
          },
          {
            id: 'ne-1-q2',
            question: 'How can you practice the golden mean in your daily habits?',
            type: 'text'
          }
        ]
      }
    ],
    badges: [
      {
        id: 'virtuous-soul',
        name: 'Virtuous Soul',
        description: 'Mastered the practice of temperance and moderation',
        icon: '⚖️',
        category: 'temperance',
        isEarned: false,
        requirements: ['Complete Nicomachean Ethics lessons', 'Practice moderation for 7 days']
      }
    ]
  }
];

export const getResourceById = (id: string): LearningResource | undefined => {
  return learningResources.find(resource => resource.id === id);
};

export const getResourcesByCategory = (category: string): LearningResource[] => {
  return learningResources.filter(resource => resource.category === category);
};

export const getRecommendedResources = (userProgress?: any): LearningResource[] => {
  // For now, return all resources. In the future, this could be personalized
  return learningResources;
}; 