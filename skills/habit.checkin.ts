import { z } from 'zod';
import type { SkillDefinition, SkillContext } from '../lib/types';
import { prisma } from '../lib/db';

const inputSchema = z.object({
  habitName: z.string().min(1),
  note: z.string().optional(),
});

export const habitCheckinSkill: SkillDefinition = {
  key: 'habit.checkin',
  description: 'Log a habit check-in and update streak',
  zodInputSchema: inputSchema,
  run: async (ctx: SkillContext, input: z.infer<typeof inputSchema>) => {
    const { habitName, note } = input;

    // Find the habit by name
    const habit = await prisma.habit.findFirst({
      where: {
        userId: ctx.userId,
        name: habitName,
      },
    });

    if (!habit) {
      return {
        success: false,
        error: `Habit "${habitName}" not found`,
      };
    }

    const now = new Date();
    const lastCheckIn = habit.lastCheckInAt;
    
    // Calculate if this is a consecutive day
    let newStreak = habit.streakCount;
    if (lastCheckIn) {
      const daysDiff = Math.floor((now.getTime() - lastCheckIn.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff === 1) {
        // Consecutive day
        newStreak += 1;
      } else if (daysDiff > 1) {
        // Streak broken
        newStreak = 1;
      }
      // If daysDiff === 0, same day, don't update streak
    } else {
      // First check-in
      newStreak = 1;
    }

    // Update the habit
    const updatedHabit = await prisma.habit.update({
      where: { id: habit.id },
      data: {
        streakCount: newStreak,
        lastCheckInAt: now,
      },
    });

    return {
      success: true,
      habit: {
        id: updatedHabit.id,
        name: updatedHabit.name,
        streakCount: updatedHabit.streakCount,
        lastCheckInAt: updatedHabit.lastCheckInAt?.toISOString(),
      },
      message: `Checked in "${habitName}". Streak: ${updatedHabit.streakCount} days`,
      note,
    };
  },
}; 