import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    const state = searchParams.get('state');

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    console.log('GitHub Callback - Code received:', !!code);
    console.log('GitHub Callback - Error:', error);

    // Handle errors from GitHub
    if (error) {
      console.error('GitHub OAuth error:', error, errorDescription);
      return NextResponse.redirect(
        `${baseUrl}/login?error=${encodeURIComponent(error)}&description=${encodeURIComponent(errorDescription || '')}`
      );
    }

    // Validate state parameter
    const storedState = request.cookies.get('github_oauth_state')?.value;
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
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${baseUrl}/api/auth/github/callback`,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Token exchange failed:', errorData);
      throw new Error('Failed to exchange code for token');
    }

    const { access_token, error: tokenError } = await tokenResponse.json();

    if (tokenError) {
      console.error('Token error:', tokenError);
      throw new Error(tokenError);
    }

    console.log('Token received, fetching user info...');

    // Get user info
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!userResponse.ok) {
      console.error('Failed to get user info');
      throw new Error('Failed to get user info');
    }

    const userInfo = await userResponse.json();

    // Get user email if not public
    let email = userInfo.email;
    if (!email) {
      console.log('Email not public, fetching from email endpoint...');
      const emailResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (emailResponse.ok) {
        const emails = await emailResponse.json();
        const primaryEmail = emails.find((e: any) => e.primary);
        email = primaryEmail?.email || emails[0]?.email;
      }
    }

    console.log('User info received:', { login: userInfo.login, email, name: userInfo.name });

    // Determine which email to use
    const primaryEmail = email || `${userInfo.login}@github.com`;

    // Create or update user in database
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: primaryEmail },
      });

      let finalUser = existingUser;
      if (!existingUser) {
        // Create new user if doesn't exist
        finalUser = await prisma.user.create({
          data: {
            email: primaryEmail,
            name: userInfo.name || userInfo.login,
            password: 'oauth-github',
          },
        });
        console.log('New user created via GitHub:', { id: finalUser.id, email: finalUser.email, githubLogin: userInfo.login });
      } else {
        // Update existing user's name if needed
        if ((userInfo.name || userInfo.login) && !existingUser.name) {
          finalUser = await prisma.user.update({
            where: { id: existingUser.id },
            data: { name: userInfo.name || userInfo.login },
          });
        }
        console.log('Existing user found via GitHub:', { id: existingUser.id, email: existingUser.email });
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
      response.cookies.delete('github_oauth_state');

      console.log('GitHub OAuth flow completed successfully');
      return response;
    } catch (dbError) {
      console.error('Database error during user creation:', dbError);
      throw dbError;
    }
  } catch (error) {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    console.error('GitHub OAuth callback error:', error);
    return NextResponse.redirect(
      `${baseUrl}/login?error=${encodeURIComponent(error instanceof Error ? error.message : 'callback_failed')}`
    );
  }
}
