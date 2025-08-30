import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';

const PrefsRequestSchema = z.object({
  framework: z.string().optional(),
  style: z.string().optional(),
  locale: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const prefs = PrefsRequestSchema.parse(body);

    // For now, we'll use a demo user approach since we don't have proper auth
    // In production, this would get the user from the session
    const demoUser = await prisma.user.findFirst({
      where: { username: 'demo-user' },
    });

    if (!demoUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Save preferences to database
    await prisma.userPreference.upsert({
      where: {
        userId: demoUser.id,
      },
      update: {
        framework: prefs.framework || null,
        style: prefs.style || 'aristotle',
        locale: prefs.locale || 'en',
      },
      create: {
        userId: demoUser.id,
        framework: prefs.framework || null,
        style: prefs.style || 'aristotle',
        locale: prefs.locale || 'en',
      },
    });

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
    // For now, we'll use a demo user approach
    const demoUser = await prisma.user.findFirst({
      where: { username: 'demo-user' },
    });

    if (!demoUser) {
      return NextResponse.json({
        framework: null,
        style: 'aristotle',
        locale: 'en',
      });
    }

    // Get user preferences from database
    const userPrefs = await prisma.userPreference.findUnique({
      where: {
        userId: demoUser.id,
      },
    });

    return NextResponse.json({
      framework: userPrefs?.framework || null,
      style: userPrefs?.style || 'aristotle',
      locale: userPrefs?.locale || 'en',
    });
  } catch (error) {
    console.error('Preferences GET error:', error);
    return NextResponse.json(
      { error: 'Failed to get preferences' },
      { status: 500 }
    );
  }
} 