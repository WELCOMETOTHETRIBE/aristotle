import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getOrCreateUser } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { automationId, userId } = body;

    if (!automationId) {
      return NextResponse.json(
        { error: 'Automation ID is required' },
        { status: 400 }
      );
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
    const user = await getOrCreateUser('Demo User');
    if (automation.userId !== user.id) {
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
        userId: user.id,
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