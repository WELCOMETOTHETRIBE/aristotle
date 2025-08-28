import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // In a real app, this would fetch from database
    const mockSessions = [
      {
        id: '1',
        userId: '1',
        type: 'box',
        duration: 300,
        phases: [
          { name: 'Inhale', duration: 4, color: '#7ad7ff' },
          { name: 'Hold', duration: 4, color: '#a78bfa' },
          { name: 'Exhale', duration: 4, color: '#7ad7ff' },
          { name: 'Hold', duration: 4, color: '#a78bfa' }
        ],
        completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        notes: 'Morning session, felt very focused'
      }
    ];

    return NextResponse.json(mockSessions);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch breathwork sessions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, duration, phases, notes } = body;

    // In a real app, this would save to database
    const newSession = {
      id: Date.now().toString(),
      userId: '1', // In real app, get from auth
      type,
      duration,
      phases,
      completedAt: new Date(),
      notes
    };

    return NextResponse.json({
      success: true,
      session: newSession
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create breathwork session' },
      { status: 500 }
    );
  }
} 