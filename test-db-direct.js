// Direct database test
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    
    const userCount = await prisma.user.count();
    console.log('✅ Connection successful!');
    console.log('User count:', userCount);
    
    // Try to create a test user
    const testUser = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        password: 'hashedpassword',
        name: 'Test User',
      },
    });
    console.log('✅ User created:', testUser);
    
    // Try to create a session
    const session = await prisma.session.create({
      data: {
        userId: testUser.id,
      },
    });
    console.log('✅ Session created:', session);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

testConnection();
