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
    const { framework, date } = body;

    // Get user ID from authentication (optional for daily wisdom)
    const userId = await getUserIdFromRequest(request);

    // Generate daily wisdom based on framework
    const wisdom = {
      quote: "The unexamined life is not worth living.",
      author: "Socrates",
      framework: framework || 'Stoic',
      reflection: "What aspect of your life needs deeper examination today?",
      date: date || new Date().toISOString().split('T')[0]
    };

    return NextResponse.json(wisdom);

  } catch (error) {
    console.error('Daily wisdom generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate daily wisdom' },
      { status: 500 }
    );
  }
}
