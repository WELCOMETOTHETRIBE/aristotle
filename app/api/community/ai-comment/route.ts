import { NextRequest, NextResponse } from 'next/server';
import { PHILOSOPHERS } from '@/lib/philosophers';

export async function POST(request: NextRequest) {
  try {
    const { threadId, threadTitle, threadContent, threadCategory } = await request.json();

    if (!threadId || !threadTitle || !threadContent) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Select a random philosopher
    const randomPhilosopher = PHILOSOPHERS[Math.floor(Math.random() * PHILOSOPHERS.length)];

    // Create the AI comment prompt
    const prompt = `You are ${randomPhilosopher.name}, ${randomPhilosopher.title}. 

You are commenting on a community thread in an ancient wisdom wellness app. Read the thread below and provide a thoughtful, philosophical response from your unique perspective.

Thread Title: "${threadTitle}"
Thread Content: "${threadContent}"
Thread Category: ${threadCategory}

Please provide a comment that:
1. Shows you've read and understood the thread
2. Offers insights from your philosophical perspective
3. Is encouraging and constructive
4. Relates to the category/topic
5. Is 2-4 sentences long
6. Maintains your philosophical voice and style

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

    // For now, we'll just return the AI comment without posting it to the database
    // since the replies API requires authentication. In a production system,
    // you might want to create a special AI user account or modify the replies API
    // to handle AI comments differently.
    
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