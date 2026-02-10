import { NextRequest } from 'next/server';
import prisma from './prisma';

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
}

/**
 * Get the authenticated user from the request
 * Returns the user object if authenticated, null otherwise
 */
export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    const sessionId = request.cookies.get('user-session')?.value;

    if (!sessionId) {
      return null;
    }

    // Find the session in the database
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });

    if (!session || session.endTime) {
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    };
  } catch (error) {
    console.error('Error getting auth user:', error);
    return null;
  }
}

/**
 * Check if a request is authenticated
 */
export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const user = await getAuthUser(request);
  return user !== null;
}

/**
 * Require authentication for a request
 * Throws an error if not authenticated
 */
export async function requireAuth(request: NextRequest): Promise<AuthUser> {
  const user = await getAuthUser(request);
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  return user;
}
