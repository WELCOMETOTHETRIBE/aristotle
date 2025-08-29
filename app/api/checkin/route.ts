import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { grantVirtues } from '@/lib/virtue';
import { getFrameworkBySlug } from '@/lib/frameworks.config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { widgetId, frameworkSlug, questId, payload, virtues } = body;

    // Validate required fields
    if (!widgetId || !frameworkSlug || !payload) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get framework config to find widget
    const frameworkConfig = getFrameworkBySlug(frameworkSlug);
    if (!frameworkConfig) {
      return NextResponse.json(
        { error: 'Framework not found' },
        { status: 404 }
      );
    }

    // Find the widget in the framework config
    const widget = frameworkConfig.widgets.find(w => w.id === widgetId);
    if (!widget) {
      return NextResponse.json(
        { error: 'Widget not found' },
        { status: 404 }
      );
    }

    // For now, use a mock user ID (in real app, get from auth)
    const userId = 'user-1';

    // Create checkin record
    const checkin = await prisma.checkin.create({
      data: {
        userId,
        questId,
        widgetId,
        frameworkSlug,
        payload,
        virtues: widget.virtueGrantPerCompletion
      }
    });

    // Create KPI readings if needed
    if (payload.value !== undefined) {
      await prisma.kPIReading.create({
        data: {
          widgetId,
          userId,
          metric: 'completion',
          value: payload.value,
          unit: payload.unit || 'count'
        }
      });
    }

    // Calculate total virtue XP granted
    const totalVirtues = grantVirtues(
      { widgetId, frameworkSlug, payload, virtues: widget.virtueGrantPerCompletion },
      widget.virtueGrantPerCompletion
    );

    return NextResponse.json({
      success: true,
      checkin: {
        id: checkin.id,
        widgetId: checkin.widgetId,
        frameworkSlug: checkin.frameworkSlug,
        virtues: totalVirtues,
        createdAt: checkin.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating checkin:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const frameworkSlug = searchParams.get('frameworkSlug');
    const userId = 'user-1'; // Mock user ID

    const where: any = { userId };
    if (frameworkSlug) {
      where.frameworkSlug = frameworkSlug;
    }

    const checkins = await prisma.checkin.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return NextResponse.json({ checkins });

  } catch (error) {
    console.error('Error fetching checkins:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 