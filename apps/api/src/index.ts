import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import { env } from './config';
import webhooksRoutes from './routes/webhooks.routes';
import applicationsRoutes from './routes/applications.routes';
import captureRoutes from './routes/capture.routes';
import followupsRoutes from './routes/followups.routes';
import { sweepFollowups } from './services/followup.service';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/webhooks', webhooksRoutes);
app.use('/applications', applicationsRoutes);
app.use('/capture', captureRoutes);
app.use('/followups', followupsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Cron job for follow-ups (runs every hour)
cron.schedule('0 * * * *', async () => {
  console.log('Running followup sweep...');
  try {
    const count = await sweepFollowups();
    console.log(`Swept ${count} followups`);
  } catch (error) {
    console.error('Error in followup sweep:', error);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ API server running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${env.NODE_ENV}`);
  console.log(`✓ Followup sweep scheduled (every hour)`);
});

export default app;

