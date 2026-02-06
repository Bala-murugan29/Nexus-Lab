# 🚀 NEXUS.LAB - Getting Started

Welcome to NEXUS.LAB! This guide will help you get the application running in 5 minutes.

## 🎯 Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js 18+ installed (`node --version`)
- ✅ Docker Desktop running
- ✅ Git installed

## 📦 Installation Steps

### Step 1: Install Dependencies

```bash
npm install
```

This will install all dependencies for the monorepo using Turbo.

### Step 2: Start Development Databases

```bash
docker-compose up -d
```

This starts:
- PostgreSQL (port 5432)
- Neo4j (ports 7474, 7687)
- Redis (port 6379)

Verify services are running:
```bash
docker-compose ps
```

### Step 3: Setup Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Seed with test data
npm run db:seed
```

### Step 4: Configure Environment

The `.env.local` file has been created with default values that work with Docker Compose. No changes needed for local development!

### Step 5: Start Development Server

```bash
npm run dev
```

## 🎉 You're Ready!

Open your browser and navigate to:
- **App**: http://localhost:3000
- **Neo4j Browser**: http://localhost:7474
  - Username: `neo4j`
  - Password: `nexuslab123`

## 🧭 What's Next?

### Explore the Interface

The main workspace includes:
- **Code Editor**: Monaco editor with syntax highlighting
- **Thought Trace**: Real-time AI reasoning visualization
- **Knowledge Topology**: Interactive knowledge graph
- **Nexus Chat**: AI assistant interface
- **Multimodal Input**: Drag & drop zone for files

### Try These Features

1. **Upload a code file** in the multimodal input zone
2. **Edit code** in the Monaco editor (auto-sync enabled)
3. **View thought traces** as the AI analyzes your work
4. **Check knowledge graph** to see your skill progression

## 🔧 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run lint             # Lint all code
npm run type-check       # Check TypeScript

# Database
npm run db:studio        # Open Prisma Studio
npm run db:push          # Update database schema
npm run db:seed          # Reseed database

# Docker
docker-compose up -d     # Start services
docker-compose down      # Stop services
docker-compose logs -f   # View logs
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Stop any conflicting services
docker-compose down
# Or change ports in docker-compose.yml
```

### Database Connection Failed

```bash
# Check if services are running
docker-compose ps

# Restart services
docker-compose restart
```

### Module Not Found

```bash
# Clean and reinstall
npm run clean
npm install
```

### TypeScript Errors

```bash
# Regenerate Prisma types
npm run db:generate

# Check types
npm run type-check
```

## 📚 Documentation

- [Development Guide](./DEVELOPMENT.md) - Detailed development info
- [Deployment Guide](./DEPLOYMENT.md) - Production deployment
- [Requirements](./requirements.md) - Full feature specifications
- [Design Document](./design.md) - Architecture details

## 🎨 Customization

### Change Theme Colors

Edit `apps/web/tailwind.config.js`:
```javascript
colors: {
  primary: {
    DEFAULT: '#3b82f6',  // Your primary color
    // ...
  },
}
```

### Add New API Routes

Create files in `apps/web/src/app/api/`:
```typescript
// apps/web/src/app/api/your-route/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Hello!' });
}
```

### Create New Components

Add to `apps/web/src/components/`:
```typescript
// apps/web/src/components/YourComponent.tsx
export function YourComponent() {
  return <div>Your component</div>;
}
```

## 💡 Tips

1. **Hot Reload**: The dev server automatically reloads on changes
2. **Prisma Studio**: Visual database editor at `npm run db:studio`
3. **Neo4j Browser**: Explore knowledge graph visually
4. **Turbo**: Builds are cached for faster subsequent builds

## 🤝 Need Help?

- Check documentation in `docs/` folder
- Review example code in existing components
- Check Docker logs: `docker-compose logs -f`
- Verify environment variables in `.env.local`

## 🚢 Deploy to Production

When ready to deploy:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or push to GitHub and connect to Vercel dashboard
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.

---

**Happy Coding! 🎉**

Built with ❤️ using Next.js, TypeScript, and AI
