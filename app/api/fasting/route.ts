import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { FastingSessionSchema, FastingBenefitSchema, FastingEndSessionSchema } from '@/lib/validators';
import { getOrCreateUser } from '@/lib/db';
import { prisma } from '@/lib/db';
import { calculateFastingDuration, getFastingStage } from '@/lib/fasting';

export async function GET(request: NextRequest) {
  try {
    const user = await getOrCreateUser('Demo User');
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    const where: any = { userId: user.id };
    if (activeOnly) {
      where.status = 'active';
    }

    const sessions = await prisma.fastingSession.findMany({
      where,
      orderBy: { startTime: 'desc' },
      include: {
        fastingBenefits: {
          orderBy: { recordedAt: 'desc' }
        }
      }
    });

    return NextResponse.json({ sessions });
  } catch (error: any) {
    console.error('Fasting sessions GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getOrCreateUser('Demo User');
    const body = await request.json();
    const validatedData = FastingSessionSchema.parse(body);

    // Check if user already has an active session
    const activeSession = await prisma.fastingSession.findFirst({
      where: { userId: user.id, status: 'active' }
    });

    if (activeSession) {
      return NextResponse.json(
        { error: 'You already have an active fasting session' },
        { status: 400 }
      );
    }

    const session = await prisma.fastingSession.create({
      data: {
        userId: user.id,
        startTime: new Date(validatedData.startTime),
        endTime: validatedData.endTime ? new Date(validatedData.endTime) : null,
        type: validatedData.type,
        notes: validatedData.notes,
        status: validatedData.endTime ? 'completed' : 'active'
      }
    });

    return NextResponse.json({ session });
  } catch (error: any) {
    console.error('Fasting session POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getOrCreateUser('Demo User');
    const body = await request.json();
    const validatedData = FastingEndSessionSchema.parse(body);

    const session = await prisma.fastingSession.findFirst({
      where: { id: validatedData.fastingSessionId, userId: user.id }
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const endTime = new Date(validatedData.endTime);
    const duration = calculateFastingDuration(new Date(session.startTime), endTime);

    const updatedSession = await prisma.fastingSession.update({
      where: { id: validatedData.fastingSessionId },
      data: {
        endTime,
        duration: duration.totalMinutes,
        status: 'completed',
        notes: validatedData.notes
      }
    });

    return NextResponse.json({ session: updatedSession });
  } catch (error: any) {
    console.error('Fasting session PATCH error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 