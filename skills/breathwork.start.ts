import { z } from 'zod';
import type { SkillDefinition, SkillContext } from '../lib/types';

const inputSchema = z.object({
  name: z.string().optional(),
  pattern: z.object({
    inhale: z.number().positive(),
    hold: z.number().min(0),
    exhale: z.number().positive(),
    hold2: z.number().min(0).optional(),
    cycles: z.number().positive(),
  }).optional(),
  durationSec: z.number().positive().optional(),
});

export const breathworkStartSkill: SkillDefinition = {
  key: 'breathwork.start',
  description: 'Start a guided breathwork session with specified pattern',
  zodInputSchema: inputSchema,
  run: async (ctx: SkillContext, input: z.infer<typeof inputSchema>) => {
    const { name = 'Box Breathing', pattern, durationSec = 300 } = input;
    
    // Default to 4-4-4-4 pattern if not specified
    const defaultPattern = {
      inhale: 4,
      hold: 4,
      exhale: 4,
      hold2: 4,
      cycles: 10,
    };

    const finalPattern = pattern || defaultPattern;
    const totalDuration = durationSec || 300; // 5 minutes default

    // In a real implementation, this would start a timer and guide the user
    // For now, we'll return the session details
    return {
      success: true,
      session: {
        name,
        pattern: finalPattern,
        durationSec: totalDuration,
        startedAt: new Date().toISOString(),
        estimatedCycles: Math.floor(totalDuration / (finalPattern.inhale + finalPattern.hold + finalPattern.exhale + (finalPattern.hold2 || 0))),
      },
      message: `Starting ${name} session for ${Math.floor(totalDuration / 60)} minutes`,
    };
  },
}; 