import { Router } from 'express';
import { CaptureSharedSchema } from '@job-tracker/shared';
import { parseSharedContent } from '@job-tracker/parsers';
import { createApplicationFromParsed } from '../services/application.service';

const router = Router();

// Capture shared content (PWA / Bookmarklet)
router.post('/shared', async (req, res) => {
  try {
    const validated = CaptureSharedSchema.parse(req.body);

    // Parse the shared content
    const parsed = parseSharedContent(
      validated.url,
      validated.title,
      validated.text
    );

    // Return prefill data with confidence
    res.json({
      prefill: {
        title: parsed.title,
        company: parsed.company,
        location: parsed.location,
        job_url: parsed.job_url,
        job_id: parsed.job_id,
      },
      confidence: parsed.confidence || 0.5,
      needs_review: (parsed.confidence || 0) < 0.6,
    });
  } catch (error: any) {
    console.error('Error capturing shared content:', error);
    
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create application from capture (after user confirms)
router.post('/confirm', async (req, res) => {
  try {
    const { title, company, location, job_url, job_id, source } = req.body;

    if (!title || !company) {
      return res.status(400).json({ error: 'Title and company are required' });
    }

    const application = await createApplicationFromParsed(
      {
        title,
        company,
        location,
        job_url,
        job_id,
      },
      source || 'Share'
    );

    res.status(201).json({ application });
  } catch (error) {
    console.error('Error confirming capture:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

