import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // For now, use a default user ID (in production, get from auth)
    const userId = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Get active habits with today's checks
    const habits = await prisma.habit.findMany({
      where: {
        userId
      },
      include: {
        checks: {
          where: {
            date: {
              gte: today,
              lt: tomorrow
            }
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
    
    // Transform to include check status
    const habitsWithChecks = habits.map((habit: any) => ({
      ...habit,
      checkedToday: habit.checks.length > 0 ? habit.checks[0].done : false,
      todayNote: habit.checks.length > 0 ? habit.checks[0].note : null
    }));
    
    return NextResponse.json({
      habits: habitsWithChecks
    });
  } catch (error) {
    console.error('Error fetching habits:', error);
    return NextResponse.json(
      { habits: [] },
      { status: 200 }
    );
  }
} 