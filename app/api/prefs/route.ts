import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Return default preferences
    const preferences = {
      displayName: payload.displayName || 'User',
      email: payload.email || '',
      theme: 'dark',
      focusVirtue: 'wisdom',
      dailyReminders: true,
      weeklyInsights: true,
      communityUpdates: false,
    };

    return NextResponse.json({ preferences });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { preferences } = body;
    
    if (!preferences) {
      return NextResponse.json({ error: 'Preferences required' }, { status: 400 });
    }

    // In a real app, you'd save to database
    // For now, we'll just return success
    console.log('Saving preferences for user:', payload.userId, preferences);

    return NextResponse.json({ 
      success: true, 
      message: 'Preferences saved successfully',
      preferences 
    });
  } catch (error) {
    console.error('Error saving preferences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 