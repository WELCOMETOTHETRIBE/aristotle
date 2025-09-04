import { NextRequest, NextResponse } from 'next/server';
import { generateWithCache, DailyWisdomSchema } from '@/lib/ai';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/db';

// Helper function to get user ID from request
async function getUserIdFromRequest(request: NextRequest): Promise<number | null> {
  let userId: number | null = null;
  
  // Try Bearer token first
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    const payload = await verifyToken(token);
    if (payload) {
      userId = payload.userId;
    }
  }
  
  // If no Bearer token, try cookie-based auth
  if (!userId) {
    try {
      const cookieHeader = request.headers.get('cookie');
      if (cookieHeader) {
        const response = await fetch(`${request.nextUrl.origin}/api/auth/me`, {
          headers: { cookie: cookieHeader }
        });
        
        if (response.ok) {
          const authData = await response.json();
          if (authData.user && authData.user.id) {
            userId = authData.user.id;
          }
        }
      }
    } catch (error) {
      console.error('Cookie auth check failed:', error);
    }
  }
  
  return userId;
}

export async function POST(request: NextRequest) {
  try {
    const { framework, date } = await request.json();
    
    // Get user ID to check their framework preferences
    const userId = await getUserIdFromRequest(request);
    let availableFrameworks = ['Stoic', 'Spartan', 'Samurai', 'Monastic', 'Yogic', 'Buddhist', 'Confucian', 'Taoist'];
    
    if (userId) {
      try {
        // Get user's framework preference
        const userPrefs = await prisma.userPreference.findUnique({
          where: { userId: userId },
        });
        
        if (userPrefs?.framework) {
          // If user has a specific framework, use that
          availableFrameworks = [userPrefs.framework];
        }
        // If no framework preference, use all available frameworks
      } catch (error) {
        console.error('Error fetching user preferences:', error);
        // Fall back to default frameworks
      }
    }
    
    // Use the requested framework if it's in the user's available frameworks
    const selectedFramework = framework && availableFrameworks.includes(framework) 
      ? framework 
      : availableFrameworks[Math.floor(Math.random() * availableFrameworks.length)];
    
    // Add variety to the prompt to ensure different quotes
    const randomElements = [
      "morning reflection", "evening contemplation", "midday pause", "dawn wisdom", "dusk insight",
      "workplace application", "personal growth", "relationship wisdom", "health and wellness", "spiritual practice",
      "emotional balance", "mental clarity", "physical discipline", "social harmony", "inner peace"
    ];
    
    const randomElement = randomElements[Math.floor(Math.random() * randomElements.length)];
    const currentHour = new Date().getHours();
    const timeOfDay = currentHour < 12 ? "morning" : currentHour < 17 ? "afternoon" : "evening";
    
    const prompt = `Generate a unique daily wisdom quote for ${selectedFramework || 'ancient wisdom'} framework, focusing on ${randomElement} and suitable for ${timeOfDay} reflection.
    
    Requirements:
    - Create a profound, inspiring quote that embodies the essence of ${selectedFramework || 'ancient wisdom'}
    - The quote should be 1-2 sentences, concise but meaningful
    - Include the name of a relevant historical figure or tradition
    - Make it relevant for daily reflection and practice
    - Focus on practical wisdom that can be applied to modern life
    - Ensure this quote is different from common, overused philosophical sayings
    - Draw from lesser-known wisdom or provide a fresh perspective on familiar concepts
    
    Format the response as JSON with:
    - quote: the wisdom quote
    - author: the source (historical figure or tradition name)
    - framework: the philosophical framework
    - reflection: a brief reflection question to ponder`;

    const wisdom = await generateWithCache(
      'daily_wisdom',
      { 
        framework: selectedFramework || 'general',
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