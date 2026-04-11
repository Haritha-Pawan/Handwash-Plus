/**
 * Integration Tests: Quiz API
 */

import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "@jest/globals";

import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import jwt from "jsonwebtoken";

import { Quiz } from "../../src/modules/quizzes/quiz.model.js";
import { Classroom } from "../../src/modules/classrooms/classroom.model.js";

process.env.JWT_SECRET = "integration_test_secret";

let mongod;
let app;

let classroomId;
let teacherToken;
let teacherId;

const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());

  const appModule = await import("../../src/app.js");
  app = appModule.default;

  // fake teacher
  teacherId = new mongoose.Types.ObjectId().toString();

  teacherToken = signToken({
    userId: teacherId,
    role: "teacher",
  });

  // FIXED CLASSROOM (matches your schema)
  const classroom = await Classroom.create({
    name: "Test Classroom",
    schoolId: new mongoose.Types.ObjectId(),
    grade: 10, // IMPORTANT: number, not string
    teacherId: teacherId,
  });

  classroomId = classroom._id.toString();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

beforeEach(async () => {
  await Quiz.deleteMany({});
});

/* ─────────────────────────────────────────────
   TEST DATA
──────────────────────────────────────────── */
const validQuizPayload = {
  title: "Math Quiz",
  classroomId: () => classroomId,
  questions: [
    {
      questionText: "2 + 2 = ?",
      options: [{ text: "3" }, { text: "4" }],
      correctAnswer: "4",
      type: "mcq",
    },
  ],
  startTime: new Date(),
  endTime: new Date(Date.now() + 3600000),
  isActive: true,
};

const auth = (token) => ({
  Authorization: `Bearer ${token}`,
});

/* ─────────────────────────────────────────────
   TEST SUITE
──────────────────────────────────────────── */

describe("Quiz API — Integration Tests", () => {
  /* ───── CREATE QUIZ ───── */
  describe("POST /api/quizzes", () => {
    it("should create a quiz", async () => {
      const res = await request(app)
        .post("/api/quizzes")
        .set(auth(teacherToken))
        .send({
          ...validQuizPayload,
          classroomId: classroomId,
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Quiz created successfuly");
      expect(res.body.quiz.title).toBe("Math Quiz");
    });

    it("should return 400 when missing fields", async () => {
      const res = await request(app)
        .post("/api/quizzes")
        .set(auth(teacherToken))
        .send({
          title: "",
          classroomId: "",
          questions: [],
        });

      expect(res.status).toBe(400);
    });

    it("should return 404 when classroom not found", async () => {
      const res = await request(app)
        .post("/api/quizzes")
        .set(auth(teacherToken))
        .send({
          title: "Quiz",
          classroomId: new mongoose.Types.ObjectId(),
          questions: [{ questionText: "Q1" }],
        });

      expect(res.status).toBe(404);
    });

    it("should return 403 when teacher not assigned", async () => {
      const fakeTeacherToken = signToken({
        userId: new mongoose.Types.ObjectId().toString(),
        role: "teacher",
      });

      const res = await request(app)
        .post("/api/quizzes")
        .set(auth(fakeTeacherToken))
        .send({
          title: "Quiz",
          classroomId,
          questions: [{ questionText: "Q1" }],
        });

      expect(res.status).toBe(403);
    });
  });

  /* ───── GET QUIZ BY ID ───── */
  describe("GET /api/quizzes/:id", () => {
    it("should get quiz by id", async () => {
      const createRes = await request(app)
        .post("/api/quizzes")
        .set(auth(teacherToken))
        .send({
          title: "Quiz 1",
          classroomId,
          questions: [
            {
              questionText: "Q1",
              type: "mcq",
            },
          ],
        });

      const quizId = createRes.body.quiz._id;

      const res = await request(app).get(`/api/quizzes/${quizId}`);

      expect(res.status).toBe(200);
      expect(res.body.title).toBe("Quiz 1");
    });

    it("should return 404 if quiz not found", async () => {
      const res = await request(app).get(
        `/api/quizzes/${new mongoose.Types.ObjectId()}`
      );

      expect(res.status).toBe(404);
    });
  });

  /* ───── GET BY CLASSROOM ───── */
  describe("GET /api/quizzes/classroom/:classroomId", () => {
    it("should return quizzes by classroom", async () => {
      await request(app)
        .post("/api/quizzes")
        .set(auth(teacherToken))
        .send({
          title: "Quiz A",
          classroomId,
          questions: [{ questionText: "Q1" }],
        });

      const res = await request(app).get(
        `/api/quizzes/classroom/${classroomId}`
      );

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("should return 400 for invalid classroomId", async () => {
      const res = await request(app).get(
        "/api/quizzes/classroom/invalid-id"
      );

      expect(res.status).toBe(400);
    });
  });

  /* ───── UPDATE QUIZ ───── */
  describe("PUT /api/quizzes/:id", () => {
    it("should update quiz", async () => {
      const createRes = await request(app)
        .post("/api/quizzes")
        .set(auth(teacherToken))
        .send({
          title: "Old Title",
          classroomId,
          questions: [{ questionText: "Q1" }],
        });

      const quizId = createRes.body.quiz._id;

      const res = await request(app)
        .put(`/api/quizzes/${quizId}`)
        .set(auth(teacherToken))
        .send({
          title: "Updated Title",
        });

      expect(res.status).toBe(200);
      expect(res.body.quiz.title).toBe("Updated Title");
    });

    it("should return 404 if quiz not found", async () => {
      const res = await request(app)
        .put(`/api/quizzes/${new mongoose.Types.ObjectId()}`)
        .set(auth(teacherToken))
        .send({ title: "Test" });

      expect(res.status).toBe(404);
    });
  });

  /* ───── DELETE QUIZ ───── */
  describe("DELETE /api/quizzes/:id", () => {
    it("should delete quiz", async () => {
      const createRes = await request(app)
        .post("/api/quizzes")
        .set(auth(teacherToken))
        .send({
          title: "Delete Quiz",
          classroomId,
          questions: [{ questionText: "Q1" }],
        });

      const quizId = createRes.body.quiz._id;

      const res = await request(app)
        .delete(`/api/quizzes/${quizId}`)
        .set(auth(teacherToken));

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/deleted/i);
    });

    it("should return 404 if quiz not found", async () => {
      const res = await request(app)
        .delete(`/api/quizzes/${new mongoose.Types.ObjectId()}`)
        .set(auth(teacherToken));

      expect(res.status).toBe(404);
    });
  });
});