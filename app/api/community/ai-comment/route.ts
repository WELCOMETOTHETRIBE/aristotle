import { NextRequest, NextResponse } from 'next/server';
import { PHILOSOPHERS } from '@/lib/philosophers';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const body = await request.json();
    const { threadId, threadTitle, threadContent, threadCategory, userComment } = body;

    if (!threadId || !threadTitle || !threadContent || !threadCategory || !userComment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Select a random philosopher persona
    const randomPhilosopher = PHILOSOPHERS[Math.floor(Math.random() * PHILOSOPHERS.length)];

    // Compose prompt
    const prompt = `You are ${randomPhilosopher.name}, ${randomPhilosopher.title}.
A community member responded: "${userComment}".
Thread context: ${threadTitle} — ${threadContent} (Category: ${threadCategory}).
Offer a short, thoughtful reply (2-5 sentences) that encourages further reflection.
Respond as ${randomPhilosopher.name} would, using your unique perspective and wisdom.`;

    // Call the AI API to generate the comment
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
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      throw new Error('Failed to generate AI comment');
    }

    const aiData = await aiResponse.json();
    const aiComment = aiData.choices[0].message.content.trim();

    // Check if the thread exists
    const thread = await prisma.communityPost.findUnique({
      where: { id: threadId },
    });

    if (!thread) {
      return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
    }

    // Ensure a default user ID for AI comments exists
    let defaultUser = await prisma.user.findUnique({ where: { id: 1 } });
    if (!defaultUser) {
      defaultUser = await prisma.user.create({
        data: {
          id: 1,
          username: 'ai_philosopher',
          displayName: 'AI Philosopher',
          email: 'ai@aristotle.com',
          password: 'system_user_no_password',
        }
      });
    }

    // Save the AI comment directly to the database
    const savedComment = await prisma.communityReply.create({
      data: {
        content: aiComment,
        authorId: defaultUser.id,
        postId: threadId,
        parentId: null, // Top-level comment
        likes: 0,
        philosopher: randomPhilosopher.name,
        isAI: true,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
      },
    });

    console.log('AI comment saved to database successfully:', {
      id: savedComment.id,
      threadId,
      philosopher: randomPhilosopher.name,
    });

    return NextResponse.json({
      success: true,
      comment: savedComment,
      philosopher: {
        id: randomPhilosopher.id,
        name: randomPhilosopher.name,
        title: randomPhilosopher.title,
        avatar: randomPhilosopher.avatar || '/avatars/ai.jpg',
      }
    });
  } catch (error) {
    console.error('AI comment error:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI comment' },
      { status: 500 }
    );
  }
} 