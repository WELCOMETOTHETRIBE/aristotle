import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/academy/milestone - Get user's Academy milestones
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

    const userId = payload.userId;
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const type = url.searchParams.get('type');

    // Build where clause
    const whereClause: any = { userId };
    if (type) {
      whereClause.type = type;
    }

    const milestones = await prisma.academyMilestone.findMany({
      where: whereClause,
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            module: {
              select: {
                id: true,
                name: true,
                virtue: true
              }
            }
          }
        }
      },
      orderBy: { achievedAt: 'desc' },
      take: limit
    });

    return NextResponse.json({ 
      success: true,
      milestones,
      count: milestones.length
    });

  } catch (error) {
    console.error('Error fetching Academy milestones:', error);
    return NextResponse.json(
      { error: 'Failed to fetch milestones' },
      { status: 500 }
    );
  }
}

// POST /api/academy/milestone - Create or update Academy milestones
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
    const { 
      lessonId, 
      moduleId, 
      type, 
      title, 
      description, 
      virtueGrants,
      metadata,
      // Legacy support for existing milestone route
      lessonTitle, 
      moduleName, 
      milestones, 
      userInputs, 
      aiResponses 
    } = body;

    const userId = payload.userId;

    // Handle legacy milestone creation (for backward compatibility)
    if (lessonTitle && moduleName) {
      // Create a comprehensive journal entry for the completed lesson
      const journalEntry = await prisma.journalEntry.create({
        data: {
          userId,
          content: `Completed Academy lesson: ${lessonTitle}

Module: ${moduleName}

Key Milestones:
${milestones ? milestones.map((m: any) => `• ${m.title}: ${m.description}`).join('\n') : 'Lesson completed successfully'}

User Responses:
${userInputs ? JSON.stringify(userInputs, null, 2) : 'No responses recorded'}

AI Interactions:
${aiResponses ? JSON.stringify(aiResponses, null, 2) : 'No AI interactions recorded'}

This lesson has contributed to my virtue development and understanding of Aristotelian principles.`,
          mood: 'accomplished',
          tags: ['academy', 'learning', 'virtue', moduleName.toLowerCase()],
          metadata: {
            lessonId,
            lessonTitle,
            moduleName,
            milestones: milestones || [],
            userInputs: userInputs || {},
            aiResponses: aiResponses || {},
            completedAt: new Date().toISOString()
          }
        }
      });

      // Create Academy milestone
      const academyMilestone = await prisma.academyMilestone.create({
        data: {
          userId,
          lessonId,
          moduleId,
          type: 'lesson_completed',
          title: `Completed: ${lessonTitle}`,
          description: `Successfully completed the Academy lesson "${lessonTitle}" in the ${moduleName} module`,
          virtueGrants: virtueGrants || { wisdom: 1 },
          metadata: {
            journalEntryId: journalEntry.id,
            milestones: milestones || [],
            userInputs: userInputs || {},
            aiResponses: aiResponses || {}
          }
        }
      });

      return NextResponse.json({
        success: true,
        journalEntry,
        milestone: academyMilestone,
        message: 'Milestone logged successfully'
      });
    }

    // Handle new milestone creation
    if (!type || !title || !description) {
      return NextResponse.json({ 
        error: 'Missing required fields: type, title, description' 
      }, { status: 400 });
    }

    const validTypes = [
      'lesson_completed', 
      'module_completed', 
      'capstone_completed', 
      'virtue_mastered',
      'assessment_passed',
      'practice_completed',
      'reflection_submitted',
      'reading_analyzed',
      'wisdom_interpreted'
    ];

    if (!validTypes.includes(type)) {
      return NextResponse.json({ 
        error: `Invalid milestone type. Must be one of: ${validTypes.join(', ')}` 
      }, { status: 400 });
    }

    const milestone = await prisma.academyMilestone.create({
      data: {
        userId,
        lessonId: lessonId || null,
        moduleId: moduleId || null,
        type,
        title,
        description,
        virtueGrants: virtueGrants || {},
        metadata: metadata || {}
      }
    });

    // Update user's virtue totals if virtue grants are provided
    if (virtueGrants && Object.keys(virtueGrants).length > 0) {
      await prisma.virtueTotals.upsert({
        where: { userId },
        update: {
          wisdom: { increment: virtueGrants.wisdom || 0 },
          justice: { increment: virtueGrants.justice || 0 },
          courage: { increment: virtueGrants.courage || 0 },
          temperance: { increment: virtueGrants.temperance || 0 }
        },
        create: {
          userId,
          wisdom: virtueGrants.wisdom || 0,
          justice: virtueGrants.justice || 0,
          courage: virtueGrants.courage || 0,
          temperance: virtueGrants.temperance || 0
        }
      });
    }

    return NextResponse.json({
      success: true,
      milestone,
      message: 'Milestone created successfully'
    });

  } catch (error) {
    console.error('Error creating Academy milestone:', error);
    return NextResponse.json(
      { error: 'Failed to create milestone' },
      { status: 500 }
    );
  }
}
