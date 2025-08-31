import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Build where clause
    const where: any = {};
    
    if (type === 'ai_questions') {
      where.isAIQuestion = true;
    } else if (type === 'discussions') {
      where.type = 'member_discussion';
    } else if (type === 'resources') {
      where.type = 'resource_share';
    }

    if (category && category !== 'all') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Fetch posts with author info and counts
    const posts = await prisma.communityPost.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true
          }
        },
        _count: {
          select: {
            replies: true,
            likes: true
          }
        }
      },
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    // Get user's likes and bookmarks for these posts
    const userLikes = await prisma.communityLike.findMany({
      where: {
        userId: payload.userId,
        postId: { in: posts.map(p => p.id) }
      }
    });

    const userBookmarks = await prisma.communityBookmark.findMany({
      where: {
        userId: payload.userId,
        postId: { in: posts.map(p => p.id) }
      }
    });

    // Transform posts to include like/bookmark status and format data
    const formattedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      author: {
        name: post.author.displayName || post.author.username,
        avatar: `/avatars/${post.author.username}.jpg`,
        level: 'Member' // You can add a level field to User model later
      },
      type: post.type,
      category: post.category,
      tags: post.tags,
      replies: post._count.replies,
      views: post.views,
      likes: post._count.likes,
      isLiked: userLikes.some(like => like.postId === post.id),
      isBookmarked: userBookmarks.some(bookmark => bookmark.postId === post.id),
      createdAt: post.createdAt.toISOString(),
      lastActivity: post.updatedAt.toISOString(),
      isPinned: post.isPinned,
      isAIQuestion: post.isAIQuestion,
      aiInsights: post.aiInsights
    }));

    return NextResponse.json({
      posts: formattedPosts,
      total: formattedPosts.length
    });

  } catch (error) {
    console.error('Error fetching community posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch community posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, postId, content, title, category, tags, type } = body;

    switch (action) {
      case 'create_post':
        if (!title || !content || !category) {
          return NextResponse.json(
            { error: 'Title, content, and category are required' },
            { status: 400 }
          );
        }

        const newPost = await prisma.communityPost.create({
          data: {
            title,
            content,
            authorId: payload.userId,
            type: type || 'member_discussion',
            category,
            tags: tags || [],
            isAIQuestion: type === 'ai_question'
          },
          include: {
            author: {
              select: {
                id: true,
                username: true,
                displayName: true
              }
            },
            _count: {
              select: {
                replies: true,
                likes: true
              }
            }
          }
        });

        const formattedNewPost = {
          id: newPost.id,
          title: newPost.title,
          content: newPost.content,
          author: {
            name: newPost.author.displayName || newPost.author.username,
            avatar: `/avatars/${newPost.author.username}.jpg`,
            level: 'Member'
          },
          type: newPost.type,
          category: newPost.category,
          tags: newPost.tags,
          replies: newPost._count.replies,
          views: newPost.views,
          likes: newPost._count.likes,
          isLiked: false,
          isBookmarked: false,
          createdAt: newPost.createdAt.toISOString(),
          lastActivity: newPost.updatedAt.toISOString(),
          isPinned: newPost.isPinned,
          isAIQuestion: newPost.isAIQuestion,
          aiInsights: newPost.aiInsights
        };

        return NextResponse.json({
          success: true,
          post: formattedNewPost,
          message: 'Post created successfully'
        });

      case 'like_post':
        if (!postId) {
          return NextResponse.json(
            { error: 'Post ID is required' },
            { status: 400 }
          );
        }

        // Check if user already liked the post
        const existingLike = await prisma.communityLike.findUnique({
          where: {
            userId_postId: {
              userId: payload.userId,
              postId
            }
          }
        });

        if (existingLike) {
          // Unlike the post
          await prisma.communityLike.delete({
            where: {
              userId_postId: {
                userId: payload.userId,
                postId
              }
            }
          });
        } else {
          // Like the post
          await prisma.communityLike.create({
            data: {
              userId: payload.userId,
              postId
            }
          });
        }

        // Get updated post with new like count
        const updatedPost = await prisma.communityPost.findUnique({
          where: { id: postId },
          include: {
            author: {
              select: {
                id: true,
                username: true,
                displayName: true
              }
            },
            _count: {
              select: {
                replies: true,
                likes: true
              }
            }
          }
        });

        if (!updatedPost) {
          return NextResponse.json(
            { error: 'Post not found' },
            { status: 404 }
          );
        }

        const formattedUpdatedPost = {
          id: updatedPost.id,
          title: updatedPost.title,
          content: updatedPost.content,
          author: {
            name: updatedPost.author.displayName || updatedPost.author.username,
            avatar: `/avatars/${updatedPost.author.username}.jpg`,
            level: 'Member'
          },
          type: updatedPost.type,
          category: updatedPost.category,
          tags: updatedPost.tags,
          replies: updatedPost._count.replies,
          views: updatedPost.views,
          likes: updatedPost._count.likes,
          isLiked: !existingLike, // Toggle based on whether we just liked or unliked
          isBookmarked: false, // You'd need to check this separately
          createdAt: updatedPost.createdAt.toISOString(),
          lastActivity: updatedPost.updatedAt.toISOString(),
          isPinned: updatedPost.isPinned,
          isAIQuestion: updatedPost.isAIQuestion,
          aiInsights: updatedPost.aiInsights
        };

        return NextResponse.json({
          success: true,
          post: formattedUpdatedPost,
          message: existingLike ? 'Post unliked' : 'Post liked'
        });

      case 'bookmark_post':
        if (!postId) {
          return NextResponse.json(
            { error: 'Post ID is required' },
            { status: 400 }
          );
        }

        // Check if user already bookmarked the post
        const existingBookmark = await prisma.communityBookmark.findUnique({
          where: {
            userId_postId: {
              userId: payload.userId,
              postId
            }
          }
        });

        if (existingBookmark) {
          // Remove bookmark
          await prisma.communityBookmark.delete({
            where: {
              userId_postId: {
                userId: payload.userId,
                postId
              }
            }
          });
        } else {
          // Add bookmark
          await prisma.communityBookmark.create({
            data: {
              userId: payload.userId,
              postId
            }
          });
        }

        // Get updated post
        const bookmarkUpdatedPost = await prisma.communityPost.findUnique({
          where: { id: postId },
          include: {
            author: {
              select: {
                id: true,
                username: true,
                displayName: true
              }
            },
            _count: {
              select: {
                replies: true,
                likes: true
              }
            }
          }
        });

        if (!bookmarkUpdatedPost) {
          return NextResponse.json(
            { error: 'Post not found' },
            { status: 404 }
          );
        }

        const formattedBookmarkPost = {
          id: bookmarkUpdatedPost.id,
          title: bookmarkUpdatedPost.title,
          content: bookmarkUpdatedPost.content,
          author: {
            name: bookmarkUpdatedPost.author.displayName || bookmarkUpdatedPost.author.username,
            avatar: `/avatars/${bookmarkUpdatedPost.author.username}.jpg`,
            level: 'Member'
          },
          type: bookmarkUpdatedPost.type,
          category: bookmarkUpdatedPost.category,
          tags: bookmarkUpdatedPost.tags,
          replies: bookmarkUpdatedPost._count.replies,
          views: bookmarkUpdatedPost.views,
          likes: bookmarkUpdatedPost._count.likes,
          isLiked: false, // You'd need to check this separately
          isBookmarked: !existingBookmark, // Toggle based on whether we just bookmarked or unbookmarked
          createdAt: bookmarkUpdatedPost.createdAt.toISOString(),
          lastActivity: bookmarkUpdatedPost.updatedAt.toISOString(),
          isPinned: bookmarkUpdatedPost.isPinned,
          isAIQuestion: bookmarkUpdatedPost.isAIQuestion,
          aiInsights: bookmarkUpdatedPost.aiInsights
        };

        return NextResponse.json({
          success: true,
          post: formattedBookmarkPost,
          message: existingBookmark ? 'Post unbookmarked' : 'Post bookmarked'
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error processing community action:', error);
    return NextResponse.json(
      { error: 'Failed to process community action' },
      { status: 500 }
    );
  }
} 