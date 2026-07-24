import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Express Health API Route', () => {
  it('GET /api/v1/health should return 200 OK with status: ok', async () => {
    const response = await request(app).get('/api/v1/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('service', 'NexaMeet Express API Server');
    expect(response.body).toHaveProperty('timestamp');
  });

  it('GET / should return service metadata', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'NexaMeet API Backend');
  });
});
