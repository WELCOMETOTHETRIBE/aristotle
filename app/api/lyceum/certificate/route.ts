import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { LyceumCertificate } from '@/lib/lyceum-certificate';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user progress
    const userProgress = await prisma.lyceumUserProgress.findUnique({
      where: { userId: session.user.id },
      include: {
        lyceumPathProgress: true,
        lyceumActivityResponses: true,
        lyceumEvaluations: true
      }
    });

    if (!userProgress) {
      return NextResponse.json({ error: 'No progress found' }, { status: 404 });
    }

    // Check eligibility
    const { eligible, requirements } = LyceumCertificate.checkEligibility(
      userProgress,
      userProgress.lyceumPathProgress,
      [...userProgress.lyceumActivityResponses, ...userProgress.lyceumEvaluations]
    );

    // Get progress data
    const progress = LyceumCertificate.getCertificateProgress(
      userProgress,
      userProgress.lyceumPathProgress,
      [...userProgress.lyceumActivityResponses, ...userProgress.lyceumEvaluations]
    );

    return NextResponse.json({
      success: true,
      eligible,
      requirements,
      progress
    });

  } catch (error) {
    console.error('Error checking certificate eligibility:', error);
    return NextResponse.json(
      { error: 'Failed to check certificate eligibility' },
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

    // Get user progress
    const userProgress = await prisma.lyceumUserProgress.findUnique({
      where: { userId: session.user.id },
      include: {
        lyceumPathProgress: true,
        lyceumActivityResponses: true,
        lyceumEvaluations: true
      }
    });

    if (!userProgress) {
      return NextResponse.json({ error: 'No progress found' }, { status: 404 });
    }

    // Get user name
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get Lyceum data
    const lyceumData = await import('@/lib/lyceum-data').then(m => m.lyceumData);

    // Generate certificate
    const certificateData = LyceumCertificate.generateCertificate(
      userProgress,
      userProgress.lyceumPathProgress,
      [...userProgress.lyceumActivityResponses, ...userProgress.lyceumEvaluations],
      user.name || 'Anonymous',
      lyceumData
    );

    // Store certificate in database
    await prisma.lyceumCertificate.create({
      data: {
        userId: session.user.id,
        certificateId: certificateData.certificateId,
        verificationCode: certificateData.verificationCode,
        completionDate: certificateData.completionDate,
        overallMastery: certificateData.overallMastery,
        masteryBreakdown: certificateData.masteryBreakdown,
        pathCompletions: certificateData.pathCompletions,
        totalArtifacts: certificateData.totalArtifacts,
        certificateData: LyceumCertificate.formatCertificateData(certificateData)
      }
    });

    return NextResponse.json({
      success: true,
      certificate: certificateData
    });

  } catch (error) {
    console.error('Error generating certificate:', error);
    return NextResponse.json(
      { error: 'Failed to generate certificate' },
      { status: 500 }
    );
  }
}
