import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection by executing a simple query
    await prisma.$connect();
    
    // Try to count users to verify read access
    const userCount = await prisma.user.count();
    
    // Get database info
    const result = await prisma.$queryRaw`SELECT version()`;
    
    return NextResponse.json(
      {
        status: 'success',
        message: 'Database connection successful',
        details: {
          connected: true,
          userCount,
          databaseVersion: result,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
