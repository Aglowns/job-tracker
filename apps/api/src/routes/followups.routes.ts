import { Router } from 'express';
import { sweepFollowups } from '../services/followup.service';

const router = Router();

// Sweep and send due followups
router.post('/sweep', async (req, res) => {
  try {
    const count = await sweepFollowups();
    res.json({ success: true, count });
  } catch (error) {
    console.error('Error sweeping followups:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

