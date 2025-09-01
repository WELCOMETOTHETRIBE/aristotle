import { 
  BeliefIdentificationInteraction, 
  DailyHabitTrackerInteraction, 
  WisdomQuoteInteraction, 
  CreativeResponseInteraction 
} from '@/components/LessonInteractionComponents';

// Define lesson interaction types with dopamine-driven mechanics
export interface LessonInteractionConfig {
  type: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
  props: any;
  dopamineMechanics: {
    progressTracking: boolean;
    visualRewards: boolean;
    achievementUnlocks: boolean;
    streakBuilding: boolean;
    satisfactionScoring: boolean;
  };
  completionCriteria: {
    minProgress: number;
    requiredElements: string[];
    timeInvestment: number; // in minutes
  };
}

// Lesson interaction configurations
export const LESSON_INTERACTIONS: Record<string, LessonInteractionConfig> = {
  // Belief and Identity Lessons
  'belief_identification': {
    type: 'belief_identification',
    title: 'Core Belief Discovery',
    description: 'Identify and examine your fundamental beliefs through structured reflection',
    component: BeliefIdentificationInteraction,
    props: {
      minBeliefs: 5,
      reflectionPrompts: [
        'What do you believe about human nature?',
        'What are your core values?',
        'What do you believe about success?',
        'What are your spiritual beliefs?',
        'What do you believe about relationships?'
      ]
    },
    dopamineMechanics: {
      progressTracking: true,
      visualRewards: true,
      achievementUnlocks: true,
      streakBuilding: false,
      satisfactionScoring: true
    },
    completionCriteria: {
      minProgress: 60,
      requiredElements: ['beliefs', 'reflection'],
      timeInvestment: 15
    }
  },

  // Habit and Practice Lessons
  'daily_habit_building': {
    type: 'daily_habit_building',
    title: 'Daily Practice Tracker',
    description: 'Build consistent daily practices through habit tracking and streak building',
    component: DailyHabitTrackerInteraction,
    props: {
      habits: [
        'Morning Reflection',
        'Mindful Breathing',
        'Gratitude Practice',
        'Evening Review',
        'Learning Integration'
      ],
      streakTargets: [3, 7, 21, 66, 100] // days
    },
    dopamineMechanics: {
      progressTracking: true,
      visualRewards: true,
      achievementUnlocks: true,
      streakBuilding: true,
      satisfactionScoring: true
    },
    completionCriteria: {
      minProgress: 80,
      requiredElements: ['habits', 'streaks'],
      timeInvestment: 20
    }
  },

  // Wisdom and Philosophy Lessons
  'wisdom_interpretation': {
    type: 'wisdom_interpretation',
    title: 'Philosophical Wisdom Application',
    description: 'Interpret ancient wisdom and apply it to modern life',
    component: WisdomQuoteInteraction,
    props: {
      interpretationDepth: 5,
      applicationExamples: 3,
      lifeIntegration: true
    },
    dopamineMechanics: {
      progressTracking: true,
      visualRewards: true,
      achievementUnlocks: true,
      streakBuilding: false,
      satisfactionScoring: true
    },
    completionCriteria: {
      minProgress: 70,
      requiredElements: ['interpretation', 'examples'],
      timeInvestment: 25
    }
  },

  // Creative Expression Lessons
  'creative_expression': {
    type: 'creative_expression',
    title: 'Creative Response & Expression',
    description: 'Express your understanding through creative mediums',
    component: CreativeResponseInteraction,
    props: {
      creativeTypes: ['poem', 'art', 'story', 'mind_map'],
      inspirationPrompts: true,
      creativityScoring: true
    },
    dopamineMechanics: {
      progressTracking: true,
      visualRewards: true,
      achievementUnlocks: true,
      streakBuilding: false,
      satisfactionScoring: true
    },
    completionCriteria: {
      minProgress: 75,
      requiredElements: ['creative_response', 'reflection'],
      timeInvestment: 30
    }
  },

  // Self-Assessment Lessons
  'self_assessment': {
    type: 'self_assessment',
    title: 'Personal Growth Assessment',
    description: 'Evaluate your current state and growth areas',
    component: BeliefIdentificationInteraction, // Placeholder - would create specific component
    props: {
      assessmentAreas: [
        'Current Knowledge',
        'Skills Development',
        'Personal Growth',
        'Challenges Faced',
        'Future Goals'
      ],
      ratingScale: 1-10
    },
    dopamineMechanics: {
      progressTracking: true,
      visualRewards: true,
      achievementUnlocks: true,
      streakBuilding: false,
      satisfactionScoring: true
    },
    completionCriteria: {
      minProgress: 90,
      requiredElements: ['assessment', 'goals'],
      timeInvestment: 20
    }
  },

  // Community and Discussion Lessons
  'community_discussion': {
    type: 'community_discussion',
    title: 'Community Learning & Discussion',
    description: 'Engage with others in shared learning experiences',
    component: BeliefIdentificationInteraction, // Placeholder - would create specific component
    props: {
      discussionTopics: [],
      peerFeedback: true,
      collaborativeLearning: true
    },
    dopamineMechanics: {
      progressTracking: true,
      visualRewards: true,
      achievementUnlocks: true,
      streakBuilding: false,
      satisfactionScoring: true
    },
    completionCriteria: {
      minProgress: 85,
      requiredElements: ['participation', 'contribution'],
      timeInvestment: 35
    }
  },

  // Skill Practice Lessons
  'skill_practice': {
    type: 'skill_practice',
    title: 'Practical Skill Development',
    description: 'Practice and develop specific skills through guided exercises',
    component: DailyHabitTrackerInteraction, // Placeholder - would create specific component
    props: {
      skillAreas: [],
      practiceExercises: [],
      progressMetrics: []
    },
    dopamineMechanics: {
      progressTracking: true,
      visualRewards: true,
      achievementUnlocks: true,
      streakBuilding: true,
      satisfactionScoring: true
    },
    completionCriteria: {
      minProgress: 80,
      requiredElements: ['practice', 'improvement'],
      timeInvestment: 40
    }
  }
};

