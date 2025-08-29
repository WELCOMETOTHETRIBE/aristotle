import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { HabitSchema } from '@/lib/validators';
import { getOrCreateUser } from '@/lib/db';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const user = await getOrCreateUser('User');
    
    const habits = await prisma.habit.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }, // Now this field exists
    });

    return NextResponse.json(habits);
  } catch (error) {
    console.error('Habits GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch habits' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const habitData = HabitSchema.parse(body);
    
    const user = await getOrCreateUser('User');
    
    const habit = await prisma.habit.create({
      data: {
        userId: user.id,
        name: habitData.name,
        description: habitData.description,
        frequency: habitData.frequency,
      },
    });

    return NextResponse.json(habit);
  } catch (error) {
    console.error('Habits POST error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid habit data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create habit' },
      { status: 500 }
    );
  }
} 