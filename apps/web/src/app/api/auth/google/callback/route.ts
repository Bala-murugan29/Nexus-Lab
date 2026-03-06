import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    console.log('Google Callback - Code received:', !!code);
    console.log('Google Callback - Error:', error);

    // Handle errors from Google
    if (error) {
      console.error('Google OAuth error:', error, errorDescription);
      return NextResponse.redirect(
        `${baseUrl}/login?error=${encodeURIComponent(error)}&description=${encodeURIComponent(errorDescription || '')}`
      );
    }

    // Validate state parameter
    const storedState = request.cookies.get('google_oauth_state')?.value;
    if (!state || state !== storedState) {
      console.error('State mismatch - potential CSRF attack');
      return NextResponse.redirect(
        `${baseUrl}/login?error=invalid_state`
      );
    }

    if (!code) {
      console.error('No authorization code received');
      return NextResponse.redirect(
        `${baseUrl}/login?error=no_code`
      );
    }

    console.log('Exchanging code for token...');

    // Exchange code for token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${baseUrl}/api/auth/google/callback`,
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Token exchange failed:', errorData);
      throw new Error('Failed to exchange code for token');
    }

    const { access_token, id_token } = await tokenResponse.json();
    console.log('Token received, fetching user info...');

    // Get user info
    const userResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!userResponse.ok) {
      console.error('Failed to get user info');
      throw new Error('Failed to get user info');
    }

    const userInfo = await userResponse.json();
    console.log('User info received:', { email: userInfo.email, name: userInfo.name, googleId: userInfo.sub });

    // Create or update user in database
    try {
      const user = await prisma.user.findUnique({
        where: { email: userInfo.email },
      });

      let finalUser = user;
      if (!user) {
        // Create new user if doesn't exist
        finalUser = await prisma.user.create({
          data: {
            email: userInfo.email,
            name: userInfo.name || userInfo.given_name,
            password: 'oauth-google',
          },
        });
        console.log('New user created:', { id: finalUser.id, email: finalUser.email });
      } else {
        // Update existing user's name if needed
        if (userInfo.name && !user.name) {
          finalUser = await prisma.user.update({
            where: { id: user.id },
            data: { name: userInfo.name || userInfo.given_name },
          });
        }
        console.log('Existing user found:', { id: user.id, email: user.email });
      }

      if (!finalUser) {
        throw new Error('Failed to create/find user');
      }

      // Create session
      const session = await prisma.session.create({
        data: {
          userId: finalUser.id,
          startTime: new Date(),
        },
      });

      console.log('Session created:', { id: session.id, userId: finalUser.id });

      // Create response with redirect
      const response = NextResponse.redirect(`${baseUrl}/dashboard`);

      // Set session cookie
      response.cookies.set('user-session', session.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      // Clear state cookie
      response.cookies.delete('google_oauth_state');

      console.log('Google OAuth flow completed successfully');
      return response;
    } catch (dbError) {
      console.error('Database error during user creation:', dbError);
      throw dbError;
    }
  } catch (error) {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(
      `${baseUrl}/login?error=${encodeURIComponent(error instanceof Error ? error.message : 'callback_failed')}`
    );
  }
}
