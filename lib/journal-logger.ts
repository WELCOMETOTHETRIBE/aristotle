/**
 * Centralized Journal Logging System
 * 
 * This utility provides a consistent way to log all user activities and module completions
 * to the journal in a tasteful, meaningful way.
 */

export interface JournalLogData {
  type: string;
  content: string;
  prompt?: string;
  category?: string;
  metadata?: Record<string, any>;
  virtueGains?: Record<string, number>;
  moduleId?: string;
  widgetId?: string;
  frameworkSlug?: string;
}

export interface JournalLogResult {
  success: boolean;
  entry?: any;
  message?: string;
  error?: string;
}

/**
 * Log a user activity to the journal
 */
export async function logToJournal(data: JournalLogData): Promise<JournalLogResult> {
  try {
    // Use absolute URL for server-side calls
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const url = `${baseUrl}/api/journal`;
    console.log('🔍 Journal logger calling:', url);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      return {
        success: true,
        entry: result.entry,
        message: result.message,
      };
    } else {
      const error = await response.json();
      return {
        success: false,
        error: error.error || 'Failed to log to journal',
      };
    }
  } catch (error) {
    console.error('Error logging to journal:', error);
    return {
      success: false,
      error: 'Network error while logging to journal',
    };
  }
}

/**
 * Predefined journal entry creators for common activities
 */

// Breathwork sessions
export function createBreathworkLog(
  pattern: string,
  durationSec: number,
  cycles?: number,
  virtueGains?: Record<string, number>
): JournalLogData {
  const content = `Completed ${pattern} breathing session for ${Math.round(durationSec / 60 * 10) / 10} minutes${
    cycles ? ` (${cycles} cycles)` : ''
  }. Focused on steady, mindful breathing to cultivate inner calm and presence.`;
  
  return {
    type: 'breathwork_session',
    content,
    category: 'mindfulness',
    metadata: {
      pattern,
      durationSec,
      cycles,
      timestamp: new Date().toISOString(),
    },
    virtueGains,
    moduleId: 'breathwork',
    widgetId: 'breathwork_timer',
  };
}

// Nature photo logs
export function createNaturePhotoLog(
  caption: string,
  tags: string[],
  location?: string,
  weather?: string,
  mood?: string
): JournalLogData {
  const content = `Captured a moment in nature: ${caption}. ${
    tags.length > 0 ? `Tags: ${tags.join(', ')}. ` : ''
  }${
    location ? `Location: ${location}. ` : ''
  }${
    weather ? `Weather: ${weather}. ` : ''
  }${
    mood ? `Mood: ${mood}. ` : ''
  }This connection with nature nurtures our sense of wonder and presence.`;
  
  return {
    type: 'nature_photo',
    content,
    category: 'nature_connection',
    metadata: {
      tags,
      location,
      weather,
      mood,
      timestamp: new Date().toISOString(),
    },
    moduleId: 'nature_photo_log',
    widgetId: 'nature_photo_widget',
  };
}

// Gratitude entries
export function createGratitudeLog(
  content: string,
  prompt?: string
): JournalLogData {
  return {
    type: 'gratitude',
    content,
    prompt,
    category: 'wellness',
    metadata: {
      timestamp: new Date().toISOString(),
    },
    moduleId: 'gratitude_awe',
    widgetId: 'gratitude_journal',
  };
}

// Hydration logs
export function createHydrationLog(
  amount: number,
  unit: string = 'ml',
  totalToday?: number
): JournalLogData {
  const content = `Hydrated with ${amount}${unit}${
    totalToday ? ` (${totalToday}${unit} total today)` : ''
  }. Staying hydrated supports physical and mental performance throughout the day.`;
  
  return {
    type: 'hydration_log',
    content,
    category: 'health',
    metadata: {
      amount,
      unit,
      totalToday,
      timestamp: new Date().toISOString(),
    },
    moduleId: 'hydration',
    widgetId: 'hydration_tracker',
  };
}

