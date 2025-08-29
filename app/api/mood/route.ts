import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { safeParse, zMoodLog } from '@/lib/validate';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = safeParse(zMoodLog, body);
    
    // For now, use a default user ID (in production, get from auth)
    const userId = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Upsert today's mood log
    const moodLog = await prisma.moodLog.upsert({
      where: {
        userId_date: {
          userId,
          date: today
        }
      },
      update: {
        mood: data.mood,
        note: data.note
      },
      create: {
        userId,
        date: today,
        mood: data.mood,
        note: data.note
      }
    });
    
    return NextResponse.json({
      success: true,
      moodLog
    });
  } catch (error) {
    console.error('Error creating mood log:', error);
    if (error instanceof Response) return error;
    return NextResponse.json(
      { error: 'Failed to create mood log' },
      { status: 500 }
    );
  }
} 