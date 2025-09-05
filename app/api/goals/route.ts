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

export async function GET(request: NextRequest) {
  try {
    // Get user ID from authentication
    const userId = await getUserIdFromRequest(request);
    
    // Require authentication
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Return mock goals data for now
    const goals = [
      { id: 1, title: 'Read 12 books this year', progress: 75, target: 12, current: 9 },
      { id: 2, title: 'Complete 100 meditation sessions', progress: 60, target: 100, current: 60 },
      { id: 3, title: 'Run 500 miles', progress: 40, target: 500, current: 200 }
    ];

    return NextResponse.json({ goals });

  } catch (error) {
    console.error('Goals API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch goals' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, target, category } = body;

    // Get user ID from authentication
    const userId = await getUserIdFromRequest(request);
    
    // Require authentication
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Create new goal (mock implementation)
    const newGoal = {
      id: Date.now(),
      title,
      description,
      target,
      category,
      userId,
      progress: 0,
      current: 0,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      goal: newGoal
    });

  } catch (error) {
    console.error('Goals creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create goal' },
      { status: 500 }
    );
  }
}