// Sleep logs
export function createSleepLog(
  hours: number,
  quality: string,
  notes?: string
): JournalLogData {
  const content = `Slept for ${hours} hours with ${quality} quality sleep${
    notes ? `. Notes: ${notes}` : ''
  }. Quality sleep is the foundation of health, recovery, and daily vitality.`;
  
  return {
    type: 'sleep_log',
    content,
    category: 'health',
    metadata: {
      hours,
      quality,
      notes,
      timestamp: new Date().toISOString(),
    },
    moduleId: 'sleep_circadian',
    widgetId: 'sleep_tracker',
  };
}

// Movement/exercise sessions
export function createMovementLog(
  activity: string,
  duration: number,
  intensity?: string,
  notes?: string
): JournalLogData {
  const content = `Completed ${activity} for ${duration} minutes${
    intensity ? ` at ${intensity} intensity` : ''
  }${
    notes ? `. Notes: ${notes}` : ''
  }. Movement nourishes both body and mind, creating energy and clarity.`;
  
  return {
    type: 'movement_session',
    content,
    category: 'health',
    metadata: {
      activity,
      duration,
      intensity,
      notes,
      timestamp: new Date().toISOString(),
    },
    moduleId: 'movement_posture',
    widgetId: 'movement_widget',
  };
}

// Focus sessions
export function createFocusLog(
  duration: number,
  task?: string,
  interruptions?: number
): JournalLogData {
  const content = `Focused deeply for ${duration} minutes${
    task ? ` on: ${task}` : ''
  }${
    interruptions ? ` with ${interruptions} interruption${interruptions !== 1 ? 's' : ''}` : ''
  }. Deep focus builds concentration and creates meaningful progress in your work.`;
  
  return {
    type: 'focus_session',
    content,
    category: 'productivity',
    metadata: {
      duration,
      task,
      interruptions,
      timestamp: new Date().toISOString(),
    },
    moduleId: 'focus_deepwork',
    widgetId: 'focus_timer',
  };
}

// Habit check-ins
export function createHabitLog(
  habitName: string,
  completed: boolean,
  streak?: number,
  notes?: string
): JournalLogData {
  const content = `${completed ? 'Completed' : 'Missed'} habit: ${habitName}${
    streak ? ` (${streak} day streak)` : ''
  }${
    notes ? `. Notes: ${notes}` : ''
  }. Consistent habits compound into remarkable long-term results.`;
  
  return {
    type: 'habit_checkin',
    content,
    category: 'productivity',
    metadata: {
      habitName,
      completed,
      streak,
      notes,
      timestamp: new Date().toISOString(),
    },
    moduleId: 'habit_tracker',
    widgetId: 'habit_widget',
  };
}

// Goal progress
export function createGoalProgressLog(
  goalName: string,
  progress: number,
  milestone?: string,
  notes?: string
): JournalLogData {
  const content = `Made progress on goal: ${goalName} (${progress}% complete)${
    milestone ? `. Milestone: ${milestone}` : ''
  }${
    notes ? `. Notes: ${notes}` : ''
  }. Progress toward goals builds confidence and momentum in your journey.`;
  
  return {
    type: 'goal_progress',
    content,
    category: 'personal_growth',
    metadata: {
      goalName,
      progress,
      milestone,
      notes,
      timestamp: new Date().toISOString(),
    },
    moduleId: 'goal_tracker',
    widgetId: 'goal_widget',
  };
}

// Academy lessons
export function createAcademyLessonLog(
  lessonTitle: string,
  moduleName: string,
  response?: string,
  insights?: string
): JournalLogData {
  const content = `Completed academy lesson: ${lessonTitle} in ${moduleName}${
    response ? `. My response: ${response}` : ''
  }${
    insights ? `. Key insights: ${insights}` : ''
  }. Learning expands your perspective and deepens your understanding of life.`;
  
  return {
    type: 'academy_lesson',
    content,
    category: 'learning',
    metadata: {
      lessonTitle,
      moduleName,
      response,
      insights,
      timestamp: new Date().toISOString(),
    },
    moduleId: 'academy',
    widgetId: 'academy_lesson',
  };
}

