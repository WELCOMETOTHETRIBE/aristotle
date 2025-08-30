import { NextRequest, NextResponse } from 'next/server';
import { generateWithCache, DailyWisdomSchema } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const { framework, date } = await request.json();
    
    const prompt = `Generate a daily wisdom quote for ${framework || 'ancient wisdom'} tradition. 
    
    Requirements:
    - Create a profound, inspiring quote that embodies the essence of ${framework || 'ancient wisdom'}
    - The quote should be 1-2 sentences, concise but meaningful
    - Include the name of a relevant historical figure or tradition
    - Make it relevant for daily reflection and practice
    - Focus on practical wisdom that can be applied to modern life
    
    Format the response as JSON with:
    - quote: the wisdom quote
    - author: the source (historical figure or tradition name)
    - framework: the philosophical tradition
    - reflection: a brief reflection question to ponder`;

    const wisdom = await generateWithCache(
      'daily_wisdom',
      { 
        framework: framework || 'general',
        date: date || new Date().toISOString().split('T')[0],
        type: 'daily_wisdom'
      },
      DailyWisdomSchema,
      prompt
    );

    return NextResponse.json(wisdom);

  } catch (error) {
    console.error('Error generating daily wisdom:', error);
    
    // Fallback wisdom
    const fallbackWisdom = [
      {
        quote: "The unexamined life is not worth living.",
        author: "Socrates",
        framework: "Stoic",
        reflection: "What aspect of your life needs deeper examination today?"
      },
      {
        quote: "Strength is forged through chosen hardship.",
        author: "Spartan Agōgē",
        framework: "Spartan",
        reflection: "What challenge can you embrace to grow stronger?"
      },
      {
        quote: "Honor is clarity in action.",
        author: "Bushidō",
        framework: "Samurai",
        reflection: "How can you act with greater clarity and purpose today?"
      }
    ];
    
    const randomFallback = fallbackWisdom[Math.floor(Math.random() * fallbackWisdom.length)];
    return NextResponse.json(randomFallback);
  }
} 