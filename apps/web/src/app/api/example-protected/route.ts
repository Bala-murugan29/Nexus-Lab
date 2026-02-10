// Example: Protected API Route using authentication

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, getAuthUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Example 1: Protected API route that requires authentication
export async function GET(request: NextRequest) {
  try {
    // This will throw an error if user is not authenticated
    const user = await requireAuth(request);
    
    // Fetch user-specific data from database
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        projects: true,
        sessions: {
          where: { endTime: null },
          orderBy: { startTime: 'desc' },
          take: 1,
        },
      },
    });

    return NextResponse.json({ user: userData });
  } catch (error) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
}

// Example 2: Optional authentication
export async function POST(request: NextRequest) {
  // Get user if authenticated, null otherwise
  const user = await getAuthUser(request);
  
  if (user) {
    return NextResponse.json({ 
      message: 'Hello authenticated user!',
      user 
    });
  }
  
  return NextResponse.json({ 
    message: 'Hello anonymous user!' 
  });
}
