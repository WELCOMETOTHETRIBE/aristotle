import { z } from 'zod';
import type { SkillDefinition, SkillContext } from '../lib/types';
import { prisma } from '../lib/db';

const inputSchema = z.object({
  content: z.string().min(1),
  reflectionType: z.enum(['gratitude', 'insight', 'challenge', 'goal', 'general']).optional(),
});

export const journalAppendSkill: SkillDefinition = {
  key: 'journal.append',
  description: 'Append an entry to the user\'s private journal',
  zodInputSchema: inputSchema,
  run: async (ctx: SkillContext, input: z.infer<typeof inputSchema>) => {
    const { content, reflectionType } = input;

    const journalEntry = await prisma.journal.create({
      data: {
        userId: ctx.userId,
        content,
      },
    });

    return {
      success: true,
      entry: {
        id: journalEntry.id,
        content: journalEntry.content,
        createdAt: journalEntry.createdAt.toISOString(),
        reflectionType,
      },
      message: `Added journal entry: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`,
    };
  },
}; 