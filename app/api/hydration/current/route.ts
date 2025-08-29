import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get today's hydration record
    const hydrationRecord = await prisma.session.findFirst({
      where: {
        moduleId: 'hydration',
        startedAt: {
          gte: today
        }
      },
      orderBy: {
        startedAt: 'desc'
      }
    });
    
    // Default values
    const current = hydrationRecord ? parseInt(hydrationRecord.metrics || '0') : 1200;
    const target = 2000; // Default target
    
    return NextResponse.json({
      current,
      target,
      percentage: Math.round((current / target) * 100)
    });
  } catch (error) {
    console.error('Error fetching hydration data:', error);
    return NextResponse.json(
      { current: 1200, target: 2000, percentage: 60 },
      { status: 200 }
    );
  }
} 