import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { lyceumAIEvaluator } from '@/lib/lyceum-ai';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
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