// Virtue practice
export function createVirtuePracticeLog(
  virtue: string,
  action: string,
  context?: string,
  virtueGains?: Record<string, number>
): JournalLogData {
  const content = `Practiced ${virtue}: ${action}${
    context ? ` in the context of ${context}` : ''
  }. Practicing virtues strengthens character and guides ethical decision-making.`;
  
  return {
    type: 'virtue_practice',
    content,
    category: 'character_development',
    metadata: {
      virtue,
      action,
      context,
      timestamp: new Date().toISOString(),
    },
    virtueGains,
    moduleId: 'virtue_practice',
    widgetId: 'virtue_widget',
  };
}

// Mood tracking
export function createMoodLog(
  mood: string,
  intensity: number,
  context?: string,
  activities?: string[]
): JournalLogData {
  const content = `Current mood: ${mood} (intensity: ${intensity}/10)${
    context ? `. Context: ${context}` : ''
  }${
    activities && activities.length > 0 ? `. Activities: ${activities.join(', ')}` : ''
  }. Tracking your mood helps build emotional awareness and identify patterns in your well-being.`;
  
  return {
    type: 'mood',
    content,
    category: 'wellness',
    metadata: {
      mood,
      intensity,
      context,
      activities,
      timestamp: new Date().toISOString(),
    },
    moduleId: 'mood_tracker',
    widgetId: 'mood_widget',
  };
}

// Meditation sessions
export function createMeditationLog(
  duration: number,
  technique?: string,
  experience?: string,
  insights?: string
): JournalLogData {
  const content = `Meditated for ${duration} minutes${
    technique ? ` using ${technique}` : ''
  }${
    experience ? `. Experience: ${experience}` : ''
  }${
    insights ? `. Insights: ${insights}` : ''
  }. Meditation cultivates inner peace and mental clarity.`;
  
  return {
    type: 'meditation_session',
    content,
    category: 'mindfulness',
    metadata: {
      duration,
      technique,
      experience,
      insights,
      timestamp: new Date().toISOString(),
    },
    moduleId: 'meditation',
    widgetId: 'meditation_timer',
  };
}

// Exercise sessions
export function createExerciseLog(
  exercise: string,
  duration: number,
  intensity: string,
  notes?: string
): JournalLogData {
  const content = `Completed ${exercise} for ${duration} minutes at ${intensity} intensity${
    notes ? `. Notes: ${notes}` : ''
  }. Physical exercise builds strength, endurance, and mental resilience.`;
  
  return {
    type: 'exercise_session',
    content,
    category: 'health',
    metadata: {
      exercise,
      duration,
      intensity,
      notes,
      timestamp: new Date().toISOString(),
    },
    moduleId: 'exercise',
    widgetId: 'exercise_tracker',
  };
}

// Mindfulness moments
export function createMindfulnessLog(
  activity: string,
  duration: number,
  experience: string,
  insights?: string
): JournalLogData {
  const content = `Practiced mindfulness through ${activity} for ${duration} minutes. Experience: ${experience}${
    insights ? `. Insights: ${insights}` : ''
  }. Mindfulness brings awareness to the present moment and reduces stress.`;
  
  return {
    type: 'mindfulness_moment',
    content,
    category: 'mindfulness',
    metadata: {
      activity,
      duration,
      experience,
      insights,
      timestamp: new Date().toISOString(),
    },
    moduleId: 'mindfulness',
    widgetId: 'mindfulness_widget',
  };
}

// Learning insights
export function createLearningInsightLog(
  topic: string,
  insight: string,
  source?: string,
  application?: string
): JournalLogData {
  const content = `Learning insight about ${topic}: ${insight}${
    source ? `. Source: ${source}` : ''
  }${
    application ? `. How to apply: ${application}` : ''
  }. New insights expand your understanding and open new possibilities.`;
  
  return {
    type: 'learning_insight',
    content,
    category: 'learning',
    metadata: {
      topic,
      insight,
      source,
      application,
      timestamp: new Date().toISOString(),
    },
    moduleId: 'learning',
    widgetId: 'learning_widget',
  };
}

