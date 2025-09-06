import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { generateAcademyAssessment } from '@/lib/ai';

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
    const { lessonTitle, userResponses, virtue, difficulty } = body;

    if (!lessonTitle || !userResponses || !virtue) {
      return NextResponse.json({ 
        error: 'Missing required fields: lessonTitle, userResponses, virtue' 
      }, { status: 400 });
    }

    const validVirtues = ['wisdom', 'justice', 'courage', 'temperance'];
    if (!validVirtues.includes(virtue)) {
      return NextResponse.json({ 
        error: 'Invalid virtue. Must be one of: wisdom, justice, courage, temperance' 
      }, { status: 400 });
    }

    const validDifficulties = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
    const finalDifficulty = difficulty && validDifficulties.includes(difficulty) 
      ? difficulty 
      : 'BEGINNER';

    const response = await generateAcademyAssessment(
      lessonTitle,
      userResponses,
      virtue,
      finalDifficulty
    );

    return NextResponse.json({
      success: true,
      response,
      message: 'Assessment generated successfully'
    });

  } catch (error) {
    console.error('Error generating Academy assessment:', error);
    return NextResponse.json(
      { error: 'Failed to generate assessment' },
      { status: 500 }
    );
  }
}
