/**
 * Integration Tests: School API
 *
 * Spins up a real Express app connected to an in-memory MongoDB instance.
 * Tests every school route end-to-end, including auth/role enforcement.
 *
 * Requirements (install before running):
 *   npm install --save-dev jest @jest/globals supertest mongodb-memory-server cross-env
 */



/*add test*/

import { jest, describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';

// ─── We need to set JWT_SECRET before importing anything that reads it ────────
process.env.JWT_SECRET = 'integration_test_secret';
process.env.JWT_REFRESH_SECRET = 'integration_test_refresh_secret';
process.env.NODE_ENV = 'test';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Generate a signed JWT for use in Authorization header.
 */
const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

const superAdminToken = signToken({
  userId: new mongoose.Types.ObjectId().toString(),
  email: 'superadmin@test.com',
  role: 'superAdmin',
});

const regularUserToken = signToken({
  userId: new mongoose.Types.ObjectId().toString(),
  email: 'user@test.com',
  role: 'teacher',
});

const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

const validSchoolPayload = {
  name: 'Integration Test School',
  address: '99 Test Avenue',
  district: 'TestDistrict v1',
  city: 'TestCity',
  lat: -1.3,
  lng: 36.8,
};

// ─── Setup ────────────────────────────────────────────────────────────────────

let mongod;
let app;

beforeAll(async () => {
  // Start in-memory MongoDB
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  // Connect mongoose
  await mongoose.connect(uri);

  // Import app AFTER mongoose is connected (app.js doesn't reconnect itself)
  const appModule = await import('../../src/app.js');
  app = appModule.default;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

beforeEach(async () => {
  // Clear schools collection between tests for isolation
  const collections = mongoose.connection.collections;
  if (collections.schools) {
    await collections.schools.deleteMany({});
  }
});

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('School API — Integration Tests', () => {

  // ── GET /api/schools ────────────────────────────────────────────────────────

  describe('GET /api/schools', () => {
    it('should return 200 with empty array when no schools exist', async () => {
      const res = await request(app).get('/api/schools');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data).toHaveLength(0);
    });

    it('should return all schools after one is created', async () => {
      // Seed one school via the POST endpoint
      await request(app)
        .post('/api/schools')
        .set(authHeader(superAdminToken))
        .send(validSchoolPayload);

      const res = await request(app).get('/api/schools');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].name).toBe('Integration Test School');
    });
  });

  // ── POST /api/schools ───────────────────────────────────────────────────────

  describe('POST /api/schools', () => {
    it('should create a school and return 201 for superAdmin', async () => {
      const res = await request(app)
        .post('/api/schools')
        .set(authHeader(superAdminToken))
        .send(validSchoolPayload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Integration Test School');
      expect(res.body.data.city).toBe('TestCity');
    });

    it('should return 401 when no auth token is provided', async () => {
      const res = await request(app)
        .post('/api/schools')
        .send(validSchoolPayload);

      expect(res.status).toBe(401);
    });

    it('should return 403 when a non-superAdmin tries to create a school', async () => {
      const res = await request(app)
        .post('/api/schools')
        .set(authHeader(regularUserToken))
        .send(validSchoolPayload);

      expect(res.status).toBe(403);
    });

    it('should return 400 when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/schools')
        .set(authHeader(superAdminToken))
        .send({ name: 'Incomplete School' }); // missing address, district, city, lat, lng

      expect(res.status).toBe(400);
    });

    it('should return 409 when creating a school with a duplicate name', async () => {
      // Create the first school
      await request(app)
        .post('/api/schools')
        .set(authHeader(superAdminToken))
        .send(validSchoolPayload);

      // Try to create a duplicate
      const res = await request(app)
        .post('/api/schools')
        .set(authHeader(superAdminToken))
        .send(validSchoolPayload);

      expect(res.status).toBe(409);
      expect(res.body.message).toMatch(/already exists/i);
    });

    it('should return 400 for out-of-range coordinates', async () => {
      const res = await request(app)
        .post('/api/schools')
        .set(authHeader(superAdminToken))
        .send({ ...validSchoolPayload, lat: 200, lng: 400 });

      expect(res.status).toBe(400);
    });
  });

  // ── GET /api/schools/:id ─────────────────────────────────────────────────────

  describe('GET /api/schools/:id', () => {
    it('should return 200 with the school when it exists', async () => {
      const createRes = await request(app)
        .post('/api/schools')
        .set(authHeader(superAdminToken))
        .send(validSchoolPayload);

      const schoolId = createRes.body.data.id;

      const res = await request(app).get(`/api/schools/${schoolId}`);

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('Integration Test School');
    });

    it('should return 404 for a non-existent school ID', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(app).get(`/api/schools/${fakeId}`);

      expect(res.status).toBe(404);
    });

    it('should return 400 for an invalid ID format', async () => {
      const res = await request(app).get('/api/schools/not-a-valid-id');

      expect(res.status).toBe(400);
    });
  });

  // ── PUT /api/schools/:id ──────────────────────────────────────────────────────

  describe('PUT /api/schools/:id', () => {
    let schoolId;

    beforeEach(async () => {
      const createRes = await request(app)
        .post('/api/schools')
        .set(authHeader(superAdminToken))
        .send(validSchoolPayload);
      schoolId = createRes.body.data.id;
    });

    it('should update a school and return 200 for superAdmin', async () => {
      const res = await request(app)
        .put(`/api/schools/${schoolId}`)
        .set(authHeader(superAdminToken))
        .send({ name: 'Updated School Name', address: '99 Test Avenue' });

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('Updated School Name');
    });

    it('should return 401 when no token is provided', async () => {
      const res = await request(app)
        .put(`/api/schools/${schoolId}`)
        .send({ name: 'Hacker Update' });

      expect(res.status).toBe(401);
    });

    it('should return 403 when a non-superAdmin tries to update', async () => {
      const res = await request(app)
        .put(`/api/schools/${schoolId}`)
        .set(authHeader(regularUserToken))
        .send({ name: 'Hacker Update' });

      expect(res.status).toBe(403);
    });

    it('should return 404 when updating a non-existent school', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .put(`/api/schools/${fakeId}`)
        .set(authHeader(superAdminToken))
        .send({ name: 'Ghost School', address: '1 Ghost Street' });

      expect(res.status).toBe(404);
    });
  });

  // ── DELETE /api/schools/:id ───────────────────────────────────────────────────

  describe('DELETE /api/schools/:id', () => {
    let schoolId;

    beforeEach(async () => {
      const createRes = await request(app)
        .post('/api/schools')
        .set(authHeader(superAdminToken))
        .send(validSchoolPayload);
      schoolId = createRes.body.data.id;
    });

    it('should delete a school and return 200 for superAdmin', async () => {
      const res = await request(app)
        .delete(`/api/schools/${schoolId}`)
        .set(authHeader(superAdminToken));

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/deleted/i);
    });

    it('should return 401 when no token is provided', async () => {
      const res = await request(app).delete(`/api/schools/${schoolId}`);
      expect(res.status).toBe(401);
    });

    it('should return 403 when a non-superAdmin tries to delete', async () => {
      const res = await request(app)
        .delete(`/api/schools/${schoolId}`)
        .set(authHeader(regularUserToken));

      expect(res.status).toBe(403);
    });

    it('should return 404 when deleting a non-existent school', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .delete(`/api/schools/${fakeId}`)
        .set(authHeader(superAdminToken));

      expect(res.status).toBe(404);
    });

    it('should confirm the school is gone after deletion', async () => {
      await request(app)
        .delete(`/api/schools/${schoolId}`)
        .set(authHeader(superAdminToken));

      const res = await request(app).get(`/api/schools/${schoolId}`);
      expect(res.status).toBe(404);
    });
  });

  // ── GET /api/schools/city/:city ───────────────────────────────────────────────

  describe('GET /api/schools/city/:city', () => {
    it('should return schools filtered by city', async () => {
      await request(app)
        .post('/api/schools')
        .set(authHeader(superAdminToken))
        .send(validSchoolPayload);

      const res = await request(app).get('/api/schools/city/TestCity');

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].city).toBe('TestCity');
    });

    it('should return empty array for a city with no schools', async () => {
      const res = await request(app).get('/api/schools/city/NonExistentCity');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(0);
    });
  });

  // ── GET /api/schools/district/:district ──────────────────────────────────────

  describe('GET /api/schools/district/:district', () => {
    it('should return schools filtered by district', async () => {
      await request(app)
        .post('/api/schools')
        .set(authHeader(superAdminToken))
        .send(validSchoolPayload);

      const res = await request(app).get('/api/schools/district/TestDistrict');

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should return empty array for a non-existent district', async () => {
      const res = await request(app).get('/api/schools/district/NoWhereDistrict');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(0);
    });
  });
});
