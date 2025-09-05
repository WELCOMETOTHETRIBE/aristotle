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

    // Parse frameworks from JSON string if it exists
    let selectedFrameworks = [];
    if (userPrefs?.frameworks) {
      try {
        selectedFrameworks = JSON.parse(userPrefs.frameworks);
      } catch {
        selectedFrameworks = userPrefs.frameworks ? [userPrefs.frameworks] : [];
      }
    } else if (userPrefs?.framework) {
      selectedFrameworks = [userPrefs.framework];
    }

    // Return preferences with defaults
    const preferences = {
      displayName: (userPrefs as any)?.name || payload.displayName || 'User',
      email: payload.email || '',
      timezone: (userPrefs as any)?.timezone || 'UTC',
      framework: userPrefs?.framework || null,
      frameworks: userPrefs?.frameworks || null,
      selectedFrameworks: selectedFrameworks,
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
    
    // If no Bearer token, try cookie-based auth (for logged in users)
    if (!userId) {
      const token = request.cookies.get('auth-token')?.value;
      if (token) {
        const payload = await verifyToken(token);
        if (payload) {
          userId = payload.userId;
        }
      }
    }
    
    // Require authentication for all operations
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Handle onboarding data
    if (isOnboarding && (framework || name || timezone)) {
      // Update or create user preferences
      await (prisma.userPreference as any).upsert({
        where: { userId: userId },
        update: {
          framework: framework || undefined,
          name: name || undefined,
          timezone: timezone || undefined,
          updatedAt: new Date(),
        },
        create: {
          userId: userId,
          framework: framework || null,
          name: name || null,
          timezone: timezone || null,
          updatedAt: new Date(),
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

    // Handle regular preferences
    if (preferences) {
      // Extract frameworks data
      const frameworksData = preferences.frameworks;
      const primaryFramework = preferences.framework;
      
      // Update user preferences in database
      await (prisma.userPreference as any).upsert({
        where: { userId: userId },
        update: {
          framework: primaryFramework || undefined,
          frameworks: frameworksData || undefined,
          name: preferences.displayName || undefined,
          timezone: preferences.timezone || undefined,
          updatedAt: new Date(),
        },
        create: {
          userId: userId,
          framework: primaryFramework || null,
          frameworks: frameworksData || null,
          name: preferences.displayName || null,
          timezone: preferences.timezone || null,
          updatedAt: new Date(),
        },
      });

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
