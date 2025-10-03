import { NextRequest, NextResponse } from 'next/server';
import { parseReceipt } from '@job-tracker/parsers';
import { createApplicationFromParsed } from '@/lib/application-service';
import { extractEmailData } from '@/lib/gmail-connector';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, messages } = body;

    // Handle both single message and batch
    const messagesToProcess = messages || (message ? [message] : []);

    if (messagesToProcess.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }

    const results = [];

    for (const msg of messagesToProcess) {
      // Extract email data
      const emailData = extractEmailData(msg);

      // Parse the receipt
      const parsed = parseReceipt({
        content: emailData.content,
        subject: emailData.subject,
        sender: emailData.sender,
      });

      if (!parsed) {
        console.log('Could not parse email:', emailData.messageId);
        results.push({ messageId: emailData.messageId, status: 'skipped', reason: 'unparseable' });
        continue;
      }

      // Create application
      const application = await createApplicationFromParsed(
        parsed,
        'Email',
        emailData.messageId
      );

      results.push({
        messageId: emailData.messageId,
        status: 'success',
        applicationId: application.id,
      });
    }

    return NextResponse.json({ success: true, results });

  } catch (error) {
    console.error('Error processing Gmail webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
