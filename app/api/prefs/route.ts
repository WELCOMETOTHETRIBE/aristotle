import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/db';

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

    // Get user preferences from database
    const userPrefs = await prisma.userPreference.findUnique({
      where: { userId: payload.userId },
    });

    // Return preferences with defaults
    const preferences = {
      displayName: userPrefs?.name || payload.displayName || 'User',
      email: payload.email || '',
      timezone: userPrefs?.timezone || 'UTC',
      framework: userPrefs?.framework || null,
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
    const { framework, name, timezone, secondaryFrameworks, preferences } = body;
    
    // Handle onboarding data
    if (framework || name || timezone) {
      await prisma.userPreference.upsert({
        where: { userId: payload.userId },
        update: {
          framework: framework || undefined,
          name: name || undefined,
          timezone: timezone || undefined,
          updatedAt: new Date(),
        },
        create: {
          userId: payload.userId,
          framework: framework || null,
          name: name || null,
          timezone: timezone || null,
        },
      });
    }

    // Handle regular preferences
    if (preferences) {
      // In a real app, you'd save other preferences to database
      console.log('Saving preferences for user:', payload.userId, preferences);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Preferences saved successfully',
      framework,
      name,
      timezone,
      preferences 
    });
  } catch (error) {
    console.error('Error saving preferences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 