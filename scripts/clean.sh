#!/bin/bash

# NEXUS.LAB Environment Cleanup Script

set -e

echo "🧹 Cleaning NEXUS.LAB environment..."

# Stop Docker services
echo "🛑 Stopping Docker services..."
docker-compose down

# Remove node_modules
echo "📦 Removing node_modules..."
find . -name "node_modules" -type d -prune -exec rm -rf '{}' +

# Remove build artifacts
echo "🗑️  Removing build artifacts..."
find . -name "dist" -type d -prune -exec rm -rf '{}' +
find . -name ".next" -type d -prune -exec rm -rf '{}' +
find . -name ".turbo" -type d -prune -exec rm -rf '{}' +

# Remove generated files
echo "🔥 Removing generated files..."
rm -rf packages/database/node_modules/.prisma

echo "✅ Cleanup completed!"
echo "💡 Run 'npm install' to reinstall dependencies"
