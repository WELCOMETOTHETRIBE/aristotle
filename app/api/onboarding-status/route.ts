import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // For now, we'll use a demo user approach since we don't have proper auth
    // In production, this would get the user from the session
    const demoUser = await prisma.user.findFirst({
      where: { username: 'demo-user' },
    });

    if (!demoUser) {
      return NextResponse.json({
        isComplete: false,
        hasUserFacts: false,
        hasFrameworkPreference: false,
        hasName: false,
        hasTimezone: false,
        shouldShowPrompt: true,
        completionPercentage: 0,
      });
    }

    // Check for framework preference
    const userPrefs = await prisma.userPreference.findUnique({
      where: { userId: demoUser.id },
    });
    
    const hasFrameworkPreference = userPrefs?.framework && userPrefs.framework !== null;
    const hasName = userPrefs?.name && userPrefs.name !== null;
    const hasTimezone = userPrefs?.timezone && userPrefs.timezone !== null;

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

    // For now, we'll use a demo user approach since we don't have proper auth
    // In production, this would get the user from the session
    const demoUser = await prisma.user.findFirst({
      where: { username: 'demo-user' },
    });

    if (!demoUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user preferences to mark onboarding as complete
    if (isComplete) {
      await prisma.userPreference.upsert({
        where: { userId: demoUser.id },
        update: {
          // Add any additional fields that indicate onboarding completion
          updatedAt: new Date(),
        },
        create: {
          userId: demoUser.id,
          // Set default values for required fields
          updatedAt: new Date(),
        },
      });
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