import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { TaskSchema } from '@/lib/validators';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/db';

// Helper function to get user ID from request
async function getUserIdFromRequest(request: NextRequest): Promise<number | null> {
  let userId: number | null = null;
  
  // Try Bearer token first
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    const payload = await verifyToken(token);
    if (payload) {
      userId = payload.userId;
    }
  }
  
  // If no Bearer token, try cookie-based auth
  if (!userId) {
    try {
      const cookieHeader = request.headers.get('cookie');
      if (cookieHeader) {
        const response = await fetch(`${request.nextUrl.origin}/api/auth/me`, {
          headers: { cookie: cookieHeader }
        });
        
        if (response.ok) {
          const authData = await response.json();
          if (authData.user && authData.user.id) {
            userId = authData.user.id;
          }
        }
      }
    } catch (error) {
      console.error('Cookie auth check failed:', error);
    }
  }
  
  return userId;
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    
    // Require authentication
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const completed = searchParams.get('completed');
    
    const where: any = { userId: userId };
    if (completed !== null) {
      where.completedAt = completed === 'true' ? { not: null } : null;
    }
    
    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Get count of pending tasks (not completed)
    const pendingCount = await prisma.task.count({
      where: {
        userId: userId,
        completedAt: null
      }
    });

    return NextResponse.json({
      tasks,
      pendingCount,
      totalCount: tasks.length
    });
  } catch (error) {
    console.error('Tasks GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const taskData = TaskSchema.parse(body);
    
    const userId = await getUserIdFromRequest(request);
    
    // Require authentication
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    const task = await prisma.task.create({
      data: {
        userId: userId,
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueAt ? new Date(taskData.dueAt) : null,
        tag: taskData.tag,
        priority: taskData.priority,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Tasks POST error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid task data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, completed } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }
    
    const userId = await getUserIdFromRequest(request);
    
    // Require authentication
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    const task = await prisma.task.update({
      where: { 
        id,
        userId: userId, // Ensure user owns the task
      },
      data: {
        completedAt: completed ? new Date() : null,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Tasks PATCH error:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
} 