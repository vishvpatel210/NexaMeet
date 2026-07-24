import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { Meeting } from '../src/models/Meeting.js';
import { Recording } from '../src/models/Recording.js';

dotenv.config();

describe('Audio Upload & Recording Pipeline API', () => {
  let testMeetingId: string;
  let testRecordingId: string;
  let savedFilename: string;

  beforeAll(async () => {
    await connectDB();

    // Create a mock meeting for recording upload tests
    const meeting = await Meeting.create({
      title: 'Recording Upload Test Meeting',
      category: 'Work',
      status: 'scheduled'
    });
    testMeetingId = (meeting._id as any).toString();
  }, 15000);

  afterAll(async () => {
    if (testMeetingId) {
      await Meeting.findByIdAndDelete(testMeetingId);
      await Recording.deleteMany({ meetingId: testMeetingId });
    }
    await disconnectDB();
  });

  it('POST /api/v1/recordings/upload should upload a WAV file and register recording document', async () => {
    // Generate dummy WAV header buffer (44 bytes RIFF WAV header)
    const dummyWavHeader = Buffer.from([
      0x52, 0x49, 0x46, 0x46, 0x24, 0x00, 0x00, 0x00, 0x57, 0x41, 0x56, 0x45,
      0x66, 0x6d, 0x74, 0x20, 0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00,
      0x80, 0x3e, 0x00, 0x00, 0x00, 0x7d, 0x00, 0x00, 0x02, 0x00, 0x10, 0x00,
      0x64, 0x61, 0x74, 0x61, 0x00, 0x00, 0x00, 0x00
    ]);

    const response = await request(app)
      .post('/api/v1/recordings/upload')
      .field('meetingId', testMeetingId)
      .field('durationSeconds', '12.5')
      .field('sampleRate', '16000')
      .field('format', 'wav')
      .attach('audio', dummyWavHeader, 'test_audio.wav');

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('_id');
    expect(response.body.data.meetingId).toBe(testMeetingId);

    testRecordingId = response.body.data._id;
    savedFilename = path.basename(response.body.data.filePath);

    // Verify file actually exists on disk
    expect(fs.existsSync(response.body.data.filePath)).toBe(true);
  });

  it('GET /api/v1/recordings/meeting/:meetingId should list recordings for the meeting', async () => {
    const response = await request(app).get(`/api/v1/recordings/meeting/${testMeetingId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.count).toBe(1);
    expect(response.body.data[0]._id).toBe(testRecordingId);
  });

  it('GET /api/v1/recordings/file/:filename should stream the uploaded audio file', async () => {
    const response = await request(app).get(`/api/v1/recordings/file/${savedFilename}`);

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('audio/wav');
  });

  it('DELETE /api/v1/recordings/:id should delete recording file from disk and database', async () => {
    const response = await request(app).delete(`/api/v1/recordings/${testRecordingId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const recordingInDb = await Recording.findById(testRecordingId);
    expect(recordingInDb).toBeNull();
  });
});
