import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// One-time migration endpoint for Vercel Postgres
export async function POST() {
  try {
    console.log('Starting database migration...');

    // Test connection first
    await prisma.$connect();
    
    // Create tables manually using Prisma's programmatic API
    console.log('Creating database tables...');
    
    // Create users table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "email" TEXT NOT NULL UNIQUE,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // Create applications table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Application" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "company" TEXT NOT NULL,
        "location" TEXT,
        "job_url" TEXT,
        "job_id" TEXT,
        "source" TEXT NOT NULL,
        "applied_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "status" TEXT NOT NULL DEFAULT 'Applied',
        "needs_review" BOOLEAN NOT NULL DEFAULT false,
        "last_email_msg_id" TEXT,
        "dedupe_key" TEXT NOT NULL UNIQUE,
        "notes" TEXT,
        "user_id" TEXT,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL
      )
    `;
    
    // Create followups table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Followup" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "application_id" TEXT NOT NULL,
        "due_at" TIMESTAMP(3) NOT NULL,
        "kind" TEXT NOT NULL,
        "sent_at" TIMESTAMP(3),
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("application_id") REFERENCES "Application"("id") ON DELETE CASCADE
      )
    `;
    
    // Create audit_logs table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "AuditLog" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "action" TEXT NOT NULL,
        "source" TEXT NOT NULL,
        "payload_hash" TEXT NOT NULL,
        "user_id" TEXT,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL
      )
    `;
    
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
