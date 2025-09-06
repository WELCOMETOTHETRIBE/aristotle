import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { generateAcademyReflectionResponse } from '@/lib/ai';

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
    const { lessonTitle, reflectionQuestion, userResponse, virtue } = body;

    if (!lessonTitle || !reflectionQuestion || !userResponse || !virtue) {
      return NextResponse.json({ 
        error: 'Missing required fields: lessonTitle, reflectionQuestion, userResponse, virtue' 
      }, { status: 400 });
    }

    const validVirtues = ['wisdom', 'justice', 'courage', 'temperance'];
    if (!validVirtues.includes(virtue)) {
      return NextResponse.json({ 
        error: 'Invalid virtue. Must be one of: wisdom, justice, courage, temperance' 
      }, { status: 400 });
    }

    const response = await generateAcademyReflectionResponse(
      lessonTitle,
      reflectionQuestion,
      userResponse,
      virtue
    );

    return NextResponse.json({
      success: true,
      response,
      message: 'Reflection response generated successfully'
    });

  } catch (error) {
    console.error('Error generating Academy reflection response:', error);
    return NextResponse.json(
      { error: 'Failed to generate reflection response' },
      { status: 500 }
    );
  }
}
