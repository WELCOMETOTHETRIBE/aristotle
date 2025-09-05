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
  
  // If no Bearer token, try cookie-based auth directly
  if (!userId) {
    try {
      const token = request.cookies.get('auth-token')?.value;
      if (token) {
        const payload = await verifyToken(token);
        if (payload) {
          userId = payload.userId;
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
    const { skillName, parameters } = SkillInvocationSchema.parse(body);

    // Get user ID from authentication
    const userId = await getUserIdFromRequest(request);
    
    // Require authentication
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get user state
    const userState = await getUserState(userId);
    
    // Create skill context
    const context: SkillContext = {
      userId,
      userState,
      prisma,
      timestamp: new Date(),
    };

    // Get and invoke the skill
    const skill = getSkill(skillName);
    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    const result = await skill.invoke(parameters, context);

    return NextResponse.json({
      success: true,
      result,
      skillName,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Skill invocation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request format', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to invoke skill' },
      { status: 500 }
    );
  }
}
