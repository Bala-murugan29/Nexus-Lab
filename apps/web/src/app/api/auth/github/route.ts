import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  try {
    // GitHub OAuth configuration
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/github/callback`;
    const scope = 'user:email';

    if (!clientId) {
      console.error('GitHub Client ID not configured');
      return NextResponse.json(
        { error: 'GitHub OAuth not configured' },
        { status: 500 }
      );
    }

    // Generate state for CSRF protection
    const state = crypto.randomBytes(32).toString('hex');

    // Redirect to GitHub OAuth authorization
    const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
    githubAuthUrl.searchParams.append('client_id', clientId);
    githubAuthUrl.searchParams.append('redirect_uri', redirectUri);
    githubAuthUrl.searchParams.append('scope', scope);
    githubAuthUrl.searchParams.append('allow_signup', 'true');
    githubAuthUrl.searchParams.append('state', state);

    console.log('Redirecting to GitHub OAuth:', githubAuthUrl.toString().split('client_id')[0] + 'client_id=***');

    // Create response with redirect
    const response = NextResponse.redirect(githubAuthUrl.toString());

    // Store state in secure httpOnly cookie
    response.cookies.set('github_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10, // 10 minutes
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate GitHub OAuth' },
      { status: 500 }
    );
  }
}
