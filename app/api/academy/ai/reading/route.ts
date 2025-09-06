import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { generateAcademyReadingResponse } from '@/lib/ai';

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
    const { lessonTitle, readingText, userQuestion, analysisType } = body;

    if (!lessonTitle || !readingText || !userQuestion) {
      return NextResponse.json({ 
        error: 'Missing required fields: lessonTitle, readingText, userQuestion' 
      }, { status: 400 });
    }

    const validAnalysisTypes = ['text_analysis', 'ai_summary', 'discussion_forum', 'creative_response'];
    const finalAnalysisType = analysisType && validAnalysisTypes.includes(analysisType) 
      ? analysisType 
      : 'text_analysis';

    const response = await generateAcademyReadingResponse(
      lessonTitle,
      readingText,
      userQuestion,
      finalAnalysisType
    );

    return NextResponse.json({
      success: true,
      response,
      message: 'Reading response generated successfully'
    });

  } catch (error) {
    console.error('Error generating Academy reading response:', error);
    return NextResponse.json(
      { error: 'Failed to generate reading response' },
      { status: 500 }
    );
  }
}
