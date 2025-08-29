import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Get today's mood log
    const moodLog = await prisma.moodLog.findFirst({
      where: {
        date: {
          gte: today,
          lt: tomorrow
        }
      },
      orderBy: {
        date: 'desc'
      }
    });
    
    return NextResponse.json({
      mood: moodLog?.mood || null,
      note: moodLog?.note || null,
      logged: !!moodLog
    });
  } catch (error) {
    console.error('Error fetching mood data:', error);
    return NextResponse.json(
      { mood: null, note: null, logged: false },
      { status: 200 }
    );
  }
} 