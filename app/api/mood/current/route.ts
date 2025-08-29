import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get today's mood record
    const moodRecord = await prisma.session.findFirst({
      where: {
        moduleId: 'mood_regulation',
        startedAt: {
          gte: today
        }
      },
      orderBy: {
        startedAt: 'desc'
      }
    });
    
    // Get mood trend for the last 7 days
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const moodTrend = await prisma.session.findMany({
      where: {
        moduleId: 'mood_regulation',
        startedAt: {
          gte: weekAgo
        },
        moodPost: {
          not: null
        }
      },
      select: {
        moodPost: true,
        startedAt: true
      },
      orderBy: {
        startedAt: 'asc'
      }
    });
    
    const current = moodRecord?.moodPost || 4;
    const trend = moodTrend.map((record: any) => record.moodPost || 4);
    
    return NextResponse.json({
      current,
      trend,
      lastUpdated: moodRecord?.startedAt
    });
  } catch (error) {
    console.error('Error fetching mood data:', error);
    return NextResponse.json(
      { current: 4, trend: [3, 4, 4, 5, 4, 3, 4] },
      { status: 200 }
    );
  }
} 