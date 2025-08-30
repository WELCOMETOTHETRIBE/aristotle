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
        shouldShowPrompt: true,
      });
    }

    // Check for framework preference
    const userPrefs = await prisma.userPreference.findUnique({
      where: { userId: demoUser.id },
    });
    
    const hasFrameworkPreference = userPrefs?.framework && userPrefs.framework !== null;

    // For now, we'll consider onboarding complete if they have a framework preference
    // In a full implementation, you'd also check for user facts
    const isOnboardingComplete = hasFrameworkPreference;

    return NextResponse.json({
      isComplete: isOnboardingComplete,
      hasUserFacts: false, // TODO: Implement when UserFact model is available
      hasFrameworkPreference,
      shouldShowPrompt: !isOnboardingComplete,
    });

  } catch (error) {
    console.error('Onboarding status API error:', error);
    return NextResponse.json(
      { 
        isComplete: false,
        hasUserFacts: false,
        hasFrameworkPreference: false,
        shouldShowPrompt: true,
        error: 'Failed to check onboarding status'
      },
      { status: 500 }
    );
  }
} 