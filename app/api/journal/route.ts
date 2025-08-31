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

    const { type, content, date } = await request.json();

    if (!type || !content) {
      return NextResponse.json(
        { error: 'Type and content are required' },
        { status: 400 }
      );
    }

    // Generate AI insights based on the journal entry
    let aiInsights = null;
    try {
      const insightsResponse = await fetch(`${request.nextUrl.origin}/api/generate/reflection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          journalEntry: content,
          type: type,
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
    const journalEntry = {
      id: Date.now().toString(),
      userId: payload.userId,
      type,
      content,
      date,
      aiInsights,
      createdAt: new Date().toISOString()
    };

    console.log('Saving journal entry:', journalEntry);

    return NextResponse.json({ 
      success: true,
      entry: journalEntry,
      message: 'Journal entry saved successfully'
    });

  } catch (error) {
    console.error('Error saving journal entry:', error);
    return NextResponse.json(
      { error: 'Failed to save journal entry' },
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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '10');

    // In a real app, fetch from database
    const mockEntries = [
      {
        id: '1',
        type: 'gratitude',
        content: 'I am grateful for the beautiful weather today and the opportunity to spend time outdoors.',
        date: new Date().toISOString(),
        aiInsights: {
          themes: ['nature', 'appreciation', 'mindfulness'],
          reflection: 'Your gratitude for nature shows a deep connection to the present moment.'
        }
      },
      {
        id: '2',
        type: 'reflection',
        content: 'Today I learned that patience is truly a virtue when dealing with challenging situations.',
        date: new Date().toISOString(),
        aiInsights: {
          themes: ['patience', 'growth', 'challenges'],
          reflection: 'This insight about patience demonstrates wisdom in recognizing personal growth opportunities.'
        }
      }
    ];

    const filteredEntries = type 
      ? mockEntries.filter(entry => entry.type === type)
      : mockEntries;

    return NextResponse.json({ 
      entries: filteredEntries.slice(0, limit),
      message: 'Journal entries retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching journal entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch journal entries' },
      { status: 500 }
    );
  }
} 