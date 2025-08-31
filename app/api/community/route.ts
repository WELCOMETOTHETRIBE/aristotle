import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    level: string;
  };
  type: 'ai_question' | 'member_discussion' | 'resource_share';
  category: string;
  tags: string[];
  replies: number;
  views: number;
  likes: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
  lastActivity: string;
  isPinned?: boolean;
  isAIQuestion?: boolean;
  aiInsights?: string[];
}

interface Reply {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    level: string;
  };
  likes: number;
  isLiked: boolean;
  createdAt: string;
  parentId?: string;
}

interface Notification {
  id: string;
  type: 'new_reply' | 'new_question' | 'like' | 'mention';
  title: string;
  message: string;
  postId?: string;
  isRead: boolean;
  createdAt: string;
}

// Community forum data
const mockPosts: ForumPost[] = [
  {
    id: '1',
    title: 'How do you apply Stoic principles when facing workplace adversity?',
    content: 'The AI Academy invites you to reflect on how ancient Stoic wisdom can guide us through modern workplace challenges. Share your experiences and learn from others who have navigated similar situations.',
    author: {
      name: 'AI Academy',
      avatar: '/ai-academy-avatar.png',
      level: 'AI Guide'
    },
    type: 'ai_question',
    category: 'Stoicism',
    tags: ['Workplace', 'Adversity', 'Stoic Principles'],
    replies: 23,
    views: 156,
    likes: 45,
    isLiked: false,
    isBookmarked: false,
    createdAt: '2024-01-15T10:00:00Z',
    lastActivity: '2024-01-15T14:30:00Z',
    isPinned: true,
    isAIQuestion: true,
    aiInsights: [
      'Focus on what you can control',
      'Practice negative visualization',
      'Maintain perspective on challenges'
    ]
  },
  {
    id: '2',
    title: 'What does Aristotle\'s concept of "eudaimonia" mean in your daily life?',
    content: 'Eudaimonia, often translated as "flourishing" or "human flourishing," is central to Aristotle\'s ethics. How do you understand and pursue this concept in your modern life?',
    author: {
      name: 'AI Academy',
      avatar: '/ai-academy-avatar.png',
      level: 'AI Guide'
    },
    type: 'ai_question',
    category: 'Aristotelian Ethics',
    tags: ['Eudaimonia', 'Flourishing', 'Purpose'],
    replies: 18,
    views: 89,
    likes: 32,
    isLiked: true,
    isBookmarked: true,
    createdAt: '2024-01-14T09:00:00Z',
    lastActivity: '2024-01-15T12:15:00Z',
    isAIQuestion: true,
    aiInsights: [
      'Cultivate virtues consistently',
      'Find balance in all activities',
      'Develop meaningful relationships'
    ]
  }
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'new_reply',
    title: 'New reply to your comment',
    message: 'Sarah M. replied to your comment on "How do you apply Stoic principles when facing workplace adversity?"',
    postId: '1',
    isRead: false,
    createdAt: '2024-01-15T14:30:00Z'
  },
  {
    id: '2',
    type: 'new_question',
    title: 'New AI Academy Question',
    message: 'The AI Academy has posted a new question: "What does Aristotle\'s concept of eudaimonia mean in your daily life?"',
    postId: '2',
    isRead: false,
    createdAt: '2024-01-14T09:00:00Z'
  }
];

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

    let filteredPosts = mockPosts;

    // Filter by type
    if (type === 'ai_questions') {
      filteredPosts = filteredPosts.filter(post => post.isAIQuestion);
    } else if (type === 'discussions') {
      filteredPosts = filteredPosts.filter(post => post.type === 'member_discussion');
    } else if (type === 'resources') {
      filteredPosts = filteredPosts.filter(post => post.type === 'resource_share');
    }

    // Filter by category
    if (category && category !== 'all') {
      filteredPosts = filteredPosts.filter(post => post.category === category);
    }

    // Filter by search
    if (search) {
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.content.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json({
      posts: filteredPosts,
      total: filteredPosts.length
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

        const newPost: ForumPost = {
          id: Date.now().toString(),
          title,
          content,
          author: {
            name: 'Current User',
            avatar: '/avatars/default.jpg',
            level: 'Member'
          },
          type: type || 'member_discussion',
          category,
          tags: tags || [],
          replies: 0,
          views: 0,
          likes: 0,
          isLiked: false,
          isBookmarked: false,
          createdAt: new Date().toISOString(),
          lastActivity: new Date().toISOString()
        };

        mockPosts.unshift(newPost);

        return NextResponse.json({
          success: true,
          post: newPost,
          message: 'Post created successfully'
        });

      case 'like_post':
        if (!postId) {
          return NextResponse.json(
            { error: 'Post ID is required' },
            { status: 400 }
          );
        }

        const post = mockPosts.find(p => p.id === postId);
        if (!post) {
          return NextResponse.json(
            { error: 'Post not found' },
            { status: 404 }
          );
        }

        // Toggle like
        post.isLiked = !post.isLiked;
        post.likes += post.isLiked ? 1 : -1;

        return NextResponse.json({
          success: true,
          post,
          message: post.isLiked ? 'Post liked' : 'Post unliked'
        });

      case 'bookmark_post':
        if (!postId) {
          return NextResponse.json(
            { error: 'Post ID is required' },
            { status: 400 }
          );
        }

        const bookmarkPost = mockPosts.find(p => p.id === postId);
        if (!bookmarkPost) {
          return NextResponse.json(
            { error: 'Post not found' },
            { status: 404 }
          );
        }

        // Toggle bookmark
        bookmarkPost.isBookmarked = !bookmarkPost.isBookmarked;

        return NextResponse.json({
          success: true,
          post: bookmarkPost,
          message: bookmarkPost.isBookmarked ? 'Post bookmarked' : 'Post unbookmarked'
        });

      case 'mark_notification_read':
        const { notificationId } = body;
        if (!notificationId) {
          return NextResponse.json(
            { error: 'Notification ID is required' },
            { status: 400 }
          );
        }

        const notification = mockNotifications.find(n => n.id === notificationId);
        if (notification) {
          notification.isRead = true;
        }

        return NextResponse.json({
          success: true,
          message: 'Notification marked as read'
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