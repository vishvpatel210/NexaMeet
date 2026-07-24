import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import dotenv from 'dotenv';
import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { Meeting } from '../src/models/Meeting.js';

dotenv.config();

describe('Meeting CRUD API & MongoDB Integration', () => {
  let testMeetingId: string;

  beforeAll(async () => {
    await connectDB();
  }, 15000);

  afterAll(async () => {
    // Clean up test data if created
    if (testMeetingId) {
      await Meeting.findByIdAndDelete(testMeetingId);
    }
    await disconnectDB();
  });

  it('POST /api/v1/meetings should create a new meeting in MongoDB', async () => {
    const payload = {
      title: 'Automated Test - Architecture Review',
      category: 'Work',
      location: 'Vibecode HQ',
      status: 'completed',
      isStarred: true,
      tags: ['architecture', 'test']
    };

    const response = await request(app)
      .post('/api/v1/meetings')
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('_id');
    expect(response.body.data.title).toBe(payload.title);

    testMeetingId = response.body.data._id;
  });

  it('GET /api/v1/meetings should list meetings including the created meeting', async () => {
    const response = await request(app).get('/api/v1/meetings');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.count).toBeGreaterThan(0);
  });

  it('GET /api/v1/meetings/:id should fetch details of created meeting', async () => {
    const response = await request(app).get(`/api/v1/meetings/${testMeetingId}`);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.meeting.title).toBe('Automated Test - Architecture Review');
  });

  it('PATCH /api/v1/meetings/:id should update meeting title', async () => {
    const response = await request(app)
      .patch(`/api/v1/meetings/${testMeetingId}`)
      .send({ title: 'Updated Test - Architecture Review' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe('Updated Test - Architecture Review');
  });

  it('DELETE /api/v1/meetings/:id should delete the meeting', async () => {
    const response = await request(app).delete(`/api/v1/meetings/${testMeetingId}`);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const checkResponse = await request(app).get(`/api/v1/meetings/${testMeetingId}`);
    expect(checkResponse.status).toBe(404);
  });
});
