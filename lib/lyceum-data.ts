import lyceumData from '@/data/lyceum_wisdom_journey_v1_1.json';

// Types for the Lyceum system
export interface LyceumMeta {
  title: string;
  version: string;
  authoring_date: string;
  philosophical_scope: string;
  session_length_minutes: string;
  device_capabilities: string[];
  artifacts_portfolio: string;
  ux_enhancements: string[];
}

export interface AIPrompts {
  tutor_system: string;
  evaluator_system: string;
  coach_system: string;
}

export interface CertificateRequirements {
  completed_paths: number;
  min_lessons_completed: number;
  portfolio_items_required: string[];
}

export interface CertificateScoring {
  rubric_average_threshold: number;
  mastery_domains: {
    logic: number;
    science: number;
    metaphysics: number;
    ethics: number;
    politics: number;
    rhetoric_poetics: number;
  };
}

export interface Certificate {
  requirements: CertificateRequirements;
  scoring: CertificateScoring;
  output: string;
}

export interface Activity {
  type: 'drag_drop_categorize' | 'reflection' | 'quiz' | 'photo_capture' | 'slider' | 'voice_note';
  id: string;
  instructions: string;
  items?: string[];
  categories?: string[];
  questions?: Array<{
    stem: string;
    choices?: string[];
    answer?: string;
    answers?: string[];
  }>;
  input?: {
    type: string;
    max_len: number;
  };
  analysis?: string;
  virtues?: Array<{
    name: string;
    min_label: string;
    max_label: string;
    start: number;
  }>;
  prompt?: string;
  max_seconds?: number;
}

export interface AssessmentRubric {
  criterion: string;
  weight: string;
  description: string;
}

export interface Assessment {
  rubric: AssessmentRubric[];
  completion_rule: string;
}

export interface MasteryUpdates {
  [key: string]: number;
}

export interface Narrative {
  intro: string;
  outro: string;
}

export interface AIHooks {
  tutor_hint: string;
  evaluator_hint: string;
  coach_hint: string;
}

export interface ScholarMode {
  title: string;
  estimated_minutes: number;
  exercise: string;
  ai_prompt: string;
}

export interface Agora {
  prompt: string;
  optional: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  time_minutes: number;
  objectives: string[];
  terms_introduced: string[];
  activities: Activity[];
  assessment: Assessment;
  artifacts: string[];
  mastery_updates: MasteryUpdates;
  dependencies: string[];
  optional: boolean;
  narrative: Narrative;
  modern_payoff: string;
  ai_hooks: AIHooks;
  scholar_mode: ScholarMode;
  agora: Agora;
}

export interface Path {
  id: string;
  title: string;
  description: string;
  estimated_minutes_total: number;
  lessons: Lesson[];
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  paths: string[];
}

export interface DailyCheckin {
  title: string;
  duration_minutes: number;
  purpose: string;
  examples: string[];
  ai_prompt: string;
}

export interface LyceumData {
  meta: LyceumMeta;
  ai_prompts: AIPrompts;
  certificate: Certificate;
  paths: Path[];
  glossary: GlossaryTerm[];
  daily_checkin: DailyCheckin;
}

// Export the loaded data with proper typing
export const LYCEUM_DATA: LyceumData = lyceumData as LyceumData;

// Helper functions
export const getPathById = (id: string): Path | undefined => {
  return LYCEUM_DATA.paths.find(path => path.id === id);
};

export const getLessonById = (lessonId: string): Lesson | undefined => {
  for (const path of LYCEUM_DATA.paths) {
    const lesson = path.lessons.find(lesson => lesson.id === lessonId);
    if (lesson) return lesson;
  }
  return undefined;
};

export const getPathByLessonId = (lessonId: string): Path | undefined => {
  return LYCEUM_DATA.paths.find(path => 
    path.lessons.some(lesson => lesson.id === lessonId)
  );
};

export const getAllArtifacts = (): string[] => {
  const artifacts = new Set<string>();
  LYCEUM_DATA.paths.forEach(path => {
    path.lessons.forEach(lesson => {
      lesson.artifacts.forEach(artifact => artifacts.add(artifact));
    });
  });
  return Array.from(artifacts);
};

export const getGlossaryTermById = (id: string): GlossaryTerm | undefined => {
  return LYCEUM_DATA.glossary.find(term => term.id === id);
};

export const getTermsByPath = (pathId: string): GlossaryTerm[] => {
  return LYCEUM_DATA.glossary.filter(term => term.paths.includes(pathId));
};

// Mastery domain helpers
export const getMasteryDomainForPath = (pathId: string): string => {
  const domainMap: { [key: string]: string } = {
    'path1': 'logic',
    'path2': 'logic', 
    'path3': 'science',
    'path4': 'science',
    'path5': 'science',
    'path6': 'metaphysics',
    'path7': 'ethics',
    'path8': 'ethics',
    'path9': 'politics',
    'path10': 'politics',
    'path11': 'rhetoric_poetics',
    'path12': 'rhetoric_poetics'
  };
  return domainMap[pathId] || 'general';
};

export const getTotalEstimatedTime = (): number => {
  return LYCEUM_DATA.paths.reduce((total, path) => total + path.estimated_minutes_total, 0);
};

export const getTotalLessons = (): number => {
  return LYCEUM_DATA.paths.reduce((total, path) => total + path.lessons.length, 0);
};

export const getCompletedPathsCount = (completedLessons: Set<string>): number => {
  return LYCEUM_DATA.paths.filter(path => 
    path.lessons.every(lesson => completedLessons.has(lesson.id))
  ).length;
};

export const getCompletedLessonsCount = (completedLessons: Set<string>): number => {
  return completedLessons.size;
};

export const canEarnCertificate = (completedLessons: Set<string>): boolean => {
  const completedPaths = getCompletedPathsCount(completedLessons);
  const completedLessonsCount = getCompletedLessonsCount(completedLessons);
  
  return completedPaths >= LYCEUM_DATA.certificate.requirements.completed_paths &&
         completedLessonsCount >= LYCEUM_DATA.certificate.requirements.min_lessons_completed;
};
