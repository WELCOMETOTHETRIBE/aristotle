import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/academy/lessons/[id] - Get a specific lesson with user progress
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const lessonId = params.id;
    const userId = payload.userId;

    // Get the lesson with user progress
    const lesson = await prisma.academyLesson.findUnique({
      where: { 
        id: lessonId,
        isActive: true 
      },
      include: {
        module: {
          select: {
            id: true,
            name: true,
            greekName: true,
            virtue: true,
            color: true,
            gradient: true
          }
        },
        userProgress: {
          where: { userId },
          select: {
            isCompleted: true,
            teachingCompleted: true,
            questionCompleted: true,
            practiceCompleted: true,
            readingCompleted: true,
            quoteCompleted: true,
            userResponses: true,
            aiInteractions: true,
            practiceEvidence: true,
            startedAt: true,
            completedAt: true,
            lastAccessedAt: true
          }
        },
        milestones: {
          where: { userId },
          select: {
            id: true,
            type: true,
            title: true,
            description: true,
            virtueGrants: true,
            achievedAt: true
          }
        }
      }
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Transform the data to include progress information
    const lessonWithProgress = {
      id: lesson.id,
      title: lesson.title,
      subtitle: lesson.subtitle,
      teaching: lesson.teaching,
      question: lesson.question,
      practice: lesson.practice,
      reading: lesson.reading,
      quote: lesson.quote,
      author: lesson.author,
      difficulty: lesson.difficulty,
      estimatedTime: lesson.estimatedTime,
      prerequisites: lesson.prerequisites,
      virtueGrants: lesson.virtueGrants,
      interactiveElements: lesson.interactiveElements,
      aiGuidance: lesson.aiGuidance,
      order: lesson.order,
      module: lesson.module,
      progress: lesson.userProgress[0] || {
        isCompleted: false,
        teachingCompleted: false,
        questionCompleted: false,
        practiceCompleted: false,
        readingCompleted: false,
        quoteCompleted: false,
        userResponses: null,
        aiInteractions: null,
        practiceEvidence: null,
        startedAt: null,
        completedAt: null,
        lastAccessedAt: null
      },
      milestones: lesson.milestones
    };

    return NextResponse.json({ lesson: lessonWithProgress });

  } catch (error) {
    console.error('Error fetching Academy lesson:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lesson' },
      { status: 500 }
    );
  }
}

// POST /api/academy/lessons/[id] - Update lesson progress and handle responses
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { action, section, response, aiInteraction, evidence } = body;
    const lessonId = params.id;
    const userId = payload.userId;

    if (!action) {
      return NextResponse.json({ error: 'Missing action' }, { status: 400 });
    }

    switch (action) {
      case 'start_lesson':
        // Create or update lesson progress when user starts a lesson
        const lessonProgress = await prisma.lessonProgress.upsert({
          where: { userId_lessonId: { userId, lessonId } },
          update: {
            lastAccessedAt: new Date()
          },
          create: {
            userId,
            lessonId,
            isCompleted: false,
            startedAt: new Date(),
            lastAccessedAt: new Date(),
            teachingCompleted: false,
            questionCompleted: false,
            practiceCompleted: false,
            readingCompleted: false,
            quoteCompleted: false
          }
        });

        return NextResponse.json({ 
          success: true, 
          progress: lessonProgress,
          message: 'Lesson started successfully'
        });

      case 'complete_section':
        if (!section) {
          return NextResponse.json({ error: 'Missing section' }, { status: 400 });
        }

        // Get current progress
        const currentProgress = await prisma.lessonProgress.findUnique({
          where: { userId_lessonId: { userId, lessonId } }
        });

        if (!currentProgress) {
          return NextResponse.json({ error: 'Lesson not started' }, { status: 400 });
        }

        // Update section completion and responses
        const updateData: any = {
          lastAccessedAt: new Date()
        };

        // Mark section as completed
        switch (section) {
          case 'teaching':
            updateData.teachingCompleted = true;
            break;
          case 'question':
            updateData.questionCompleted = true;
            break;
          case 'practice':
            updateData.practiceCompleted = true;
            if (evidence) {
              updateData.practiceEvidence = evidence;
            }
            break;
          case 'reading':
            updateData.readingCompleted = true;
            break;
          case 'quote':
            updateData.quoteCompleted = true;
            break;
        }

        // Update user responses
        if (response || aiInteraction) {
          const currentResponses = (currentProgress.userResponses as any) || {};
          const currentAiInteractions = (currentProgress.aiInteractions as any) || {};
          
          if (response) {
            currentResponses[section] = response;
            updateData.userResponses = currentResponses;
          }
          
          if (aiInteraction) {
            currentAiInteractions[section] = aiInteraction;
            updateData.aiInteractions = currentAiInteractions;
          }
        }

        // Check if all sections are completed
        const allCompleted = (
          (section === 'teaching' || currentProgress.teachingCompleted) &&
          (section === 'question' || currentProgress.questionCompleted) &&
          (section === 'practice' || currentProgress.practiceCompleted) &&
          (section === 'reading' || currentProgress.readingCompleted) &&
          (section === 'quote' || currentProgress.quoteCompleted)
        );

        if (allCompleted) {
          updateData.isCompleted = true;
          updateData.completedAt = new Date();
        }

        const updatedProgress = await prisma.lessonProgress.update({
          where: { userId_lessonId: { userId, lessonId } },
          data: updateData
        });

        // If lesson is completed, create a milestone
        if (allCompleted) {
          const lesson = await prisma.academyLesson.findUnique({
            where: { id: lessonId },
            select: { title: true, virtueGrants: true, moduleId: true }
          });

          if (lesson) {
            await prisma.academyMilestone.create({
              data: {
                userId,
                lessonId,
                moduleId: lesson.moduleId,
                type: 'lesson_completed',
                title: `Completed: ${lesson.title}`,
                description: `You have successfully completed the lesson "${lesson.title}"`,
                virtueGrants: lesson.virtueGrants,
                achievedAt: new Date()
              }
            });
          }
        }

        return NextResponse.json({ 
          success: true, 
          progress: updatedProgress,
          completed: allCompleted,
          message: allCompleted ? 'Lesson completed!' : 'Section completed successfully'
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error updating Academy lesson:', error);
    return NextResponse.json(
      { error: 'Failed to update lesson' },
      { status: 500 }
    );
  }
}
