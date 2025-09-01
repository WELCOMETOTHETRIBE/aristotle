import { AcademyLesson } from './academy-curriculum';
import { getLessonInteraction } from './lesson-interactions';

// Example lesson: Core Belief Examination
export const EXAMPLE_LESSON_BELIEFS: AcademyLesson = {
  id: 'wisdom-core-beliefs',
  title: 'Examining Your Core Beliefs',
  subtitle: 'Discover the foundational beliefs that shape your worldview',
  teaching: `Our beliefs are the invisible architecture of our lives. They shape how we see the world, make decisions, and interact with others. In this lesson, we'll explore the concept of core beliefs and how they influence our daily experiences.

Core beliefs are deeply held convictions that we often take for granted. They can be empowering or limiting, conscious or unconscious. By identifying and examining our beliefs, we gain the power to choose which ones serve us and which ones we might want to reconsider.

The process of belief examination is not about changing who you are, but about becoming more conscious of the mental frameworks that guide your life. It's about moving from unconscious belief to conscious choice.`,
  
  question: `What beliefs do you hold so strongly that you've never really questioned them? These might be beliefs about:
• Human nature and potential
• Success and achievement
• Relationships and love
• Spirituality and meaning
• Your own capabilities and worth

Take a moment to reflect on beliefs that feel like "just the way things are" rather than choices you've made.`,
  
  practice: `This practice involves identifying and examining your core beliefs through structured reflection. You'll be guided through a process of discovery that will help you become more conscious of the beliefs that shape your worldview.

The practice includes:
1. Belief Identification: Write down 5 beliefs you hold strongly
2. Belief Examination: Question the origins and evidence for each belief
3. Belief Assessment: Evaluate whether each belief serves your growth
4. Belief Choice: Decide which beliefs to keep, modify, or release

This is a foundational practice that will be referenced throughout your learning journey.`,
  
  reading: `Recommended Reading: "The Power of Belief" by Dr. Carol Dweck

This reading explores the concept of mindset and how our beliefs about intelligence and ability can profoundly impact our learning and growth. Dweck's research shows that people with a "growth mindset" - who believe abilities can be developed - tend to achieve more than those with a "fixed mindset" - who believe abilities are innate and unchangeable.

Key concepts to focus on:
• The difference between fixed and growth mindsets
• How beliefs about ability affect learning behavior
• Strategies for developing a growth mindset
• The role of effort and persistence in achievement`,
  
  quote: `"The mind is everything. What you think you become."`,
  author: "Buddha",
  
  completed: false,
  difficulty: 'beginner',
  estimatedTime: 45,
  prerequisites: [],
  tags: ['beliefs', 'self-awareness', 'mindset', 'foundational'],
  framework: 'stoic',
  
  // Enhanced interactive elements
  interactiveElements: {
    teaching: {
      type: 'belief_identification',
      required: true,
      completed: false,
      aiPrompt: 'Help me understand how beliefs shape our worldview and daily experiences',
      minWords: 0,
      interactionData: {
        type: 'belief_identification',
        prompts: [
          'What do you believe about human nature?',
          'What are your core values?',
          'What do you believe about success?',
          'What are your spiritual beliefs?',
          'What do you believe about relationships?'
        ]
      }
    },
    
    question: {
      type: 'personal_reflection',
      required: true,
      completed: false,
      aiPrompt: 'Help me reflect deeper on my core beliefs and question their origins',
      minWords: 100,
      interactionData: {
        type: 'deep_reflection',
        reflectionDepth: 5,
        clarity: 0
      }
    },
    
    practice: {
      type: 'real_world_exercise',
      required: true,
      completed: false,
      aiPrompt: 'Guide me through the belief examination process step by step',
      minWords: 0,
      outsideRequirements: [
        'Quiet space for reflection',
        'Journal or digital note-taking tool',
        '20-30 minutes of uninterrupted time'
      ],
      verificationMethod: 'self_report',
      interactionData: {
        type: 'belief_examination',
        steps: [
          'Identify 5 core beliefs',
          'Examine origins and evidence',
          'Assess impact on life',
          'Choose beliefs to keep/modify/release'
        ]
      }
    },
    
    reading: {
      type: 'text_analysis',
      required: true,
      completed: false,
      aiPrompt: 'Help me analyze the key concepts from this reading and apply them to my life',
      minWords: 150,
      analysisQuestions: [
        'How does Dweck\'s research on mindset relate to your own learning experiences?',
        'What evidence do you see of fixed vs. growth mindsets in your life?',
        'How might changing your beliefs about ability affect your learning behavior?',
        'What strategies from the reading could you implement in your daily life?'
      ],
      creativeResponse: 'mind_map',
      interactionData: {
        type: 'mindset_analysis',
        comprehension: 0,
        creativity: 0
      }
    },
    
    quote: {
      type: 'personal_interpretation',
      required: true,
      completed: false,
      aiPrompt: 'Help me explore the deeper meaning of this quote and how it applies to belief examination',
      minWords: 100,
      interpretationPrompt: 'What does Buddha\'s quote mean in the context of examining and choosing our beliefs?',
      applicationExercise: 'How can you apply this wisdom to your belief examination practice?',
      interactionData: {
        type: 'wisdom_application',
        insight: 0,
        application: 0
      }
    }
  },
  
  milestones: {
    teachingCompleted: false,
    questionAnswered: false,
    practiceCompleted: false,
    readingAnalyzed: false,
    quoteInterpreted: false,
    allCompleted: false
  },
  
  aiGuidance: {
    teachingAssistant: 'I\'m here to guide you through understanding how beliefs shape our worldview. Ask me anything!',
    reflectionCoach: 'Let me help you reflect deeper on your core beliefs. What\'s on your mind?',
    practiceMentor: 'I\'ll support you in completing the belief examination practice. What challenges are you facing?',
    readingGuide: 'I can help you analyze the mindset research and apply it to your life. What aspects would you like to explore?',
    wisdomInterpreter: 'Let\'s unpack Buddha\'s wisdom together. What does it mean to you?'
  }
};

