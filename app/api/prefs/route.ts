import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const PrefsRequestSchema = z.object({
  framework: z.string().optional(),
  style: z.string().optional(),
  locale: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const prefs = PrefsRequestSchema.parse(body);

    // For now, we'll just return success
    // In a full implementation, you'd save this to the database
    // associated with the current user session

    return NextResponse.json({
      success: true,
      message: 'Preferences saved successfully',
      preferences: prefs,
    });

  } catch (error) {
    console.error('Preferences API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request format', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to save preferences' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Return default preferences
    return NextResponse.json({
      framework: null,
      style: 'aristotle',
      locale: 'en',
    });
  } catch (error) {
    console.error('Preferences GET error:', error);
    return NextResponse.json(
      { error: 'Failed to get preferences' },
      { status: 500 }
    );
  }
} 