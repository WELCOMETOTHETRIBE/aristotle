import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createNaturePhotoLog, logToJournal } from '@/lib/journal-logger';
import { getStorageService, generateUniqueFilename, getFileExtensionFromBase64 } from '@/lib/storage-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, imageData, caption, tags, location, weather, mood, aiInsights, aiComment } = body;

    // For now, use a default user ID if not provided
    const actualUserId = userId || 1;

    // Generate unique filename and save image using storage service
    const fileExtension = getFileExtensionFromBase64(imageData);
    const filename = generateUniqueFilename(actualUserId, fileExtension);
    
    const storageService = getStorageService();
    const imageUrl = await storageService.saveImage(filename, imageData);
    const imagePath = storageService.getImagePath(filename);

    // Create nature photo record
    const photo = await prisma.naturePhoto.create({
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
      imageUrl,
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