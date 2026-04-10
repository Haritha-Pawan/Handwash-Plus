import { createQuiz } from "../../quiz.controller.js";
import { Quiz } from "../../quiz.model.js";
import { Classroom } from "../../../classrooms/classroom.model.js";

jest.mock("../../quiz.model.js");
jest.mock("../../../classrooms/classroom.model.js");

describe("createQuiz Unit Test", () => {

  it("should create quiz successfully", async () => {
    const req = {
      body: {
        title: "Math Quiz",
        classroomId: "123",
        questions: [{ questionText: "2+2", type: "mcq" }]
      },
      user: { id: "teacher123" }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    Classroom.findById = jest.fn().mockResolvedValue({
      teacherId: "teacher123"
    });

    Quiz.create = jest.fn().mockResolvedValue({
      _id: "quiz123",
      title: "Math Quiz"
    });

    await createQuiz(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Quiz created successfuly"
      })
    );
  });
});