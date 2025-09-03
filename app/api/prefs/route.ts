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
    const body = await request.json();
    const { framework, name, timezone, secondaryFrameworks, preferences, isOnboarding } = body;
    
    // Handle onboarding data without authentication
    if (isOnboarding && (framework || name || timezone)) {
      // For onboarding, we'll use a demo user approach
      // In production, this would create a new user account
      const demoUser = await prisma.user.findFirst({
        where: { username: 'demo-user' },
      });

      if (!demoUser) {
        return NextResponse.json({ error: 'Demo user not found' }, { status: 404 });
      }

      await prisma.userPreference.upsert({
        where: { userId: demoUser.id },
        update: {
          framework: framework || undefined,
          name: name || undefined,
          timezone: timezone || undefined,
          updatedAt: new Date(),
        },
        create: {
          userId: demoUser.id,
          framework: framework || null,
          name: name || null,
          timezone: timezone || null,
        },
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Onboarding preferences saved successfully',
        framework,
        name,
        timezone
      });
    }

    // Handle authenticated user preferences - try both cookie and Bearer token
    let userId: number | null = null;
    
    // First try Bearer token
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const payload = await verifyToken(token);
      if (payload) {
        userId = payload.userId;
      }
    }
    
    // If no Bearer token, try cookie-based auth (for demo users)
    if (!userId) {
      try {
        const cookieHeader = request.headers.get('cookie');
        if (cookieHeader) {
          // For demo users, we'll check if they're authenticated via cookies
          // This is a simplified approach - in production you'd verify the session
          const demoUser = await prisma.user.findFirst({
            where: { username: 'demo-user' },
          });
          if (demoUser) {
            userId = demoUser.id;
          }
        }
      } catch (error) {
        console.error('Cookie auth check failed:', error);
      }
    }
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Handle regular preferences
    if (preferences) {
      // In a real app, you'd save other preferences to database
      console.log('Saving preferences for user:', userId, preferences);
    }

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