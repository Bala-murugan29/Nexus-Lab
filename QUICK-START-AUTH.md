# 🔐 Authentication System - Quick Start Guide

## ✅ What Has Been Implemented

A complete authentication system with:
- **Login Page** at `/login`
- **Signup Page** at `/signup`  
- **Database Integration** with PostgreSQL via Prisma
- **Password Security** using bcrypt hashing
- **Session Management** with HTTP-only cookies
- **API Routes** for authentication endpoints

## 📋 Components Created

### Database Schema
- ✅ Updated `User` model with `password` field
- ✅ Database synced and ready

### API Routes
- ✅ `POST /api/auth/signup` - Create new account
- ✅ `POST /api/auth/login` - Authenticate user
- ✅ `POST /api/auth/logout` - End session

### Utility Files
- ✅ `src/lib/prisma.ts` - Database client singleton
- ✅ `src/lib/auth.ts` - Authentication helpers
- ✅ `src/app/api/example-protected/route.ts` - Protected route example

### UI Components
- ✅ Login page (already existed, now connected)
- ✅ Signup page (already existed, now connected)
- ✅ Form hook updated to work with new API

## 🚀 How to Start Using It

### 1. Start the Development Server

```bash
npm run dev
```

The app will run at `http://localhost:3000`

### 2. Create an Account

1. Navigate to `http://localhost:3000/signup`
2. Fill in:
   - First Name
   - Last Name
   - Email
   - Password
   - Confirm Password
3. Click "Create Account"

### 3. Login

1. Navigate to `http://localhost:3000/login`
2. Enter your email and password
3. Click "Sign In"
4. You'll be redirected to `/workspace`

## 🔧 How It Works

### User Flow

```
┌─────────┐      POST /api/auth/signup      ┌──────────┐
│ Signup  │ ──────────────────────────────> │   API    │
│  Page   │                                 │  Route   │
└─────────┘                                 └──────────┘
                                                  │
                ┌──────────────────────────────────┘
                │
                ▼
          ┌──────────┐     bcrypt.hash()     ┌──────────┐
          │ Validate │ ───────────────────>  │ Database │
          │  Input   │                        │  (User)  │
          └──────────┘                        └──────────┘
                │
                │ Set Session Cookie
                ▼
          ┌──────────┐
          │ Redirect │
          │ to Login │
          └──────────┘
```

### Authentication Check

```typescript
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const user = await requireAuth(request);
  // user is authenticated, proceed...
}
```

## 🛠️ Configuration

### Environment Variables

The system uses these environment variables (already configured):

**`packages/database/.env`**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nexuslab"
```

**`apps/web/.env.local`** (if needed)
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nexuslab"
NODE_ENV="development"
```

### Database Connection

Make sure PostgreSQL is running:
```bash
# Check if database is accessible
npm run db:studio
```

## 📝 API Documentation

### Signup Endpoint

**POST** `/api/auth/signup`

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "clx123...",
    "email": "john@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Login Endpoint

**POST** `/api/auth/login`

```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "clx123...",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

Sets `user-session` cookie with session ID.

### Logout Endpoint

**POST** `/api/auth/logout`

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

Clears `user-session` cookie.

## 🔒 Security Features

- ✅ **Password Hashing**: bcrypt with 10 salt rounds
- ✅ **HTTP-Only Cookies**: Prevents XSS attacks
- ✅ **Secure Flag**: Enabled in production
- ✅ **SameSite**: Set to 'lax' for CSRF protection
- ✅ **No Password Leaks**: Passwords never returned in responses
- ✅ **Session Tracking**: All sessions stored in database

## 🧪 Testing

Run the test script to verify everything works:

```bash
# Make sure dev server is running first (npm run dev)
node test-auth.js
```

This will test:
- User signup
- Login with correct credentials
- Login with wrong password
- Logout

## 📚 Usage Examples

### Protecting a Page

```typescript
// app/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function Dashboard() {
  const cookieStore = cookies();
  const session = cookieStore.get('user-session');
  
  if (!session) {
    redirect('/login');
  }
  
  return <div>Protected Dashboard</div>;
}
```

### Protecting an API Route

```typescript
// app/api/protected/route.ts
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    return NextResponse.json({ data: 'secret info', user });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
```

### Optional Authentication

```typescript
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const user = await getAuthUser(request);
  
  if (user) {
    return NextResponse.json({ 
      message: `Hello ${user.name}!` 
    });
  }
  
  return NextResponse.json({ 
    message: 'Hello guest!' 
  });
}
```

## 🎯 Next Steps

Your authentication system is ready to use! You can now:

1. **Test the login/signup pages** in the browser
2. **Protect routes** using the auth helpers
3. **Add more user fields** to the database schema if needed
4. **Implement password reset** functionality
5. **Add OAuth providers** (Google, GitHub)
6. **Add email verification**
7. **Implement 2FA** for extra security

## ❓ Troubleshooting

### Database Connection Error
```bash
# Check if PostgreSQL is running
# Update DATABASE_URL in packages/database/.env
npm run db:push
```

### "User already exists" Error
This means the email is already registered. Use a different email or login with existing credentials.

### Session Cookie Not Set
Check browser DevTools > Application > Cookies to verify `user-session` cookie is present.

### API Route Not Found
Make sure the dev server is running (`npm run dev`) and the route files exist in `apps/web/src/app/api/auth/`.

## 📞 Support

For more details, see:
- `AUTH-SETUP.md` - Detailed technical documentation
- `apps/web/src/lib/auth.ts` - Authentication utilities
- `packages/database/prisma/schema.prisma` - Database schema

---

**Status**: ✅ Fully Implemented and Ready to Use
