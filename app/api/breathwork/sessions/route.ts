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
    
    // Create the breathwork session
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

    // Grant temperance XP for completing breathwork
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calculate XP based on session duration (longer sessions = more XP)
    const baseXP = 5;
    const durationBonus = Math.floor(data.durationSec / 60); // 1 XP per minute
    const temperanceXP = Math.min(baseXP + durationBonus, 15); // Cap at 15 XP
    
    // Update today's virtue scores
    const virtueScore = await prisma.virtueScore.upsert({
      where: {
        userId_date: {
          userId,
          date: today
        }
      },
      update: {
        temperance: {
          increment: temperanceXP
        },
        note: `Breathwork session completed: +${temperanceXP} temperance XP`
      },
      create: {
        userId,
        date: today,
        wisdom: 0,
        courage: 0,
        justice: 0,
        temperance: temperanceXP,
        note: `Breathwork session completed: +${temperanceXP} temperance XP`
      }
    });

    // Log completion to journal
    const journalEntry = await prisma.journalEntry.create({
      data: {
        userId,
        type: 'reflection',
        content: `Completed ${data.pattern} breathwork session for ${Math.floor(data.durationSec / 60)}m ${data.durationSec % 60}s. Focused breathing helps cultivate inner calm and self-control.`,
        prompt: 'Breathwork Session Reflection',
        category: 'breathwork',
        date: new Date(),
        aiInsights: 'Breathwork is a powerful practice for developing temperance. By consciously controlling your breath, you strengthen your ability to regulate emotions and maintain composure in challenging situations. This session contributes to your journey of self-mastery.'
      }
    });
    
    return NextResponse.json({
      success: true,
      session,
      virtueScore,
      journalEntry,
      xpGained: temperanceXP
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