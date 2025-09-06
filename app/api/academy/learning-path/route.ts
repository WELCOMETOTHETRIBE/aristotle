import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';
import { generateAcademyLearningPath } from '@/lib/ai';

const prisma = new PrismaClient();

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
    const { learningGoals } = body;
    const userId = payload.userId;

    // Get user profile and progress data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        createdAt: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get completed modules
    const completedModules = await prisma.academyModuleProgress.findMany({
      where: { 
        userId,
        isCompleted: true 
      },
      include: {
        module: {
          select: {
            id: true,
            name: true,
            virtue: true
          }
        }
      }
    });

    // Get assessment results (recent milestones)
    const recentMilestones = await prisma.academyMilestone.findMany({
      where: { userId },
      orderBy: { achievedAt: 'desc' },
      take: 10,
      select: {
        type: true,
        virtueGrants: true,
        achievedAt: true
      }
    });

    // Get virtue totals
    const virtueProgress = await prisma.virtueTotals.findUnique({
      where: { userId },
      select: {
        wisdom: true,
        justice: true,
        courage: true,
        temperance: true
      }
    });

    // Prepare data for AI
    const userProfile = {
      name: user.name,
      joinDate: user.createdAt,
      virtueScores: virtueProgress || { wisdom: 0, justice: 0, courage: 0, temperance: 0 }
    };

    const completedModuleIds = completedModules.map(m => m.module.id);

    const assessmentResults = {
      recentMilestones: recentMilestones.slice(0, 5),
      virtueProgress: virtueProgress,
      completedModulesCount: completedModules.length
    };

    const finalLearningGoals = learningGoals && Array.isArray(learningGoals) 
      ? learningGoals 
      : ['Develop virtue', 'Live a flourishing life'];

    const response = await generateAcademyLearningPath(
      userProfile,
      completedModuleIds,
      assessmentResults,
      finalLearningGoals
    );

    return NextResponse.json({
      success: true,
      response,
      userProfile,
      completedModules: completedModuleIds,
      message: 'Learning path generated successfully'
    });

  } catch (error) {
    console.error('Error generating Academy learning path:', error);
    return NextResponse.json(
      { error: 'Failed to generate learning path' },
      { status: 500 }
    );
  }
}
