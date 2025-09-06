import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/academy/modules - Get all Academy modules with user progress
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

    // Get all Academy modules with user progress
    const modules = await prisma.academyModule.findMany({
      where: { isActive: true },
      include: {
        lessons: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            difficulty: true,
            estimatedTime: true,
            order: true,
            userProgress: {
              where: { userId },
              select: {
                isCompleted: true,
                teachingCompleted: true,
                questionCompleted: true,
                practiceCompleted: true,
                readingCompleted: true,
                quoteCompleted: true,
                lastAccessedAt: true
              }
            }
          }
        },
        userProgress: {
          where: { userId },
          select: {
            progress: true,
            completedLessons: true,
            totalLessons: true,
            isCompleted: true,
            startedAt: true,
            completedAt: true,
            lastAccessedAt: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    // Transform the data to include progress information
    const modulesWithProgress = modules.map(module => ({
      id: module.id,
      name: module.name,
      greekName: module.greekName,
      description: module.description,
      longDescription: module.longDescription,
      virtue: module.virtue,
      icon: module.icon,
      color: module.color,
      gradient: module.gradient,
      totalLessons: module.totalLessons,
      estimatedTime: module.estimatedTime,
      prerequisites: module.prerequisites,
      capstoneTitle: module.capstoneTitle,
      capstoneDescription: module.capstoneDescription,
      capstoneRequirements: module.capstoneRequirements,
      capstoneTime: module.capstoneTime,
      lessons: module.lessons.map(lesson => ({
        ...lesson,
        progress: lesson.userProgress[0] || null
      })),
      progress: module.userProgress[0] || {
        progress: 0,
        completedLessons: 0,
        totalLessons: module.totalLessons,
        isCompleted: false,
        startedAt: null,
        completedAt: null,
        lastAccessedAt: null
      }
    }));

    return NextResponse.json({ modules: modulesWithProgress });

  } catch (error) {
    console.error('Error fetching Academy modules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Academy modules' },
      { status: 500 }
    );
  }
}

// POST /api/academy/modules - Update user progress for a module
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
    const { moduleId, action, data } = body;

    if (!moduleId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const userId = payload.userId;

    switch (action) {
      case 'start_module':
        // Create or update module progress when user starts a module
        const moduleProgress = await prisma.academyModuleProgress.upsert({
          where: { userId_moduleId: { userId, moduleId } },
          update: {
            lastAccessedAt: new Date()
          },
          create: {
            userId,
            moduleId,
            progress: 0,
            completedLessons: 0,
            totalLessons: data?.totalLessons || 0,
            isCompleted: false,
            startedAt: new Date(),
            lastAccessedAt: new Date()
          }
        });

        return NextResponse.json({ 
          success: true, 
          progress: moduleProgress,
          message: 'Module started successfully'
        });

      case 'update_progress':
        // Update module progress
        const updatedProgress = await prisma.academyModuleProgress.update({
          where: { userId_moduleId: { userId, moduleId } },
          data: {
            progress: data?.progress,
            completedLessons: data?.completedLessons,
            isCompleted: data?.isCompleted,
            completedAt: data?.isCompleted ? new Date() : null,
            lastAccessedAt: new Date()
          }
        });

        return NextResponse.json({ 
          success: true, 
          progress: updatedProgress,
          message: 'Progress updated successfully'
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error updating Academy module progress:', error);
    return NextResponse.json(
      { error: 'Failed to update module progress' },
      { status: 500 }
    );
  }
}
