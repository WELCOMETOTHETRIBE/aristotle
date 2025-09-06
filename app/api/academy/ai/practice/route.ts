import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { generateAcademyPracticeResponse } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { lessonTitle, practiceDescription, userChallenge, practiceType } = body;

    if (!lessonTitle || !practiceDescription || !userChallenge) {
      return NextResponse.json({ 
        error: 'Missing required fields: lessonTitle, practiceDescription, userChallenge' 
      }, { status: 400 });
    }

    const validPracticeTypes = ['real_world_exercise', 'journal_entry', 'skill_practice', 'ai_coaching'];
    const finalPracticeType = practiceType && validPracticeTypes.includes(practiceType) 
      ? practiceType 
      : 'real_world_exercise';

    const response = await generateAcademyPracticeResponse(
      lessonTitle,
      practiceDescription,
      userChallenge,
      finalPracticeType
    );

    return NextResponse.json({
      success: true,
      response,
      message: 'Practice response generated successfully'
    });

  } catch (error) {
    console.error('Error generating Academy practice response:', error);
    return NextResponse.json(
      { error: 'Failed to generate practice response' },
      { status: 500 }
    );
  }
}
