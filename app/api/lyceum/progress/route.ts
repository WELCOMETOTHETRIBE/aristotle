import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's Lyceum progress
    let userProgress = await prisma.lyceumUserProgress.findUnique({
      where: { userId: session.user.id },
      include: {
        pathProgress: {
          include: {
            path: true
          }
        },
        lessonProgress: {
          include: {
            lesson: true
          }
        }
      }
    });

    // If no progress exists, create it
    if (!userProgress) {
      userProgress = await prisma.lyceumUserProgress.create({
        data: {
          userId: session.user.id,
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
        },
        include: {
          pathProgress: {
            include: {
              path: true
            }
          },
          lessonProgress: {
            include: {
              lesson: true
            }
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      progress: userProgress
    });

  } catch (error) {
    console.error('Error fetching Lyceum progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      completedLessons, 
      completedPaths, 
      artifacts, 
      masteryScores,
      currentPath,
      currentLesson,
      totalTimeSpent,
      dailyCheckins,
      scholarModeCompleted,
      agoraShares
    } = body;

    // Update or create user progress
    const userProgress = await prisma.lyceumUserProgress.upsert({
      where: { userId: session.user.id },
      update: {
        completedLessons: completedLessons || [],
        completedPaths: completedPaths || [],
        artifacts: artifacts || [],
        masteryScores: masteryScores || {},
        currentPath,
        currentLesson,
        totalTimeSpent: totalTimeSpent || 0,
        dailyCheckins: dailyCheckins || 0,
        scholarModeCompleted: scholarModeCompleted || [],
        agoraShares: agoraShares || [],
        lastAccessed: new Date()
      },
      create: {
        userId: session.user.id,
        completedLessons: completedLessons || [],
        completedPaths: completedPaths || [],
        artifacts: artifacts || [],
        masteryScores: masteryScores || {
          logic: 0,
          science: 0,
          metaphysics: 0,
          ethics: 0,
          politics: 0,
          rhetoric_poetics: 0
        },
        currentPath,
        currentLesson,
        totalTimeSpent: totalTimeSpent || 0,
        dailyCheckins: dailyCheckins || 0,
        scholarModeCompleted: scholarModeCompleted || [],
        agoraShares: agoraShares || []
      }
    });

    return NextResponse.json({
      success: true,
      progress: userProgress
    });

  } catch (error) {
    console.error('Error updating Lyceum progress:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
