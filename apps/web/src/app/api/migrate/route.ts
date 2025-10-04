import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { execSync } from 'child_process';

// One-time migration endpoint for Vercel Postgres
export async function POST() {
  try {
    console.log('Starting database migration...');

    // Test connection first
    await prisma.$connect();
    
    // Push the schema to create tables
    console.log('Pushing Prisma schema to database...');
    execSync('npx prisma db push --force-reset', { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    // Create a test user to verify everything works
    const testUser = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
      },
    });

    // Create a test application
    const testApp = await prisma.application.upsert({
      where: { 
        dedupe_key: 'test-dedupe-key-vercel' 
      },
      update: {},
      create: {
        title: 'Test Engineer',
        company: 'Vercel Test Corp',
        source: 'Share',
        applied_at: new Date(),
        status: 'Applied',
        dedupe_key: 'test-dedupe-key-vercel',
        user_id: testUser.id,
      },
    });

    await prisma.$disconnect();

    return NextResponse.json({ 
      success: true, 
      message: 'Database migration completed successfully',
      testUser: testUser.email,
      testApplication: testApp.title
    });

  } catch (error) {
    console.error('Migration error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
      { status: 500 }
    );
  }
}
