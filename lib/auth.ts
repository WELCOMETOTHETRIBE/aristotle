import bcrypt from 'bcryptjs';
import * as jose from 'jose';
import { prisma } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'default-jwt-secret-for-development-only';

export interface JWTPayload {
  userId: number;
  username: string;
  [key: string]: any;
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function generateToken(payload: JWTPayload): Promise<string> {
  const secret = new TextEncoder().encode(JWT_SECRET);
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    return payload as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function authenticateUser(username: string, password: string) {
  // Try to find user by username first
  let user = await prisma.user.findUnique({
    where: { username }
  });

  // If not found by username, try by email
  if (!user) {
    user = await prisma.user.findUnique({
      where: { email: username }
    });
  }

  if (!user) {
    return null;
  }

  const isValidPassword = await comparePassword(password, user.password);
  if (!isValidPassword) {
    return null;
  }

  return user;
}

export async function createUser(username: string, password: string, email?: string, displayName?: string) {
  const hashedPassword = await hashPassword(password);
  
  return prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      email,
      displayName: displayName || username
    }
  });
}

export async function getUserById(userId: number) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      displayName: true,
      tz: true,
      createdAt: true
    }
  });
} 