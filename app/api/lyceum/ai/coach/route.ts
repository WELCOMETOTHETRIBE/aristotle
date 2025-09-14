import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { lyceumAICoach } from '@/lib/lyceum-ai';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userTelos, currentPath, recentActivity, masteryScores, type } = body;

    let coaching;

    if (type === 'daily_checkin') {
      // Get daily check-in coaching
      coaching = await lyceumAICoach.provideDailyCheckin(
        userTelos || 'general flourishing',
        0 // This would be fetched from user's check-in history
      );
    } else {
      // Get regular coaching
      coaching = await lyceumAICoach.provideCoaching(
        userTelos || 'general flourishing',
        currentPath,
        recentActivity,
        masteryScores
      );
    }

    return NextResponse.json({
      success: true,
      coaching
    });

  } catch (error) {
    console.error('Error getting AI coaching:', error);
    return NextResponse.json(
      { error: 'Failed to get AI coaching' },
      { status: 500 }
    );
  }
}
