# Profile Page Setup Guide

## Features Added

### 1. Profile Header
- **Back Button** (top left) - Navigate back to previous page
- **Title** - "Profile" with subtitle
- **Logout Button** (top right) - Securely logout user

### 2. Social Login
- **Google Sign In** - OAuth integration with Google
- **GitHub Sign In** - OAuth integration with GitHub

### 3. Profile Card
- User information display
- Editable profile name
- Statistics and metrics
- Knowledge areas
- Recent projects
- Learning goals progress

---

## Environment Variables Setup

### Required Variables

Add these to your `.env.local` file in the web app:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# App URL (required for OAuth callbacks)
NEXTAUTH_URL=http://localhost:3000  # Development
NEXTAUTH_URL=https://yourdomain.com  # Production
```

---

## Setting Up Google OAuth

### Step 1: Create Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Choose "Web application" as the application type

### Step 2: Configure Authorized Redirect URIs
Add these redirect URIs:
```
http://localhost:3000/api/auth/google/callback    (Development)
https://yourdomain.com/api/auth/google/callback   (Production)
```

### Step 3: Copy Credentials
- Copy the `Client ID` and `Client Secret`
- Add them to `.env.local`:
  ```env
  GOOGLE_CLIENT_ID=your_client_id
  GOOGLE_CLIENT_SECRET=your_client_secret
  ```

---

## Setting Up GitHub OAuth

### Step 1: Create GitHub OAuth App
1. Go to GitHub Settings → [Developer settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the following:
   - **Application name**: Your App Name
   - **Homepage URL**: `http://localhost:3000` (Development) or your domain (Production)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/github/callback` (Development)

### Step 2: Configure Authorization Callback URL
- Add callback URL for production: `https://yourdomain.com/api/auth/github/callback`

### Step 3: Copy Credentials
- Copy the `Client ID` and `Client Secret`
- Add them to `.env.local`:
  ```env
  GITHUB_CLIENT_ID=your_client_id
  GITHUB_CLIENT_SECRET=your_client_secret
  ```

---

## API Endpoints

### GET `/api/auth/google`
Initiates Google OAuth flow. Redirects users to Google consent screen.

### GET `/api/auth/google/callback`
Handles Google OAuth callback. Exchanges code for token and retrieves user info.

### GET `/api/auth/github`
Initiates GitHub OAuth flow. Redirects users to GitHub authorization screen.

### GET `/api/auth/github/callback`
Handles GitHub OAuth callback. Exchanges code for token and retrieves user info.

### POST `/api/auth/logout`
Logs out the current user and clears session.

### GET `/api/user/profile`
Fetches complete user profile with stats and related data.

### PUT `/api/user/profile`
Updates user profile information.

---

## Components

### ProfileHeader
Located: `/components/workspace/ProfileHeader.tsx`

Renders header with:
- Back button (uses router.back())
- Profile title
- Logout button (calls `/api/auth/logout`)

```tsx
import { ProfileHeader } from '@/components/workspace/ProfileHeader';

<ProfileHeader />
```

### SocialLogin
Located: `/components/workspace/SocialLogin.tsx`

Renders social login buttons:
- Google sign in (redirects to `/api/auth/google`)
- GitHub sign in (redirects to `/api/auth/github`)

```tsx
import { SocialLogin } from '@/components/workspace/SocialLogin';

<SocialLogin />
```

### UserProfileCard
Located: `/components/workspace/UserProfileCard.tsx`

Displays comprehensive user profile with stats and information.

---

## Pages

### Profile Page (`/profile`)
Displays:
1. ProfileHeader with back button and logout
2. SocialLogin for OAuth connections
3. UserProfileCard with profile details

---

## How It Works

### Login Flow
1. User clicks "Google" or "GitHub" button on profile page
2. Redirected to `/api/auth/google` or `/api/auth/github`
3. OAuth provider's consent screen is shown
4. After approval, redirect to callback endpoint
5. Callback endpoint exchanges code for token
6. User info is retrieved from OAuth provider
7. User is created/updated in database (TODO)
8. Session is created and user is redirected to dashboard

### Logout Flow
1. User clicks "Logout" button
2. POST request to `/api/auth/logout`
3. Current session is marked as ended in database
4. Session cookie is cleared
5. User is redirected to `/login`

---

## Next Steps

### To Complete OAuth Integration:

1. **Update database schema** (if needed)
   - Add fields to User model for OAuth provider data:
     ```prisma
     model User {
       // ... existing fields
       googleId String? @unique
       githubId String? @unique
       googleEmail String?
       githubEmail String?
     }
     ```

2. **Update callback endpoints** to create/update users:
   ```typescript
   const user = await prisma.user.upsert({
     where: { googleId: userInfo.sub },
     update: { name: userInfo.name, email: userInfo.email },
     create: {
       googleId: userInfo.sub,
       email: userInfo.email,
       name: userInfo.name,
       password: 'oauth', // placeholder
     },
   });
   ```

3. **Create session** and set cookie in callback:
   ```typescript
   const session = await prisma.session.create({
     data: { userId: user.id },
   });
   
   response.cookies.set('user-session', session.id, {
     httpOnly: true,
     secure: process.env.NODE_ENV === 'production',
     sameSite: 'lax',
   });
   ```

4. **Test OAuth flow** in development
5. **Deploy** to production with correct URLs

---

## Troubleshooting

### OAuth Not Working
- Verify environment variables are set correctly
- Check redirect URIs match exactly
- Ensure NEXTAUTH_URL is set for your environment
- Check browser console for errors

### Callback Fails
- Verify callback endpoints are created
- Check that code is received in URL
- Verify client ID and secret are correct

### Session Not Created
- Check database connection
- Verify Prisma schema has necessary fields
- Check session cookie settings

---

## Security Considerations

- ✅ OAuth tokens are not stored in client-side cookies
- ✅ Callback endpoints validate state/code
- ✅ Session cookies are HttpOnly
- ⚠️ Implement CSRF protection for production
- ⚠️ Validate user data before storing
- ⚠️ Use HTTPS in production

---