// Example lesson: Daily Habit Building
export const EXAMPLE_LESSON_HABITS: AcademyLesson = {
  id: 'courage-daily-habits',
  title: 'Building Courage Through Daily Practice',
  subtitle: 'Develop the courage to face challenges through consistent daily habits',
  teaching: `Courage is not the absence of fear, but the ability to act despite it. It's a muscle that grows stronger with use, and daily practice is the key to building this essential virtue.

In this lesson, we'll explore how small, consistent actions build the foundation for courageous behavior in challenging situations. We'll focus on creating daily practices that gradually expand your comfort zone and strengthen your ability to face difficulties.

The key insight is that courage is not a fixed trait but a skill that can be developed through intentional practice. By committing to daily acts of courage, no matter how small, you build the confidence and resilience needed for life's bigger challenges.`,
  
  question: `Think about a time when you felt afraid but acted courageously anyway. What gave you the strength to move forward despite your fear? 

Now consider: What small, daily actions could you take that would help you build that same kind of courage? These might be things like:
• Speaking up when you normally stay quiet
• Trying something new that makes you uncomfortable
• Setting boundaries in relationships
• Taking responsibility for mistakes
• Asking for help when you need it`,
  
  practice: `This practice involves building courage through daily habit formation. You'll track your progress and build streaks of courageous behavior, creating a foundation of confidence that supports you in challenging situations.

Daily practices to choose from:
1. Morning Courage Check-in: Identify one courageous action for the day
2. Comfort Zone Expansion: Do one thing that makes you slightly uncomfortable
3. Fear Confrontation: Face a small fear each day
4. Boundary Setting: Practice saying "no" when appropriate
5. Vulnerability Practice: Share something authentic with someone you trust

Track your progress daily and celebrate your courage-building streaks.`,
  
  reading: `Recommended Reading: "The Courage Habit" by Kate Swoboda

This reading explores the science of habit formation and how it applies to building courage. Swoboda argues that courage is not an innate quality but a practice that can be developed through consistent, intentional action.

Key concepts to focus on:
• The habit loop and how it applies to courage
• The role of small wins in building confidence
• How to reframe fear as a signal for growth
• Strategies for maintaining courage habits during difficult times`,
  
  quote: `"Courage is not the absence of fear, but the triumph over it."`,
  author: "Nelson Mandela",
  
  completed: false,
  difficulty: 'intermediate',
  estimatedTime: 60,
  prerequisites: ['wisdom-core-beliefs'],
  tags: ['courage', 'habits', 'daily-practice', 'fear-management'],
  framework: 'stoic',
  
  interactiveElements: {
    teaching: {
      type: 'daily_habit_building',
      required: true,
      completed: false,
      aiPrompt: 'Help me understand how daily practice builds courage over time',
      minWords: 0,
      interactionData: {
        type: 'courage_habits',
        habits: [
          'Morning Courage Check-in',
          'Comfort Zone Expansion',
          'Fear Confrontation',
          'Boundary Setting',
          'Vulnerability Practice'
        ],
        streakTargets: [3, 7, 21, 66, 100]
      }
    },
    
    question: {
      type: 'personal_reflection',
      required: true,
      completed: false,
      aiPrompt: 'Help me reflect on my experiences with courage and identify areas for growth',
      minWords: 150,
      interactionData: {
        type: 'courage_reflection',
        reflectionDepth: 5,
        clarity: 0
      }
    },
    
    practice: {
      type: 'real_world_exercise',
      required: true,
      completed: false,
      aiPrompt: 'Guide me through setting up and maintaining my daily courage practices',
      minWords: 0,
      outsideRequirements: [
        'Daily commitment to courage practices',
        'Journal for tracking progress',
        'Accountability partner (optional)',
        '21 days minimum commitment'
      ],
      verificationMethod: 'self_report',
      interactionData: {
        type: 'courage_practice',
        steps: [
          'Choose 3-5 daily courage practices',
          'Set up tracking system',
          'Commit to daily practice',
          'Build and maintain streaks',
          'Reflect on growth and challenges'
        ]
      }
    },
    
    reading: {
      type: 'text_analysis',
      required: true,
      completed: false,
      aiPrompt: 'Help me analyze the habit formation concepts and apply them to building courage',
      minWords: 200,
      analysisQuestions: [
        'How does the habit loop apply to building courage?',
        'What role do small wins play in developing courage?',
        'How can you reframe fear as a signal for growth?',
        'What strategies from the reading will you implement?'
      ],
      creativeResponse: 'story',
      interactionData: {
        type: 'habit_analysis',
        comprehension: 0,
        creativity: 0
      }
    },
    
    quote: {
      type: 'personal_interpretation',
      required: true,
      completed: false,
      aiPrompt: 'Help me explore Mandela\'s wisdom about courage and fear',
      minWords: 150,
      interpretationPrompt: 'What does Mandela\'s quote reveal about the true nature of courage?',
      applicationExercise: 'How can you apply this understanding to your daily courage practices?',
      interactionData: {
        type: 'courage_wisdom',
        insight: 0,
        application: 0
      }
    }
  },
  
  milestones: {
    teachingCompleted: false,
    questionAnswered: false,
    practiceCompleted: false,
    readingAnalyzed: false,
    quoteInterpreted: false,
    allCompleted: false
  },
  
  aiGuidance: {
    teachingAssistant: 'I\'m here to guide you through understanding how daily practice builds courage. Ask me anything!',
    reflectionCoach: 'Let me help you reflect on your experiences with courage. What\'s on your mind?',
    practiceMentor: 'I\'ll support you in setting up and maintaining your daily courage practices. What challenges are you facing?',
    readingGuide: 'I can help you analyze the habit formation concepts and apply them to courage. What aspects would you like to explore?',
    wisdomInterpreter: 'Let\'s unpack Mandela\'s wisdom about courage together. What does it mean to you?'
  }
};

