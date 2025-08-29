import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API key not configured");
  }
  return new OpenAI({ apiKey });
}

export async function POST(request: NextRequest) {
  try {
    const { frameworkId, leaderName, leaderPrompt, message, conversationHistory } = await request.json();

    if (!message || !leaderPrompt) {
      return NextResponse.json(
        { error: 'Message and leader prompt are required' },
        { status: 400 }
      );
    }

    // Build conversation context
    const messages = [
      {
        role: 'system' as const,
        content: `${leaderPrompt}

You are speaking as ${leaderName}. Respond in character, drawing from the wisdom and teachings of this tradition. Keep responses concise but meaningful, typically 2-4 sentences. Be authentic to the voice and style of this historical figure while providing practical, actionable guidance.

Remember: You are not just explaining the tradition - you are embodying it and teaching through your responses.`
      },
      ...conversationHistory.slice(-6).map((msg: any) => ({
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
      temperature: 0.7,
      max_tokens: 300,
    });

    const response = completion.choices[0]?.message?.content || 'I am unable to respond at this time.';

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Framework chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
} 