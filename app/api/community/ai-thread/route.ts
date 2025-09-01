import { NextRequest, NextResponse } from 'next/server';
import { PHILOSOPHERS } from '@/lib/philosophers';

export async function POST(request: NextRequest) {
  try {
    // Select a random philosopher for today's thread
    const randomPhilosopher = PHILOSOPHERS[Math.floor(Math.random() * PHILOSOPHERS.length)];
    
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
      throw new Error('Failed to generate AI thread');
    }

    const aiData = await aiResponse.json();
    const aiThreadContent = aiData.choices[0].message.content.trim();

    // Parse the AI response to extract title, content, category, and tags
    const titleMatch = aiThreadContent.match(/Title:\s*(.+)/);
    const contentMatch = aiThreadContent.match(/Content:\s*(.+)/);
    const categoryMatch = aiThreadContent.match(/Category:\s*(.+)/);
    const tagsMatch = aiThreadContent.match(/Tags:\s*(.+)/);

    const title = titleMatch ? titleMatch[1].trim() : `Daily Wisdom from ${randomPhilosopher.name}`;
    const content = contentMatch ? contentMatch[1].trim() : aiThreadContent;
    const category = categoryMatch ? categoryMatch[1].trim() : 'Wisdom';
    const tags = tagsMatch ? tagsMatch[1].split(',').map((tag: string) => tag.trim()) : ['daily-wisdom', 'philosophy'];

    // Note: We're not posting to the database here to avoid authentication issues
    // The frontend will handle adding the AI thread to the state
    console.log('AI thread generated successfully:', { title, content, category, tags });

    return NextResponse.json({
      success: true,
      thread: {
        id: `ai-thread-${Date.now()}`,
        title,
        content,
        category,
        tags,
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
    console.error('Error generating AI thread:', error);
    return NextResponse.json({ error: 'Failed to generate AI thread' }, { status: 500 });
  }
} 