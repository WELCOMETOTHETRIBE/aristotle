import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/lyceum-auth';
import { lyceumAIEvaluator } from '@/lib/lyceum-ai';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { lessonId, activityResponses, assessment } = body;

    if (!lessonId || !activityResponses || !assessment) {
      return NextResponse.json({ error: 'Lesson ID, activity responses, and assessment are required' }, { status: 400 });
    }

    // Get AI evaluation
    const evaluation = await lyceumAIEvaluator.evaluateWork(
      lessonId,
      activityResponses,
      assessment
    );

    return NextResponse.json({
      success: true,
      evaluation
    });

  } catch (error) {
    console.error('Error getting AI evaluation:', error);
    return NextResponse.json(
      { error: 'Failed to get AI evaluation' },
      { status: 500 }
    );
  }
}
