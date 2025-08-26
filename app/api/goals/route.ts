import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { GoalSchema } from '@/lib/validators';
import { getOrCreateUser } from '@/lib/db';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const user = await getOrCreateUser('Demo User');
    
    const goals = await prisma.goal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }, // This field exists in the Goal model
    });

    return NextResponse.json(goals);
  } catch (error) {
    console.error('Goals GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch goals' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const goalData = GoalSchema.parse(body);
    
    const user = await getOrCreateUser('Demo User');
    
    const goal = await prisma.goal.create({
      data: {
        userId: user.id,
        title: goalData.title,
        description: goalData.description,
        category: goalData.category,
        cadence: goalData.cadence,
        targetMetric: goalData.targetMetric ? JSON.stringify(goalData.targetMetric) : null,
      },
    });

    return NextResponse.json(goal);
  } catch (error) {
    console.error('Goals POST error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid goal data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create goal' },
      { status: 500 }
    );
  }
} 