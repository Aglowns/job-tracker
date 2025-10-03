import { prisma } from '@job-tracker/db';

export async function sweepFollowups() {
  const now = new Date();

  // Find all due, unsent followups
  const dueFollowups = await prisma.followup.findMany({
    where: {
      due_at: { lte: now },
      sent_at: null,
    },
    include: {
      application: true,
    },
  });

  console.log(`Found ${dueFollowups.length} due followups`);

  // Mark them as sent (in MVP, we just log)
  for (const followup of dueFollowups) {
    await prisma.followup.update({
      where: { id: followup.id },
      data: { sent_at: now },
    });

    console.log(
      `✓ Follow-up ${followup.kind} sent for application: ${followup.application.title} at ${followup.application.company}`
    );
  }

  return dueFollowups.length;
}

export async function checkEmailForResponse(emailContent: string, applicationId: string) {
  // Positive intent patterns
  const positivePatterns = [
    /schedule|interview|next steps|phone screen|call|meeting|speak with you/i,
  ];

  // Rejection patterns
  const rejectionPatterns = [
    /unfortunately|not moving forward|regret|decided to pursue|other candidates/i,
  ];

  const isPositive = positivePatterns.some((pattern) => pattern.test(emailContent));
  const isRejection = rejectionPatterns.some((pattern) => pattern.test(emailContent));

  if (isPositive) {
    // Update status to PhoneScreen/Interview
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: 'PhoneScreen' },
    });

    // Cancel pending followups
    await prisma.followup.updateMany({
      where: {
        application_id: applicationId,
        sent_at: null,
      },
      data: { sent_at: new Date() },
    });

    console.log(`✓ Positive response detected for application ${applicationId}`);
    return 'positive';
  }

  if (isRejection) {
    // Update status to Rejected
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: 'Rejected' },
    });

    // Cancel pending followups
    await prisma.followup.updateMany({
      where: {
        application_id: applicationId,
        sent_at: null,
      },
      data: { sent_at: new Date() },
    });

    console.log(`✓ Rejection detected for application ${applicationId}`);
    return 'rejection';
  }

  return 'neutral';
}

