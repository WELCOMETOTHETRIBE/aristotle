import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { generateAcademyTeachingResponse } from '@/lib/ai';

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
    const { lessonTitle, teachingContent, userQuestion, userLevel } = body;

    if (!lessonTitle || !teachingContent || !userQuestion) {
      return NextResponse.json({ 
        error: 'Missing required fields: lessonTitle, teachingContent, userQuestion' 
      }, { status: 400 });
    }

    const response = await generateAcademyTeachingResponse(
      lessonTitle,
      teachingContent,
      userQuestion,
      userLevel || 'BEGINNER'
    );

    return NextResponse.json({
      success: true,
      response,
      message: 'Teaching response generated successfully'
    });

  } catch (error) {
    console.error('Error generating Academy teaching response:', error);
    return NextResponse.json(
      { error: 'Failed to generate teaching response' },
      { status: 500 }
    );
  }
}
