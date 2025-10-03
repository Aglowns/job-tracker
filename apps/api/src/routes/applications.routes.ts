import { Router } from 'express';
import {
  CreateApplicationSchema,
  UpdateApplicationSchema,
} from '@job-tracker/shared';
import {
  createApplication,
  listApplications,
  getApplication,
  updateApplication,
} from '../services/application.service';

const router = Router();

// List applications
router.get('/', async (req, res) => {
  try {
    const { status, user_id, start_date, end_date } = req.query;

    const filters: any = {};
    if (status) filters.status = status as string;
    if (user_id) filters.user_id = user_id as string;
    if (start_date) filters.start_date = new Date(start_date as string);
    if (end_date) filters.end_date = new Date(end_date as string);

    const applications = await listApplications(filters);
    res.json({ applications });
  } catch (error) {
    console.error('Error listing applications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single application
router.get('/:id', async (req, res) => {
  try {
    const application = await getApplication(req.params.id);
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({ application });
  } catch (error) {
    console.error('Error getting application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create application
router.post('/', async (req, res) => {
  try {
    const validated = CreateApplicationSchema.parse(req.body);

    const application = await createApplication({
      ...validated,
      applied_at: validated.applied_at ? new Date(validated.applied_at) : undefined,
    });

    res.status(201).json({ application });
  } catch (error: any) {
    console.error('Error creating application:', error);
    
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update application
router.patch('/:id', async (req, res) => {
  try {
    const validated = UpdateApplicationSchema.parse(req.body);

    const application = await updateApplication(req.params.id, validated);

    res.json({ application });
  } catch (error: any) {
    console.error('Error updating application:', error);
    
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

