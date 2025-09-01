import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getStorageService, generateUniqueFilename, getFileExtensionFromBase64 } from '@/lib/storage-service';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, imageData, caption, tags, location, weather, mood, aiInsights, aiComment } = body;

    if (!userId || !imageData || !caption || !tags) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get storage service for current environment
    const storageService = getStorageService();
    
    // Generate unique filename with proper extension
    const fileExtension = getFileExtensionFromBase64(imageData);
    const filename = generateUniqueFilename(parseInt(userId), fileExtension);

    try {
      // Save image using storage service
      const imageUrl = await storageService.saveImage(filename, imageData);
      
      // Save to database
      const photo = await prisma.naturePhoto.create({
        data: {
          userId: parseInt(userId),
          imagePath: imageUrl,
          caption,
          tags,
          location: location || null,
          weather: weather || null,
          mood: mood || null,
          aiInsights: aiInsights || null,
          aiComment: aiComment || null,
        }
      });

      console.log('Nature photo saved successfully:', photo);
      return NextResponse.json({ 
        success: true,
        photo,
        message: 'Photo uploaded successfully',
        note: process.env.NODE_ENV === 'production' 
          ? 'Image stored in temporary location. Consider implementing cloud storage for production.' 
          : 'Image stored successfully'
      });
    } catch (storageError) {
      console.error('Error saving image:', storageError);
      return NextResponse.json({ error: 'Failed to save image' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error uploading nature photo:', error);
    return NextResponse.json({ error: 'Failed to upload photo' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

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
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 });
  }
} 