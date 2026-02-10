#!/bin/bash

# NEXUS.LAB Production Build Script

set -e

echo "🚀 Building NEXUS.LAB for production..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
npm run clean

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Generate Prisma client
echo "🔨 Generating Prisma client..."
cd packages/database
npx prisma generate
cd ../..

# Type check
echo "🔍 Type checking..."
npm run type-check

# Lint
echo "✨ Linting..."
npm run lint

# Build all packages
echo "🏗️  Building packages..."
npm run build

echo "✅ Build completed successfully!"
