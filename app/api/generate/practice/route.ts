import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');
    const level = searchParams.get('level');
    const style = searchParams.get('style');
    const locale = searchParams.get('locale');

    // For now, return a fallback practice structure
    // In the future, this could integrate with AI generation
    const fallbackPractice = {
      title: `${style ? style.charAt(0).toUpperCase() + style.slice(1) : 'Ancient'} ${moduleId ? moduleId.charAt(0).toUpperCase() + moduleId.slice(1) : 'Practice'}`,
      body: `A foundational practice from the ${style || 'ancient'} tradition. Focus on mindful awareness and steady progress.`,
      bullets: [
        "Find a comfortable position",
        "Close your eyes and focus inward",
        "Breathe naturally and observe",
        "Return to focus when mind wanders"
      ],
      coach_prompts: [
        "Notice how your body feels",
        "Observe any changes in your mental state"
      ],
      safety_reminders: [
        "Stop if you feel uncomfortable",
        "Practice with gentleness and patience"
      ],
      est_time_min: 5
    };

    return NextResponse.json(fallbackPractice);
  } catch (error) {
    console.error('Error generating practice:', error);
    return NextResponse.json(
      { error: 'Failed to generate practice' },
      { status: 500 }
    );
  }
} 