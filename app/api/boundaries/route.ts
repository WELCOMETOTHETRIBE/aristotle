import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { boundaryId, date } = await request.json();

    if (!boundaryId) {
      return NextResponse.json(
        { error: 'Boundary ID is required' },
        { status: 400 }
      );
    }

    // Generate AI insights for boundary practice
    let aiInsights = null;
    try {
      const insightsResponse = await fetch(`${request.nextUrl.origin}/api/generate/practice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          practiceType: 'boundary_setting',
          boundaryId: boundaryId,
          userId: payload.userId
        })
      });

      if (insightsResponse.ok) {
        aiInsights = await insightsResponse.json();
      }
    } catch (error) {
      console.error('Error generating AI insights:', error);
    }

    // In a real app, save to database
    const boundaryPractice = {
      id: Date.now().toString(),
      userId: payload.userId,
      boundaryId,
      date,
      aiInsights,
      createdAt: new Date().toISOString()
    };

    console.log('Saving boundary practice:', boundaryPractice);

    return NextResponse.json({ 
      success: true,
      practice: boundaryPractice,
      message: 'Boundary practice recorded successfully'
    });

  } catch (error) {
    console.error('Error recording boundary practice:', error);
    return NextResponse.json(
      { error: 'Failed to record boundary practice' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // In a real app, fetch from database
    const mockPractices = [
      {
        id: '1',
        boundaryId: 'say_no',
        date: new Date().toISOString(),
        aiInsights: {
          strength: 'You showed courage in declining a request that didn\'t align with your priorities.',
          growth: 'This practice builds your ability to stay true to your values.'
        }
      },
      {
        id: '2',
        boundaryId: 'protect_energy',
        date: new Date().toISOString(),
        aiInsights: {
          strength: 'Setting limits on draining activities shows wisdom in self-care.',
          growth: 'This boundary helps maintain your emotional and mental well-being.'
        }
      }
    ];

    return NextResponse.json({ 
      practices: mockPractices,
      message: 'Boundary practices retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching boundary practices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch boundary practices' },
      { status: 500 }
    );
  }
} 