// Personal growth moments
export function createPersonalGrowthLog(
  area: string,
  realization: string,
  action?: string,
  impact?: string
): JournalLogData {
  const content = `Personal growth in ${area}: ${realization}${
    action ? `. Action taken: ${action}` : ''
  }${
    impact ? `. Impact: ${impact}` : ''
  }. Personal growth is a journey of continuous self-improvement and discovery.`;
  
  return {
    type: 'personal_growth',
    content,
    category: 'personal_development',
    metadata: {
      area,
      realization,
      action,
      impact,
      timestamp: new Date().toISOString(),
    },
    moduleId: 'personal_growth',
    widgetId: 'growth_widget',
  };
}

// Wellness activities
export function createWellnessActivityLog(
  activity: string,
  duration: number,
  benefits: string[],
  notes?: string
): JournalLogData {
  const content = `Completed wellness activity: ${activity} for ${duration} minutes. Benefits: ${benefits.join(', ')}${
    notes ? `. Notes: ${notes}` : ''
  }. Wellness activities nurture your physical, mental, and emotional health.`;
  
  return {
    type: 'wellness_activity',
    content,
    category: 'wellness',
    metadata: {
      activity,
      duration,
      benefits,
      notes,
      timestamp: new Date().toISOString(),
    },
    moduleId: 'wellness',
    widgetId: 'wellness_widget',
  };
}

// Productivity sessions
export function createProductivitySessionLog(
  task: string,
  duration: number,
  outcome: string,
  challenges?: string[]
): JournalLogData {
  const content = `Productivity session: ${task} for ${duration} minutes. Outcome: ${outcome}${
    challenges && challenges.length > 0 ? `. Challenges: ${challenges.join(', ')}` : ''
  }. Productive sessions create momentum and build confidence in your abilities.`;
  
  return {
    type: 'productivity_session',
    content,
    category: 'productivity',
    metadata: {
      task,
      duration,
      outcome,
      challenges,
      timestamp: new Date().toISOString(),
    },
    moduleId: 'productivity',
    widgetId: 'productivity_widget',
  };
}

// Creative expression
export function createCreativeExpressionLog(
  medium: string,
  creativeContent: string,
  inspiration?: string,
  process?: string
): JournalLogData {
  const content = `Creative expression through ${medium}: ${creativeContent}${
    inspiration ? `. Inspiration: ${inspiration}` : ''
  }${
    process ? `. Process: ${process}` : ''
  }. Creative expression connects you with your authentic self and inner wisdom.`;
  
  return {
    type: 'creative_expression',
    content,
    category: 'creativity',
    metadata: {
      medium,
      content,
      inspiration,
      process,
      timestamp: new Date().toISOString(),
    },
    moduleId: 'creativity',
    widgetId: 'creative_widget',
  };
}

// Social connections
export function createSocialConnectionLog(
  type: string,
  person?: string,
  activity?: string,
  impact?: string
): JournalLogData {
  const content = `Social connection: ${type}${
    person ? ` with ${person}` : ''
  }${
    activity ? ` through ${activity}` : ''
  }${
    impact ? `. Impact: ${impact}` : ''
  }. Social connections provide support, joy, and a sense of belonging.`;
  
  return {
    type: 'social_connection',
    content,
    category: 'relationships',
    metadata: {
      type,
      person,
      activity,
      impact,
      timestamp: new Date().toISOString(),
    },
    moduleId: 'social',
    widgetId: 'social_widget',
  };
}

// Self-care activities
export function createSelfCareActivityLog(
  activity: string,
  duration: number,
  reason: string,
  effect?: string
): JournalLogData {
  const content = `Self-care activity: ${activity} for ${duration} minutes. Reason: ${reason}${
    effect ? `. Effect: ${effect}` : ''
  }. Self-care is essential for maintaining balance and preventing burnout.`;
  
  return {
    type: 'self_care_activity',
    content,
    category: 'wellness',
    metadata: {
      activity,
      duration,
      reason,
      effect,
      timestamp: new Date().toISOString(),
    },
    moduleId: 'self_care',
    widgetId: 'self_care_widget',
  };
} 