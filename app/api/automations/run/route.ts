import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

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
    const body = await request.json();
    const { automationId, userId: bodyUserId } = body;

    if (!automationId) {
      return NextResponse.json(
        { error: 'Automation ID is required' },
        { status: 400 }
      );
    }

    // Get user ID from authentication
    const userId = await getUserIdFromRequest(request);
    
    // Require authentication
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get the automation
    const automation = await prisma.automation.findUnique({
      where: { id: automationId },
    });

    if (!automation) {
      return NextResponse.json(
        { error: 'Automation not found' },
        { status: 404 }
      );
    }

    // Verify user owns the automation
    if (automation.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Execute the automation based on type
    let result;
    switch (automation.type) {
      case 'reminder':
        result = await handleReminder(automation);
        break;
      case 'habit_checkin':
        result = await handleHabitCheckin(automation);
        break;
      case 'goal_review':
        result = await handleGoalReview(automation);
        break;
      case 'breathwork_reminder':
        result = await handleBreathworkReminder(automation);
        break;
      default:
        return NextResponse.json(
          { error: 'Unknown automation type' },
          { status: 400 }
        );
    }

    // Log the automation run
    await prisma.skillRunLog.create({
      data: {
        userId: userId,
        skillKey: `automation.${automation.type}`,
        inputJson: JSON.stringify({ automationId, config: automation.config }),
        outputJson: JSON.stringify(result),
        status: 'success',
      },
    });

    return NextResponse.json({
      success: true,
      result,
      message: `Automation ${automation.type} executed successfully`,
    });

  } catch (error) {
    console.error('Automation run error:', error);
    return NextResponse.json(
      { error: 'Failed to run automation' },
      { status: 500 }
    );
  }
}

async function handleReminder(automation: any) {
  // In a real implementation, this would send a notification
  // For now, we'll just return a success message
  return {
    type: 'reminder',
    message: automation.config?.message || 'Reminder triggered',
    sent: true,
  };
}

async function handleHabitCheckin(automation: any) {
  // Find habits that need check-in
  const habits = await prisma.habit.findMany({
    where: {
      userId: automation.userId,
      frequency: automation.config?.frequency || 'daily',
    },
  });

  const checkinResults: Array<{
    habitId: string;
    habitName: string;
    success: boolean;
    error?: string;
  }> = [];
  
  for (const habit of habits) {
    try {
      // Call the habit checkin skill
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/skills/invoke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skill: 'habit.checkin',
          args: { habitId: habit.id },
        }),
      });

      if (response.ok) {
        checkinResults.push({
          habitId: habit.id,
          habitName: habit.name,
          success: true,
        });
      }
    } catch (error: any) {
      checkinResults.push({
        habitId: habit.id,
        habitName: habit.name,
        success: false,
        error: error.message,
      });
    }
  }

  return {
    type: 'habit_checkin',
    habitsChecked: checkinResults.length,
    results: checkinResults,
  };
}

async function handleGoalReview(automation: any) {
  // Find goals that need review
  const goals = await prisma.goal.findMany({
    where: {
      userId: automation.userId,
      status: 'active',
    },
  });

  return {
    type: 'goal_review',
    goalsFound: goals.length,
    goals: goals.map(goal => ({
      id: goal.id,
      title: goal.title,
      category: goal.category,
      status: goal.status,
    })),
  };
}

async function handleBreathworkReminder(automation: any) {
  // In a real implementation, this would send a breathwork reminder
  // and potentially start a breathwork session
  return {
    type: 'breathwork_reminder',
    message: 'Time for your daily breathwork practice',
    pattern: automation.config?.pattern || 'Box Breathing',
    cycles: automation.config?.cycles || 5,
  };
} 