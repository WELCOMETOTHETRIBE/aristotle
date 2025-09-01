import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas for different journal entry types
const JournalEntrySchema = z.object({
  type: z.enum(['gratitude', 'reflection', 'voice_note', 'boundaries', 'community_connections']),
  content: z.string().min(1, 'Content is required'),
  prompt: z.string().optional(),
  category: z.string().optional(),
  date: z.string().optional(),
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

    const { type, content, prompt, category, date } = validationResult.data;

    // Create journal entry
    const entry = await prisma.journalEntry.create({
      data: {
        userId: payload.userId,
        type,
        content,
        prompt: prompt || null,
        category: category || null,
        date: date ? new Date(date) : new Date(),
        aiInsights: await generateAIInsights(type, content, prompt),
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
async function generateAIInsights(type: string, content: string, prompt?: string): Promise<string | null> {
  try {
    // For now, return a simple insight based on the type
    // In a full implementation, this would call OpenAI API
    const insights = {
      gratitude: "Practicing gratitude helps cultivate a positive mindset and strengthens relationships.",
      reflection: "Self-reflection is a powerful tool for personal growth and self-awareness.",
      voice_note: "Voice notes capture authentic thoughts and emotions that might be lost in writing.",
      boundaries: "Setting healthy boundaries is essential for maintaining well-being and relationships.",
      community_connections: "Building meaningful connections enriches our lives and supports our growth."
    };

    return insights[type as keyof typeof insights] || "Your entry has been recorded for future reflection.";
  } catch (error) {
    console.error('Error generating AI insights:', error);
    return null;
  }
} 