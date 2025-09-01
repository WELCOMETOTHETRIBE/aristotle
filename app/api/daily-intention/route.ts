import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

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
    const existingIntention = await prisma.dailyIntention.findFirst({
      where: {
        userId: parseInt(userId),
        date: {
          gte: new Date().setHours(0, 0, 0, 0),
          lt: new Date().setHours(23, 59, 59, 999)
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
      return NextResponse.json({ intention: newIntention });
    }
  } catch (error) {
    console.error('Error creating daily intention:', error);
    return NextResponse.json({ error: 'Failed to create daily intention' }, { status: 500 });
  }
} 