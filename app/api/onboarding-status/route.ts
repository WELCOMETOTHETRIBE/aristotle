import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get user ID from authentication
    let userId: number | null = null;
    
    // Try Bearer token first
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const payload = await verifyToken(token);
      if (payload) {
        userId = payload.userId;
      }
    }
    
    // If no Bearer token, try cookie-based auth
    if (!userId) {
      const token = request.cookies.get('auth-token')?.value;
      if (token) {
        const payload = await verifyToken(token);
        if (payload) {
          userId = payload.userId;
        }
      }
    }
    
    // Require authentication
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Check for framework preference
    const userPrefs = await prisma.userPreference.findUnique({
      where: { userId: userId },
    });
    
    const hasFrameworkPreference = userPrefs?.framework && userPrefs.framework !== null;
    const hasName = (userPrefs as any)?.name && (userPrefs as any).name !== null;
    const hasTimezone = (userPrefs as any)?.timezone && (userPrefs as any).timezone !== null;

    // Calculate completion percentage
    let completionPercentage = 0;
    if (hasFrameworkPreference) completionPercentage += 40;
    if (hasName) completionPercentage += 30;
    if (hasTimezone) completionPercentage += 30;

    // Consider onboarding complete if they have all essential preferences
    const isOnboardingComplete = hasFrameworkPreference && hasName && hasTimezone;

    return NextResponse.json({
      isComplete: isOnboardingComplete,
      hasUserFacts: false, // TODO: Implement when UserFact model is available
      hasFrameworkPreference,
      hasName,
      hasTimezone,
      shouldShowPrompt: !isOnboardingComplete,
      completionPercentage,
      missingItems: [
        ...(hasName ? [] : ['name']),
        ...(hasTimezone ? [] : ['timezone']),
        ...(hasFrameworkPreference ? [] : ['framework preference'])
      ]
    });

  } catch (error) {
    console.error('Onboarding status API error:', error);
    return NextResponse.json(
      { 
        isComplete: false,
        hasUserFacts: false,
        hasFrameworkPreference: false,
        hasName: false,
        hasTimezone: false,
        shouldShowPrompt: true,
        completionPercentage: 0,
        error: 'Failed to check onboarding status'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { isComplete, completedAt } = body;

    // Get user ID from authentication
    let userId: number | null = null;
    
    // Try Bearer token first
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const payload = await verifyToken(token);
      if (payload) {
        userId = payload.userId;
      }
    }
    
    // If no Bearer token, try cookie-based auth
    if (!userId) {
      const token = request.cookies.get('auth-token')?.value;
      if (token) {
        const payload = await verifyToken(token);
        if (payload) {
          userId = payload.userId;
        }
      }
    }
    
    // Require authentication
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Update user preferences to mark onboarding as complete
    if (isComplete) {
      await prisma.userPreference.upsert({
        where: { userId: userId },
        update: {
          // Add any additional fields that indicate onboarding completion
          updatedAt: new Date(),
        },
        create: {
          userId: userId,
          // Set default values for required fields
          updatedAt: new Date(),
        },
      });

      // Mark onboarding task as completed
      try {
        await prisma.task.updateMany({
          where: {
            userId: userId,
            tag: 'onboarding'
          },
          data: {
            completedAt: new Date()
          }
        });
        console.log('✅ Onboarding task marked as completed for user:', userId);
      } catch (taskError) {
        console.error('⚠️ Failed to mark onboarding task as completed:', taskError);
        // Don't fail the onboarding completion if task update fails
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Onboarding status updated successfully',
      isComplete,
      completedAt
    });

  } catch (error) {
    console.error('Error updating onboarding status:', error);
    return NextResponse.json(
      { error: 'Failed to update onboarding status' },
      { status: 500 }
    );
  }
} 