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
    let userFramework = null;
    
    if (userId) {
      try {
        // Get user's framework preference
        const userPrefs = await prisma.userPreference.findUnique({
          where: { userId: userId },
        });
        
        if (userPrefs?.framework) {
          userFramework = userPrefs.framework;
          console.log(`✅ Using user's preferred framework: ${userFramework}`);
        } else {
          console.log('⚠️ No framework preference found for user, will use requested framework');
        }
      } catch (error) {
        console.error('Error fetching user preferences:', error);
        // Fall back to requested framework
      }
    }
    
    // Use the user's framework preference if available, otherwise use the requested framework
    const selectedFramework = userFramework || framework || 'Stoic';
    
    console.log(`🎯 Generating daily wisdom for framework: ${selectedFramework}`);
    
    // Add variety to the prompt to ensure different quotes
    const randomElements = [
      "morning reflection", "evening contemplation", "midday pause", "dawn wisdom", "dusk insight",
      "workplace application", "personal growth", "relationship wisdom", "health and wellness", "spiritual practice",
      "emotional balance", "mental clarity", "physical discipline", "social harmony", "inner peace"
    ];
    
    const randomElement = randomElements[Math.floor(Math.random() * randomElements.length)];
    const currentHour = new Date().getHours();
    const timeOfDay = currentHour < 12 ? "morning" : currentHour < 17 ? "afternoon" : "evening";
    
    const prompt = `Generate a unique daily wisdom quote specifically for the ${selectedFramework} framework/philosophy.

Requirements:
- Create a profound, inspiring quote that embodies the essence of ${selectedFramework} philosophy
- The quote should be 1-2 sentences, concise but meaningful
- Include the name of a relevant historical figure or tradition from ${selectedFramework} background
- Make it relevant for daily reflection and practice
- Focus on practical wisdom that can be applied to modern life
- Ensure this quote is different from common, overused philosophical sayings
- Draw from ${selectedFramework} wisdom or provide a fresh perspective on familiar ${selectedFramework} concepts
- IMPORTANT: This must be specifically from ${selectedFramework} tradition, not generic wisdom

Format the response as JSON with:
- quote: the wisdom quote
- author: the source (historical figure or tradition name from ${selectedFramework})
- framework: "${selectedFramework}"
- reflection: a brief reflection question related to this wisdom`;

    const wisdom = await generateWithCache(
      'daily_wisdom',
      { 
        framework: selectedFramework,
        date: date || new Date().toISOString().split('T')[0],
        type: 'daily_wisdom',
        randomElement,
        timeOfDay
      },
      DailyWisdomSchema,
      prompt
    );

    console.log(`✅ Generated ${selectedFramework} wisdom: "${wisdom.quote}" by ${wisdom.author}`);

    return NextResponse.json(wisdom);

  } catch (error) {
    console.error('Error generating daily wisdom:', error);
    return NextResponse.json(
      { error: 'Failed to generate daily wisdom' },
      { status: 500 }
    );
  }
} 