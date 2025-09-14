import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/lyceum-auth';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { lessonId, artifacts, masteryUpdates, timeSpent } = body;

    if (!lessonId) {
      return NextResponse.json({ error: 'Lesson ID is required' }, { status: 400 });
    }

    // Get the lesson to verify it exists
    const lesson = await prisma.lyceumLesson.findUnique({
      where: { lessonId },
      include: { path: true }
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Get or create user progress
    let userProgress = await prisma.lyceumUserProgress.findUnique({
      where: { userId: session.user.id }
    });

    if (!userProgress) {
      userProgress = await prisma.lyceumUserProgress.create({
        data: {
          userId: user.id,
          completedLessons: [],
          completedPaths: [],
          artifacts: [],
          masteryScores: {
            logic: 0,
            science: 0,
            metaphysics: 0,
            ethics: 0,
            politics: 0,
            rhetoric_poetics: 0
          },
          totalTimeSpent: 0,
          dailyCheckins: 0,
          scholarModeCompleted: [],
          agoraShares: []
        }
      });
    }

    // Update completed lessons
    const updatedCompletedLessons = [...new Set([...userProgress.completedLessons, lessonId])];
    
    // Update artifacts
    const updatedArtifacts = [...new Set([...userProgress.artifacts, ...(artifacts || [])])];
    
    // Update mastery scores
    const updatedMasteryScores = { ...userProgress.masteryScores };
    if (masteryUpdates) {
      Object.entries(masteryUpdates).forEach(([domain, delta]) => {
        const currentScore = updatedMasteryScores[domain] || 0;
        updatedMasteryScores[domain] = Math.min(1, currentScore + (delta as number));
      });
    }

    // Check if path is completed
    const pathLessons = await prisma.lyceumLesson.findMany({
      where: { pathId: lesson.pathId },
      select: { lessonId: true }
    });

    const pathLessonIds = pathLessons.map(l => l.lessonId);
    const isPathCompleted = pathLessonIds.every(id => updatedCompletedLessons.includes(id));
    
    const updatedCompletedPaths = isPathCompleted 
      ? [...new Set([...userProgress.completedPaths, lesson.pathId])]
      : userProgress.completedPaths;

    // Update user progress
    const updatedProgress = await prisma.lyceumUserProgress.update({
      where: { userId: session.user.id },
      data: {
        completedLessons: updatedCompletedLessons,
        completedPaths: updatedCompletedPaths,
        artifacts: updatedArtifacts,
        masteryScores: updatedMasteryScores,
        totalTimeSpent: userProgress.totalTimeSpent + (timeSpent || 0),
        lastAccessed: new Date()
      }
    });

    // Create or update lesson progress
    await prisma.lyceumLessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId: lesson.id
        }
      },
      update: {
        completed: true,
        timeSpent: timeSpent || 0,
        completedAt: new Date()
      },
      create: {
        userId: user.id,
        lessonId: lesson.id,
        completed: true,
        timeSpent: timeSpent || 0,
        completedAt: new Date()
      }
    });

    // Update path progress
    const completedLessonsInPath = updatedCompletedLessons.filter(id => pathLessonIds.includes(id));
    const pathProgressPercentage = (completedLessonsInPath.length / pathLessonIds.length) * 100;

    await prisma.lyceumPathProgress.upsert({
      where: {
        userId_pathId: {
          userId: user.id,
          pathId: lesson.pathId
        }
      },
      update: {
        completed: isPathCompleted,
        completedLessons: completedLessonsInPath.length,
        totalLessons: pathLessonIds.length,
        progressPercentage: pathProgressPercentage,
        completedAt: isPathCompleted ? new Date() : null
      },
      create: {
        userId: user.id,
        pathId: lesson.pathId,
        completed: isPathCompleted,
        completedLessons: completedLessonsInPath.length,
        totalLessons: pathLessonIds.length,
        progressPercentage: pathProgressPercentage,
        completedAt: isPathCompleted ? new Date() : null
      }
    });

    return NextResponse.json({
      success: true,
      progress: updatedProgress,
      pathCompleted: isPathCompleted
    });

  } catch (error) {
    console.error('Error completing lesson:', error);
    return NextResponse.json(
      { error: 'Failed to complete lesson' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
