import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import dotenv from 'dotenv';
import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { Meeting } from '../src/models/Meeting.js';
import { Summary } from '../src/models/Summary.js';
import { VectorChunk } from '../src/models/VectorChunk.js';

dotenv.config();

describe('Vector DB Semantic Search Engine API', () => {
  let meeting1Id: string;
  let meeting2Id: string;

  beforeAll(async () => {
    await connectDB();

    // Create Meeting 1 (Database & Vector Search Focus)
    const m1 = await Meeting.create({
      title: 'Database Architecture & Vector Embedding Search',
      category: 'Work',
      status: 'completed'
    });
    meeting1Id = (m1._id as any).toString();

    await Summary.create({
      meetingId: m1._id,
      executiveSummary: 'Reviewed MongoDB collection indexes, sqlite-vec embeddings, and cosine similarity search for fast semantic query retrieval.',
      keyPoints: ['Optimized MongoDB document schemas.', 'Implemented 384-dimensional cosine vector distance search.'],
      modelUsed: 'openai/gpt-4o-mini'
    });

    // Create Meeting 2 (UI & Frontend Focus)
    const m2 = await Meeting.create({
      title: 'UI Component Library & Glassmorphism Design Tokens',
      category: 'Personal',
      status: 'completed'
    });
    meeting2Id = (m2._id as any).toString();

    await Summary.create({
      meetingId: m2._id,
      executiveSummary: 'Finalized Obsidian Glass & Kinetic Cyan color palette tokens, button styles, and live recording modal visualizer components.',
      keyPoints: ['Updated CSS design system variables.', 'Built equalizer spectrum animation.'],
      modelUsed: 'openai/gpt-4o-mini'
    });
  }, 30000);

  afterAll(async () => {
    if (meeting1Id) {
      await Meeting.findByIdAndDelete(meeting1Id);
      await Summary.deleteMany({ meetingId: meeting1Id });
      await VectorChunk.deleteMany({ meetingId: meeting1Id });
    }
    if (meeting2Id) {
      await Meeting.findByIdAndDelete(meeting2Id);
      await Summary.deleteMany({ meetingId: meeting2Id });
      await VectorChunk.deleteMany({ meetingId: meeting2Id });
    }
    await disconnectDB();
  });

  it('POST /api/v1/search/index/:meetingId should index meeting text into vector chunks', async () => {
    const res1 = await request(app).post(`/api/v1/search/index/${meeting1Id}`);
    expect(res1.status).toBe(200);
    expect(res1.body.success).toBe(true);
    expect(res1.body.indexedChunksCount).toBeGreaterThan(0);

    const res2 = await request(app).post(`/api/v1/search/index/${meeting2Id}`);
    expect(res2.status).toBe(200);
    expect(res2.body.success).toBe(true);
    expect(res2.body.indexedChunksCount).toBeGreaterThan(0);
  });

  it('GET /api/v1/search should return semantically relevant meetings ranked by vector score', async () => {
    const response = await request(app).get('/api/v1/search?query=database+vector+embedding');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.count).toBeGreaterThan(0);

    const topMatch = response.body.data[0];
    expect(topMatch.meetingId).toBe(meeting1Id);
    expect(topMatch.score).toBeGreaterThan(0);
  });
});
