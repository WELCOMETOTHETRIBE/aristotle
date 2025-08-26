import { z } from 'zod';
import type { SkillDefinition, SkillContext } from '../lib/types';
import { prisma } from '../lib/db';

const inputSchema = z.object({
  goalId: z.string().optional(),
  goalTitle: z.string().optional(),
  progressNote: z.string().optional(),
  completed: z.boolean().optional(),
  newStatus: z.enum(['active', 'paused', 'completed']).optional(),
});

export const goalUpdateSkill: SkillDefinition = {
  key: 'goal.update',
  description: 'Update goal progress or status',
  zodInputSchema: inputSchema,
  run: async (ctx: SkillContext, input: z.infer<typeof inputSchema>) => {
    const { goalId, goalTitle, progressNote, completed, newStatus } = input;

    // Find the goal by ID or title
    let goal;
    if (goalId) {
      goal = await prisma.goal.findFirst({
        where: {
          id: goalId,
          userId: ctx.userId,
        },
      });
    } else if (goalTitle) {
      goal = await prisma.goal.findFirst({
        where: {
          title: goalTitle,
          userId: ctx.userId,
        },
      });
    }

    if (!goal) {
      return {
        success: false,
        error: goalId ? `Goal with ID "${goalId}" not found` : `Goal "${goalTitle}" not found`,
      };
    }

    // Determine new status
    let status = goal.status;
    if (completed) {
      status = 'completed';
    } else if (newStatus) {
      status = newStatus;
    }

    // Update the goal
    const updatedGoal = await prisma.goal.update({
      where: { id: goal.id },
      data: {
        status,
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      goal: {
        id: updatedGoal.id,
        title: updatedGoal.title,
        status: updatedGoal.status,
        updatedAt: updatedGoal.updatedAt.toISOString(),
      },
      message: `Updated goal "${updatedGoal.title}" to ${status}`,
      progressNote,
    };
  },
}; 