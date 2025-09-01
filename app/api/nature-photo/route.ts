import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, imageData, caption, tags, location, weather, mood, aiInsights, aiComment } = body;

    if (!userId || !imageData || !caption || !tags) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'nature-photos');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `nature_${userId}_${timestamp}.jpg`;
    const filePath = join(uploadsDir, filename);

    // Convert base64 to buffer and save file
    const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    await writeFile(filePath, buffer);

    // Save to database
    const photo = await prisma.naturePhoto.create({
      data: {
        userId: parseInt(userId),
        imagePath: `/uploads/nature-photos/${filename}`,
        caption,
        tags,
        location: location || null,
        weather: weather || null,
        mood: mood || null,
        aiInsights: aiInsights || null,
        aiComment: aiComment || null,
      }
    });

    return NextResponse.json({ photo });
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