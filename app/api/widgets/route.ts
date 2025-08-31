import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

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

    // For now, return default widgets - in a real app, this would come from the database
    const defaultWidgets = [
      'wisdom_spotlight',
      'virtue_progress', 
      'task_manager',
      'habit_manager',
      'goal_tracker',
      'breathwork_timer',
      'hydration_tracker',
      'mood_tracker',
      'hedonic_awareness',
      'sleep_tracker'
    ];

    return NextResponse.json({ 
      activeWidgets: defaultWidgets,
      message: 'Widget preferences retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching widget preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch widget preferences' },
      { status: 500 }
    );
  }
}

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

    const { activeWidgets } = await request.json();

    if (!Array.isArray(activeWidgets)) {
      return NextResponse.json(
        { error: 'activeWidgets must be an array' },
        { status: 400 }
      );
    }

    // For now, just return success - in a real app, this would save to the database
    // TODO: Save widget preferences to database
    console.log('Saving widget preferences for user:', payload.userId, activeWidgets);

    return NextResponse.json({ 
      message: 'Widget preferences updated successfully',
      activeWidgets
    });

  } catch (error) {
    console.error('Error updating widget preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update widget preferences' },
      { status: 500 }
    );
  }
} 