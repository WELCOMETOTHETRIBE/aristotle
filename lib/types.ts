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