// Example lesson: Creative Wisdom Expression
export const EXAMPLE_LESSON_CREATIVE: AcademyLesson = {
  id: 'temperance-creative-expression',
  title: 'Expressing Wisdom Through Creative Mediums',
  subtitle: 'Channel your understanding into creative expression and deepen your insights',
  teaching: `Creativity is not just about artistic talent - it's about finding new ways to express and understand the wisdom you've gained. When you create something that represents your learning, you're not just expressing knowledge, you're integrating it more deeply into your being.

In this lesson, we'll explore how creative expression can deepen your understanding of philosophical concepts and personal insights. We'll focus on using various creative mediums - writing, visual art, storytelling, or mind mapping - to express what you've learned in new and meaningful ways.

The creative process itself becomes a form of meditation and reflection, allowing you to see your learning from fresh perspectives and discover new connections between ideas.`,
  
  question: `Think about a concept or insight that has deeply resonated with you recently. How might you express this understanding through a creative medium?

Consider:
• What medium feels most natural to you?
• How could you represent this concept visually or through words?
• What metaphors or analogies come to mind?
• How might you share this insight with others in a creative way?

The goal is not perfection, but authentic expression of your understanding.`,
  
  practice: `This practice involves choosing a creative medium and expressing your understanding of a philosophical concept or personal insight. You'll create something that represents your learning in a new and meaningful way.

Creative options to choose from:
1. Poetry: Write a poem that captures the essence of your insight
2. Visual Art: Create a drawing, painting, or digital artwork
3. Storytelling: Write a short story that illustrates your understanding
4. Mind Mapping: Create a visual map of concepts and connections
5. Mixed Media: Combine multiple creative approaches

Focus on the process of creation rather than the final product. The act of creating will deepen your understanding.`,
  
  reading: `Recommended Reading: "The Artist's Way" by Julia Cameron

This reading explores the creative process and how it can be a spiritual practice for personal growth and self-discovery. Cameron's approach to creativity emphasizes the importance of regular creative practice and trusting the creative process.

Key concepts to focus on:
• The relationship between creativity and spirituality
• How creative practice can deepen self-understanding
• Techniques for overcoming creative blocks
• The role of play and experimentation in creative growth`,
  
  quote: `"Creativity is intelligence having fun."`,
  author: "Albert Einstein",
  
  completed: false,
  difficulty: 'intermediate',
  estimatedTime: 75,
  prerequisites: ['wisdom-core-beliefs'],
  tags: ['creativity', 'self-expression', 'artistic', 'integration'],
  framework: 'stoic',
  
  interactiveElements: {
    teaching: {
      type: 'creative_expression',
      required: true,
      completed: false,
      aiPrompt: 'Help me understand how creative expression deepens learning and understanding',
      minWords: 0,
      interactionData: {
        type: 'creative_learning',
        creativeTypes: ['poem', 'art', 'story', 'mind_map'],
        inspirationPrompts: true,
        creativityScoring: true
      }
    },
    
    question: {
      type: 'personal_reflection',
      required: true,
      completed: false,
      aiPrompt: 'Help me explore how I might express my insights through creative mediums',
      minWords: 150,
      interactionData: {
        type: 'creative_exploration',
        reflectionDepth: 5,
        clarity: 0
      }
    },
    
    practice: {
      type: 'real_world_exercise',
      required: true,
      completed: false,
      aiPrompt: 'Guide me through the creative expression process and help me overcome any blocks',
      minWords: 0,
      outsideRequirements: [
        'Creative materials of your choice',
        'Quiet space for creative work',
        'Time for experimentation and play',
        'Willingness to create without judgment'
      ],
      verificationMethod: 'self_report',
      interactionData: {
        type: 'creative_practice',
        steps: [
          'Choose your creative medium',
          'Select a concept to express',
          'Begin creating without judgment',
          'Reflect on the creative process',
          'Share your creation (optional)'
        ]
      }
    },
    
    reading: {
      type: 'text_analysis',
      required: true,
      completed: false,
      aiPrompt: 'Help me analyze the creative process concepts and apply them to my learning',
      minWords: 200,
      analysisQuestions: [
        'How does creativity relate to spiritual growth and self-discovery?',
        'What techniques can help overcome creative blocks?',
        'How can you integrate regular creative practice into your life?',
        'What insights from the reading will you apply to your creative expression?'
      ],
      creativeResponse: 'poem',
      interactionData: {
        type: 'creativity_analysis',
        comprehension: 0,
        creativity: 0
      }
    },
    
    quote: {
      type: 'personal_interpretation',
      required: true,
      completed: false,
      aiPrompt: 'Help me explore Einstein\'s insight about creativity and intelligence',
      minWords: 150,
      interpretationPrompt: 'What does Einstein\'s quote reveal about the relationship between creativity and learning?',
      applicationExercise: 'How can you bring more play and fun to your creative learning process?',
      interactionData: {
        type: 'creative_wisdom',
        insight: 0,
        application: 0
      }
    }
  },
  
  milestones: {
    teachingCompleted: false,
    questionAnswered: false,
    practiceCompleted: false,
    readingAnalyzed: false,
    quoteInterpreted: false,
    allCompleted: false
  },
  
  aiGuidance: {
    teachingAssistant: 'I\'m here to guide you through understanding how creative expression deepens learning. Ask me anything!',
    reflectionCoach: 'Let me help you explore creative ways to express your insights. What\'s on your mind?',
    practiceMentor: 'I\'ll support you in your creative expression practice. What challenges are you facing?',
    readingGuide: 'I can help you analyze the creative process concepts and apply them to your learning. What aspects would you like to explore?',
    wisdomInterpreter: 'Let\'s unpack Einstein\'s wisdom about creativity together. What does it mean to you?'
  }
};

// Export all example lessons
export const EXAMPLE_LESSONS = [
  EXAMPLE_LESSON_BELIEFS,
  EXAMPLE_LESSON_HABITS,
  EXAMPLE_LESSON_CREATIVE
];

// Helper function to get example lesson by type
export function getExampleLesson(type: string): AcademyLesson | null {
  const lessonMap: Record<string, AcademyLesson> = {
    'beliefs': EXAMPLE_LESSON_BELIEFS,
    'habits': EXAMPLE_LESSON_HABITS,
    'creative': EXAMPLE_LESSON_CREATIVE
  };
  
  return lessonMap[type] || null;
} 