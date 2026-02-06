#!/bin/bash

# NEXUS.LAB Development Server Startup Script

set -e

echo "🎬 Starting NEXUS.LAB development environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "⚠️  Docker is not running. Please start Docker first."
  exit 1
fi

# Start databases
echo "🗄️  Starting databases..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 5

# Generate Prisma client
echo "🔨 Generating Prisma client..."
npm run db:generate

# Push database schema
echo "📊 Pushing database schema..."
npm run db:push

# Start development server
echo "🚀 Starting development servers..."
npm run dev
