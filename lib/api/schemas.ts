import { z } from 'zod';

// Coach API schemas
export const In_Coach_POST = z.object({
  message: z.string().min(1),
  useVoice: z.boolean().optional().default(true)
});

export const Out_Coach_POST = z.object({
  reply: z.string(),
  plan: z.object({
    actions: z.array(z.object({
      title: z.string(),
      description: z.string(),
      tag: z.string(),
      priority: z.enum(['L', 'M', 'H'])
    })),
    habitNudges: z.array(z.object({
      habitName: z.string(),
      suggestion: z.string()
    })),
    reflectionPrompt: z.string()
  })
});

// TTS API schemas
export const In_TTS_POST = z.object({
  text: z.string().min(1).max(4096),
  voice: z.enum(['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']).optional().default('nova')
});

export const Out_TTS_POST = z.object({
  url: z.string(),
  filename: z.string(),
  size: z.number()
});

// Transcribe API schemas
export const In_Transcribe_POST = z.object({
  audio: z.instanceof(File)
});

export const Out_Transcribe_POST = z.object({
  text: z.string(),
  confidence: z.number().optional()
});

// Skills API schemas
export const In_Skills_Invoke_POST = z.object({
  skill: z.string(),
  args: z.record(z.any())
});

export const Out_Skills_Invoke_POST = z.object({
  result: z.any(),
  success: z.boolean()
});

// Health API schemas
export const Out_Health_GET = z.object({
  ok: z.boolean(),
  service: z.string(),
  timestamp: z.string(),
  environment: z.object({
    missing: z.array(z.string()),
    present: z.array(z.string())
  }),
  database: z.object({
    status: z.enum(['ok', 'fail']),
    error: z.string().optional()
  }),
  audio: z.object({
    breathwork: z.enum(['ok', 'missing'])
  }),
  tts: z.object({
    status: z.enum(['ok', 'fail'])
  })
});

// Fasting API schemas
export const In_Fasting_POST = z.object({
  startTime: z.string(),
  endTime: z.string().optional(),
  type: z.string(),
  notes: z.string().optional()
});

export const Out_Fasting_GET = z.object({
  sessions: z.array(z.any())
});

// Habits API schemas
export const In_Habits_POST = z.object({
  name: z.string(),
  description: z.string().optional(),
  frequency: z.string()
});

export const Out_Habits_GET = z.object({
  habits: z.array(z.any())
});

// Tasks API schemas
export const In_Tasks_POST = z.object({
  title: z.string(),
  description: z.string().optional(),
  dueAt: z.string().optional(),
  tag: z.string().optional(),
  priority: z.enum(['L', 'M', 'H']).optional()
});

export const Out_Tasks_GET = z.object({
  tasks: z.array(z.any())
});

// Goals API schemas
export const In_Goals_POST = z.object({
  title: z.string(),
  description: z.string().optional(),
  category: z.string(),
  targetDate: z.string().optional()
});

export const Out_Goals_GET = z.object({
  goals: z.array(z.any())
});

// User Facts API schemas
export const In_UserFacts_POST = z.object({
  facts: z.array(z.object({
    kind: z.enum(['bio', 'value', 'constraint', 'preference', 'insight']),
    content: z.string()
  }))
});

export const Out_UserFacts_POST = z.object({
  success: z.boolean(),
  message: z.string(),
  userId: z.string()
});
