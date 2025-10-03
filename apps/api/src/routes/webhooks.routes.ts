import { Router } from 'express';
import { parseReceipt } from '@job-tracker/parsers';
import { createApplicationFromParsed } from '../services/application.service';
import { extractEmailData } from '../connectors/gmail.connector';
import { extractOutlookEmailData } from '../connectors/outlook.connector';

const router = Router();

// Gmail webhook
router.post('/gmail', async (req, res) => {
  try {
    const { message, messages } = req.body;

    // Handle both single message and batch
    const messagesToProcess = messages || (message ? [message] : []);

    if (messagesToProcess.length === 0) {
      return res.status(400).json({ error: 'No messages provided' });
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

    res.json({ success: true, results });
  } catch (error) {
    console.error('Error processing Gmail webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Outlook webhook
router.post('/outlook', async (req, res) => {
  try {
    const { message, messages } = req.body;

    // Handle both single message and batch
    const messagesToProcess = messages || (message ? [message] : []);

    if (messagesToProcess.length === 0) {
      return res.status(400).json({ error: 'No messages provided' });
    }

    const results = [];

    for (const msg of messagesToProcess) {
      // Extract email data
      const emailData = extractOutlookEmailData(msg);

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

    res.json({ success: true, results });
  } catch (error) {
    console.error('Error processing Outlook webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

