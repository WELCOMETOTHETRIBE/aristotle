import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { safeParse, zMoodLog } from '@/lib/validate';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = safeParse(zMoodLog, body);
    
    // For now, use a default user ID (in production, get from auth)
    const userId = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if a mood log already exists for today
    const existingMoodLog = await prisma.moodLog.findFirst({
      where: {
        userId,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) // Next day
        }
      }
    });
    
    let moodLog;
    
    if (existingMoodLog) {
      // Update existing mood log
      moodLog = await prisma.moodLog.update({
        where: { id: existingMoodLog.id },
        data: {
          mood: data.mood,
          note: data.note
        }
      });
    } else {
      // Create new mood log
      moodLog = await prisma.moodLog.create({
        data: {
          userId,
          date: today,
          mood: data.mood,
          note: data.note
        }
      });
    }
    
    // Create a journal entry for the mood log
    const moodEmoji = ['😢', '😕', '😐', '🙂', '😊'][data.mood - 1] || '😐';
    const moodDescription = ['Very Low', 'Low', 'Neutral', 'Good', 'Excellent'][data.mood - 1] || 'Unknown';
    
    const journalEntry = await prisma.journalEntry.create({
      data: {
        userId,
        type: 'mood',
        content: `${moodEmoji} Mood: ${moodDescription}${data.note ? ` - ${data.note}` : ''}`,
        category: 'mood_tracking',
        date: today,
        aiInsights: generateMoodInsights(data.mood, data.note)
      }
    });
    
    return NextResponse.json({
      success: true,
      moodLog,
      journalEntry,
      message: 'Mood logged and journal entry created successfully'
    });
  } catch (error) {
    console.error('Error creating mood log:', error);
    if (error instanceof Response) return error;
    return NextResponse.json(
      { error: 'Failed to create mood log' },
      { status: 500 }
    );
  }
}

// Helper function to generate mood-related insights
function generateMoodInsights(mood: number, note?: string): string {
  const baseInsights = [
    "Remember that emotions are temporary visitors. Practice self-compassion.",
    "Consider what might be influencing your mood today. Awareness is the first step.",
    "Your feelings are valid. Take a moment to acknowledge them without judgment.",
    "This is a good opportunity to practice emotional regulation techniques.",
    "Celebrate this positive energy! Consider what contributed to this good mood."
  ];
  
  let insight = baseInsights[mood - 1] || baseInsights[2]; // Default to neutral insight
  
  if (note && note.trim()) {
    insight += ` Your note suggests ${mood >= 4 ? 'positive' : mood <= 2 ? 'challenging' : 'mixed'} circumstances.`;
  }
  
  return insight;
} 