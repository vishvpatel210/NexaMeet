import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { User } from '../src/models/User.js';

dotenv.config();

describe('User Authentication & JWT Security Pipeline API', () => {
  const testEmail = `alex_test_${Date.now()}@nexameet.app`;
  const testPassword = 'SecurePassword123!';
  let jwtToken: string;

  beforeAll(async () => {
    await connectDB();
  }, 20000);

  afterAll(async () => {
    try {
      if (mongoose.connection.readyState === 1) {
        await User.deleteMany({ email: testEmail });
      }
      await disconnectDB();
    } catch (err) {
      console.warn('Cleanup warning in auth.test.ts:', err);
    }
  });

  it('POST /api/v1/auth/signup should register new user and return JWT token', async () => {
    const response = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        name: 'Alex Lead Architect',
        email: testEmail,
        password: testPassword
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.email).toBe(testEmail);
    expect(response.body.user).not.toHaveProperty('password');

    jwtToken = response.body.token;
  });

  it('POST /api/v1/auth/signup should reject duplicate email registration', async () => {
    const response = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        name: 'Alex Duplicate',
        email: testEmail,
        password: testPassword
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Registration failed');
  });

  it('POST /api/v1/auth/login should authenticate user with valid credentials', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testEmail,
        password: testPassword
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body).toHaveProperty('token');
  });

  it('POST /api/v1/auth/login should reject invalid password', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testEmail,
        password: 'WrongPassword999!'
      });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Authentication failed');
  });

  it('GET /api/v1/auth/me should return authenticated user profile with valid Bearer token', async () => {
    const response = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.user.email).toBe(testEmail);
  });

  it('GET /api/v1/auth/me should reject request without token', async () => {
    const response = await request(app).get('/api/v1/auth/me');
    expect(response.status).toBe(401);
  });
});
