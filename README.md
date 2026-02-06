# 🧠 NEXUS.LAB - Autonomous AI Cognitive Environment

![NEXUS.LAB](https://img.shields.io/badge/NEXUS.LAB-v1.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Production Ready](https://img.shields.io/badge/status-production%20ready-green)

**NEXUS.LAB** is a production-ready autonomous AI cognitive environment that unifies multimodal understanding, adaptive learning, and autonomous project scaffolding into one cohesive intelligence layer.

## ✨ Key Features

- 🔄 **Multimodal Input Processing** - Process code, images, diagrams, schemas, and logs
- 🕸️ **Knowledge Graph Engine** - Track learning progression with Neo4j
- 🤖 **Autonomous Thought Loop** - Proactive problem detection and intervention
- 📚 **Adaptive Learning** - Personalized micro-lessons and learning paths
- ⚡ **Real-time Monitoring** - WebSocket-powered live updates
- 🎨 **Modern Dark UI** - Optimized for development work
- 🏗️ **Project Builder** - AI-powered code generation
- 📊 **Productivity Analytics** - Track and optimize workflow

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start databases
docker-compose up -d

# Setup database
npm run db:generate && npm run db:push && npm run db:seed

# Start development
npm run dev
```

Visit **http://localhost:3000** 🎉

📖 **Detailed Guide**: See [GETTING-STARTED.md](./GETTING-STARTED.md)

## 📁 Monorepo Structure

```
nexus-lab/
├── apps/
│   └── web/              # Next.js 14 frontend with App Router
├── packages/
│   ├── core/             # TypeScript types & business logic
│   ├── database/         # Prisma ORM + PostgreSQL
│   ├── ai-engine/        # AI services (Knowledge Graph, Thought Loop, etc.)
│   └── ui/               # Shared React components
├── docs/                 # Requirements & design documents
└── scripts/              # Build & deployment scripts
```

## 🛠️ Tech Stack

**Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Monaco Editor, D3.js  
**Backend**: Next.js API Routes, Prisma, PostgreSQL, Neo4j, Socket.io  
**Infrastructure**: Turbo, Docker, Vercel

## 📚 Documentation

- **[Getting Started](./GETTING-STARTED.md)** - 5-minute setup guide
- **[Development Guide](./DEVELOPMENT.md)** - Local development workflow
- **[Deployment Guide](./DEPLOYMENT.md)** - Production deployment to Vercel
- **[Requirements](./requirements.md)** - Complete feature specifications
- **[Design Document](./design.md)** - System architecture and design

## 🔧 Development Commands

```bash
npm run dev          # Start dev server with hot reload
npm run build        # Build all packages for production
npm run lint         # Lint all code
npm run test         # Run test suite
npm run type-check   # TypeScript type checking
npm run db:studio    # Open Prisma Studio (DB GUI)
```

## 🌐 Deploy to Vercel

```bash
vercel
```

Or connect your GitHub repo to Vercel dashboard for automatic deployments.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🎨 UI Theme

Dark theme optimized for development:
- **Background**: Deep navy (#0a0e1a)
- **Primary**: Blue (#3b82f6)
- **Accents**: Purple, Cyan, Green, Yellow
- **Fonts**: Inter (UI), Fira Code (code)

## 🧪 Key Packages

| Package | Description |
|---------|-------------|
| `@nexus-lab/core` | Core types and business logic |
| `@nexus-lab/database` | Prisma ORM + schemas |
| `@nexus-lab/ai-engine` | AI services (KG, Thought Loop, etc.) |
| `@nexus-lab/ui` | Shared UI components |

## 🔐 Environment Setup

Copy `.env.example` to `.env.local`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nexuslab_dev"
NEO4J_URI="bolt://localhost:7687"
NEO4J_USER="neo4j"
NEO4J_PASSWORD="nexuslab123"
NEXT_PUBLIC_WS_URL="http://localhost:3001"
```

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see [LICENSE](./LICENSE)

## 🙏 Acknowledgments

Built with [Next.js](https://nextjs.org/), [Vercel](https://vercel.com), [Neo4j](https://neo4j.com), and [Turbo](https://turbo.build)

---

**Built with ❤️ by the NEXUS.LAB team**
