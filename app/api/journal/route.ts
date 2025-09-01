import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';
import { z } from 'zod';

const prisma = new PrismaClient();

// Comprehensive validation schema for all journal entry types
const JournalEntrySchema = z.object({
  type: z.enum([
    'gratitude', 
    'reflection', 
    'voice_note', 
    'boundaries', 
    'community_connections', 
    'mood',
    'breathwork_session',
    'nature_photo',
    'hydration_log',
    'sleep_log',
    'movement_session',
    'focus_session',
    'habit_checkin',
    'goal_progress',
    'academy_lesson',
    'virtue_practice',
    'meditation_session',
    'exercise_session',
    'mindfulness_moment',
    'learning_insight',
    'personal_growth',
    'wellness_activity',
    'productivity_session',
    'creative_expression',
    'social_connection',
    'self_care_activity'
  ]),
  content: z.string().min(1, 'Content is required'),
  prompt: z.string().optional(),
  category: z.string().optional(),
  date: z.string().optional(),
  metadata: z.record(z.any()).optional(), // For additional context like duration, patterns, etc.
  virtueGains: z.record(z.number()).optional(), // Track virtue XP gained
  moduleId: z.string().optional(), // Which module/widget was used
  widgetId: z.string().optional(), // Specific widget identifier
  frameworkSlug: z.string().optional(), // Which framework was used
});

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
    const validationResult = JournalEntrySchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request format', 
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const { type, content, prompt, category, date, metadata, virtueGains, moduleId, widgetId, frameworkSlug } = validationResult.data;

    // Create journal entry
    const entry = await prisma.journalEntry.create({
      data: {
        userId: payload.userId,
        type,
        content,
        prompt: prompt || null,
        category: category || null,
        date: date ? new Date(date) : new Date(),
        aiInsights: await generateAIInsights(type, content, prompt, metadata),
      },
    });

    return NextResponse.json({ 
      success: true, 
      entry,
      message: 'Journal entry saved successfully' 
    }, { status: 201 });

  } catch (error) {
    console.error('Journal API error:', error);
    return NextResponse.json(
      { error: 'Failed to save journal entry' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // Build where clause
    const where: any = { userId: payload.userId };
    if (type && type !== 'all') {
      where.type = type;
    }

    // Get journal entries
    const entries = await prisma.journalEntry.findMany({
      where,
      orderBy: { date: 'desc' },
      skip: offset,
      take: limit,
    });

    // Get total count for pagination
    const total = await prisma.journalEntry.count({ where });

    return NextResponse.json({
      entries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Journal GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch journal entries' },
      { status: 500 }
    );
  }
}

// Helper function to generate AI insights based on entry type
async function generateAIInsights(type: string, content: string, prompt?: string, metadata?: any): Promise<string | null> {
  try {
    // For now, return a simple insight based on the type
    // In a full implementation, this would call OpenAI API
    const insights = {
      gratitude: "Practicing gratitude helps cultivate a positive mindset and strengthens relationships.",
      reflection: "Self-reflection is a powerful tool for personal growth and self-awareness.",
      voice_note: "Voice notes capture authentic thoughts and emotions that might be lost in writing.",
      boundaries: "Setting healthy boundaries is essential for maintaining well-being and relationships.",
      community_connections: "Building meaningful connections enriches our lives and supports our growth.",
      mood: "Tracking your mood helps build emotional awareness and identify patterns in your well-being.",
      breathwork_session: "Breathwork cultivates inner calm and strengthens the mind-body connection.",
      nature_photo: "Connecting with nature through photography nurtures our sense of wonder and presence.",
      hydration_log: "Staying hydrated supports physical and mental performance throughout the day.",
      sleep_log: "Quality sleep is the foundation of health, recovery, and daily vitality.",
      movement_session: "Movement nourishes both body and mind, creating energy and clarity.",
      focus_session: "Deep focus builds concentration and creates meaningful progress in your work.",
      habit_checkin: "Consistent habits compound into remarkable long-term results.",
      goal_progress: "Progress toward goals builds confidence and momentum in your journey.",
      academy_lesson: "Learning expands your perspective and deepens your understanding of life.",
      virtue_practice: "Practicing virtues strengthens character and guides ethical decision-making.",
      meditation_session: "Meditation cultivates inner peace and mental clarity.",
      exercise_session: "Physical exercise builds strength, endurance, and mental resilience.",
      mindfulness_moment: "Mindfulness brings awareness to the present moment and reduces stress.",
      learning_insight: "New insights expand your understanding and open new possibilities.",
      personal_growth: "Personal growth is a journey of continuous self-improvement and discovery.",
      wellness_activity: "Wellness activities nurture your physical, mental, and emotional health.",
      productivity_session: "Productive sessions create momentum and build confidence in your abilities.",
      creative_expression: "Creative expression connects you with your authentic self and inner wisdom.",
      social_connection: "Social connections provide support, joy, and a sense of belonging.",
      self_care_activity: "Self-care is essential for maintaining balance and preventing burnout."
    };

    return insights[type as keyof typeof insights] || "Your entry has been recorded for future reflection.";
  } catch (error) {
    console.error('Error generating AI insights:', error);
    return null;
  }
} 