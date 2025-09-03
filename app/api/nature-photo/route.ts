import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createNaturePhotoLog, logToJournal } from '@/lib/journal-logger';
import { getStorageService, generateUniqueFilename, getFileExtensionFromBase64 } from '@/lib/storage-service';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }
    const db = prisma as any;
    const body = await request.json();
    const { userId, imageData, caption, tags, location, weather, mood, aiInsights, aiComment, shareToCommunity } = body;

    if (!imageData || typeof imageData !== 'string') {
      return NextResponse.json({ error: 'imageData (base64) is required' }, { status: 400 });
    }

    // Ensure a default user exists for logging if not provided
    const actualUserId = userId || 1;
    let actualUser = null;
    
    if (userId) {
      // Get the actual user's information
      actualUser = await db.user.findUnique({ where: { id: parseInt(userId) } });
    }
    
    if (!actualUser) {
      // Fallback to system user if no actual user found
      actualUser = await db.user.findUnique({ where: { id: 1 } });
      if (!actualUser) {
        actualUser = await db.user.create({
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
    // Use imageUrl (web-accessible path) instead of imagePath (filesystem path)
    const imagePath = imageUrl;

    // Generate AI insights from the actual image
    let computedInsights: string | null = null;
    try {
      const apiKey = process.env.OPENAI_API_KEY;
      if (apiKey) {
        const openai = new OpenAI({ apiKey });
        const supplemental = [
          caption ? `Caption: ${caption}` : null,
          (Array.isArray(tags) && tags.length > 0) ? `Tags: ${tags.join(', ')}` : null,
          location ? `Location: ${location}` : null,
          weather ? `Weather: ${weather}` : null,
          mood ? `Mood: ${mood}` : null,
        ].filter(Boolean).join('\n');

        const userPrompt = `Look at this nature photo and describe succinctly (2-3 sentences) what you see (e.g., sky, water, trees, light) and the feeling it evokes. If helpful, consider the supplemental details.\n\n${supplemental}`.trim();

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: userPrompt },
                { type: 'image_url', image_url: { url: imagePath } },
              ] as any,
            },
          ],
          temperature: 0.7,
          max_tokens: 180,
        });
        computedInsights = completion.choices?.[0]?.message?.content || null;
      }
    } catch (visionError) {
      console.error('Vision insights generation failed:', visionError);
      // fall through with null to use fallback below
    }

    // Create nature photo record
    const photo = await db.naturePhoto.create({
      data: {
        userId: actualUserId,
        imagePath, // This now contains the web-accessible URL
        caption: caption || 'Nature moment',
        tags: tags || [],
        location: location || null,
        weather: weather || null,
        mood: mood || null,
        aiInsights: computedInsights || aiInsights || null,
        aiComment: computedInsights || aiComment || null
      }
    });

    // Create comprehensive journal entry using the journal logger
    const journalData = createNaturePhotoLog(
      caption || 'Nature moment',
      tags || [],
      location,
      weather,
      mood
    );

    // Log to journal using the proper function
    console.log('Logging nature photo to journal for user:', actualUserId);
    const journalResult = await logToJournal(journalData);

    if (!journalResult.success) {
      console.error('Failed to log to journal:', journalResult.error);
      // Continue with the photo creation even if journal logging fails
    } else {
      console.log('Successfully logged to journal:', journalResult.entry?.id);
    }

    // Community sharing functionality restored
    let thread = null;
    if (shareToCommunity) {
      const createdPost = await db.communityPost.create({
        data: {
          title: `Nature Log: ${photo.caption}`,
          content: `A moment captured in nature that speaks to the soul. ${photo.caption}`,
          authorId: actualUserId,
          type: 'nature_photo',
          category: 'Nature Logs',
          tags: ['Nature Logs', ...(photo.tags || [])],
          isAIQuestion: false,
          aiInsights: computedInsights ? [computedInsights] : [],
          views: 0,
          imagePath: photo.imagePath,
          source: 'nature_photo',
          sourceId: String(photo.id),
          // Remove aiComment to avoid duplication - only use aiInsights
        },
      });

      // Generate AI philosopher comment directly instead of making HTTP request
      try {
        console.log('Generating AI philosopher comment for post:', createdPost.id);
        
        // Import and call the AI comment generation logic directly
        const { generateAIComment } = await import('../community/ai-philosopher-comment/generate');
        
        const aiCommentData = await generateAIComment({
          imageUrl: photo.imagePath,
          caption: photo.caption,
          tags: photo.tags,
          location: photo.location,
          weather: photo.weather,
          mood: photo.mood,
          postId: createdPost.id,
        });
        
        console.log('AI philosopher comment created successfully:', aiCommentData);
      } catch (aiError) {
        console.error('Error generating AI philosopher comment:', aiError);
      }

      thread = createdPost;
    }

    return NextResponse.json({
      success: true,
      photo,
      imageUrl,
      journalEntry: journalResult.entry, // Assuming journalResult.entry is the new entry
      thread,
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
    if (!prisma) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }
    const db = prisma as any;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || '1';

    const photos = await db.naturePhoto.findMany({
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