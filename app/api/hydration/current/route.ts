import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Get today's hydration logs
    const hydrationLogs = await prisma.hydrationLog.findMany({
      where: {
        date: {
          gte: today,
          lt: tomorrow
        }
      }
    });
    
    // Calculate total hydration for today
    const current = hydrationLogs.reduce((sum: number, log: any) => sum + log.ml, 0);
    const target = 2000; // Default target
    
    return NextResponse.json({
      current,
      target,
      percentage: Math.round((current / target) * 100),
      logs: hydrationLogs
    });
  } catch (error) {
    console.error('Error fetching hydration data:', error);
    return NextResponse.json(
      { current: 0, target: 2000, percentage: 0, logs: [] },
      { status: 200 }
    );
  }
} 