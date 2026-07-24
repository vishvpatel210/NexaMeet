import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import dotenv from 'dotenv';
import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { Meeting } from '../src/models/Meeting.js';
import { Transcript } from '../src/models/Transcript.js';
import { Summary } from '../src/models/Summary.js';
import { ActionItem } from '../src/models/ActionItem.js';

dotenv.config();

describe('AI Summarization Engine & OpenRouter LLM API', () => {
  let testMeetingId: string;
  let testActionItemId: string;

  beforeAll(async () => {
    await connectDB();

    // Create mock meeting
    const meeting = await Meeting.create({
      title: 'AI Architecture & OpenRouter Integration Review',
      category: 'Work',
      status: 'completed'
    });
    testMeetingId = (meeting._id as any).toString();

    // Create mock transcript with speaker segments
    await Transcript.create({
      meetingId: meeting._id,
      sttEngine: 'whisper-local',
      language: 'en',
      segments: [
        {
          startTime: 0,
          endTime: 12.5,
          speakerLabel: 'Alex (Lead Architect)',
          content: 'We need to migrate our LLM completion pipeline to OpenRouter using Gemini 2.0 Flash Lite for high speed and low latency.'
        },
        {
          startTime: 12.5,
          endTime: 25.0,
          speakerLabel: 'Sarah (Tech Lead)',
          content: 'Agreed. Sarah will set up OpenRouter API keys and update the summary service by Thursday.'
        }
      ]
    });
  }, 30000);

  afterAll(async () => {
    if (testMeetingId) {
      await Meeting.findByIdAndDelete(testMeetingId);
      await Transcript.deleteMany({ meetingId: testMeetingId });
      await Summary.deleteMany({ meetingId: testMeetingId });
      await ActionItem.deleteMany({ meetingId: testMeetingId });
    }
    await disconnectDB();
  });

  it('GET /api/v1/summaries/templates should return built-in meeting prompt templates', async () => {
    const response = await request(app).get('/api/v1/summaries/templates');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.count).toBeGreaterThan(0);
  });

  it('POST /api/v1/summaries/generate should generate AI summary and extract action items', async () => {
    const response = await request(app)
      .post('/api/v1/summaries/generate')
      .send({
        meetingId: testMeetingId,
        templateId: 'executive-brief',
        rawUserNotes: 'Decided on OpenRouter for LLM. Sarah assigned to setup keys.'
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('summary');
    expect(response.body.data.summary).toHaveProperty('executiveSummary');
    expect(Array.isArray(response.body.data.summary.keyPoints)).toBe(true);
    expect(Array.isArray(response.body.data.actionItems)).toBe(true);

    if (response.body.data.actionItems.length > 0) {
      testActionItemId = response.body.data.actionItems[0]._id;
    }
  }, 25000);

  it('GET /api/v1/summaries/meeting/:meetingId should fetch generated summary & action items', async () => {
    const response = await request(app).get(`/api/v1/summaries/meeting/${testMeetingId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.summary.meetingId).toBe(testMeetingId);
  });

  it('PATCH /api/v1/summaries/action-items/:id should update action item completion status', async () => {
    if (!testActionItemId) return;

    const response = await request(app)
      .patch(`/api/v1/summaries/action-items/${testActionItemId}`)
      .send({ status: 'completed' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('completed');
  });
});
