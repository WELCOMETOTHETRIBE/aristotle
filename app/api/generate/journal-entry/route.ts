import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { date = new Date().toISOString().split('T')[0] } = body;

    const userId = payload.userId;
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Gather all user data for the day
    const [
      dailyIntentions,
      moodLogs,
      naturePhotos,
      hydrationLogs,
      fastingSessions,
      timerSessions,
      journalEntries
    ] = await Promise.all([
      // Daily intentions
      prisma.dailyIntention.findMany({
        where: {
          userId,
          date: {
            gte: startOfDay,
            lte: endOfDay
          }
        },
        orderBy: { timePeriod: 'asc' }
      }),
      
      // Mood logs
      prisma.moodLog.findMany({
        where: {
          userId,
          date: {
            gte: startOfDay,
            lte: endOfDay
          }
        },
        orderBy: { date: 'asc' }
      }),
      
      // Nature photos
      prisma.naturePhoto.findMany({
        where: {
          userId,
          date: {
            gte: startOfDay,
            lte: endOfDay
          }
        },
        orderBy: { date: 'desc' }
      }),
      
      // Hydration logs
      prisma.hydrationLog.findMany({
        where: {
          userId,
          date: {
            gte: startOfDay,
            lte: endOfDay
          }
        },
        orderBy: { date: 'asc' }
      }),
      
      // Fasting sessions
      prisma.fastingSession.findMany({
        where: {
          userId,
          startTime: {
            gte: startOfDay,
            lte: endOfDay
          }
        },
        include: {
          benefits: true
        }
      }),
      
      // Timer sessions
      prisma.timerSession.findMany({
        where: {
          userId,
          startedAt: {
            gte: startOfDay,
            lte: endOfDay
          }
        },
        orderBy: { startedAt: 'asc' }
      }),
      
      // Journal entries
      prisma.journalEntry.findMany({
        where: {
          userId,
          date: {
            gte: startOfDay,
            lte: endOfDay
          }
        },
        orderBy: { date: 'desc' }
      })
    ]);

    // Calculate daily statistics
    const totalHydration = hydrationLogs.reduce((sum: number, log: any) => sum + log.ml, 0);
    const averageMood = moodLogs.length > 0 
      ? moodLogs.reduce((sum: number, log: any) => sum + log.mood, 0) / moodLogs.length 
      : null;
    
    const completedIntentions = dailyIntentions.filter((i: any) => i.submitted).length;
    const totalIntentions = dailyIntentions.length;

    // Generate comprehensive journal entry
    const journalContent = await generateComprehensiveJournalEntry({
      date: targetDate,
      dailyIntentions,
      moodLogs,
      naturePhotos,
      hydrationLogs,
      fastingSessions,
      timerSessions,
      journalEntries,
      statistics: {
        totalHydration,
        averageMood,
        completedIntentions,
        totalIntentions,
        photosTaken: naturePhotos.length,
        timersUsed: timerSessions.length,
        journalEntries: journalEntries.length
      }
    });

    // Save the generated journal entry
    const entry = await prisma.journalEntry.create({
      data: {
        userId,
        type: 'reflection',
        content: journalContent,
        prompt: 'AI-generated comprehensive daily reflection',
        category: 'daily_summary',
        date: targetDate,
        aiInsights: 'This comprehensive reflection was generated based on your daily activities and intentions.'
      }
    });

    return NextResponse.json({
      success: true,
      entry,
      message: 'Comprehensive journal entry generated successfully',
      data: {
        dailyIntentions,
        moodLogs,
        naturePhotos,
        hydrationLogs,
        fastingSessions,
        timerSessions,
        journalEntries,
        statistics: {
          totalHydration,
          averageMood,
          completedIntentions,
          totalIntentions,
          photosTaken: naturePhotos.length,
          timersUsed: timerSessions.length,
          journalEntries: journalEntries.length
        }
      }
    });

  } catch (error) {
    console.error('Error generating journal entry:', error);
    return NextResponse.json(
      { error: 'Failed to generate journal entry' },
      { status: 500 }
    );
  }
}

