import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    // Check if user already liked the post
    const existingLike = await prisma.communityLike.findUnique({
      where: {
        userId_postId: {
          userId: payload.userId,
          postId,
        },
      },
    });

    if (existingLike) {
      // Unlike the post
      await prisma.communityLike.delete({
        where: {
          userId_postId: {
            userId: payload.userId,
            postId,
          },
        },
      });

      return NextResponse.json({
        success: true,
        liked: false,
        message: 'Post unliked',
      });
    } else {
      // Like the post
      await prisma.communityLike.create({
        data: {
          userId: payload.userId,
          postId,
        },
      });

      return NextResponse.json({
        success: true,
        liked: true,
        message: 'Post liked',
      });
    }
  } catch (error) {
    console.error('Community like error:', error);
    return NextResponse.json(
      { error: 'Failed to process like' },
      { status: 500 }
    );
  }
} 