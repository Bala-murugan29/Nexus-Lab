#!/usr/bin/env node

/**
 * NEXUS.LAB Database Seed Script
 * Seeds the database with initial data for development
 */

import { prisma } from '../src/index';

async function main() {
  console.log('🌱 Seeding database...');

  // Create test user
  const user = await prisma.user.upsert({
    where: { email: 'dev@nexuslab.ai' },
    update: {},
    create: {
      email: 'dev@nexuslab.ai',
      name: 'Dr. Aris',
    },
  });

  console.log('✅ Created user:', user.email);

  // Create test project
  const project = await prisma.project.upsert({
    where: { id: 'project-1' },
    update: {},
    create: {
      id: 'project-1',
      name: 'Neural Synth v2',
      description: 'AI-powered synthesis engine',
      userId: user.id,
    },
  });

  console.log('✅ Created project:', project.name);

  // Create knowledge nodes
  const reactNode = await prisma.knowledgeNode.upsert({
    where: {
      userId_concept: {
        userId: user.id,
        concept: 'React',
      },
    },
    update: {},
    create: {
      userId: user.id,
      concept: 'React',
      category: 'framework',
      masteryLevel: 0.85,
      confidence: 0.9,
    },
  });

  const tsNode = await prisma.knowledgeNode.upsert({
    where: {
      userId_concept: {
        userId: user.id,
        concept: 'TypeScript',
      },
    },
    update: {},
    create: {
      userId: user.id,
      concept: 'TypeScript',
      category: 'programming_language',
      masteryLevel: 0.75,
      confidence: 0.85,
    },
  });

  console.log('✅ Created knowledge nodes');

  // Create learning goals
  await prisma.learningGoal.create({
    data: {
      userId: user.id,
      concept: 'Advanced React Patterns',
      targetMastery: 0.9,
      progress: 0.6,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  });

  console.log('✅ Created learning goals');

  // Create session
  const session = await prisma.session.create({
    data: {
      userId: user.id,
      focusTime: 45,
      tasksCompleted: 3,
      currentFile: 'CoreEngine.tsx',
    },
  });

  console.log('✅ Created session');

  // Create sample activities
  await prisma.activity.createMany({
    data: [
      {
        sessionId: session.id,
        type: 'code_edit',
        details: { file: 'CoreEngine.tsx', linesChanged: 15 },
      },
      {
        sessionId: session.id,
        type: 'file_opened',
        details: { file: 'utils.ts' },
      },
    ],
  });

  console.log('✅ Created activities');

  // Create sample learning content
  await prisma.learningContent.create({
    data: {
      type: 'micro_lesson',
      concept: 'React Hooks',
      duration: 120,
      difficulty: 'intermediate',
      content: {
        text: 'Understanding React Hooks',
        code: [
          {
            language: 'typescript',
            code: 'const [state, setState] = useState(0);',
            explanation: 'useState hook for state management',
          },
        ],
      },
      prerequisites: ['React', 'JavaScript'],
      learningObjectives: ['Understand hooks', 'Use useState', 'Use useEffect'],
    },
  });

  console.log('✅ Created learning content');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
