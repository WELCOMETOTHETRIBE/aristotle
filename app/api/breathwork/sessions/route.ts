import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { safeParse, zBreathworkSession } from '@/lib/validate';

export async function GET(request: NextRequest) {
  try {
    // For now, use a default user ID (in production, get from auth)
    const userId = 1;
    
    const sessions = await prisma.session.findMany({
      where: {
        userId,
        moduleId: 'breathwork'
      },
      orderBy: {
        startedAt: 'desc'
      },
      take: 10
    });
    
    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Error fetching breathwork sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch breathwork sessions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = safeParse(zBreathworkSession, body);
    
    // For now, use a default user ID (in production, get from auth)
    const userId = 1;
    
    const session = await prisma.session.create({
      data: {
        userId,
        moduleId: 'breathwork',
        startedAt: new Date(),
        endedAt: new Date(),
        metrics: JSON.stringify({
          pattern: data.pattern,
          durationSec: data.durationSec
        }),
        moodPre: data.moodBefore,
        moodPost: data.moodAfter
      }
    });
    
    return NextResponse.json({
      success: true,
      session
    });
  } catch (error) {
    console.error('Error creating breathwork session:', error);
    if (error instanceof Response) return error;
    return NextResponse.json(
      { error: 'Failed to create breathwork session' },
      { status: 500 }
    );
  }
} 