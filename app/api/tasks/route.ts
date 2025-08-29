import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { TaskSchema } from '@/lib/validators';
import { getOrCreateUser } from '@/lib/db';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const user = await getOrCreateUser('User');
    const { searchParams } = new URL(request.url);
    const completed = searchParams.get('completed');
    
    const where: any = { userId: user.id };
    if (completed !== null) {
      where.completedAt = completed === 'true' ? { not: null } : null;
    }
    
    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' }, // Now this field exists
    });

    return NextResponse.json(tasks);
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
    
    const user = await getOrCreateUser('User');
    
    const task = await prisma.task.create({
      data: {
        userId: user.id,
        title: taskData.title,
        description: taskData.description,
        dueAt: taskData.dueAt ? new Date(taskData.dueAt) : null,
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
    
    const user = await getOrCreateUser('User');
    
    const task = await prisma.task.update({
      where: { 
        id,
        userId: user.id, // Ensure user owns the task
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