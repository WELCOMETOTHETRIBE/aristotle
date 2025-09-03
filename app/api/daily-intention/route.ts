import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { logToJournal } from '@/lib/journal-logger';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const intentions = await prisma.dailyIntention.findMany({
      where: {
        userId: parseInt(userId),
        date: {
          gte: new Date(date),
          lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)
        }
      },
      orderBy: {
        timePeriod: 'asc'
      }
    });

    return NextResponse.json({ intentions });
  } catch (error) {
    console.error('Error fetching daily intentions:', error);
    return NextResponse.json({ error: 'Failed to fetch daily intentions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, timePeriod, mood, intention } = body;

    if (!userId || !timePeriod || !mood || !intention) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if intention already exists for this user, date, and time period
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
    
    const existingIntention = await prisma.dailyIntention.findFirst({
      where: {
        userId: parseInt(userId),
        date: {
          gte: startOfDay,
          lt: endOfDay
        },
        timePeriod
      }
    });

    if (existingIntention) {
      // Update existing intention
      const updatedIntention = await prisma.dailyIntention.update({
        where: { id: existingIntention.id },
        data: {
          mood,
          intention,
          submitted: true,
          submittedAt: new Date()
        }
      });

      // Log to journal
      await logToJournal({
        type: 'daily_intention',
        content: `Updated ${timePeriod} intention: ${intention}`,
        category: 'goal_setting',
        metadata: {
          timePeriod,
          mood,
          intention,
          timestamp: new Date().toISOString(),
        },
        moduleId: 'daily_intention',
        widgetId: 'intention_setter',
      });

      return NextResponse.json({ intention: updatedIntention });
    } else {
      // Create new intention
      const newIntention = await prisma.dailyIntention.create({
        data: {
          userId: parseInt(userId),
          timePeriod,
          mood,
          intention,
          submitted: true,
          submittedAt: new Date()
        }
      });

      // Log to journal
      await logToJournal({
        type: 'daily_intention',
        content: `Set ${timePeriod} intention: ${intention}`,
        category: 'goal_setting',
        metadata: {
          timePeriod,
          mood,
          intention,
          timestamp: new Date().toISOString(),
        },
        moduleId: 'daily_intention',
        widgetId: 'intention_setter',
      });

      return NextResponse.json({ intention: newIntention });
    }
  } catch (error) {
    console.error('Error creating daily intention:', error);
    return NextResponse.json({ error: 'Failed to create daily intention' }, { status: 500 });
  }
} 