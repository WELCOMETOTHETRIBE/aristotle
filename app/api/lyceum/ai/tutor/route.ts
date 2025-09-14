import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { lyceumAITutor } from '@/lib/lyceum-ai';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { lessonId, activityId, userResponse, context } = body;

    if (!lessonId || !activityId) {
      return NextResponse.json({ error: 'Lesson ID and Activity ID are required' }, { status: 400 });
    }

    // Get AI tutor guidance
    const guidance = await lyceumAITutor.provideGuidance(
      lessonId,
      activityId,
      userResponse,
      context
    );

    return NextResponse.json({
      success: true,
      guidance
    });

  } catch (error) {
    console.error('Error getting AI tutor guidance:', error);
    return NextResponse.json(
      { error: 'Failed to get AI guidance' },
      { status: 500 }
    );
  }
}
