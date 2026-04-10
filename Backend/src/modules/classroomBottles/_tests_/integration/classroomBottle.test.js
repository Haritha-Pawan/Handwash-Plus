import request from "supertest";
import mongoose from "mongoose";
import app from "../../../../app.js";
import { connectDB, closeDB, clearDB } from "../../../../../setupTests.js";

let classroomId;

describe("Classroom Bottles API", () => {

  beforeAll(async () => {
    await connectDB();
  });

  afterEach(async () => {
    await clearDB();
  });

  afterAll(async () => {
    await closeDB();
  });

  // SUCCESS CASE
  it("Should update classroom bottles", async () => {
    const classroom = await mongoose.model("Classroom").create({
      teacherId: "699fe963fac309cee0d145a8",
      schoolId: new mongoose.Types.ObjectId(),
      grade: "1",
      name: "6 A",
    });

    classroomId = classroom._id;

    await mongoose.model("DistributedBottles").create({
      classroomId,
      month: "January",
      bottleDistributed: 10,
    });

    const res = await request(app)
      .put("/api/classroomsBottles/update")
      .send({
        classroomId: classroomId.toString(),
        month: "January",
        bottleUsed: 5,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.ClassroomBottles.bottleRemaining).toBe(5);
  });

  // CLASSROOM NOT FOUND
  it("Should return 404 if classroom not found", async () => {
    const res = await request(app)
      .put("/api/classroomsBottles/update")
      .send({
        classroomId: new mongoose.Types.ObjectId(),
        month: "January",
        bottleUsed: 2,
      });

    expect(res.statusCode).toBe(404);
  });

  // TEACHER NOT AUTHORIZED
  it("Should return 403 if teacher is not assigned", async () => {
    const classroom = await mongoose.model("Classroom").create({
      teacherId: new mongoose.Types.ObjectId(),
      schoolId: new mongoose.Types.ObjectId(),
      grade: "1",
      name: "Test Class",
    });

    await mongoose.model("DistributedBottles").create({
      classroomId: classroom._id,
      month: "January",
      bottleDistributed: 10,
    });

    const res = await request(app)
      .put("/api/classroomsBottles/update")
      .send({
        classroomId: classroom._id.toString(),
        month: "January",
        bottleUsed: 2,
      });

    expect(res.statusCode).toBe(403);
  });

  //  EXCEED BOTTLES
  it("Should return 404 if bottleUsed exceeds distributed bottles", async () => {
    const classroom = await mongoose.model("Classroom").create({
      teacherId: "699fe963fac309cee0d145a8",
      schoolId: new mongoose.Types.ObjectId(),
      grade: "1",
      name: "Test Class",
    });

    await mongoose.model("DistributedBottles").create({
      classroomId: classroom._id,
      month: "January",
      bottleDistributed: 5,
    });

    const res = await request(app)
      .put("/api/classroomsBottles/update")
      .send({
        classroomId: classroom._id.toString(),
        month: "January",
        bottleUsed: 20,
      });

    expect(res.statusCode).toBe(404);
  });

  // GET BOTTLES
  it("Should get classroom bottles by classroomId", async () => {
    const classroom = await mongoose.model("Classroom").create({
      teacherId: "699fe963fac309cee0d145a8",
      schoolId: new mongoose.Types.ObjectId(),
      grade: "1",
      name: "Test Class",
    });

    await mongoose.model("DistributedBottles").create({
      classroomId: classroom._id,
      month: "January",
      bottleDistributed: 10,
    });

    await mongoose.model("ClassroomBottles").create({
      classroomId: classroom._id,
      month: "January",
      bottleUsed: 4,
      bottleRemaining: 6,
    });

    const res = await request(app).get(
      `/api/classroomsBottles/${classroom._id.toString()}`
    );

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.ClassroomBottles)).toBe(true);
  });

  //  NO DISTRIBUTED BOTTLES
  it("Should return 404 if no distributed bottles exist", async () => {
    const classroom = await mongoose.model("Classroom").create({
      teacherId: "699fe963fac309cee0d145a8",
      schoolId: new mongoose.Types.ObjectId(),
      grade: "2",
      name: "Class B",
    });

    const res = await request(app).get(
      `/api/classroomsBottles/${classroom._id.toString()}`
    );

    expect(res.statusCode).toBe(404);
  });
});