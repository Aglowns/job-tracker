import { prisma } from '@/lib/db';

export interface CreateAuditLogInput {
  action: string;
  source: string;
  payload_hash: string;
  user_id?: string | null;
}

export async function createAuditLog(input: CreateAuditLogInput) {
  return prisma.auditLog.create({
    data: {
      action: input.action,
      source: input.source,
      payload_hash: input.payload_hash,
      user_id: input.user_id || null,
    },
  });
}
