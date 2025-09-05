import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

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
  
  // If no Bearer token, try cookie-based auth directly
  if (!userId) {
    try {
      const token = request.cookies.get('auth-token')?.value;
      if (token) {
        const payload = await verifyToken(token);
        if (payload) {
          userId = payload.userId;
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
    const body = await request.json();
    const { audioData, duration, timestamp } = body;

    // Get user ID from authentication
    const userId = await getUserIdFromRequest(request);
    
    // Require authentication
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Mock transcription and insights generation
    const transcription = "This is a mock transcription of the voice note.";
    
    const insights = {
      transcription,
      duration,
      timestamp,
      insights: [
        "Your voice note contains thoughtful reflections.",
        "Consider the themes you've discussed.",
        "This could be valuable for your journaling practice."
      ],
      recommendations: [
        "Review this note in your journal",
        "Consider the patterns in your thoughts",
        "Use these insights for personal growth"
      ]
    };

    return NextResponse.json({
      success: true,
      insights,
      userId,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Voice notes API error:', error);
    return NextResponse.json(
      { error: 'Failed to process voice note' },
      { status: 500 }
    );
  }
}
