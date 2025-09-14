import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/lyceum-auth';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const postId = params.id;

    // Get the post with comments
    const post = await prisma.lyceumAgoraPost.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      post
    });

  } catch (error) {
    console.error('Error getting Agora post:', error);
    return NextResponse.json(
      { error: 'Failed to get Agora post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const postId = params.id;
    const body = await request.json();
    const { title, content, tags, isAnonymous } = body;

    // Check if user owns the post
    const existingPost = await prisma.lyceumAgoraPost.findUnique({
      where: { id: postId }
    });

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (existingPost.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update the post
    const post = await prisma.lyceumAgoraPost.update({
      where: { id: postId },
      data: {
        title: title || existingPost.title,
        content: content || existingPost.content,
        tags: tags || existingPost.tags,
        isAnonymous: isAnonymous !== undefined ? isAnonymous : existingPost.isAnonymous
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
    console.error('Error updating Agora post:', error);
    return NextResponse.json(
      { error: 'Failed to update Agora post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const postId = params.id;

    // Check if user owns the post
    const existingPost = await prisma.lyceumAgoraPost.findUnique({
      where: { id: postId }
    });

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (existingPost.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete the post
    await prisma.lyceumAgoraPost.delete({
      where: { id: postId }
    });

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting Agora post:', error);
    return NextResponse.json(
      { error: 'Failed to delete Agora post' },
      { status: 500 }
    );
  }
}
