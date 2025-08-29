import { NextRequest, NextResponse } from 'next/server';
import { FastingBenefitSchema } from '@/lib/validators';
import { getOrCreateUser } from '@/lib/db';
import { prisma } from '@/lib/db';
import { analyzeFastingBenefits } from '@/lib/fasting';

export async function GET(request: NextRequest) {
  try {
    const user = await getOrCreateUser('User');
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    const where: any = { userId: user.id };
    if (sessionId) {
      where.fastingSessionId = sessionId;
    }

    const benefits = await prisma.fastingBenefit.findMany({
      where,
      orderBy: { recordedAt: 'desc' },
      include: {
        fastingSession: true
      }
    });

    const analysis = analyzeFastingBenefits(benefits.map((b: any) => ({
      ...b,
      benefitType: b.benefitType as any
    })));

    return NextResponse.json({ benefits, analysis });
  } catch (error: any) {
    console.error('Fasting benefits GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getOrCreateUser('User');
    const body = await request.json();
    const validatedData = FastingBenefitSchema.parse(body);

    // Verify the fasting session belongs to the user
    const session = await prisma.fastingSession.findFirst({
      where: { id: validatedData.fastingSessionId, userId: user.id }
    });

    if (!session) {
      return NextResponse.json({ error: 'Fasting session not found' }, { status: 404 });
    }

    const benefit = await prisma.fastingBenefit.create({
      data: {
        userId: user.id,
        fastingSessionId: validatedData.fastingSessionId,
        benefitType: validatedData.benefitType,
        intensity: validatedData.intensity,
        notes: validatedData.notes
      }
    });

    return NextResponse.json({ benefit });
  } catch (error: any) {
    console.error('Fasting benefit POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 