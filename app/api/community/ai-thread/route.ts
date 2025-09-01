import { NextRequest, NextResponse } from 'next/server';
import { PHILOSOPHERS } from '@/lib/philosophers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 AI Thread API called');
    
    // Test Prisma connection and models
    try {
      console.log('🔍 Testing Prisma connection...');
      const userCount = await prisma.user.count();
      console.log('✅ User count:', userCount);
      
      // Test if communityPost model exists
      console.log('🔍 Testing communityPost model...');
      const postCount = await prisma.communityPost.count();
      console.log('✅ Community post count:', postCount);
    } catch (prismaError) {
      console.error('❌ Prisma test failed:', prismaError);
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: prismaError instanceof Error ? prismaError.message : 'Unknown Prisma error',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    const body = await request.json();
    console.log('🔍 Request body:', body);
    
    const { 
      title, 
      content, 
      category, 
      tags, 
      imagePath, 
      aiComment, 
      source, 
      sourceId 
    } = body;

    // Check if this is a nature photo thread request
    if (source === 'nature_photo') {
      console.log('🔍 Creating nature photo thread...');
      return await createNaturePhotoThread(body);
    }

    console.log('🔍 Creating AI philosophical thread...');

    // Enforce server-side authorization via shared secret (e.g., cron job)
    // Temporarily allow direct access for testing - remove in production
    const secret = request.headers.get('x-cron-secret') || request.nextUrl.searchParams.get('secret');
    if (process.env.NODE_ENV === 'production' && (!secret || secret !== process.env.CRON_SECRET)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Enforce one AI thread per day
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    console.log('🔍 Checking for existing AI threads today...');
    const existingToday = await prisma.communityPost.findFirst({
      where: {
        isAIQuestion: true,
        createdAt: { gte: startOfDay, lte: endOfDay },
      },
    });

    if (existingToday) {
      console.log('✅ AI thread for today already exists');
      return NextResponse.json({ success: true, message: 'AI thread for today already exists' });
    }

    // Select a random philosopher for today's thread
    const randomPhilosopher = PHILOSOPHERS[Math.floor(Math.random() * PHILOSOPHERS.length)];
    console.log('🔍 Selected philosopher:', randomPhilosopher.name);
    
    // Get today's date for context
    const today = new Date();
    const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
    const month = today.toLocaleDateString('en-US', { month: 'long' });
    const day = today.getDate();

    // Create the AI thread generation prompt
    const prompt = `You are ${randomPhilosopher.name}, ${randomPhilosopher.title}. 

Today is ${dayOfWeek}, ${month} ${day}. You are creating a daily philosophical discussion thread for a community of wisdom seekers.

Please create a thought-provoking thread that:
1. Relates to current events, seasons, or universal human experiences
2. Draws from your philosophical teachings and perspective
3. Encourages community discussion and reflection
4. Is relevant to modern life while honoring ancient wisdom
5. Has a compelling title and engaging opening content
6. Includes 2-3 discussion questions to spark conversation
7. Relates to one of these categories: Stoicism, Aristotelian Ethics, Courage, Wisdom, Justice, or Temperance

Format your response as:
Title: [Your thread title]
Content: [Your opening post content - 3-4 sentences]
Category: [Choose one of the categories above]
Tags: [3-5 relevant tags separated by commas]

Respond as ${randomPhilosopher.name} would, using your unique voice and wisdom.`;

    console.log('🔍 Calling OpenAI API...');
    // Call the AI API to generate the thread
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: randomPhilosopher.systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 400,
        temperature: 0.8,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('❌ OpenAI API error:', errorText);
      throw new Error(`OpenAI API failed: ${aiResponse.status} ${errorText}`);
    }

    const aiData = await aiResponse.json();
    console.log('✅ OpenAI API response received');
    const aiThreadContent = aiData.choices[0].message.content.trim();

    // Parse the AI response to extract title, content, category, and tags
    const titleMatch = aiThreadContent.match(/Title:\s*(.+)/);
    const contentMatch = aiThreadContent.match(/Content:\s*(.+)/);
    const categoryMatch = aiThreadContent.match(/Category:\s*(.+)/);
    const tagsMatch = aiThreadContent.match(/Tags:\s*(.+)/);

    const generatedTitle = titleMatch ? titleMatch[1].trim() : `Daily Wisdom from ${randomPhilosopher.name}`;
    const generatedContent = contentMatch ? contentMatch[1].trim() : aiThreadContent;
    const generatedCategory = categoryMatch ? categoryMatch[1].trim() : 'Wisdom';
    const generatedTags = tagsMatch ? tagsMatch[1].split(',').map((tag: string) => tag.trim()) : ['daily-wisdom', 'philosophy'];

    console.log('🔍 Generated content:', { title: generatedTitle, category: generatedCategory, tags: generatedTags });

    // Extract AI insights from the content
    const aiInsights = extractAIInsights(generatedContent);

    // Check if default user exists, create if not
    console.log('🔍 Checking for default AI user...');
    let defaultUser = await prisma.user.findUnique({ where: { id: 1 } });
    if (!defaultUser) {
      console.log('🔍 Creating default AI user...');
      defaultUser = await prisma.user.create({
        data: {
          id: 1,
          username: 'ai_philosopher',
          displayName: 'AI Philosopher',
          email: 'ai@aristotle.com',
          password: 'system_user_no_password',
        }
      });
      console.log('✅ Default AI user created:', defaultUser.id);
    } else {
      console.log('✅ Default AI user found:', defaultUser.id);
    }

    // Save the AI thread to the database
    console.log('🔍 Saving AI thread to database...');
    const savedThread = await prisma.communityPost.create({
      data: {
        title: generatedTitle,
        content: generatedContent,
        authorId: defaultUser.id,
        type: 'ai_question',
        category: generatedCategory,
        tags: generatedTags,
        isAIQuestion: true,
        aiInsights,
        views: 0,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
        _count: {
          select: {
            replies: true,
            likes: true,
          },
        },
      },
    });

    console.log('✅ AI thread saved successfully:', savedThread.id);

    return NextResponse.json({
      success: true,
      thread: {
        id: savedThread.id,
        title: savedThread.title,
        content: savedThread.content,
        category: savedThread.category,
        tags: savedThread.tags,
        author: {
          name: randomPhilosopher.name,
          avatar: randomPhilosopher.avatar || '/avatars/ai.jpg',
          isAI: true,
          persona: randomPhilosopher.title,
        },
        createdAt: savedThread.createdAt.toISOString(),
        replies: savedThread._count.replies,
        views: savedThread.views,
        likes: savedThread._count.likes,
      },
      philosopher: {
        id: randomPhilosopher.id,
        name: randomPhilosopher.name,
        title: randomPhilosopher.title,
        avatar: randomPhilosopher.avatar || '/avatars/ai.jpg',
      }
    });

  } catch (error) {
    console.error('❌ Error generating AI thread:', error);
    
    // Return more detailed error information for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace available';
    
    console.error('Error details:', { message: errorMessage, stack: errorStack });
    
    return NextResponse.json({ 
      error: 'Failed to generate AI thread',
      details: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Function to create nature photo community threads
async function createNaturePhotoThread(data: any) {
  try {
    console.log('Creating nature photo thread with data:', data);
    const { title, content, category, tags, imagePath, aiComment, sourceId } = data;
    
    // Create a system user for AI posts (or use a default user ID)
    const defaultUserId = 1; // Ensure this exists in DB

    console.log('About to create community post with data:', {
      title: title || 'Nature Log: A Moment of Reflection',
      content: content || 'A moment captured in nature that speaks to the soul.',
      authorId: defaultUserId,
      type: 'nature_photo',
      category: category || 'Nature Logs',
      tags: tags || ['Nature Logs', 'reflection', 'nature'],
      isAIQuestion: false,
      aiInsights: aiComment ? [aiComment] : [],
      views: 0,
      imagePath,
      source: 'nature_photo',
      sourceId: sourceId?.toString(),
      aiComment,
    });

    // Save the nature photo thread to the database
    const savedThread = await prisma.communityPost.create({
      data: {
        title: title || 'Nature Log: A Moment of Reflection',
        content: content || 'A moment captured in nature that speaks to the soul.',
        authorId: defaultUserId,
        type: 'nature_photo',
        category: category || 'Nature Logs',
        tags: tags || ['Nature Logs', 'reflection', 'nature'],
        isAIQuestion: false,
        aiInsights: aiComment ? [aiComment] : [],
        views: 0,
        imagePath,
        source: 'nature_photo',
        sourceId: sourceId?.toString(),
        aiComment,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
        _count: {
          select: {
            replies: true,
            likes: true,
          },
        },
      },
    });

    console.log('Nature photo thread created successfully:', savedThread);

    return NextResponse.json({
      success: true,
      thread: {
        id: savedThread.id,
        title: savedThread.title,
        content: savedThread.content,
        category: savedThread.category,
        tags: savedThread.tags,
        author: {
          name: 'Nature Enthusiast',
          avatar: '/avatars/nature.jpg',
          isAI: false,
        },
        createdAt: savedThread.createdAt.toISOString(),
        replies: savedThread._count.replies,
        views: savedThread.views,
        likes: savedThread._count.likes,
        imagePath,
        aiComment,
      },
      message: 'Nature photo thread created successfully'
    });

  } catch (error) {
    console.error('Error creating nature photo thread:', error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    return NextResponse.json({ 
      error: 'Failed to create nature photo thread',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Helper function to extract AI insights from content
function extractAIInsights(content: string): string[] {
  const insights: string[] = [];
  
  const philosophicalTerms = [
    'virtue', 'wisdom', 'courage', 'justice', 'temperance', 'eudaimonia', 'stoicism',
    'mindfulness', 'resilience', 'growth', 'reflection', 'practice', 'discipline',
    'balance', 'harmony', 'truth', 'knowledge', 'understanding', 'perspective'
  ];
  
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
  
  sentences.forEach(sentence => {
    const lowerSentence = sentence.toLowerCase();
    const hasPhilosophicalTerm = philosophicalTerms.some(term => 
      lowerSentence.includes(term)
    );
    
    if (hasPhilosophicalTerm && sentence.trim().length > 20) {
      insights.push(sentence.trim());
    }
  });
  
  if (insights.length === 0) {
    insights.push('This discussion touches on important philosophical themes');
    insights.push('Consider how this relates to your personal growth journey');
  }
  
  return insights.slice(0, 3);
} 