import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { safeParse, zBreathworkSession } from '@/lib/validate';
import { createBreathworkLog, logToJournal } from '@/lib/journal-logger';

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
    const validationResult = safeParse(zBreathworkSession, body);
    
    // safeParse throws on validation failure, so if we get here, validation passed
    const { pattern, durationSec, startedAt, completedAt } = validationResult;
    
    // For now, use a default user ID (in production, get from auth)
    const userId = 1;

    // Create session record
    const session = await prisma.session.create({
      data: {
        userId,
        moduleId: 'breathwork',
        startedAt: new Date(startedAt),
        endedAt: new Date(completedAt),
        metrics: JSON.stringify({
          pattern,
          durationSec,
          cycles: Math.floor(durationSec / 60), // Rough estimate
          completed: true
        })
      }
    });

    // Calculate temperance XP (5-15 points based on duration)
    const baseXP = 5;
    const durationBonus = Math.floor(durationSec / 60); // +1 XP per minute
    const totalXP = Math.min(15, baseXP + durationBonus);

    // Add XP to user's daily temperance virtue score
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const virtueScore = await prisma.virtueScore.upsert({
      where: {
        userId_date: {
          userId,
          date: today
        }
      },
      update: {
        temperance: {
          increment: totalXP
        }
      },
      create: {
        userId,
        date: today,
        wisdom: 0,
        courage: 0,
        temperance: totalXP,
        justice: 0
      }
    });

    // Create comprehensive journal entry using the new logging system
    const journalData = createBreathworkLog(
      pattern,
      durationSec,
      Math.floor(durationSec / 60), // cycles
      { temperance: totalXP }
    );

    const journalResult = await logToJournal(journalData);

    return NextResponse.json({
      success: true,
      session,
      xpGained: totalXP,
      virtueScore: virtueScore.temperance,
      journalEntry: journalResult.entry,
      message: `Breathwork session completed! +${totalXP} Temperance XP gained.`
    });

  } catch (error) {
    console.error('Error creating breathwork session:', error);
    return NextResponse.json(
      { error: 'Failed to create breathwork session' },
      { status: 500 }
    );
  }
} 