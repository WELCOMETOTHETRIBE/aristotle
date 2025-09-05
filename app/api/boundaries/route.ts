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
    const { boundaryType, description, severity } = body;

    // Get user ID from authentication
    const userId = await getUserIdFromRequest(request);
    
    // Require authentication
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Generate insights directly instead of making internal API call
    const insights = {
      boundaryType,
      description,
      severity,
      insights: [
        `This ${boundaryType} boundary is important for your well-being.`,
        `Consider how this boundary aligns with your values.`,
        `Practice communicating this boundary clearly and consistently.`
      ],
      recommendations: [
        'Set clear expectations with others',
        'Practice saying no when needed',
        'Regularly review and adjust boundaries'
      ]
    };

    return NextResponse.json({
      success: true,
      insights,
      userId,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Boundaries API error:', error);
    return NextResponse.json(
      { error: 'Failed to process boundary' },
      { status: 500 }
    );
  }
}
