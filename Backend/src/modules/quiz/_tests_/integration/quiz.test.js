import request from "supertest";
import mongoose from "mongoose";
import app from "../../../../app.js";
import { connectDB, closeDB, clearDB } from "../../../../../setupTests.js";

let quizId;
let classroomId;

// MUST match mockAuth teacher id
const teacherId = "699fe963fac309cee0d145a8";

describe("Quiz API Integration Tests", () => {

  beforeAll(async () => {
    await connectDB();

    // create classroom inside test DB
    const classroom = await mongoose.model("Classroom").create({
      name: "Test Classroom",
      teacherId: teacherId,
      schoolId: new mongoose.Types.ObjectId(),
      grade: 10
    });

    classroomId = classroom._id;
  });

  //  DO NOT CLEAR DB AFTER EACH TEST (this was your bug)
  afterAll(async () => {
    await clearDB();
    await closeDB();
  });

  
  // CREATE QUIZ

  it("should create a quiz", async () => {
    const res = await request(app)
      .post("/api/quiz")
      .send({
        title: "Math Quiz 1",
        classroomId: classroomId.toString(),
        isActive: true,
        startTime: "2026-04-10T10:00:00.000Z",
        endTime: "2026-04-10T11:00:00.000Z",
        questions: [
          {
            questionText: "2 + 2 = ?",
            type: "mcq",
            options: [
              { text: "3" },
              { text: "4" }
            ],
            correctAnswer: "4"
          }
        ]
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.quiz).toHaveProperty("_id");

    quizId = res.body.quiz._id;
  });

  
  // GET QUIZ BY ID
 
  it("should get quiz by id", async () => {
    const res = await request(app).get(`/api/quiz/${quizId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(quizId);
  });

  
  // GET BY CLASSROOM
 
  it("should get quizzes by classroom", async () => {
    const res = await request(app)
      .get(`/api/quiz/classroom/${classroomId}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  
  // UPDATE QUIZ
 
  it("should update quiz", async () => {
    const res = await request(app)
      .put(`/api/quiz/${quizId}`)
      .send({
        title: "Updated Quiz Title",
        isPublished: false
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.quiz.title).toBe("Updated Quiz Title");
  });

 
  // DELETE QUIZ
  
  it("should delete quiz", async () => {
    const res = await request(app)
      .delete(`/api/quiz/${quizId}`);

    expect(res.statusCode).toBe(200);
  });

});