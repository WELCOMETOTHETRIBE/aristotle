import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getPhilosopher } from '@/lib/philosophers';

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key not found');
  }
  return new OpenAI({ apiKey });
}

export async function POST(request: NextRequest) {
  try {
    const { philosopherId, message, conversationHistory } = await request.json();

    if (!message || !philosopherId) {
      return NextResponse.json(
        { error: 'Message and philosopher ID are required' },
        { status: 400 }
      );
    }

    const philosopher = getPhilosopher(philosopherId);
    if (!philosopher) {
      return NextResponse.json(
        { error: 'Philosopher not found' },
        { status: 404 }
      );
    }

    // Build conversation context
    const messages = [
      {
        role: 'system' as const,
        content: philosopher.systemPrompt
      },
      ...conversationHistory.slice(-8).map((msg: any) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      {
        role: 'user' as const,
        content: message
      }
    ];

    const client = getOpenAIClient();
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.8,
      max_tokens: 400,
    });

    const response = completion.choices[0]?.message?.content || 'I am unable to respond at this time.';

    return NextResponse.json({ 
      response,
      philosopher: {
        name: philosopher.name,
        title: philosopher.title,
        avatar: philosopher.avatar
      }
    });
  } catch (error) {
    console.error('Philosopher chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
} 