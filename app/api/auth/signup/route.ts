import { NextRequest, NextResponse } from 'next/server';
import { createUser, generateToken, hashPassword } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { username, password, email, displayName } = await request.json();

    console.log('🔐 Signup request received for username:', username, 'email:', email);

    if (!username || !password) {
      console.log('❌ Missing username or password');
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    if (!email) {
      console.log('❌ Missing email');
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      console.log('❌ Password too short');
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Use a transaction to prevent race conditions
    const user = await prisma.$transaction(async (tx) => {
      // Check if username already exists
      const existingUser = await tx.user.findUnique({
        where: { username }
      });

      if (existingUser) {
        console.log('❌ Username already exists:', username);
        throw new Error('USERNAME_EXISTS');
      }

      // Check if email already exists (if provided)
      if (email) {
        const existingEmail = await tx.user.findUnique({
          where: { email }
        });

        if (existingEmail) {
          console.log('❌ Email already exists:', email);
          throw new Error('EMAIL_EXISTS');
        }
      }

      // Create the user within the transaction
      console.log('✅ Creating new user:', username);
      const hashedPassword = await hashPassword(password);
      
      return tx.user.create({
        data: {
          username,
          password: hashedPassword,
          email,
          displayName: displayName || username
        }
      });
    });

    console.log('✅ User created successfully:', user.username);
    const token = await generateToken({
      userId: user.id,
      username: user.username
    });

    const response = NextResponse.json({
      message: 'User created successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName
      }
    });

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('💥 Sign-up error:', error);
    console.error('💥 Error code:', error.code);
    console.error('💥 Error meta:', error.meta);
    
    // Handle our custom transaction errors
    if (error.message === 'USERNAME_EXISTS') {
      return NextResponse.json(
        { error: 'This username is already taken. Please choose a different username.' },
        { status: 409 }
      );
    }
    
    if (error.message === 'EMAIL_EXISTS') {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please try signing in instead.' },
        { status: 409 }
      );
    }
    
    // Handle Prisma unique constraint errors (fallback)
    if (error.code === 'P2002') {
      const target = error.meta?.target;
      console.log('🔍 Unique constraint violation on:', target);
      
      if (target && target.includes('email')) {
        return NextResponse.json(
          { error: 'An account with this email already exists. Please try signing in instead.' },
          { status: 409 }
        );
      }
      if (target && target.includes('username')) {
        return NextResponse.json(
          { error: 'This username is already taken. Please choose a different username.' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: 'This account already exists. Please try signing in instead.' },
        { status: 409 }
      );
    }
    
    // Handle other Prisma errors
    if (error.code && error.code.startsWith('P')) {
      console.error('💥 Prisma error:', error.code, error.message);
      return NextResponse.json(
        { error: 'Database error occurred. Please try again.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
} 