import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { generateAcademyWisdomResponse } from '@/lib/ai';

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
    const { quote, author, userInterpretation, virtue } = body;

    if (!quote || !author || !userInterpretation || !virtue) {
      return NextResponse.json({ 
        error: 'Missing required fields: quote, author, userInterpretation, virtue' 
      }, { status: 400 });
    }

    const validVirtues = ['wisdom', 'justice', 'courage', 'temperance'];
    if (!validVirtues.includes(virtue)) {
      return NextResponse.json({ 
        error: 'Invalid virtue. Must be one of: wisdom, justice, courage, temperance' 
      }, { status: 400 });
    }

    const response = await generateAcademyWisdomResponse(
      quote,
      author,
      userInterpretation,
      virtue
    );

    return NextResponse.json({
      success: true,
      response,
      message: 'Wisdom response generated successfully'
    });

  } catch (error) {
    console.error('Error generating Academy wisdom response:', error);
    return NextResponse.json(
      { error: 'Failed to generate wisdom response' },
      { status: 500 }
    );
  }
}
