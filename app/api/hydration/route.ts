import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { safeParse, zHydrationLog } from '@/lib/validate';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = safeParse(zHydrationLog, body);
    
    // For now, use a default user ID (in production, get from auth)
    const userId = 1;
    
    const hydrationLog = await prisma.hydrationLog.create({
      data: {
        userId,
        ml: data.ml,
        source: data.source,
        date: new Date()
      }
    });
    
    return NextResponse.json({
      success: true,
      hydrationLog
    });
  } catch (error) {
    console.error('Error creating hydration log:', error);
    if (error instanceof Response) return error;
    return NextResponse.json(
      { error: 'Failed to create hydration log' },
      { status: 500 }
    );
  }
} 