import { NextRequest } from 'next/server';
import { verifyToken, getUserById } from '@/lib/auth';

export async function getAuthenticatedUser(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return null;
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return null;
    }

    const user = await getUserById(payload.userId);
    return user;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}
