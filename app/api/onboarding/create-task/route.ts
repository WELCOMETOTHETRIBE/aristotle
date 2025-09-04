import { NextRequest, NextResponse } from 'next/server';
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

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    
    // Require authentication
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Check if onboarding task already exists
    const existingTask = await prisma.task.findFirst({
      where: {
        userId: userId,
        tag: 'onboarding'
      }
    });

    if (existingTask) {
      return NextResponse.json({ 
        success: true, 
        message: 'Onboarding task already exists',
        task: existingTask
      });
    }

    // Create onboarding task
    const onboardingTask = await prisma.task.create({
      data: {
        userId: userId,
        title: 'Complete Onboarding',
        description: 'Set up your profile, choose your framework, and get started with Aristotle',
        tag: 'onboarding',
        priority: 'H', // High priority
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Onboarding task created successfully',
      task: onboardingTask
    });

  } catch (error) {
    console.error('Error creating onboarding task:', error);
    return NextResponse.json(
      { error: 'Failed to create onboarding task' },
      { status: 500 }
    );
  }
} 