# NEXUS.LAB - Production-Ready AI Cognitive Environment

![NEXUS.LAB](https://img.shields.io/badge/NEXUS.LAB-v1.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![License](https://img.shields.io/badge/license-MIT-green)

NEXUS.LAB is a production-ready autonomous AI cognitive environment built with Next.js, designed to enable faster learning, smarter building, and highly efficient debugging.

## ✨ Features

- **🧠 Multimodal Input Processing**: Process code, images, diagrams, schemas, and logs
- **🕸️ Knowledge Graph Engine**: Dynamic knowledge tracking with Neo4j
- **🔄 Autonomous Thought Loop**: Continuous problem detection and intervention
- **📚 Adaptive Learning**: Personalized micro-lessons and learning paths
- **⚡ Real-time Monitoring**: WebSocket-powered live updates
- **🎨 Modern UI**: Dark theme with Tailwind CSS and Framer Motion
- **📊 Productivity Analytics**: Track and improve your workflow
- **🏗️ Project Builder**: AI-powered code generation and scaffolding

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- Docker & Docker Compose
- npm >= 9.0.0

### Installation

```bash
# Clone repository
git clone <your-repo-url>
cd nexus-lab

# Install dependencies
npm install

# Start development databases
docker-compose up -d

# Initialize database
npm run db:generate
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

```
nexus-lab/
├── apps/
│   └── web/              # Next.js frontend
│       ├── src/
│       │   ├── app/      # Next.js 14 app router
│       │   ├── components/
│       │   ├── hooks/
│       │   └── lib/
├── packages/
│   ├── core/             # Core types & schemas
│   ├── database/         # Prisma ORM
│   ├── ai-engine/        # AI services
│   └── ui/               # UI components
├── docs/                 # Documentation
└── scripts/              # Utility scripts
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Monaco Editor** - Code editor
- **D3.js** - Data visualization
- **Socket.io Client** - Real-time communication

### Backend
- **Next.js API Routes** - Serverless API
- **Prisma** - ORM
- **PostgreSQL** - Relational database
- **Neo4j** - Graph database
- **Socket.io** - WebSocket server

### Infrastructure
- **Turbo** - Monorepo build system
- **Docker** - Containerization
- **Vercel** - Deployment platform

## 📚 Documentation

- [Development Guide](./DEVELOPMENT.md) - Local development setup
- [Deployment Guide](./DEPLOYMENT.md) - Production deployment
- [Requirements](./requirements.md) - Full requirements specification
- [Design Document](./design.md) - System architecture and design

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run tests
npm run lint         # Lint code
npm run format       # Format code
npm run type-check   # TypeScript type checking
npm run clean        # Clean build artifacts
```

### Database Commands

```bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database with test data
```

## 🌐 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

## 📦 Key Packages

### @nexus-lab/core
Core types, interfaces, and business logic shared across the application.

### @nexus-lab/database
Prisma schema and database access layer with PostgreSQL.

### @nexus-lab/ai-engine
AI processing engines including:
- Knowledge Graph Engine
- Autonomous Thought Loop
- Multimodal Input Processor
- Learning Content Generator
- Project Builder

### @nexus-lab/ui
Shared UI components built with React and Tailwind CSS.

## 🎨 UI Theme

The application uses a modern dark theme optimized for development work:

- **Background**: Deep navy (#0a0e1a)
- **Primary**: Blue (#3b82f6)
- **Accent Colors**: Purple, Cyan, Green, Yellow, Red
- **Typography**: Inter for UI, Fira Code for code

## 🔐 Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
DATABASE_URL="postgresql://..."
NEO4J_URI="bolt://localhost:7687"
NEO4J_USER="neo4j"
NEO4J_PASSWORD="your-password"
NEXT_PUBLIC_WS_URL="http://localhost:3001"
```

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Vercel](https://vercel.com)
- Graph database by [Neo4j](https://neo4j.com)
- Monorepo managed by [Turbo](https://turbo.build)

## 📞 Support

- Documentation: [docs/](./docs)
- Issues: [GitHub Issues](https://github.com/your-repo/issues)
- Discussions: [GitHub Discussions](https://github.com/your-repo/discussions)

---

Built with ❤️ by the NEXUS.LAB team
