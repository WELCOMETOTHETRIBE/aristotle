import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { SkillInvocationSchema } from '@/lib/validators';
import { getSkill } from '@/skills';
import { getOrCreateUser, getUserState } from '@/lib/db';
import { prisma } from '@/lib/db';
import { SkillContext, GoalCategory, GoalStatus, TaskTag, TaskPriority } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { skill, args } = SkillInvocationSchema.parse(body);

    // Get or create user
    const user = await getOrCreateUser('User');

    // Get skill definition
    const skillDef = getSkill(skill);
    if (!skillDef) {
      return NextResponse.json(
        { error: `Skill "${skill}" not found` },
        { status: 404 }
      );
    }

    // Validate input with skill's schema
    const validatedArgs = skillDef.zodInputSchema.parse(args);

    // Get user state for skill context
    const userState = await getUserState(user.id);
    
    // Transform database results to match TypeScript types
    const context: SkillContext = {
      userId: user.id,
      userState: {
        activeGoals: userState.activeGoals.map(goal => ({
          id: goal.id,
          title: goal.title,
          category: goal.category as GoalCategory,
          status: goal.status as GoalStatus,
        })),
        dueTasks: userState.dueTasks.map(task => ({
          id: task.id,
          title: task.title,
          tag: task.tag as TaskTag | undefined,
          priority: task.priority as TaskPriority,
          dueAt: task.dueAt?.toISOString(),
        })),
        habits: userState.habits.map(habit => ({
          id: habit.id,
          name: habit.name,
          streakCount: habit.streakCount,
          lastCheckInAt: habit.lastCheckInAt?.toISOString(),
        })),
        rollingSummary: userState.rollingSummary || undefined,
      },
    };

    // Execute skill
    const result = await skillDef.run(context, validatedArgs);

    // Log skill execution
    await prisma.skillRunLog.create({
      data: {
        userId: user.id,
        skillKey: skill,
        inputJson: JSON.stringify(args),
        outputJson: JSON.stringify(result),
        status: result.success ? 'success' : 'error',
      },
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('Skill invocation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid skill input', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Skill execution failed' },
      { status: 500 }
    );
  }
} 