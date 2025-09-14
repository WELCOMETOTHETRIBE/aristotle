import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/lyceum-auth';
import { prisma } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const postId = params.id;

    // Check if post exists
    const post = await prisma.lyceumAgoraPost.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Check if user already liked the post
    const existingLike = await prisma.lyceumAgoraLike.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId: postId
        }
      }
    });

    if (existingLike) {
      // Unlike the post
      await prisma.lyceumAgoraLike.delete({
        where: {
          userId_postId: {
            userId: user.id,
            postId: postId
          }
        }
      });

      return NextResponse.json({
        success: true,
        liked: false,
        message: 'Post unliked'
      });
    } else {
      // Like the post
      await prisma.lyceumAgoraLike.create({
        data: {
          userId: user.id,
          postId: postId
        }
      });

      return NextResponse.json({
        success: true,
        liked: true,
        message: 'Post liked'
      });
    }

  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}
