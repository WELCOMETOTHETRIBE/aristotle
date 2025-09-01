import { NextRequest, NextResponse } from 'next/server';
import { PHILOSOPHERS } from '@/lib/philosophers';

export async function POST(request: NextRequest) {
  try {
    const { threadId, threadTitle, threadContent, threadCategory, userComment } = await request.json();

    if (!threadId || !threadTitle || !threadContent) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Select a random philosopher
    const randomPhilosopher = PHILOSOPHERS[Math.floor(Math.random() * PHILOSOPHERS.length)];

    // Create the AI comment prompt
    let prompt = `You are ${randomPhilosopher.name}, ${randomPhilosopher.title}. 

You are commenting on a community thread in an ancient wisdom wellness app. Read the thread below and provide a thoughtful, philosophical response from your unique perspective.`;

    if (userComment) {
      // If this is a response to a user comment, include it in the context
      prompt += `

A user has just commented: "${userComment}"

Please respond to their comment specifically, while also considering the original thread context.`;
    }

    prompt += `

Thread Title: "${threadTitle}"
Thread Content: "${threadContent}"
Thread Category: ${threadCategory}

Please provide a comment that:
1. Shows you've read and understood the thread${userComment ? ' and the user\'s comment' : ''}
2. Offers insights from your philosophical perspective
3. Is encouraging and constructive
4. Relates to the category/topic
5. Is 2-4 sentences long
6. Maintains your philosophical voice and style
${userComment ? '7. Directly addresses the user\'s comment or question' : ''}

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

    // Post the AI comment to the database
    const commentResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/community/${threadId}/replies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.AI_SYSTEM_TOKEN || 'ai-system-token'}`,
      },
      body: JSON.stringify({
        content: aiComment,
        author: {
          name: randomPhilosopher.name,
          avatar: randomPhilosopher.avatar,
          isAI: true,
          persona: randomPhilosopher.title,
        },
      }),
    });

    if (!commentResponse.ok) {
      console.warn('Failed to post AI comment to database, but continuing with response');
    }

    return NextResponse.json({
      success: true,
      comment: {
        id: `ai-${Date.now()}`,
        content: aiComment,
        author: {
          name: randomPhilosopher.name,
          avatar: randomPhilosopher.avatar,
          isAI: true,
          persona: randomPhilosopher.title,
        },
        createdAt: new Date().toISOString(),
      },
      philosopher: {
        id: randomPhilosopher.id,
        name: randomPhilosopher.name,
        title: randomPhilosopher.title,
        avatar: randomPhilosopher.avatar,
      }
    });

  } catch (error) {
    console.error('Error generating AI comment:', error);
    return NextResponse.json({ error: 'Failed to generate AI comment' }, { status: 500 });
  }
} 