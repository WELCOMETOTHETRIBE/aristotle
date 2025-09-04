import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { safeParse, zHabitCheck } from '@/lib/validate';
import { verifyToken } from '@/lib/auth';

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

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    
    // Require authentication
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
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
    
    const userId = await getUserIdFromRequest(request);
    
    // Require authentication
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
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
    
    // Check if habit check already exists for today
    const existingCheck = await prisma.habitCheck.findFirst({
      where: {
        habitId: data.habitId,
        date: today
      }
    });
    
    let habitCheck;
    if (existingCheck) {
      // Update existing check
      habitCheck = await prisma.habitCheck.update({
        where: { id: existingCheck.id },
        data: {
          done: data.done,
          note: data.note
        }
      });
    } else {
      // Create new check
      habitCheck = await prisma.habitCheck.create({
        data: {
          habitId: data.habitId,
          date: today,
          done: data.done,
          note: data.note
        }
      });
    }
    
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