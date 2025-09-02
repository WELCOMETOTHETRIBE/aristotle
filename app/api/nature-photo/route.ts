import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createNaturePhotoLog, logToJournal } from '@/lib/journal-logger';
import { getStorageService, generateUniqueFilename, getFileExtensionFromBase64 } from '@/lib/storage-service';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, imageData, caption, tags, location, weather, mood, aiInsights, aiComment } = body;

    if (!imageData || typeof imageData !== 'string') {
      return NextResponse.json({ error: 'imageData (base64) is required' }, { status: 400 });
    }

    // Ensure a default user exists for logging if not provided
    const actualUserId = userId || 1;
    if (!userId) {
      let defaultUser = await prisma.user.findUnique({ where: { id: 1 } });
      if (!defaultUser) {
        defaultUser = await prisma.user.create({
          data: {
            id: 1,
            username: 'system_user',
            displayName: 'System User',
            email: 'system@aristotle.com',
            password: 'system_user_no_password',
          }
        });
      }
    }

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
        aiComment: aiComment || null
      }
    });

    // Create comprehensive journal entry directly in the database
    const journalData = createNaturePhotoLog(
      caption || 'Nature moment',
      tags || [],
      location,
      weather,
      mood
    );

    // Create journal entry directly instead of making HTTP call
    const journalEntry = await prisma.journalEntry.create({
      data: {
        userId: actualUserId,
        type: journalData.type,
        content: journalData.content,
        category: journalData.category,
        date: new Date(),
        // Only fields present in schema are used; remove metadata/moduleId/widgetId
      },
    });

    return NextResponse.json({
      success: true,
      photo,
      imageUrl,
      journalEntry: journalEntry,
      message: 'Nature photo saved and logged to journal successfully!'
    });

  } catch (error) {
    console.error('Error creating nature photo:', error);
    return NextResponse.json(
      { error: 'Failed to create nature photo', details: error instanceof Error ? error.message : 'Unknown error' },
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
        date: 'desc'
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