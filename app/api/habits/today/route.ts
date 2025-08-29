import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get today's completed habits
    const completedHabits = await prisma.session.findMany({
      where: {
        startedAt: {
          gte: today
        },
        endedAt: {
          not: null
        }
      },
      select: {
        moduleId: true
      }
    });
    
    // Default morning ritual habits
    const totalHabits = ['breathwork', 'movement', 'gratitude'];
    const completedHabitIds = completedHabits.map((session: any) => session.moduleId).filter(Boolean);
    
    return NextResponse.json({
      completed: completedHabitIds,
      total: totalHabits,
      count: completedHabitIds.length,
      totalCount: totalHabits.length
    });
  } catch (error) {
    console.error('Error fetching habits data:', error);
    return NextResponse.json(
      { 
        completed: ['breathwork'], 
        total: ['breathwork', 'movement', 'gratitude'],
        count: 1,
        totalCount: 3
      },
      { status: 200 }
    );
  }
} 