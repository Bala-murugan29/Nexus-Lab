# Dynamic User Profile System

This document describes the dynamic user profile system implemented in the NEXUS application.

## Features

### 1. User Profile Page
**Location:** `/profile`

A comprehensive profile page displaying:
- User information (name, email, member since)
- Edit profile functionality
- Statistics overview:
  - Total projects
  - Active sessions
  - Tasks completed
  - Learning goals progress
- Knowledge areas with mastery levels
- Recent projects
- Productivity metrics

### 2. User Dashboard
**Location:** `/dashboard`

An analytics dashboard showing:
- Welcome message with user's name
- Key metrics (daily focus time, tasks completed, knowledge areas, learning goals)
- Weekly productivity trends with interactive charts
- Learning goals progress visualization
- All-time statistics

### 3. Dynamic Sidebar
The sidebar now displays:
- Real user name and initials (instead of hardcoded "Dr. Aris")
- Active session count
- Click to navigate to profile page
- Responsive to user data loading

### 4. API Endpoint: `/api/user/profile`

#### GET Request
Fetches the complete user profile data including:
- User information (id, email, name, timestamps)
- Statistics (projects, sessions, focus time, tasks, knowledge)
- Recent projects (last 5)
- Top knowledge areas (top 10)
- Learning goals
- Productivity data (last 7 days)

**Example Response:**
```json
{
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T00:00:00Z"
  },
  "stats": {
    "totalProjects": 5,
    "activeSessions": 1,
    "totalFocusTime": 1200,
    "totalTasksCompleted": 45,
    "knowledgeNodeCount": 12,
    "averageMasteryLevel": 0.75,
    "learningGoalsCount": 3,
    "completedGoals": 1
  },
  "recentProjects": [...],
  "topKnowledgeAreas": [...],
  "learningGoals": [...],
  "productivityData": [...]
}
```

#### PUT Request
Updates user profile information.

**Request Body:**
```json
{
  "name": "New Name"
}
```

**Response:** Updated user object

### 5. Custom Hook: `useUserProfile`
**Location:** `/hooks/useUserProfile.ts`

Provides easy access to user profile data in components.

**Usage:**
```typescript
import { useUserProfile } from '@/hooks/useUserProfile';

export function MyComponent() {
  const { profile, loading, error, updateProfile, refreshProfile } = useUserProfile();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{profile?.user.name}</h1>
      <p>Total Projects: {profile?.stats.totalProjects}</p>
    </div>
  );
}
```

## Components

### UserProfileCard
**Location:** `/components/workspace/UserProfileCard.tsx`

Displays comprehensive user profile information with:
- Editable name
- Profile header with avatar
- Statistics grid
- Knowledge areas
- Recent projects
- Smooth animations

### UserDashboard
**Location:** `/components/workspace/UserDashboard.tsx`

Shows analytics and productivity metrics with:
- Welcome banner
- Key metric cards
- Weekly productivity charts (focus time and tasks)
- Learning goals progress
- Quick stat boxes

## Database Schema

The user profile system uses existing Prisma models:

### User Model
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  sessions         Session[]
  knowledgeNodes   KnowledgeNode[]
  learningGoals    LearningGoal[]
  productivityData ProductivityData[]
  projects         Project[]
}
```

### Related Models
- `Session`: User's work sessions with focus time tracking
- `Project`: User's projects
- `KnowledgeNode`: Learning topics and mastery levels
- `LearningGoal`: User's learning objectives
- `ProductivityData`: Daily productivity metrics

## Authentication

All profile endpoints require authentication via session cookie (`user-session`).

The `getAuthUser()` function from `/lib/auth.ts` validates requests and retrieves the current user's information.

## Styling

All components use the existing design system:
- Color scheme: `accent-blue`, `accent-green`, `accent-purple`, `accent-cyan`
- Text colors: `text-primary`, `text-muted`, `text-secondary`
- Background: `background`, `background-secondary`, `background-tertiary`
- Animations: Framer Motion for smooth transitions

## Integration Guide

### Adding to Existing Components

1. **Use the hook:**
```typescript
const { profile, loading, error } = useUserProfile();
```

2. **Display user info:**
```typescript
<p>Welcome, {profile?.user.name}!</p>
```

3. **Show statistics:**
```typescript
<p>Projects: {profile?.stats.totalProjects}</p>
```

### Adding to Navigation

Update your navigation to include links to new pages:
```typescript
<Link href="/profile">Profile</Link>
<Link href="/dashboard">Dashboard</Link>
```

## Future Enhancements

- User settings page (password change, preferences)
- Profile customization (avatar, bio, theme preferences)
- Social features (follow users, share profiles)
- Advanced analytics and reports
- Export productivity data
- Profile achievements and badges
- Integration with external services (GitHub, calendar)