async function generateComprehensiveJournalEntry(data: any): Promise<string> {
  const {
    date,
    dailyIntentions,
    moodLogs,
    naturePhotos,
    hydrationLogs,
    fastingSessions,
    timerSessions,
    journalEntries,
    statistics
  } = data;

  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  const dateString = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  let content = `# Daily Reflection - ${dayName}, ${dateString}\n\n`;

  // Morning intentions
  if (dailyIntentions.length > 0) {
    content += `## Morning Intentions\n`;
    dailyIntentions.forEach(intention => {
      if (intention.submitted) {
        content += `- **${intention.timePeriod.charAt(0).toUpperCase() + intention.timePeriod.slice(1)}**: ${intention.intention} (Mood: ${intention.mood}/5)\n`;
      }
    });
    content += `\n`;
  }

  // Mood tracking
  if (moodLogs.length > 0) {
    content += `## Mood Throughout the Day\n`;
    moodLogs.forEach(log => {
      const time = new Date(log.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      content += `- **${time}**: ${log.mood}/5${log.note ? ` - ${log.note}` : ''}\n`;
    });
    if (statistics.averageMood) {
      content += `- **Average Mood**: ${statistics.averageMood.toFixed(1)}/5\n`;
    }
    content += `\n`;
  }

  // Nature photos
  if (naturePhotos.length > 0) {
    content += `## Nature Moments Captured\n`;
    naturePhotos.forEach(photo => {
      content += `- **${photo.caption}** (${photo.tags.join(', ')})\n`;
      if (photo.aiComment) {
        content += `  - Reflection: ${photo.aiComment}\n`;
      }
    });
    content += `\n`;
  }

  // Wellness activities
  if (statistics.totalHydration > 0 || fastingSessions.length > 0 || timerSessions.length > 0) {
    content += `## Wellness Activities\n`;
    
    if (statistics.totalHydration > 0) {
      content += `- **Hydration**: ${statistics.totalHydration}ml consumed\n`;
    }
    
    if (fastingSessions.length > 0) {
      fastingSessions.forEach(session => {
        const duration = session.endTime 
          ? Math.round((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / (1000 * 60 * 60))
          : Math.round((new Date().getTime() - new Date(session.startTime).getTime()) / (1000 * 60 * 60));
        content += `- **Fasting**: ${session.protocol} protocol (${duration} hours)\n`;
      });
    }
    
    if (timerSessions.length > 0) {
      timerSessions.forEach(session => {
        const duration = session.endedAt 
          ? Math.round((new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime()) / (1000 * 60))
          : Math.round((new Date().getTime() - new Date(session.startedAt).getTime()) / (1000 * 60));
        content += `- **${session.type}**: ${duration} minutes${session.label ? ` (${session.label})` : ''}\n`;
      });
    }
    content += `\n`;
  }

  // Personal reflections
  if (journalEntries.length > 0) {
    content += `## Personal Reflections\n`;
    journalEntries.forEach(entry => {
      content += `- **${entry.type}**: ${entry.content.substring(0, 100)}${entry.content.length > 100 ? '...' : ''}\n`;
    });
    content += `\n`;
  }

  // Daily summary
  content += `## Daily Summary\n`;
  content += `Today was a day of ${statistics.completedIntentions}/${statistics.totalIntentions} completed intentions. `;
  
  if (statistics.averageMood) {
    if (statistics.averageMood >= 4) {
      content += `Overall mood was positive, averaging ${statistics.averageMood.toFixed(1)}/5. `;
    } else if (statistics.averageMood >= 3) {
      content += `Mood was generally stable, averaging ${statistics.averageMood.toFixed(1)}/5. `;
    } else {
      content += `Mood was challenging today, averaging ${statistics.averageMood.toFixed(1)}/5. `;
    }
  }

  if (statistics.photosTaken > 0) {
    content += `You captured ${statistics.photosTaken} moments in nature, showing mindfulness and appreciation for the world around you. `;
  }

  if (statistics.totalHydration > 0) {
    content += `You maintained good hydration with ${statistics.totalHydration}ml consumed. `;
  }

  if (statistics.timersUsed > 0) {
    content += `You used ${statistics.timersUsed} focused sessions for personal development. `;
  }

  content += `\n\n## Tomorrow's Intentions\n`;
  content += `Based on today's activities, consider:\n`;
  content += `- What worked well today that you'd like to continue?\n`;
  content += `- What challenges did you face and how did you handle them?\n`;
  content += `- What would you like to focus on or improve tomorrow?\n`;
  content += `- How can you apply the wisdom from today's experiences?\n`;

  return content;
} 