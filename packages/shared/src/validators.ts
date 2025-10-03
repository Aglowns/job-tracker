import { z } from 'zod';

export const ApplicationSourceEnum = z.enum(['Email', 'Share', 'Bookmarklet']);
export const ApplicationStatusEnum = z.enum([
  'Applied',
  'PhoneScreen',
  'Interview',
  'Offer',
  'Rejected',
  'Ghosted',
]);
export const FollowupKindEnum = z.enum(['+7d', '+14d']);

export const CreateApplicationSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  location: z.string().optional(),
  job_url: z.string().url().optional(),
  job_id: z.string().optional(),
  source: ApplicationSourceEnum,
  applied_at: z.string().datetime().optional(),
  notes: z.string().optional(),
});

export const UpdateApplicationSchema = z.object({
  title: z.string().min(1).optional(),
  company: z.string().min(1).optional(),
  location: z.string().nullable().optional(),
  job_url: z.string().url().nullable().optional(),
  status: ApplicationStatusEnum.optional(),
  notes: z.string().nullable().optional(),
  needs_review: z.boolean().optional(),
});

export const CaptureSharedSchema = z.object({
  url: z.string().optional(),
  title: z.string().optional(),
  text: z.string().optional(),
});

export const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  API_BASE_URL: z.string().url(),
  WEB_BASE_URL: z.string().url(),
  GMAIL_CLIENT_ID: z.string().optional(),
  GMAIL_CLIENT_SECRET: z.string().optional(),
  OUTLOOK_CLIENT_ID: z.string().optional(),
  OUTLOOK_CLIENT_SECRET: z.string().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export type CreateApplicationInput = z.infer<typeof CreateApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof UpdateApplicationSchema>;
export type CaptureSharedInput = z.infer<typeof CaptureSharedSchema>;
export type EnvConfig = z.infer<typeof EnvSchema>;

