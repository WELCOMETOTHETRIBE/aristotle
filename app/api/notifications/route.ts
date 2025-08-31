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
    const unreadOnly = searchParams.get('unread') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build where clause
    const where: any = { userId: payload.userId };
    
    if (unreadOnly) {
      where.isRead = false;
    }

    // Fetch notifications
    const notifications = await prisma.communityNotification.findMany({
      where,
      include: {
        post: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    // Count unread notifications
    const unreadCount = await prisma.communityNotification.count({
      where: {
        userId: payload.userId,
        isRead: false
      }
    });

    // Format notifications
    const formattedNotifications = notifications.map(notification => ({
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      postId: notification.postId,
      isRead: notification.isRead,
      createdAt: notification.createdAt.toISOString()
    }));

    return NextResponse.json({
      notifications: formattedNotifications,
      unreadCount,
      total: notifications.length
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

        const notification = await prisma.communityNotification.findFirst({
          where: {
            id: notificationId,
            userId: payload.userId
          }
        });

        if (!notification) {
          return NextResponse.json(
            { error: 'Notification not found' },
            { status: 404 }
          );
        }

        await prisma.communityNotification.update({
          where: { id: notificationId },
          data: { isRead: true }
        });

        return NextResponse.json({
          success: true,
          message: 'Notification marked as read'
        });

      case 'mark_all_read':
        await prisma.communityNotification.updateMany({
          where: {
            userId: payload.userId,
            isRead: false
          },
          data: { isRead: true }
        });

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

        const notificationToDelete = await prisma.communityNotification.findFirst({
          where: {
            id: notificationId,
            userId: payload.userId
          }
        });

        if (!notificationToDelete) {
          return NextResponse.json(
            { error: 'Notification not found' },
            { status: 404 }
          );
        }

        await prisma.communityNotification.delete({
          where: { id: notificationId }
        });

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