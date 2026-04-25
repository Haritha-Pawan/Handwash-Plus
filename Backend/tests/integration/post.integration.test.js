/**
 * Integration Tests: Post API
 * Refactored to match the quiz integration test pattern.
 */

import { jest, describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';

// Import model directly for setup and verification
import Post from "../../src/modules/post/post.model.js";

// ─── Environment Setup ───────────────────────────────────────────────────────

process.env.JWT_SECRET = 'post_integration_secret';
process.env.NODE_ENV = 'test';

// ─── Global Mocks ────────────────────────────────────────────────────────────

// Mock ImageKit to prevent real API calls
jest.unstable_mockModule('../../src/config/imagekitConfig.js', () => ({
  default: {
    upload: jest.fn().mockResolvedValue({ url: 'https://ik.imagekit.io/test/mock.jpg' }),
  },
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

const signToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

const teacherId = new mongoose.Types.ObjectId().toString();
const teacherToken = signToken({ id: teacherId, role: 'teacher' });

const otherTeacherId = new mongoose.Types.ObjectId().toString();
const otherTeacherToken = signToken({ id: otherTeacherId, role: 'teacher' });

const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

// ─── App & DB Setup ──────────────────────────────────────────────────────────

let mongod;
let app;

beforeAll(async () => {
  try {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);

    const appModule = await import('../../src/app.js');
    app = appModule.default;
  } catch (error) {
    console.error('Failed to start MongoMemoryServer:', error);
    throw error;
  }
}, 300000); // 5m timeout for binary download

afterAll(async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
});

beforeEach(async () => {
  await Post.deleteMany({}); // Direct model cleaning matches quiz pattern
});

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('Post API — Integration Tests', () => {

  describe('POST /api/posts/create', () => {
    it('should create a post successfully without an image', async () => {
      const res = await request(app)
        .post('/api/posts/create')
        .set(authHeader(teacherToken))
        .send({ title: 'New Story', content: 'Once upon a time...' });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('New Story');
      expect(res.body.author.toString()).toBe(teacherId);
    });

    it('should create a post successfully with an image buffer', async () => {
      const res = await request(app)
        .post('/api/posts/create')
        .set(authHeader(teacherToken))
        .field('title', 'Photo Story')
        .field('content', 'Look at this!')
        .attach('image', Buffer.from('fake-image-data'), 'test.jpg');

      expect(res.status).toBe(201);
      expect(res.body.imageUrl).toBe('https://ik.imagekit.io/test/mock.jpg');
    });
  });

  describe('GET /api/posts/my-posts', () => {
    it('should return only posts belonging to the authenticated teacher', async () => {
      // Seed directly via model (quiz pattern)
      await Post.create([
        { title: 'My Post', content: '...', author: teacherId },
        { title: 'Other Post', content: '...', author: otherTeacherId }
      ]);

      const res = await request(app)
        .get('/api/posts/my-posts')
        .set(authHeader(teacherToken));

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].title).toBe('My Post');
    });
  });

  describe('PUT /api/posts/:id', () => {
    it('should allow author to update their own post', async () => {
      const post = await Post.create({ title: 'Old Title', content: '...', author: teacherId });

      const res = await request(app)
        .put(`/api/posts/${post._id}`)
        .set(authHeader(teacherToken))
        .send({ title: 'New Title' });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('New Title');
    });

    it('should prevent one teacher from updating another teacher\'s post', async () => {
      const post = await Post.create({ title: 'Forbidden Post', content: '...', author: teacherId });

      const res = await request(app)
        .put(`/api/posts/${post._id}`)
        .set(authHeader(otherTeacherToken))
        .send({ title: 'I am a hacker' });

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/posts/:id', () => {
    it('should delete post successfully when called by owner', async () => {
      const post = await Post.create({ title: 'Delete Me', content: '...', author: teacherId });

      const res = await request(app)
        .delete(`/api/posts/${post._id}`)
        .set(authHeader(teacherToken));

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/deleted successfully/i);
      
      const exists = await Post.findById(post._id);
      expect(exists).toBeNull();
    });
  });
});
