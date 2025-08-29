import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get today's fasting session
    const fastingSession = await prisma.session.findFirst({
      where: {
        moduleId: 'fasting',
        startedAt: {
          gte: today
        },
        endedAt: null // Active session
      },
      orderBy: {
        startedAt: 'desc'
      }
    });
    
    if (fastingSession) {
      const startTime = new Date(fastingSession.startedAt).getTime();
      const now = Date.now();
      const elapsed = now - startTime;
      const protocol = fastingSession.metrics ? JSON.parse(fastingSession.metrics).protocol : '16:8';
      
      return NextResponse.json({
        isActive: true,
        timeRemaining: elapsed,
        protocol,
        startTime: fastingSession.startedAt
      });
    }
    
    return NextResponse.json({
      isActive: false,
      timeRemaining: 0,
      protocol: '16:8'
    });
  } catch (error) {
    console.error('Error fetching fasting status:', error);
    return NextResponse.json(
      { isActive: false, timeRemaining: 0, protocol: '16:8' },
      { status: 200 }
    );
  }
} 