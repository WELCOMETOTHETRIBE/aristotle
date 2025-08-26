import { z } from "zod";
import type { CoachPlan } from "./types";

export const CoachPlanSchema = z.object({
  reply: z.string(),
  actions: z.array(z.object({
    title: z.string(),
    description: z.string().optional(),
    tag: z.enum(["breathwork", "reflection", "practice", "log", "misc"]).optional(),
    dueAt: z.string().optional(),
    priority: z.enum(["L", "M", "H"]).optional(),
  })),
  habitNudges: z.array(z.object({
    habitName: z.string(),
    suggestion: z.string(),
  })).optional(),
  goalUpdates: z.array(z.object({
    goalId: z.string().optional(),
    title: z.string().optional(),
    progressNote: z.string().optional(),
    completed: z.boolean().optional(),
  })).optional(),
  breathwork: z.object({
    name: z.string(),
    pattern: z.object({
      inhale: z.number(),
      hold: z.number(),
      exhale: z.number(),
      hold2: z.number().optional(),
      cycles: z.number(),
    }),
    durationSec: z.number().optional(),
    note: z.string().optional(),
  }).optional(),
  reflectionPrompt: z.string().optional(),
  hedonicCheck: z.object({
    riskLevel: z.enum(["low", "medium", "high"]),
    triggers: z.array(z.string()),
    counterMoves: z.array(z.string()),
  }).optional(),
  knowledgeFacts: z.array(z.string()).optional(),
  skillInvocations: z.array(z.object({
    skill: z.string(),
    args: z.record(z.unknown()),
  })).optional(),
});

export const UserFactSchema = z.object({
  kind: z.enum(["bio", "value", "constraint", "preference", "insight", "goal"]),
  content: z.string().min(1),
});

export const GoalSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.enum(["spiritual", "fitness", "career", "relationships", "learning", "finance", "misc"]),
  cadence: z.enum(["daily", "weekly", "ad-hoc"]),
  targetMetric: z.record(z.unknown()).optional(),
});

export const HabitSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  frequency: z.enum(["daily", "x_per_week", "custom"]),
});

export const TaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dueAt: z.string().optional(),
  tag: z.enum(["breathwork", "reflection", "practice", "log", "misc"]).optional(),
  priority: z.enum(["L", "M", "H"]).default("M"),
});

export const BreathworkPlanSchema = z.object({
  name: z.string().min(1),
  pattern: z.object({
    inhale: z.number().positive(),
    hold: z.number().min(0),
    exhale: z.number().positive(),
    hold2: z.number().min(0).optional(),
    cycles: z.number().positive(),
  }),
  durationSec: z.number().positive(),
  notes: z.string().optional(),
});

export const ChallengeSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  category: z.string(),
});

export const AutomationSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["reminder", "review", "sync", "custom"]),
  config: z.record(z.unknown()),
  isActive: z.boolean().default(true),
});

export const SkillInvocationSchema = z.object({
  skill: z.string(),
  args: z.record(z.unknown()),
});

export const TranscribeRequestSchema = z.object({
  audio: z.any(), // File validation is handled in the API route
});

export const CoachRequestSchema = z.object({
  text: z.string().min(1),
});

export const TTSRequestSchema = z.object({
  text: z.string().min(1),
  voice: z.string().optional(),
});

export const FastingSessionSchema = z.object({
  startTime: z.string().datetime(),
  endTime: z.string().datetime().optional(),
  type: z.enum(["16:8", "18:6", "20:4", "24h", "36h", "48h", "72h", "custom"]),
  notes: z.string().optional(),
});

export const FastingBenefitSchema = z.object({
  fastingSessionId: z.string(),
  benefitType: z.enum(["energy", "clarity", "weight_loss", "inflammation", "autophagy", "insulin_sensitivity", "mental_focus", "digestive_health"]),
  intensity: z.number().min(1).max(10),
  notes: z.string().optional(),
});

export const FastingEndSessionSchema = z.object({
  fastingSessionId: z.string(),
  endTime: z.string().datetime(),
  notes: z.string().optional(),
});

export type ValidatedCoachPlan = z.infer<typeof CoachPlanSchema>; 