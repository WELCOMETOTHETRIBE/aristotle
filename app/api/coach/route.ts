import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';
import { CoachRequestSchema } from '@/lib/validators';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

// Fallback responses when OpenAI is not available
const fallbackResponses = [
  {
    reply: "I understand you're reaching out. While I'm having some technical difficulties right now, I want you to know that I'm here to support you. Could you tell me more about what's on your mind?",
    plan: {
      actions: [
        {
          title: "Take a moment to breathe",
          description: "Practice deep breathing for 2-3 minutes to center yourself",
          tag: "wellness",
          priority: "M"
        }
      ],
      habitNudges: [
        {
          habitName: "Mindfulness",
          suggestion: "Try a quick 2-minute meditation or breathing exercise"
        }
      ],
      reflectionPrompt: "What would be most helpful for you right now?"
    }
  },
  {
    reply: "Thank you for sharing that with me. I'm experiencing some connectivity issues, but I want to acknowledge what you've said. How are you feeling about this situation?",
    plan: {
      actions: [
        {
          title: "Self-reflection",
          description: "Take 5 minutes to journal about your current thoughts and feelings",
          tag: "reflection",
          priority: "M"
        }
      ],
      habitNudges: [
        {
          habitName: "Journaling",
          suggestion: "Write down three things you're grateful for today"
        }
      ],
      reflectionPrompt: "What would be the most supportive next step for you?"
    }
  },
  {
    reply: "I hear you, and I appreciate you taking the time to connect. I'm currently having some technical difficulties, but I'm still here to listen. What's the most important thing you'd like to focus on?",
    plan: {
      actions: [
        {
          title: "Gentle movement",
          description: "Take a short walk or do some gentle stretching",
          tag: "wellness",
          priority: "L"
        }
      ],
      habitNudges: [
        {
          habitName: "Movement",
          suggestion: "Try 5 minutes of gentle stretching or walking"
        }
      ],
      reflectionPrompt: "What would bring you the most peace right now?"
    }
  }
];

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request
    const body = await request.json();
    const { text } = CoachRequestSchema.parse(body);

    // Try to use OpenAI if available
    if (!openai) {
      throw new Error('OpenAI not configured');
    }
    
    try {
      const messages = [
        { 
          role: 'system' as const, 
          content: `You are Aristotle, a wise and compassionate life coach. Respond naturally and helpfully to the user's message. Keep responses warm, supportive, and actionable. Focus on practical wisdom and gentle guidance.` 
        },
        { 
          role: 'user' as const, 
          content: text 
        }
      ];

      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages,
        temperature: 0.7,
        max_tokens: 500,
      });

      const response = completion.choices[0]?.message?.content;
      if (response) {
        // Create a simple plan structure
        const plan = {
          actions: [
            {
              title: "Reflect on this guidance",
              description: "Take a moment to consider how this applies to your situation",
              tag: "reflection",
              priority: "M"
            }
          ],
          habitNudges: [
            {
              habitName: "Mindfulness",
              suggestion: "Practice being present with your thoughts and feelings"
            }
          ],
          reflectionPrompt: "How does this guidance resonate with you?"
        };

        return NextResponse.json({
          reply: response,
          plan: plan,
          sessionId: Date.now().toString(),
        });
      }
    } catch (openaiError) {
      console.warn('OpenAI not available, using fallback response:', openaiError);
    }

    // Use fallback response if OpenAI fails
    const fallbackIndex = Math.floor(Math.random() * fallbackResponses.length);
    const fallback = fallbackResponses[fallbackIndex];

    return NextResponse.json({
      reply: fallback.reply,
      plan: fallback.plan,
      sessionId: Date.now().toString(),
    });

  } catch (error) {
    console.error('Coach API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request format', details: error.errors },
        { status: 400 }
      );
    }

    // Return a basic fallback response
    return NextResponse.json({
      reply: "I'm here to support you. While I'm experiencing some technical difficulties, I want you to know that your well-being matters. What's on your mind?",
      plan: {
        actions: [
          {
            title: "Take care of yourself",
            description: "Remember to be kind to yourself today",
            tag: "wellness",
            priority: "H"
          }
        ],
        habitNudges: [
          {
            habitName: "Self-compassion",
            suggestion: "Practice speaking to yourself as you would to a dear friend"
          }
        ],
        reflectionPrompt: "What do you need most right now?"
      },
      sessionId: Date.now().toString(),
    });
  }
} 