# Authentication Setup Guide

## Overview
This project now has a complete authentication system with login and signup functionality connected to a PostgreSQL database using Prisma.

## Setup Instructions

### 1. Environment Variables
Create a `.env` file in the `packages/database` directory (or root) with:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nexuslab"
```

Update the connection string with your actual database credentials.

### 2. Install Dependencies
Dependencies have been installed in the web app:
- `bcryptjs` - Password hashing
- `jose` - JWT token handling
- `@types/bcryptjs` - TypeScript types

### 3. Update Database Schema
Run these commands from the root directory:

```bash
# Generate Prisma Client with updated schema
npm run db:generate

# Push schema changes to database
npm run db:push
```

Or from the database package:
```bash
cd packages/database
npm run db:generate
npm run db:push
```

## Features Implemented

### Database Schema Changes
- Added `password` field to User model in Prisma schema
- Passwords are hashed using bcrypt before storage

### API Routes Created

#### 1. Signup (`/api/auth/signup`)
- **Method:** POST
- **Body:** `{ name, email, password }`
- Creates new user with hashed password
- Returns user data and sets session cookie

#### 2. Login (`/api/auth/login`)
- **Method:** POST
- **Body:** `{ email, password }`
- Verifies credentials against database
- Creates session and sets HTTP-only cookie

#### 3. Logout (`/api/auth/logout`)
- **Method:** POST
- Clears session cookie
- Updates session end time in database

### Utility Files

#### Prisma Singleton (`src/lib/prisma.ts`)
- Prevents multiple Prisma Client instances in development
- Handles connection pooling efficiently

#### Auth Helpers (`src/lib/auth.ts`)
- `getAuthUser(request)` - Get current authenticated user
- `isAuthenticated(request)` - Check if request is authenticated
- `requireAuth(request)` - Require authentication (throws error if not)

### Existing UI Components
- Login page: `/login` (`apps/web/src/app/(auth)/login/page.tsx`)
- Signup page: `/signup` (`apps/web/src/app/(auth)/signup/page.tsx`)
- Form handling: `useAuthForm` hook already configured

## Usage

### Using the Auth System

The existing login and signup pages are already connected to the API routes through the `useAuthForm` hook.

To protect a page or API route, use the auth helpers:

```typescript
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const user = await requireAuth(request);
  // ... your protected route logic
}
```

### Session Management
- Sessions are stored as HTTP-only cookies
- Cookie name: `user-session`
- Expiration: 7 days
- Database sessions track start/end times

## Testing the System

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/signup`

3. Create an account

4. Login at `http://localhost:3000/login`

5. You'll be redirected to `/workspace` on successful login

## Security Features
- Passwords hashed with bcrypt (salt rounds: 10)
- HTTP-only cookies prevent XSS attacks
- Secure flag enabled in production
- Sessions tracked in database
- Passwords never returned in API responses

## Next Steps (Optional Enhancements)
- Add email verification
- Implement password reset functionality
- Add rate limiting to prevent brute force attacks
- Implement JWT tokens for stateless authentication
- Add OAuth providers (Google, GitHub, etc.)
- Add 2FA support
