import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const pathId = searchParams.get('pathId');
    const lessonId = searchParams.get('lessonId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause
    const where: any = {};
    if (pathId) where.pathId = pathId;
    if (lessonId) where.lessonId = lessonId;

    // Get community posts
    const posts = await prisma.lyceumAgoraPost.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });

    // Get total count
    const totalCount = await prisma.lyceumAgoraPost.count({ where });

    return NextResponse.json({
      success: true,
      posts,
      totalCount,
      hasMore: offset + limit < totalCount
    });

  } catch (error) {
    console.error('Error getting Agora posts:', error);
    return NextResponse.json(
      { error: 'Failed to get Agora posts' },
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
      pathId, 
      lessonId, 
      title, 
      content, 
      type, 
      tags,
      isAnonymous 
    } = body;

    // Create the post
    const post = await prisma.lyceumAgoraPost.create({
      data: {
        userId: session.user.id,
        pathId: pathId || null,
        lessonId: lessonId || null,
        title: title || 'Untitled',
        content,
        type: type || 'reflection',
        tags: tags || [],
        isAnonymous: isAnonymous || false
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      post
    });

  } catch (error) {
    console.error('Error creating Agora post:', error);
    return NextResponse.json(
      { error: 'Failed to create Agora post' },
      { status: 500 }
    );
  }
}
