import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');
    
    // Get virtue scores for the last N days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const virtueScores = await prisma.virtueScore.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        date: 'desc'
      },
      take: days
    });
    
    // Calculate average scores
    const totalScores = virtueScores.reduce((acc: any, score: any) => ({
      wisdom: acc.wisdom + score.wisdom,
      courage: acc.courage + score.courage,
      justice: acc.justice + score.justice,
      temperance: acc.temperance + score.temperance
    }), { wisdom: 0, courage: 0, justice: 0, temperance: 0 });
    
    const count = virtueScores.length || 1;
    const averageScores = {
      wisdom: Math.round(totalScores.wisdom / count),
      courage: Math.round(totalScores.courage / count),
      justice: Math.round(totalScores.justice / count),
      temperance: Math.round(totalScores.temperance / count)
    };
    
    return NextResponse.json({
      scores: averageScores,
      recentScores: virtueScores,
      days: days
    });
  } catch (error) {
    console.error('Error fetching virtue progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch virtue progress' },
      { status: 500 }
    );
  }
} 