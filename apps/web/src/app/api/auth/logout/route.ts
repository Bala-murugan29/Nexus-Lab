import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('user-session')?.value;

    if (sessionId) {
      // Update session end time in database
      await prisma.session.update({
        where: { id: sessionId },
        data: { endTime: new Date() },
      }).catch(() => {
        // Session might not exist, that's okay
      });
    }

    // Create response
    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );

    // Clear the session cookie
    response.cookies.delete('user-session');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'An error occurred during logout' },
      { status: 500 }
    );
  }
}
