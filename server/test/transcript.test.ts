import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { Meeting } from '../src/models/Meeting.js';
import { Recording } from '../src/models/Recording.js';
import { Transcript } from '../src/models/Transcript.js';

dotenv.config();

describe('Whisper Speech-to-Text (STT) Pipeline API', () => {
  let testMeetingId: string;
  let testRecordingId: string;
  let testAudioFilePath: string;
  let testSegmentId: string;

  beforeAll(async () => {
    await connectDB();

    // Create mock meeting
    const meeting = await Meeting.create({
      title: 'Whisper STT Test Meeting',
      category: 'Work',
      status: 'completed'
    });
    testMeetingId = (meeting._id as any).toString();

    // Create dummy audio file on disk
    const uploadDir = path.join(process.cwd(), 'uploads', 'recordings');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    testAudioFilePath = path.join(uploadDir, `test_stt_${Date.now()}.wav`);
    fs.writeFileSync(testAudioFilePath, Buffer.from('RIFF....WAVEfmt ....data....'));

    // Create mock recording
    const recording = await Recording.create({
      meetingId: meeting._id,
      filePath: testAudioFilePath,
      durationSeconds: 15,
      sampleRate: 16000,
      format: 'wav'
    });
    testRecordingId = (recording._id as any).toString();
  }, 15000);

  afterAll(async () => {
    if (testMeetingId) {
      await Meeting.findByIdAndDelete(testMeetingId);
      await Recording.deleteMany({ meetingId: testMeetingId });
      await Transcript.deleteMany({ meetingId: testMeetingId });
    }
    if (fs.existsSync(testAudioFilePath)) {
      try {
        fs.unlinkSync(testAudioFilePath);
      } catch (e) {}
    }
    await disconnectDB();
  });

  it('POST /api/v1/transcripts/transcribe/:recordingId should generate timestamped transcript segments', async () => {
    const response = await request(app)
      .post(`/api/v1/transcripts/transcribe/${testRecordingId}`)
      .send({ language: 'en', sttEngine: 'whisper-local' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('segments');
    expect(Array.isArray(response.body.data.segments)).toBe(true);
    expect(response.body.data.segments.length).toBeGreaterThan(0);

    const firstSegment = response.body.data.segments[0];
    expect(firstSegment).toHaveProperty('startTime');
    expect(firstSegment).toHaveProperty('endTime');
    expect(firstSegment).toHaveProperty('speakerLabel');
    expect(firstSegment).toHaveProperty('content');

    testSegmentId = firstSegment._id;
  });

  it('GET /api/v1/transcripts/meeting/:meetingId should retrieve meeting transcript', async () => {
    const response = await request(app).get(`/api/v1/transcripts/meeting/${testMeetingId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.meetingId).toBe(testMeetingId);
  });

  it('PATCH /api/v1/transcripts/meeting/:meetingId/segment/:segmentId should update speaker label', async () => {
    const response = await request(app)
      .patch(`/api/v1/transcripts/meeting/${testMeetingId}/segment/${testSegmentId}`)
      .send({ speakerLabel: 'Alex (Lead Architect)' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const updatedSegment = response.body.data.segments.find((s: any) => s._id === testSegmentId);
    expect(updatedSegment.speakerLabel).toBe('Alex (Lead Architect)');
  });
});
