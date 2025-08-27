export type CoachPlan = {
  reply: string;
  actions: Array<{
    title: string;
    description?: string;
    tag?: "breathwork" | "reflection" | "practice" | "log" | "misc";
    dueAt?: string;
    priority?: "L" | "M" | "H";
  }>;
  habitNudges?: Array<{
    habitName: string;
    suggestion: string;
  }>;
  goalUpdates?: Array<{
    goalId?: string;
    title?: string;
    progressNote?: string;
    completed?: boolean;
  }>;
  breathwork?: {
    name: string;
    pattern: {
      inhale: number;
      hold: number;
      exhale: number;
      hold2?: number;
      cycles: number;
    };
    durationSec?: number;
    note?: string;
  };
  reflectionPrompt?: string;
  hedonicCheck?: {
    riskLevel: "low" | "medium" | "high";
    triggers: string[];
    counterMoves: string[];
  };
  knowledgeFacts?: string[];
  skillInvocations?: Array<{
    skill: string;
    args: Record<string, unknown>;
  }>;
};

export type UserFactKind = "bio" | "value" | "constraint" | "preference" | "insight" | "goal";

export type GoalCategory = "spiritual" | "fitness" | "career" | "relationships" | "learning" | "finance" | "misc";

export type GoalCadence = "daily" | "weekly" | "ad-hoc";

export type GoalStatus = "active" | "paused" | "completed";

export type HabitFrequency = "daily" | "x_per_week" | "custom";

export type TaskTag = "breathwork" | "reflection" | "practice" | "log" | "misc";

export type TaskPriority = "L" | "M" | "H";

export type InputMode = "voice" | "text";

export type CoachTone = "gentle" | "direct" | "sage";

export type AutomationType = "reminder" | "review" | "sync" | "custom";

export type SkillRunStatus = "success" | "error" | "pending";

export type HedonicRiskLevel = "low" | "medium" | "high";

export interface BreathworkPattern {
  inhale: number;
  hold: number;
  exhale: number;
  hold2?: number;
  cycles: number;
}

export interface HedonicCheck {
  riskLevel: HedonicRiskLevel;
  triggers: string[];
  counterMoves: string[];
}

export interface UserState {
  activeGoals: Array<{
    id: string;
    title: string;
    category: GoalCategory;
    status: GoalStatus;
  }>;
  dueTasks: Array<{
    id: string;
    title: string;
    tag?: TaskTag;
    priority: TaskPriority;
    dueAt?: string;
  }>;
  habits: Array<{
    id: string;
    name: string;
    streakCount: number;
    lastCheckInAt?: string;
  }>;
  rollingSummary?: string;
}

export interface SkillContext {
  userId: string;
  userState: UserState;
  sessionId?: string;
}

export interface SkillDefinition {
  key: string;
  description: string;
  zodInputSchema: any; // Zod schema
  run: (ctx: SkillContext, input: any) => Promise<any>;
}

export type FastingType = "16:8" | "18:6" | "20:4" | "24h" | "36h" | "48h" | "72h" | "custom";

export type FastingStatus = "active" | "completed" | "broken";

export type BenefitType = "energy" | "clarity" | "weight_loss" | "inflammation" | "autophagy" | "insulin_sensitivity" | "mental_focus" | "digestive_health";

export interface FastingSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // minutes
  type: FastingType;
  status: FastingStatus;
  notes?: string;
  benefits?: string; // JSON string
  createdAt: Date;
  updatedAt: Date;
}

export interface FastingBenefit {
  id: string;
  userId: string;
  fastingSessionId: string;
  benefitType: BenefitType;
  intensity: number; // 1-10
  notes?: string;
  recordedAt: Date;
}

export interface FastingBenefitAnalysis {
  benefitType: BenefitType;
  averageIntensity: number;
  frequency: number;
  trend: "improving" | "stable" | "declining";
  description: string;
  scientificBackground: string;
}

export interface FastingProgress {
  currentSession?: FastingSession;
  totalSessions: number;
  averageDuration: number;
  longestFast: number;
  completionRate: number;
  benefits: FastingBenefitAnalysis[];
  recommendations: string[];
} 

// Ancient Wisdom Wellness System Types
export interface AncientPractice {
  id: string;
  title: string;
  description: string;
  virtue: 'wisdom' | 'courage' | 'justice' | 'temperance';
  category: string;
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  benefits: string[];
  instructions: string[];
  culturalContext: string;
  scientificValidation?: string;
  resources: {
    books?: string[];
    articles?: string[];
    teachers?: string[];
  };
  tags: string[];
}

export interface VirtueScore {
  virtue: 'wisdom' | 'courage' | 'justice' | 'temperance';
  score: number; // 0-1
  trend: 'up' | 'down' | 'stable';
  lastUpdated: Date;
}

export interface Routine {
  id: string;
  name: string;
  type: 'morning' | 'midday' | 'evening';
  practices: {
    practiceId: string;
    duration: number;
    order: number;
  }[];
  isActive: boolean;
  streak: number;
  lastCompleted?: Date;
}

export interface TrackerRecord {
  id: string;
  type: 'fasting' | 'breathwork' | 'cold-exposure' | 'heat-exposure' | 'mood' | 'sleep' | 'hydration';
  value: number;
  unit: string;
  timestamp: Date;
  notes?: string;
}

export interface MoodLog {
  id: string;
  mood: 1 | 2 | 3 | 4 | 5; // 1=very low, 5=very high
  energy: 1 | 2 | 3 | 4 | 5;
  timestamp: Date;
  reflection?: string;
}

export interface FastingSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  targetHours: number;
  isActive: boolean;
  notes?: string;
}

export interface BreathworkSession {
  id: string;
  type: 'box' | 'wim-hof' | 'pranayama' | 'custom';
  duration: number;
  phases: {
    name: string;
    duration: number;
  }[];
  completedAt: Date;
  notes?: string;
}

export interface ColdExposureSession {
  id: string;
  duration: number; // in seconds
  temperature?: number; // in celsius
  type: 'cold-shower' | 'ice-bath' | 'cold-plunge';
  completedAt: Date;
  notes?: string;
}

export interface HydrationLog {
  id: string;
  amount: number; // in ml
  timestamp: Date;
  type: 'water' | 'tea' | 'other';
}

export interface SleepLog {
  id: string;
  bedtime: Date;
  wakeTime: Date;
  quality: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  timezone: string;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    units: 'metric' | 'imperial';
  };
  goals: {
    dailyHydration: number; // in ml
    sleepHours: { start: string; end: string };
    fastingHours: number;
  };
  streaks: {
    morningRoutine: number;
    breathwork: number;
    fasting: number;
    coldExposure: number;
  };
}

export interface WidgetLayout {
  id: string;
  type: string;
  position: { x: number; y: number; w: number; h: number };
  isVisible: boolean;
  settings?: Record<string, any>;
}

export interface DashboardState {
  widgets: WidgetLayout[];
  lastUpdated: Date;
}

export interface Resource {
  id: string;
  title: string;
  type: 'book' | 'article' | 'video' | 'teacher';
  description: string;
  url?: string;
  author?: string;
  tags: string[];
  virtue?: 'wisdom' | 'courage' | 'justice' | 'temperance';
  isSaved: boolean;
} 