// Helper function to get interaction config for a lesson
export function getLessonInteraction(lessonType: string): LessonInteractionConfig | null {
  return LESSON_INTERACTIONS[lessonType] || null;
}

// Helper function to get all available interaction types
export function getAvailableInteractionTypes(): string[] {
  return Object.keys(LESSON_INTERACTIONS);
}

// Helper function to get interaction by category
export function getInteractionsByCategory(category: string): LessonInteractionConfig[] {
  const categoryMap: Record<string, string[]> = {
    'self_discovery': ['belief_identification', 'self_assessment'],
    'habit_building': ['daily_habit_building', 'skill_practice'],
    'wisdom_application': ['wisdom_interpretation'],
    'creative_expression': ['creative_expression'],
    'community_learning': ['community_discussion']
  };

  const types = categoryMap[category] || [];
  return types.map(type => LESSON_INTERACTIONS[type]).filter(Boolean);
}

// Dopamine reward system configuration
export const DOPAMINE_REWARDS = {
  progressMilestones: [25, 50, 75, 100],
  visualEffects: {
    completion: 'scale-110 rotate-12',
    progress: 'pulse',
    achievement: 'bounce',
    streak: 'wiggle'
  },
  achievementBadges: {
    'first_step': { name: 'First Step', icon: '🎯', color: 'blue' },
    'halfway_there': { name: 'Halfway There', icon: '🚀', color: 'green' },
    'almost_done': { name: 'Almost Done', icon: '⭐', color: 'yellow' },
    'completion_master': { name: 'Completion Master', icon: '🏆', color: 'purple' },
    'streak_builder': { name: 'Streak Builder', icon: '🔥', color: 'orange' },
    'creative_genius': { name: 'Creative Genius', icon: '🎨', color: 'pink' }
  },
  satisfactionScoring: {
    levels: ['Beginner', 'Apprentice', 'Practitioner', 'Master', 'Sage'],
    thresholds: [0, 20, 40, 60, 80, 100]
  }
};

// Lesson completion tracking
export interface LessonCompletion {
  lessonId: string;
  interactionType: string;
  progress: number;
  timeSpent: number;
  achievements: string[];
  satisfaction: number;
  completedAt: Date;
  nextSteps: string[];
}

// Generate next steps based on completion
export function generateNextSteps(completion: LessonCompletion): string[] {
  const nextSteps: string[] = [];
  
  if (completion.progress < 100) {
    nextSteps.push('Complete remaining sections');
  }
  
  if (completion.satisfaction < 80) {
    nextSteps.push('Review and deepen understanding');
  }
  
  if (completion.achievements.length < 3) {
    nextSteps.push('Explore additional learning opportunities');
  }
  
  nextSteps.push('Apply learnings in daily life');
  nextSteps.push('Share insights with community');
  
  return nextSteps;
} 