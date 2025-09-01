import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createNaturePhotoLog, logToJournal } from '@/lib/journal-logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, imageData, caption, tags, location, weather, mood, aiInsights, aiComment } = body;

    // For now, use a default user ID if not provided
    const actualUserId = userId || 1;

    // Save image to uploads folder (simplified for demo)
    const filename = `nature_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`;
    const imagePath = `/uploads/nature-photos/${filename}`;

    // Create nature photo record
    const photo = await prisma.NaturePhoto.create({
      data: {
        userId: actualUserId,
        imagePath,
        caption: caption || 'Nature moment',
        tags: tags || [],
        location: location || null,
        weather: weather || null,
        mood: mood || null,
        aiInsights: aiInsights || null,
        aiComment: aiComment || null,
        createdAt: new Date()
      }
    });

    // Create comprehensive journal entry using the new logging system
    const journalData = createNaturePhotoLog(
      caption || 'Nature moment',
      tags || [],
      location,
      weather,
      mood
    );

    const journalResult = await logToJournal(journalData);

    return NextResponse.json({
      success: true,
      photo,
      journalEntry: journalResult.entry,
      message: 'Nature photo saved and logged to journal successfully!'
    });

  } catch (error) {
    console.error('Error creating nature photo:', error);
    return NextResponse.json(
      { error: 'Failed to create nature photo' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || '1';

    const photos = await prisma.naturePhoto.findMany({
      where: {
        userId: parseInt(userId)
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ photos });
  } catch (error) {
    console.error('Error fetching nature photos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch nature photos' },
      { status: 500 }
    );
  }
} 