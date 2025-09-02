import { NextRequest, NextResponse } from 'next/server';
import { generateWithCache, DailyWisdomSchema } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const { framework, date } = await request.json();
    
    // Add variety to the prompt to ensure different quotes
    const randomElements = [
      "morning reflection", "evening contemplation", "midday pause", "dawn wisdom", "dusk insight",
      "workplace application", "personal growth", "relationship wisdom", "health and wellness", "spiritual practice",
      "emotional balance", "mental clarity", "physical discipline", "social harmony", "inner peace"
    ];
    
    const randomElement = randomElements[Math.floor(Math.random() * randomElements.length)];
    const currentHour = new Date().getHours();
    const timeOfDay = currentHour < 12 ? "morning" : currentHour < 17 ? "afternoon" : "evening";
    
    const prompt = `Generate a unique daily wisdom quote for ${framework || 'ancient wisdom'} tradition, focusing on ${randomElement} and suitable for ${timeOfDay} reflection.
    
    Requirements:
    - Create a profound, inspiring quote that embodies the essence of ${framework || 'ancient wisdom'}
    - The quote should be 1-2 sentences, concise but meaningful
    - Include the name of a relevant historical figure or tradition
    - Make it relevant for daily reflection and practice
    - Focus on practical wisdom that can be applied to modern life
    - Ensure this quote is different from common, overused philosophical sayings
    - Draw from lesser-known wisdom or provide a fresh perspective on familiar concepts
    
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
        type: 'daily_wisdom',
        randomElement,
        timeOfDay
      },
      DailyWisdomSchema,
      prompt
    );

    return NextResponse.json(wisdom);

  } catch (error) {
    console.error('Error generating daily wisdom:', error);
    
    // Enhanced fallback wisdom with more variety
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
      },
      {
        quote: "Wisdom grows in the soil of silence.",
        author: "Monastic Tradition",
        framework: "Monastic",
        reflection: "Where can you find moments of silence today?"
      },
      {
        quote: "Balance is not a destination, but a continuous dance.",
        author: "Yogic Philosophy",
        framework: "Yogic",
        reflection: "How can you find balance in today's challenges?"
      }
    ];
    
    const randomFallback = fallbackWisdom[Math.floor(Math.random() * fallbackWisdom.length)];
    return NextResponse.json(randomFallback);
  }
} 