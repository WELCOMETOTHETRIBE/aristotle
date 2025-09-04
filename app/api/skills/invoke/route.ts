import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { SkillInvocationSchema } from '@/lib/validators';
import { getSkill } from '@/skills';
import { getUserState } from '@/lib/db';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { SkillContext, GoalCategory, GoalStatus, TaskTag, TaskPriority } from '@/lib/types';

// Helper function to get user ID from request
async function getUserIdFromRequest(request: NextRequest): Promise<number | null> {
  let userId: number | null = null;
  
  // Try Bearer token first
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    const payload = await verifyToken(token);
    if (payload) {
      userId = payload.userId;
    }
  }
  
  // If no Bearer token, try cookie-based auth
  if (!userId) {
    try {
      const cookieHeader = request.headers.get('cookie');
      if (cookieHeader) {
        const response = await fetch(`${request.nextUrl.origin}/api/auth/me`, {
          headers: { cookie: cookieHeader }
        });
        
        if (response.ok) {
          const authData = await response.json();
          if (authData.user && authData.user.id) {
            userId = authData.user.id;
          }
        }
      }
    } catch (error) {
      console.error('Cookie auth check failed:', error);
    }
  }
  
  return userId;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { skill, args } = SkillInvocationSchema.parse(body);

    // Get user ID from authentication
    const userId = await getUserIdFromRequest(request);
    
    // Require authentication
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

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
    const userState = await getUserState(userId);
    
    // Transform database results to match TypeScript types
    const context: SkillContext = {
      userId: userId,
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
          dueAt: task.dueDate?.toISOString(),
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
        userId: userId,
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