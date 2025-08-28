import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // In a real app, this would fetch from database
    const mockSessions = [
      {
        id: '1',
        userId: '1',
        type: 'focus',
        duration: 1500, // 25 minutes in seconds
        isActive: false,
        startTime: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        endTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        notes: 'Deep work session on project planning'
      },
      {
        id: '2',
        userId: '1',
        type: 'meditation',
        duration: 600, // 10 minutes
        isActive: false,
        startTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        endTime: new Date(Date.now() - 50 * 60 * 1000), // 50 minutes ago
        notes: 'Mindfulness meditation'
      }
    ];

    return NextResponse.json(mockSessions);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch timer sessions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, duration, notes } = body;

    // In a real app, this would save to database
    const newSession = {
      id: Date.now().toString(),
      userId: '1', // In real app, get from auth
      type,
      duration,
      isActive: true,
      startTime: new Date(),
      endTime: null,
      notes
    };

    return NextResponse.json({
      success: true,
      session: newSession
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create timer session' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, action } = body;

    // In a real app, this would update the database
    let response;
    
    if (action === 'complete') {
      response = {
        success: true,
        message: 'Session completed',
        session: {
          id: sessionId,
          endTime: new Date(),
          isActive: false
        }
      };
    } else if (action === 'pause') {
      response = {
        success: true,
        message: 'Session paused',
        session: {
          id: sessionId,
          isActive: false
        }
      };
    } else if (action === 'resume') {
      response = {
        success: true,
        message: 'Session resumed',
        session: {
          id: sessionId,
          isActive: true
        }
      };
    }

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update timer session' },
      { status: 500 }
    );
  }
} 