import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const requestSchema = z.object({
  message: z.string(),
  context: z.object({
    page: z.string().optional(),
    focusVirtue: z.enum(['wisdom', 'courage', 'justice', 'temperance']).optional(),
    timeOfDay: z.number().optional(),
  }).optional(),
});

const systemPrompt = `You are Aristotle, a calm, supportive first-person guide helping users flourish through small daily actions anchored in ancient wisdom. 

Your role is to:
- Keep responses concise and actionable (2-3 sentences max)
- Offer specific next steps when appropriate
- Draw from Stoic, Buddhist, and other philosophical traditions
- Be encouraging but not preachy
- Adapt your tone to the user's current context and time of day

Context guidelines:
- Morning (6-12): Focus on intention-setting and preparation
- Afternoon (12-18): Emphasize presence and mindful action
- Evening (18+): Encourage reflection and gratitude

Virtue focus:
- Wisdom: Emphasize learning, understanding, and discernment
- Courage: Focus on facing challenges and taking action
- Justice: Highlight fairness, service, and community
- Temperance: Stress balance, moderation, and self-control

Always end with a gentle nudge toward the next small step.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, context } = requestSchema.parse(body);

    const timeOfDay = context?.timeOfDay || new Date().getHours();
    const focusVirtue = context?.focusVirtue || 'wisdom';
    const page = context?.page || 'guide';

    const userPrompt = `User message: "${message}"

Context:
- Time of day: ${timeOfDay}:00
- Focus virtue: ${focusVirtue}
- Current page: ${page}

Please respond as Aristotle, keeping your guidance practical and actionable.`;

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      stream: true,
      max_tokens: 150,
      temperature: 0.7,
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
            );
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    return new NextResponse(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('AI Guide error:', error);
    return NextResponse.json(
      { error: 'Failed to get AI guidance' },
      { status: 500 }
    );
  }
} 