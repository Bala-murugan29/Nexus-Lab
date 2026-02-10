# 🚀 NEXUS.LAB Quick Reference

## 📦 One-Line Install

```bash
npm i && docker-compose up -d && npm run db:generate && npm run db:push && npm run dev
```

## 🔥 Essential Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Lint all code |
| `npm run type-check` | Check TypeScript |
| `npm test` | Run tests |
| `npm run clean` | Clean build artifacts |

## 🗄️ Database Commands

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to DB |
| `npm run db:studio` | Open Prisma Studio GUI |
| `npm run db:seed` | Seed with test data |

## 🐳 Docker Commands

| Command | Description |
|---------|-------------|
| `docker-compose up -d` | Start all services |
| `docker-compose down` | Stop all services |
| `docker-compose ps` | Check service status |
| `docker-compose logs -f` | View live logs |
| `docker-compose restart` | Restart all services |

## 🌐 Access Points

| Service | URL | Credentials |
|---------|-----|-------------|
| App | http://localhost:3000 | - |
| Neo4j Browser | http://localhost:7474 | neo4j / nexuslab123 |
| Prisma Studio | `npm run db:studio` | - |
| PostgreSQL | localhost:5432 | postgres / postgres |

## 📁 Key Directories

```
apps/web/          → Frontend application
packages/core/     → Types & business logic
packages/database/ → Prisma ORM
packages/ai-engine/→ AI services
packages/ui/       → UI components
```

## 🎨 Theme Colors

```css
--background: #0a0e1a
--primary: #3b82f6
--accent-purple: #8b5cf6
--accent-green: #10b981
--text-primary: #e5e7eb
```

## 🔧 File Locations

| What | Where |
|------|-------|
| Environment vars | `apps/web/.env.local` |
| Database schema | `packages/database/prisma/schema.prisma` |
| Main page | `apps/web/src/app/page.tsx` |
| API routes | `apps/web/src/app/api/` |
| Components | `apps/web/src/components/workspace/` |
| Types | `packages/core/src/types.ts` |

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port in use | `docker-compose down` |
| Module not found | `npm install` |
| Prisma errors | `npm run db:generate` |
| TypeScript errors | `npm run type-check` |
| DB connection failed | `docker-compose restart postgres` |

## 📝 Quick Tasks

### Add New API Route
```typescript
// apps/web/src/app/api/your-route/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Hello!' });
}
```

### Create Component
```typescript
// apps/web/src/components/YourComponent.tsx
export function YourComponent() {
  return <div>Your component</div>;
}
```

### Add Database Model
```prisma
// packages/database/prisma/schema.prisma
model YourModel {
  id    String @id @default(cuid())
  name  String
}
```
Then run: `npm run db:push`

## 🎯 Common Workflows

### Start Fresh
```bash
npm run clean
docker-compose down -v
npm install
docker-compose up -d
npm run db:generate
npm run db:push
npm run dev
```

### Deploy to Vercel
```bash
vercel
```

### Add Dependency
```bash
# To specific package
npm install package-name --workspace=@nexus-lab/web

# To root
npm install package-name
```

## 📊 Package Scripts

Each package has:
- `lint` - ESLint
- `type-check` - TypeScript check
- `build` - Production build

Run for specific package:
```bash
npm run lint --workspace=@nexus-lab/core
```

## 🔐 Environment Variables

Required in `apps/web/.env.local`:
```env
DATABASE_URL=
NEO4J_URI=
NEO4J_USER=
NEO4J_PASSWORD=
NEXT_PUBLIC_WS_URL=
```

Optional:
```env
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
NEXTAUTH_SECRET=
```

## 📚 Documentation

- [Getting Started](./GETTING-STARTED.md) - Setup guide
- [Development](./DEVELOPMENT.md) - Dev workflow
- [Deployment](./DEPLOYMENT.md) - Deploy guide
- [Summary](./PROJECT-SUMMARY.md) - Complete overview
- [Checklist](./INSTALLATION-CHECKLIST.md) - Verification

## 💡 Tips

- Use `cmd/ctrl + click` on types for navigation
- Prisma Studio for DB debugging
- Neo4j Browser for graph visualization
- React Query DevTools in dev mode
- Hot reload works across monorepo

## 🎓 Learn More

- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- Neo4j: https://neo4j.com/docs
- Turbo: https://turbo.build/repo/docs

---

**Built with Next.js, TypeScript, Prisma, Neo4j, and ❤️**
