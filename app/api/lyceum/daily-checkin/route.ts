import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { lyceumAICoach } from '@/lib/lyceum-ai';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    let targetDate = new Date();
    if (date) {
      targetDate = new Date(date);
    }

    // Get check-in for the specified date
    const checkin = await prisma.lyceumDailyCheckin.findFirst({
      where: {
        userId: session.user.id,
        date: {
          gte: new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()),
          lt: new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() + 1)
        }
      }
    });

    // Get recent check-ins for streak calculation
    const recentCheckins = await prisma.lyceumDailyCheckin.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      orderBy: { date: 'desc' }
    });

    // Calculate streak
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < recentCheckins.length; i++) {
      const checkinDate = new Date(recentCheckins[i].date);
      checkinDate.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      
      if (checkinDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    return NextResponse.json({
      success: true,
      checkin,
      streak,
      recentCheckins: recentCheckins.slice(0, 7) // Last 7 days
    });

  } catch (error) {
    console.error('Error getting daily check-in:', error);
    return NextResponse.json(
      { error: 'Failed to get daily check-in' },
      { status: 500 }
    );
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
      telos, 
      reflection, 
      gratitude, 
      challenges, 
      insights, 
      mood, 
      energy, 
      focus,
      date 
    } = body;

    const checkinDate = date ? new Date(date) : new Date();
    checkinDate.setHours(0, 0, 0, 0);

    // Check if check-in already exists for this date
    const existingCheckin = await prisma.lyceumDailyCheckin.findFirst({
      where: {
        userId: session.user.id,
        date: {
          gte: checkinDate,
          lt: new Date(checkinDate.getTime() + 24 * 60 * 60 * 1000)
        }
      }
    });

    if (existingCheckin) {
      return NextResponse.json(
        { error: 'Check-in already exists for this date' },
        { status: 400 }
      );
    }

    // Get AI coaching based on the check-in
    const coaching = await lyceumAICoach.provideDailyCheckin(
      telos || 'general flourishing',
      recentCheckins.length
    );

    // Create the check-in
    const checkin = await prisma.lyceumDailyCheckin.create({
      data: {
        userId: session.user.id,
        date: checkinDate,
        telos: telos || 'general flourishing',
        reflection: reflection || '',
        gratitude: gratitude || '',
        challenges: challenges || '',
        insights: insights || '',
        mood: mood || 3,
        energy: energy || 3,
        focus: focus || 3,
        aiCoaching: coaching.suggestions || '',
        aiInsights: coaching.insights || ''
      }
    });

    return NextResponse.json({
      success: true,
      checkin
    });

  } catch (error) {
    console.error('Error creating daily check-in:', error);
    return NextResponse.json(
      { error: 'Failed to create daily check-in' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      id,
      telos, 
      reflection, 
      gratitude, 
      challenges, 
      insights, 
      mood, 
      energy, 
      focus
    } = body;

    // Update the check-in
    const checkin = await prisma.lyceumDailyCheckin.update({
      where: {
        id: id,
        userId: session.user.id
      },
      data: {
        telos: telos || 'general flourishing',
        reflection: reflection || '',
        gratitude: gratitude || '',
        challenges: challenges || '',
        insights: insights || '',
        mood: mood || 3,
        energy: energy || 3,
        focus: focus || 3
      }
    });

    return NextResponse.json({
      success: true,
      checkin
    });

  } catch (error) {
    console.error('Error updating daily check-in:', error);
    return NextResponse.json(
      { error: 'Failed to update daily check-in' },
      { status: 500 }
    );
  }
}
