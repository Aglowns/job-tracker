import { prisma } from '@job-tracker/db';
import { ParsedApplication, generateDedupeKey, addDays } from '@job-tracker/shared';
import { createAuditLog } from './audit.service';

export interface CreateApplicationInput {
  title: string;
  company: string;
  location?: string;
  job_url?: string;
  job_id?: string;
  source: 'Email' | 'Share' | 'Bookmarklet';
  applied_at?: Date;
  last_email_msg_id?: string;
  user_id?: string;
  notes?: string;
  needs_review?: boolean;
}

export async function createApplication(input: CreateApplicationInput) {
  const applied_at = input.applied_at || new Date();
  const dedupe_key = generateDedupeKey(
    input.company,
    input.title,
    input.job_url,
    applied_at
  );

  // Check for existing application
  const existing = await prisma.application.findUnique({
    where: { dedupe_key },
  });

  if (existing) {
    console.log('Duplicate application detected:', dedupe_key);
    return existing;
  }

  // Create application
  const application = await prisma.application.create({
    data: {
      title: input.title,
      company: input.company,
      location: input.location || null,
      job_url: input.job_url || null,
      job_id: input.job_id || null,
      source: input.source,
      applied_at,
      status: 'Applied',
      needs_review: input.needs_review || false,
      last_email_msg_id: input.last_email_msg_id || null,
      dedupe_key,
      notes: input.notes || null,
      user_id: input.user_id || null,
    },
  });

  // Create follow-ups (+7d and +14d)
  await prisma.followup.createMany({
    data: [
      {
        application_id: application.id,
        due_at: addDays(applied_at, 7),
        kind: 'PLUS_7D',
      },
      {
        application_id: application.id,
        due_at: addDays(applied_at, 14),
        kind: 'PLUS_14D',
      },
    ],
  });

  // Audit log
  await createAuditLog({
    action: 'application_created',
    source: input.source,
    payload_hash: dedupe_key,
    user_id: input.user_id,
  });

  return application;
}

export async function createApplicationFromParsed(
  parsed: ParsedApplication,
  source: 'Email' | 'Share' | 'Bookmarklet',
  email_msg_id?: string,
  user_id?: string
) {
  return createApplication({
    title: parsed.title,
    company: parsed.company,
    location: parsed.location,
    job_url: parsed.job_url,
    job_id: parsed.job_id,
    source,
    applied_at: parsed.applied_at,
    last_email_msg_id: email_msg_id,
    user_id,
    needs_review: (parsed.confidence || 0) < 0.6,
  });
}

export async function listApplications(filters?: {
  status?: string;
  user_id?: string;
  start_date?: Date;
  end_date?: Date;
}) {
  return prisma.application.findMany({
    where: {
      ...(filters?.status && { status: filters.status as any }),
      ...(filters?.user_id && { user_id: filters.user_id }),
      ...(filters?.start_date && { applied_at: { gte: filters.start_date } }),
      ...(filters?.end_date && { applied_at: { lte: filters.end_date } }),
    },
    orderBy: { applied_at: 'desc' },
    include: {
      followups: {
        orderBy: { due_at: 'asc' },
      },
    },
  });
}

export async function getApplication(id: string) {
  return prisma.application.findUnique({
    where: { id },
    include: {
      followups: {
        orderBy: { due_at: 'asc' },
      },
    },
  });
}

export async function updateApplication(
  id: string,
  data: {
    title?: string;
    company?: string;
    location?: string | null;
    job_url?: string | null;
    status?: string;
    notes?: string | null;
    needs_review?: boolean;
  }
) {
  return prisma.application.update({
    where: { id },
    data,
  });
}

export async function cancelFollowups(applicationId: string) {
  // Mark all pending followups as sent (effectively cancelling them)
  return prisma.followup.updateMany({
    where: {
      application_id: applicationId,
      sent_at: null,
    },
    data: {
      sent_at: new Date(),
    },
  });
}

