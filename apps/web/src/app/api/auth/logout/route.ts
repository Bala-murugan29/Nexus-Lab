import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const REDIRECT_URL = '/login';

async function clearSession(request: NextRequest) {
  const sessionId = request.cookies.get('user-session')?.value;

  console.log('Logout request - Session ID:', sessionId);

  if (sessionId) {
    await prisma.session.update({
      where: { id: sessionId },
      data: { endTime: new Date() },
    }).catch((err) => {
      console.log('Session update error (non-critical):', err.message);
    });
  }
}

function clearCookie(response: NextResponse) {
  response.cookies.set('user-session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

export async function POST(request: NextRequest) {
  try {
    await clearSession(request);

    const response = NextResponse.json(
      { message: 'Logged out successfully', success: true, redirectUrl: REDIRECT_URL },
      { status: 200 }
    );

    clearCookie(response);
    console.log('Logout successful');
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'An error occurred during logout', success: false },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await clearSession(request);

    const response = NextResponse.redirect(new URL(REDIRECT_URL, request.url));
    clearCookie(response);
    console.log('Logout successful (redirect)');
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'An error occurred during logout', success: false },
      { status: 500 }
    );
  }
}
