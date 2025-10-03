import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../index';

describe('Applications API', () => {
  let createdAppId: string;

  it('POST /applications - should create an application', async () => {
    const response = await request(app)
      .post('/applications')
      .send({
        title: 'Test Engineer',
        company: 'Test Company',
        location: 'Remote',
        job_url: 'https://example.com/job',
        source: 'Share',
      });

    expect(response.status).toBe(201);
    expect(response.body.application).toBeDefined();
    expect(response.body.application.title).toBe('Test Engineer');
    expect(response.body.application.company).toBe('Test Company');
    
    createdAppId = response.body.application.id;
  });

  it('GET /applications - should list applications', async () => {
    const response = await request(app).get('/applications');

    expect(response.status).toBe(200);
    expect(response.body.applications).toBeDefined();
    expect(Array.isArray(response.body.applications)).toBe(true);
  });

  it('GET /applications/:id - should get single application', async () => {
    if (!createdAppId) {
      return; // Skip if no app created
    }

    const response = await request(app).get(`/applications/${createdAppId}`);

    expect(response.status).toBe(200);
    expect(response.body.application).toBeDefined();
    expect(response.body.application.id).toBe(createdAppId);
  });

  it('PATCH /applications/:id - should update application', async () => {
    if (!createdAppId) {
      return; // Skip if no app created
    }

    const response = await request(app)
      .patch(`/applications/${createdAppId}`)
      .send({
        status: 'Interview',
        notes: 'Had a great conversation',
      });

    expect(response.status).toBe(200);
    expect(response.body.application.status).toBe('Interview');
    expect(response.body.application.notes).toBe('Had a great conversation');
  });

  it('POST /applications - should reject invalid data', async () => {
    const response = await request(app)
      .post('/applications')
      .send({
        // Missing required fields
        title: 'Test',
      });

    expect(response.status).toBe(400);
  });
});

