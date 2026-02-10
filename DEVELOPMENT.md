# NEXUS.LAB Development Setup Guide

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker & Docker Compose (for databases)
- Git

## Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd nexus-lab

# Install dependencies
npm install
```

### 2. Start Development Databases

```bash
# Start PostgreSQL, Neo4j, and Redis
docker-compose up -d

# Verify services are running
docker-compose ps
```

### 3. Configure Environment

```bash
# Copy environment template
cp apps/web/.env.example apps/web/.env.local

# Edit .env.local with your settings
# Default values work with Docker Compose setup
```

### 4. Initialize Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with test data
npm run db:seed
```

### 5. Start Development Server

```bash
# Start all applications in dev mode
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Neo4j Browser: http://localhost:7474 (user: neo4j, password: nexuslab123)

## Project Structure

```
nexus-lab/
├── apps/
│   └── web/              # Next.js frontend application
│       ├── src/
│       │   ├── app/      # Next.js 14 app directory
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── lib/
│       │   └── styles/
│       └── public/
├── packages/
│   ├── core/             # Core types and business logic
│   ├── database/         # Prisma ORM and database schemas
│   ├── ai-engine/        # AI processing engines
│   └── ui/               # Shared UI components
└── docs/                 # Documentation
```

## Development Workflow

### Running Tests

```bash
# Run all tests
npm test

# Run tests for specific package
npm test --workspace=@nexus-lab/core

# Watch mode
npm test -- --watch
```

### Code Quality

```bash
# Lint all packages
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

### Building

```bash
# Build all packages
npm run build

# Build specific workspace
npm run build --workspace=@nexus-lab/web
```

## Database Management

### Prisma Commands

```bash
# Generate Prisma client after schema changes
npm run db:generate

# Push schema changes to database
npm run db:push

# Open Prisma Studio (database GUI)
npm run db:studio

# Create migration
cd packages/database
npx prisma migrate dev --name your_migration_name
```

### Neo4j Knowledge Graph

Access Neo4j Browser at http://localhost:7474

Example Cypher queries:
```cypher
// View all knowledge nodes
MATCH (n) RETURN n LIMIT 25

// Create concept relationships
MATCH (a:Concept {name: 'JavaScript'})
MATCH (b:Concept {name: 'React'})
CREATE (a)-[:PREREQUISITE_FOR]->(b)
```

## Troubleshooting

### Port Conflicts

If ports are already in use:

```bash
# Stop existing services
docker-compose down

# Change ports in docker-compose.yml
# Or kill processes using the ports
```

### Database Connection Issues

```bash
# Check database logs
docker-compose logs postgres
docker-compose logs neo4j

# Restart services
docker-compose restart
```

### Module Resolution Issues

```bash
# Clean and reinstall
npm run clean
rm -rf node_modules
npm install

# Rebuild
npm run build
```

### TypeScript Errors

```bash
# Regenerate type definitions
npm run type-check

# For Prisma types
npm run db:generate
```

## IDE Setup

### VS Code

Recommended extensions:
- ESLint
- Prettier
- Prisma
- Tailwind CSS IntelliSense
- Neo4j Cypher

### WebStorm / IntelliJ

Enable:
- TypeScript support
- ESLint integration
- Prettier on save

## Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and test
3. Run linting: `npm run lint`
4. Format code: `npm run format`
5. Commit: `git commit -m "feat: your feature"`
6. Push and create PR

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Neo4j Documentation](https://neo4j.com/docs)
- [Turbo Documentation](https://turbo.build/repo/docs)

## Support

For issues and questions:
- GitHub Issues: <repository-url>/issues
- Documentation: <docs-url>
