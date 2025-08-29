import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { safeParse, zFastingSession } from '@/lib/validate';

export async function GET(request: NextRequest) {
  try {
    // For now, use a default user ID (in production, get from auth)
    const userId = 1;
    
    // Get active fasting session
    const activeSession = await prisma.fastingSession.findFirst({
      where: {
        userId,
        status: 'active'
      },
      orderBy: {
        startTime: 'desc'
      }
    });
    
    // Get latest completed session
    const latestSession = await prisma.fastingSession.findFirst({
      where: {
        userId,
        status: 'completed'
      },
      orderBy: {
        startTime: 'desc'
      }
    });
    
    return NextResponse.json({
      active: activeSession,
      latest: latestSession
    });
  } catch (error) {
    console.error('Error fetching fasting sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fasting sessions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = safeParse(zFastingSession, body);
    
    // For now, use a default user ID (in production, get from auth)
    const userId = 1;
    
    // Check if there's already an active session
    const existingActive = await prisma.fastingSession.findFirst({
      where: {
        userId,
        status: 'active'
      }
    });
    
    if (existingActive) {
      return NextResponse.json(
        { error: 'Already have an active fasting session' },
        { status: 400 }
      );
    }
    
    const session = await prisma.fastingSession.create({
      data: {
        userId,
        protocol: data.protocol,
        targetHours: data.targetHours,
        notes: data.notes
      }
    });
    
    return NextResponse.json({
      success: true,
      session
    });
  } catch (error) {
    console.error('Error starting fasting session:', error);
    if (error instanceof Response) return error;
    return NextResponse.json(
      { error: 'Failed to start fasting session' },
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
    
    const session = await prisma.fastingSession.update({
      where: {
        id: parseInt(id),
        userId
      },
      data: {
        status: 'completed',
        endTime: new Date()
      }
    });
    
    return NextResponse.json({
      success: true,
      session
    });
  } catch (error) {
    console.error('Error stopping fasting session:', error);
    return NextResponse.json(
      { error: 'Failed to stop fasting session' },
      { status: 500 }
    );
  }
} 