/**
 * Integration Tests: Grade API
 * Refactored to match the quiz integration test pattern.
 */

import { jest, describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';

// Import models directly for direct database seeding (quiz pattern)
import Grade from "../../src/modules/grades/grade.model.js";
import School from "../../src/modules/schools/school.model.js";
import { Classroom } from "../../src/modules/classrooms/classroom.model.js";

// ─── Environment Setup ───────────────────────────────────────────────────────

process.env.JWT_SECRET = 'grade_integration_secret';
process.env.NODE_ENV = 'test';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const signToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

const validSchoolData = {
  name: 'Grade Test School',
  address: '123 Primary St',
  district: 'District A',
  city: 'City X',
  lat: 1.0,
  lng: 1.0
};

// ─── App & DB Setup ──────────────────────────────────────────────────────────

let mongod;
let app;
let schoolId;
let teacherToken;
let adminToken;
let superAdminToken;

beforeAll(async () => {
  try {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);

    const appModule = await import('../../src/app.js');
    app = appModule.default;

    // Seed a School once for all tests in this suite
    const school = await School.create(validSchoolData);
    schoolId = school._id.toString();

    // Generate tokens linked to the seeded school
    superAdminToken = signToken({ role: 'superAdmin' });
    adminToken = signToken({ id: 'admin1', role: 'admin', school: schoolId });
    teacherToken = signToken({ id: 'teacher1', role: 'teacher', school: schoolId });

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
  // Clear collections except School
  await Grade.deleteMany({});
  await Classroom.deleteMany({});
});

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('Grade API — Integration Tests', () => {

  describe('POST /api/grades', () => {
    it('should create multiple grades for a school (admin)', async () => {
      const res = await request(app)
        .post('/api/grades')
        .set(authHeader(adminToken))
        .send({ count: 5 });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      
      const count = await Grade.countDocuments({ school: schoolId });
      expect(count).toBe(5);
    });

    it('should throw error for invalid count', async () => {
      const res = await request(app)
        .post('/api/grades')
        .set(authHeader(adminToken))
        .send({ count: 15 });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/grades/individual', () => {
    it('should add an individual grade with student count', async () => {
      const res = await request(app)
        .post('/api/grades/individual')
        .set(authHeader(adminToken))
        .send({ gradeNumber: 10, studentCount: 45, lowThreshold: 5 });

      expect(res.status).toBe(201);
      expect(res.body.data.gradeNumber).toBe(10);
      
      const saved = await Grade.findOne({ gradeNumber: 10, school: schoolId });
      expect(saved.studentCount).toBe(45);
    });
  });

  describe('PATCH /api/grades/:gradeId', () => {
    it('should update grade details', async () => {
      // Seed directly
      const grade = await Grade.create({ 
        gradeNumber: 1, 
        studentCount: 30, 
        school: schoolId 
      });

      const res = await request(app)
        .patch(`/api/grades/${grade._id}`)
        .set(authHeader(adminToken))
        .send({ studentCount: 35, lowThreshold: 10 });

      expect(res.status).toBe(200);
      
      const updated = await Grade.findById(grade._id);
      expect(updated.studentCount).toBe(35);
      expect(updated.sanitizer.lowThreshold).toBe(10);
    });
  });

  describe('Workflow: Bottle Distribution', () => {
    it('should distribute bottles and update stock', async () => {
      // 1. Create a grade with stock directly
      const grade = await Grade.create({ 
        gradeNumber: 1, 
        studentCount: 50, 
        school: schoolId,
        sanitizer: { currentQuantity: 100 }
      });

      // 2. Create a classroom for this grade directly
      await Classroom.create({
        schoolId: schoolId,
        grade: 1,
        section: 'A',
        studentCount: 25
      });

      // 3. Distribute bottles via API
      const res = await request(app)
        .post(`/api/grades/${grade._id}/distribute-bottles`)
        .set(authHeader(adminToken))
        .send({ bottlesPerClassroom: 2, month: 'January 2026' });

      expect(res.status).toBe(200);
      expect(res.body.data.totalDeducted).toBe(2);
      
      const updatedGrade = await Grade.findById(grade._id);
      expect(updatedGrade.sanitizer.currentQuantity).toBe(98);
    });
  });
});
