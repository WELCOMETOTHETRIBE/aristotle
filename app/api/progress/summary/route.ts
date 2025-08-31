import { NextRequest, NextResponse } from 'next/server';
import { VirtueTotals } from '@/lib/virtue';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const frameworkSlug = url.searchParams.get('frameworkSlug');
    const userId = 'user-1'; // Mock user ID

    // Mock virtue totals (in real app, calculate from checkins)
    const virtueTotals: VirtueTotals = {
      wisdom: 45,
      justice: 32,
      courage: 28,
      temperance: 38
    };

    // Mock 30-day streak (in real app, calculate from checkins)
    const streak = 12;

    // Mock rubric completion (in real app, calculate from capstone progress)
    const rubricCompletion = {
      attendance: 80, // 24/30 days
      kpis: 75, // 70% target days met
      reflection: 60, // 12/20 entries
      capstone: 0 // 0/1 completed
    };

    // Calculate overall completion percentage
    const overallCompletion = Math.round(
      (rubricCompletion.attendance + rubricCompletion.kpis + rubricCompletion.reflection + rubricCompletion.capstone) / 4
    );

    return NextResponse.json({
      success: true,
      virtueTotals,
      streak,
      rubricCompletion,
      overallCompletion,
      frameworkSlug
    });

  } catch (error) {
    console.error('Error fetching progress summary:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 