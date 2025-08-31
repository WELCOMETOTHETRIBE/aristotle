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

    const { actionId, date } = await request.json();

    if (!actionId) {
      return NextResponse.json(
        { error: 'Action ID is required' },
        { status: 400 }
      );
    }

    // Generate AI insights for community action
    let aiInsights = null;
    try {
      const insightsResponse = await fetch(`${request.nextUrl.origin}/api/generate/practice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          practiceType: 'community_connection',
          actionId: actionId,
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
    const communityAction = {
      id: Date.now().toString(),
      userId: payload.userId,
      actionId,
      date,
      aiInsights,
      createdAt: new Date().toISOString()
    };

    console.log('Saving community action:', communityAction);

    return NextResponse.json({ 
      success: true,
      action: communityAction,
      message: 'Community action recorded successfully'
    });

  } catch (error) {
    console.error('Error recording community action:', error);
    return NextResponse.json(
      { error: 'Failed to record community action' },
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
    const mockActions = [
      {
        id: '1',
        actionId: 'reach_out',
        date: new Date().toISOString(),
        aiInsights: {
          impact: 'Reaching out to friends strengthens your social bonds and builds community.',
          growth: 'This action demonstrates courage in initiating connections.'
        }
      },
      {
        id: '2',
        actionId: 'share_wisdom',
        date: new Date().toISOString(),
        aiInsights: {
          impact: 'Sharing wisdom helps others while reinforcing your own understanding.',
          growth: 'Teaching others is a powerful way to deepen your own practice.'
        }
      }
    ];

    return NextResponse.json({ 
      actions: mockActions,
      message: 'Community actions retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching community actions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch community actions' },
      { status: 500 }
    );
  }
} 