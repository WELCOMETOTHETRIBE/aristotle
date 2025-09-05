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

    // Return mock habits data for now
    const habits = [
      { id: 1, name: 'Morning Meditation', completed: true, streak: 7 },
      { id: 2, name: 'Daily Reading', completed: false, streak: 3 },
      { id: 3, name: 'Exercise', completed: true, streak: 12 },
      { id: 4, name: 'Journaling', completed: false, streak: 5 }
    ];

    return NextResponse.json({ habits });

  } catch (error) {
    console.error('Habits API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch habits' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, category } = body;

    // Get user ID from authentication
    const userId = await getUserIdFromRequest(request);
    
    // Require authentication
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Create new habit (mock implementation)
    const newHabit = {
      id: Date.now(),
      name,
      description,
      category,
      userId,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      habit: newHabit
    });

  } catch (error) {
    console.error('Habits creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create habit' },
      { status: 500 }
    );
  }
}
