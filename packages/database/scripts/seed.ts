#!/usr/bin/env node

/**
 * NEXUS.LAB Database Seed Script
 * Seeds the database with initial data for development
 */

import { prisma } from '../src/index';

async function main() {
  console.log('🌱 Seeding database...');

  // No dummy data - users will sign up through the app
  console.log('✅ Database ready for user signups!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
