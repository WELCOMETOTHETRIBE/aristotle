import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/db';

// Helper function to get user ID from request
async function getUserIdFromRequest(request: NextRequest): Promise<number | null> {
  let userId: number | null = null;
  
  // Try Bearer token first
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    const payload = await verifyToken(token);
    if (payload) {
      userId = payload.userId;
    }
  }
  
  // If no Bearer token, try cookie-based auth
  if (!userId) {
    try {
      const cookieHeader = request.headers.get('cookie');
      if (cookieHeader) {
        const response = await fetch(`${request.nextUrl.origin}/api/auth/me`, {
          headers: { cookie: cookieHeader }
        });
        
        if (response.ok) {
          const authData = await response.json();
          if (authData.user && authData.user.id) {
            userId = authData.user.id;
          }
        }
      }
    } catch (error) {
      console.error('Cookie auth check failed:', error);
    }
  }
  
  return userId;
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    
    // Require authentication
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get user data for confirmation
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { username: true, email: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete user data in a transaction to ensure consistency
    await prisma.$transaction(async (tx) => {
      // Delete all user-related data
      await tx.task.deleteMany({ where: { userId } });
      await tx.goal.deleteMany({ where: { userId } });
      await tx.habit.deleteMany({ where: { userId } });
      await tx.habitCheck.deleteMany({ 
        where: { 
          Habit: { userId } 
        } 
      });
      await tx.fastingSession.deleteMany({ where: { userId } });
      await tx.fastingBenefit.deleteMany({ 
        where: { 
          session: { userId } 
        } 
      });
      await tx.hydrationLog.deleteMany({ where: { userId } });
      await tx.moodLog.deleteMany({ where: { userId } });
      await tx.dailyIntention.deleteMany({ where: { userId } });
      await tx.naturePhoto.deleteMany({ where: { userId } });
      await tx.timerSession.deleteMany({ where: { userId } });
      await tx.communityPost.deleteMany({ where: { authorId: userId } });
      await tx.communityReply.deleteMany({ where: { authorId: userId } });
      await tx.communityNotification.deleteMany({ where: { userId } });
      await tx.userPreference.deleteMany({ where: { userId } });
      
      // Finally delete the user
      await tx.user.delete({ where: { id: userId } });
    });

    console.log('✅ Account deleted successfully for user ID:', userId);

    // Create response and clear auth cookie
    const response = NextResponse.json({
      success: true,
      message: 'Account deleted successfully'
    });

    // Clear the auth cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0 // Expire immediately
    });

    return response;

  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
} 