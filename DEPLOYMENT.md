# NEXUS.LAB - Vercel Deployment Configuration

## Overview
This guide covers deploying NEXUS.LAB to Vercel with all necessary services.

## Prerequisites
- Vercel account
- PostgreSQL database (e.g., Vercel Postgres, Supabase, or Railway)
- Neo4j AuraDB instance (for Knowledge Graph)

## Deployment Steps

### 1. Prepare Database

**PostgreSQL:**
```bash
# Install Vercel Postgres or use external provider
vercel postgres create nexuslab-db

# Run migrations
npm run db:push
```

**Neo4j:**
- Create a free Neo4j AuraDB instance at https://neo4j.com/cloud/aura/
- Note the connection URI, username, and password

### 2. Configure Environment Variables

Add these environment variables in Vercel dashboard:

```env
DATABASE_URL="your-postgresql-url"
NEO4J_URI="your-neo4j-uri"
NEO4J_USER="neo4j"
NEO4J_PASSWORD="your-password"
NEXTAUTH_SECRET="generate-secure-random-string"
NEXTAUTH_URL="https://your-domain.vercel.app"
```

### 3. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Or for production
vercel --prod
```

### 4. Post-Deployment

1. Run database migrations:
```bash
vercel env pull .env.local
npm run db:push
```

2. Verify deployment:
- Check logs: `vercel logs`
- Test API endpoints
- Verify WebSocket connections

## Architecture on Vercel

```
┌─────────────────────────────────────┐
│         Vercel Edge Network         │
│  (CDN + Serverless Functions)       │
└──────────────┬──────────────────────┘
               │
    ┌──────────┴───────────┐
    │                      │
┌───▼────┐          ┌──────▼──────┐
│Next.js │          │   API       │
│  App   │          │  Routes     │
└────────┘          └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
        ┌─────▼────┐  ┌────▼────┐  ┌───▼────┐
        │PostgreSQL│  │ Neo4j   │  │External│
        │(Vercel)  │  │(AuraDB) │  │  APIs  │
        └──────────┘  └─────────┘  └────────┘
```

## Optimization Tips

1. **Edge Functions**: Use for frequently accessed API routes
2. **ISR**: Implement Incremental Static Regeneration for dashboard pages
3. **Image Optimization**: Use Next.js Image component
4. **Caching**: Implement Redis/Vercel KV for session data

## Monitoring

- Enable Vercel Analytics
- Set up error tracking (Sentry)
- Monitor database performance
- Track WebSocket connections

## Scaling Considerations

- Use Vercel Pro for higher limits
- Implement database connection pooling
- Consider separating WebSocket service to dedicated server
- Use serverless Redis for caching

## Troubleshooting

**Cold Starts:**
- Keep functions warm with periodic health checks
- Optimize bundle size

**WebSocket Issues:**
- Consider using Vercel's Edge Network or separate WS server
- Implement reconnection logic

**Database Connections:**
- Use connection pooling (PgBouncer)
- Set appropriate connection limits
