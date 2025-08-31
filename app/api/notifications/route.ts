import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

interface Notification {
  id: string;
  type: 'new_reply' | 'new_question' | 'like' | 'mention';
  title: string;
  message: string;
  postId?: string;
  isRead: boolean;
  createdAt: string;
}

// Notifications data
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
  },
  {
    id: '3',
    type: 'like',
    title: 'Someone liked your post',
    message: 'Michael R. liked your discussion about morning meditation',
    postId: '4',
    isRead: true,
    createdAt: '2024-01-15T12:15:00Z'
  },
  {
    id: '4',
    type: 'mention',
    title: 'You were mentioned in a post',
    message: 'Emma L. mentioned you in their post about justice in relationships',
    postId: '5',
    isRead: false,
    createdAt: '2024-01-15T10:45:00Z'
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
    const unreadOnly = searchParams.get('unread') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');

    let filteredNotifications = mockNotifications;

    // Filter by unread status
    if (unreadOnly) {
      filteredNotifications = filteredNotifications.filter(notification => !notification.isRead);
    }

    // Apply limit
    filteredNotifications = filteredNotifications.slice(0, limit);

    // Count unread notifications
    const unreadCount = mockNotifications.filter(notification => !notification.isRead).length;

    return NextResponse.json({
      notifications: filteredNotifications,
      unreadCount,
      total: mockNotifications.length
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
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
    const { action, notificationId } = body;

    switch (action) {
      case 'mark_read':
        if (!notificationId) {
          return NextResponse.json(
            { error: 'Notification ID is required' },
            { status: 400 }
          );
        }

        const notification = mockNotifications.find(n => n.id === notificationId);
        if (!notification) {
          return NextResponse.json(
            { error: 'Notification not found' },
            { status: 404 }
          );
        }

        notification.isRead = true;

        return NextResponse.json({
          success: true,
          notification,
          message: 'Notification marked as read'
        });

      case 'mark_all_read':
        mockNotifications.forEach(n => n.isRead = true);

        return NextResponse.json({
          success: true,
          message: 'All notifications marked as read'
        });

      case 'delete':
        if (!notificationId) {
          return NextResponse.json(
            { error: 'Notification ID is required' },
            { status: 400 }
          );
        }

        const index = mockNotifications.findIndex(n => n.id === notificationId);
        if (index === -1) {
          return NextResponse.json(
            { error: 'Notification not found' },
            { status: 404 }
          );
        }

        mockNotifications.splice(index, 1);

        return NextResponse.json({
          success: true,
          message: 'Notification deleted'
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error processing notification action:', error);
    return NextResponse.json(
      { error: 'Failed to process notification action' },
      { status: 500 }
    );
  }
} 