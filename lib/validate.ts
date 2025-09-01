import { z } from "zod";

export const zId = z.coerce.number().int().positive();
export const zDateISO = z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/));
export const zString = z.string().min(1);
export const zOptional = <T extends z.ZodTypeAny>(s: T) => s.optional();

export function safeParse<T>(schema: z.ZodSchema<T>, data: unknown) {
  const r = schema.safeParse(data);
  if (!r.success) throw new Response(JSON.stringify({ error: r.error.flatten() }), { status: 400 });
  return r.data;
}

// Common schemas for API routes
export const zVirtueScore = z.object({
  wisdom: z.number().min(0).max(10),
  courage: z.number().min(0).max(10),
  justice: z.number().min(0).max(10),
  temperance: z.number().min(0).max(10),
  note: z.string().optional()
});

export const zHydrationLog = z.object({
  ml: z.number().positive(),
  source: z.string().optional()
});

export const zMoodLog = z.object({
  mood: z.number().min(1).max(5),
  note: z.string().optional()
});

export const zHabitCheck = z.object({
  habitId: zId,
  done: z.boolean(),
  note: z.string().optional()
});

export const zTimerSession = z.object({
  type: z.string(),
  label: z.string().optional(),
  meta: z.record(z.any()).optional()
});

export const zFastingSession = z.object({
  protocol: z.string(),
  targetHours: z.number().positive(),
  notes: z.string().optional()
});

export const zBreathworkSession = z.object({
  pattern: z.string(),
  durationSec: z.number().positive(),
  startedAt: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)),
  completedAt: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)),
  moodBefore: z.number().min(1).max(5).optional(),
  moodAfter: z.number().min(1).max(5).optional()
});

export const zTask = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: zDateISO.optional(),
  priority: z.enum(["L", "M", "H"]).default("M"),
  tag: z.string().optional()
});

export const zGoal = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.string(),
  targetDate: zDateISO.optional()
}); 