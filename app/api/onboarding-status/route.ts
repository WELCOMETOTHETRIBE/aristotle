import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // For now, we'll use a simple approach to check onboarding status
    // In a full implementation, you'd check against the actual user session
    
    // Check if user facts exist (indicating onboarding completion)
    let hasUserFacts = false;
    let hasFrameworkPreference = false;
    
    try {
      // Check for user facts
      const factsResponse = await fetch(`${request.nextUrl.origin}/api/user-facts`);
      if (factsResponse.ok) {
        const factsData = await factsResponse.json();
        hasUserFacts = factsData.facts && factsData.facts.length > 0;
      }
      
      // Check for framework preference
      const prefsResponse = await fetch(`${request.nextUrl.origin}/api/prefs`);
      if (prefsResponse.ok) {
        const prefsData = await prefsResponse.json();
        hasFrameworkPreference = prefsData.framework && prefsData.framework !== null;
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    }

    const isOnboardingComplete = hasUserFacts && hasFrameworkPreference;

    return NextResponse.json({
      isComplete: isOnboardingComplete,
      hasUserFacts,
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