import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createNaturePhotoLog, logToJournal } from '@/lib/journal-logger';
import { getStorageService, generateUniqueFilename, getFileExtensionFromBase64 } from '@/lib/storage-service';
// import OpenAI from 'openai'; // Commented out for now

export async function POST(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }
    const db = prisma as any;
    const body = await request.json();
    const { userId, imageData, caption, tags, location, weather, mood, aiInsights, aiComment, shareToCommunity, philosopher } = body;

    if (!imageData || typeof imageData !== 'string') {
      return NextResponse.json({ error: 'imageData (base64) is required' }, { status: 400 });
    }

    // Ensure a default user exists for logging if not provided
    const actualUserId = userId || 1;
    if (!userId) {
      let defaultUser = await db.user.findUnique({ where: { id: 1 } });
      if (!defaultUser) {
        defaultUser = await db.user.create({
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

    // AI insights generation temporarily disabled
    // let computedInsights: string | null = null;
    // try {
    //   const apiKey = process.env.OPENAI_API_KEY;
    //   if (apiKey) {
    //     const openai = new OpenAI({ apiKey });
    //     const supplemental = [
    //       caption ? `Caption: ${caption}` : null,
    //       (Array.isArray(tags) && tags.length > 0) ? `Tags: ${tags.join(', ')}` : null,
    //       location ? `Location: ${location}` : null,
    //       weather ? `Weather: ${weather}` : null,
    //       mood ? `Mood: ${mood}` : null,
    //     ].filter(Boolean).join('\n');

    //     const userPrompt = `Look at this nature photo and describe succinctly (2-3 sentences) what you see (e.g., sky, water, trees, light) and the feeling it evokes. If helpful, consider the supplemental details.\n\n${supplemental}`.trim();

    //     const completion = await openai.chat.completions.create({
    //       model: 'gpt-4o',
    //       messages: [
    //         {
    //           role: 'user',
    //           content: [
    //             { type: 'text', text: userPrompt },
    //             { type: 'image_url', image_url: { url: imagePath } },
    //           ] as any,
    //         },
    //       ],
    //       temperature: 0.7,
    //       max_tokens: 180,
    //     });
    //     computedInsights = completion.choices?.[0]?.message?.content || null;
    //   }
    // } catch (visionError) {
    //   console.error('Vision insights generation failed:', visionError);
    //   // fall through with null to use fallback below
    // }

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
        aiInsights: null, // Temporarily disabled
        aiComment: null    // Temporarily disabled
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
    const journalEntry = await db.journalEntry.create({
      data: {
        userId: actualUserId,
        type: journalData.type,
        content: journalData.content,
        category: journalData.category,
        date: new Date(),
        // Only fields present in schema are used; remove metadata/moduleId/widgetId
      },
    });

    // Community sharing temporarily disabled
    // let thread = null;
    // if (shareToCommunity) {
    //   const createdPost = await db.communityPost.create({
    //     data: {
    //       title: `Nature Log: ${photo.caption}`,
    //       content: `A moment captured in nature that speaks to the soul. ${photo.caption}`,
    //       authorId: actualUserId,
    //       type: 'nature_photo',
    //       category: 'Nature Logs',
    //       tags: ['Nature Logs', ...(photo.tags || [])],
    //       isAIQuestion: false,
    //       aiInsights: computedInsights ? [computedInsights] : [],
    //       views: 0,
    //       imagePath: photo.imagePath,
    //       source: 'nature_photo',
    //       sourceId: String(photo.id),
    //       aiComment: computedInsights || null,
    //     },
    //   });

    //   // Post an AI reply if we have an insight
    //   if (computedInsights) {
    //     try {
    //       // Ensure AI user exists
    //       let aiUser = await db.user.findUnique({ where: { id: 1 } });
    //       if (!aiUser) {
    //       aiUser = await db.user.create({
    //         data: {
    //           id: 1,
    //           username: 'ai_philosopher',
    //           displayName: 'AI Philosopher',
    //           email: 'ai@aristotle.com',
    //           password: 'system_user_no_password',
    //         }
    //       });
    //       await db.communityReply.create({
    //         data: {
    //           content: computedInsights,
    //           authorId: aiUser.id,
    //           postId: createdPost.id,
    //           philosopher: philosopher || 'AI Philosopher',
    //           isAI: true,
    //         },
    //       });
    //     } catch (e) {
    //       console.warn('Failed to create AI reply for nature post:', e);
    //     }
    //   }

    //   thread = createdPost;
    // }

    return NextResponse.json({
      success: true,
      photo,
      imageUrl,
      journalEntry: journalEntry,
      // thread, // Temporarily disabled
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