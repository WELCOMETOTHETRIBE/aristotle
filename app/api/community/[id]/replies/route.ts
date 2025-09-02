import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const postId = params.id;

    // Check if post exists
    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Get all replies for this post
    const replies = await prisma.communityReply.findMany({
      where: { postId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Transform to client-facing shape
    const transformed = replies.map((r) => ({
      id: r.id,
      content: r.content,
      author: {
        name: r.isAI ? (r.philosopher || 'AI Philosopher') : (r.author.displayName || r.author.username || 'Member'),
        avatar: r.isAI ? '/avatars/ai.jpg' : '/avatars/user.jpg',
        isAI: !!r.isAI,
        persona: r.isAI ? r.philosopher : undefined,
      },
      likes: r.likes ?? 0,
      isLiked: false,
      createdAt: r.createdAt.toISOString(),
      parentId: r.parentId || undefined,
    }));

    return NextResponse.json({ replies: transformed });
  } catch (error) {
    console.error('Community replies GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch replies' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const postId = params.id;
    const body = await request.json();
    const { content, parentId } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Check if post exists
    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // If parentId is provided, check if parent reply exists
    if (parentId) {
      const parentReply = await prisma.communityReply.findUnique({
        where: { id: parentId },
      });

      if (!parentReply) {
        return NextResponse.json(
          { error: 'Parent reply not found' },
          { status: 404 }
        );
      }
    }

    const reply = await prisma.communityReply.create({
      data: {
        content,
        authorId: payload.userId,
        postId,
        parentId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
      },
    });

    // Transform to client-facing shape
    const transformed = {
      id: reply.id,
      content: reply.content,
      author: {
        name: reply.author.displayName || reply.author.username || 'Member',
        avatar: '/avatars/user.jpg',
        isAI: false,
      },
      likes: reply.likes ?? 0,
      isLiked: false,
      createdAt: reply.createdAt.toISOString(),
      parentId: reply.parentId || undefined,
    };

    return NextResponse.json(transformed, { status: 201 });
  } catch (error) {
    console.error('Community reply error:', error);
    return NextResponse.json(
      { error: 'Failed to create reply' },
      { status: 500 }
    );
  }
} 