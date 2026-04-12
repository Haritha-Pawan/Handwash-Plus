import { updateClassroomBottles } from "../../classroomBottles.controller.js";
import { Classroom } from "../../../classrooms/classroom.model.js";
import DistributedBottles from "../../distributedBottles.model.js";
import ClassroomBottles from "../../classroomBottles.model.js";


jest.mock("../../../classrooms/classroom.model.js");
jest.mock("../../distributedBottles.model.js");
jest.mock("../../classroomBottles.model.js");

describe("Classroom Bottles Controller - Unit Tests", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        classroomId: "123",
        month: "January",
        bottleUsed: 5,
      },
    };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  });

  it("should return 404 if classroom not found", async () => {
    Classroom.findById.mockResolvedValue(null);

    await updateClassroomBottles(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Classroom not found" });
  });

  it("should return 403 if teacher is not assigned", async () => {
    Classroom.findById.mockResolvedValue({ teacherId: "otherId" });

    await updateClassroomBottles(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Not authorized to update this classroom bottles",
    });
  });

  it("should return 404 if bottleUsed exceeds distributed bottles", async () => {
    Classroom.findById.mockResolvedValue({ teacherId: "699fe963fac309cee0d145a8" });
    DistributedBottles.findOne.mockResolvedValue({ bottleDistributed: 3 });

    await updateClassroomBottles(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Bottles used can not be exceed the distributed bottles",
    });
  });
});