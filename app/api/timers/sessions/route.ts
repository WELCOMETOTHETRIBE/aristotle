import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { safeParse, zTimerSession, zId } from '@/lib/validate';

export async function GET(request: NextRequest) {
  try {
    // For now, use a default user ID (in production, get from auth)
    const userId = 1;
    
    const sessions = await prisma.timerSession.findMany({
      where: { userId },
      orderBy: { startedAt: 'desc' },
      take: 10
    });
    
    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Error fetching timer sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch timer sessions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = safeParse(zTimerSession, body);
    
    // For now, use a default user ID (in production, get from auth)
    const userId = 1;
    
    const session = await prisma.timerSession.create({
      data: {
        userId,
        type: data.type,
        label: data.label,
        meta: data.meta || {}
      }
    });
    
    return NextResponse.json({
      success: true,
      session
    });
  } catch (error) {
    console.error('Error starting timer session:', error);
    if (error instanceof Response) return error;
    return NextResponse.json(
      { error: 'Failed to start timer session' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }
    
    // For now, use a default user ID (in production, get from auth)
    const userId = 1;
    
    const session = await prisma.timerSession.update({
      where: {
        id: parseInt(id),
        userId
      },
      data: {
        endedAt: new Date()
      }
    });
    
    return NextResponse.json({
      success: true,
      session
    });
  } catch (error) {
    console.error('Error stopping timer session:', error);
    return NextResponse.json(
      { error: 'Failed to stop timer session' },
      { status: 500 }
    );
  }
} 