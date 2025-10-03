import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// One-time migration endpoint for Vercel Postgres
export async function POST() {
  try {
    console.log('Starting database migration...');

    // For Vercel deployment, we'll use a simple approach
    // You can run this once after deployment to set up tables

    // Test connection
    await prisma.$connect();
    
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
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
