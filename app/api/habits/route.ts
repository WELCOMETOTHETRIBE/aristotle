import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { safeParse, zHabitCheck } from '@/lib/validate';

export async function GET(request: NextRequest) {
  try {
    // For now, use a default user ID (in production, get from auth)
    const userId = 1;
    
    const habits = await prisma.habit.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
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
    const data = safeParse(zHabitCheck, body);
    
    // For now, use a default user ID (in production, get from auth)
    const userId = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if habit exists and belongs to user
    const habit = await prisma.habit.findFirst({
      where: {
        id: data.habitId,
        userId
      }
    });
    
    if (!habit) {
      return NextResponse.json(
        { error: 'Habit not found' },
        { status: 404 }
      );
    }
    
    // Upsert today's habit check
    const habitCheck = await prisma.habitCheck.upsert({
      where: {
        habitId_date: {
          habitId: data.habitId,
          date: today
        }
      },
      update: {
        done: data.done,
        note: data.note
      },
      create: {
        habitId: data.habitId,
        date: today,
        done: data.done,
        note: data.note
      }
    });
    
    return NextResponse.json({
      success: true,
      habitCheck
    });
  } catch (error) {
    console.error('Error creating habit check:', error);
    if (error instanceof Response) return error;
    return NextResponse.json(
      { error: 'Failed to create habit check' },
      { status: 500 }
    );
  }
} 