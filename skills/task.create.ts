import { z } from 'zod';
import type { SkillDefinition, SkillContext } from '../lib/types';
import { prisma } from '../lib/db';

const inputSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dueAt: z.string().optional(),
  tag: z.enum(['breathwork', 'reflection', 'practice', 'log', 'misc']).optional(),
  priority: z.enum(['L', 'M', 'H']).default('M'),
});

export const taskCreateSkill: SkillDefinition = {
  key: 'task.create',
  description: 'Create a new task for the user',
  zodInputSchema: inputSchema,
  run: async (ctx: SkillContext, input: z.infer<typeof inputSchema>) => {
    const { title, description, dueAt, tag, priority } = input;

    const task = await prisma.task.create({
      data: {
        userId: ctx.userId,
        sessionId: ctx.sessionId,
        title,
        description,
        dueAt: dueAt ? new Date(dueAt) : null,
        tag,
        priority,
      },
    });

    return {
      success: true,
      task: {
        id: task.id,
        title: task.title,
        description: task.description,
        dueAt: task.dueAt?.toISOString(),
        tag: task.tag,
        priority: task.priority,
      },
      message: `Created task: ${title}`,
    };
  },
}; 