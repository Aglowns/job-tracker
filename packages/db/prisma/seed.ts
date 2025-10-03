import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create a stub user
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
    },
  });

  console.log('Created user:', user.email);

  // Create sample applications
  const app1 = await prisma.application.create({
    data: {
      title: 'Senior Software Engineer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      job_url: 'https://jobs.techcorp.com/senior-engineer',
      job_id: 'TC-12345',
      source: 'Email',
      applied_at: new Date('2024-01-15'),
      status: 'Applied',
      needs_review: false,
      dedupe_key: 'sample-dedupe-key-1',
      user_id: user.id,
    },
  });

  console.log('Created application:', app1.title, 'at', app1.company);

  // Create followups for app1
  await prisma.followup.createMany({
    data: [
      {
        application_id: app1.id,
        due_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        kind: 'PLUS_7D',
      },
      {
        application_id: app1.id,
        due_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        kind: 'PLUS_14D',
      },
    ],
  });

  const app2 = await prisma.application.create({
    data: {
      title: 'Frontend Developer',
      company: 'StartupXYZ',
      location: 'Remote',
      job_url: 'https://startupxyz.com/careers/frontend',
      source: 'Share',
      applied_at: new Date('2024-01-10'),
      status: 'PhoneScreen',
      needs_review: false,
      dedupe_key: 'sample-dedupe-key-2',
      user_id: user.id,
    },
  });

  console.log('Created application:', app2.title, 'at', app2.company);

  const app3 = await prisma.application.create({
    data: {
      title: 'Full Stack Engineer',
      company: 'BigTech Inc',
      location: 'New York, NY',
      job_url: 'https://bigtech.com/jobs/fullstack',
      source: 'Bookmarklet',
      applied_at: new Date('2024-01-05'),
      status: 'Interview',
      needs_review: false,
      dedupe_key: 'sample-dedupe-key-3',
      user_id: user.id,
    },
  });

  console.log('Created application:', app3.title, 'at', app3.company);

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

