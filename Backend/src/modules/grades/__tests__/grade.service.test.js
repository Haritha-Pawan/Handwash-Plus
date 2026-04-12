import { jest } from "@jest/globals";

/*
  STEP 1: Mock dependencies BEFORE importing the service
*/

const mockGrade = {
  find: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    // Make the query object thenable to satisfy await
    then: function(onFulfilled) {
      return Promise.resolve(this._resolvedValue || []).then(onFulfilled);
    }
  }),
  create: jest.fn(),
  findOne: jest.fn().mockReturnValue({
    populate: jest.fn().mockReturnThis(),
    then: function(onFulfilled) {
      return Promise.resolve(this._resolvedValue || null).then(onFulfilled);
    }
  }),
  findOneAndUpdate: jest.fn(),
};

const mockSchool = {
  findById: jest.fn(),
};

const mockSendSanitizerAlertWhatsApp = jest.fn();

jest.unstable_mockModule("../grade.model.js", () => ({
  default: mockGrade,
}));

jest.unstable_mockModule("../../schools/school.model.js", () => ({
  default: mockSchool,
}));

jest.unstable_mockModule("../../../@core/lib/sms/sms.service.js", () => ({
  sendSanitizerAlertWhatsApp: mockSendSanitizerAlertWhatsApp,
}));

/*
  STEP 2: Import service AFTER mocking
*/
const { default: gradeService } = await import("../grade.service.js");

/*
  STEP 3: Write tests
*/

describe("Grade Service Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createGrades", () => {

    it("should create missing grades successfully", async () => {

      // mock existing grades
      const query = mockGrade.find();
      query._resolvedValue = [
        { gradeNumber: 1 },
        { gradeNumber: 2 },
      ];

      // mock creation
      mockGrade.create.mockResolvedValue([
        { gradeNumber: 3 },
        { gradeNumber: 4 },
        { gradeNumber: 5 },
      ]);

      const result = await gradeService.createGrades("school123", 5);

      expect(mockGrade.find).toHaveBeenCalledWith({ school: "school123" });

      expect(mockGrade.create).toHaveBeenCalledWith([
        { gradeNumber: 3, school: "school123" },
        { gradeNumber: 4, school: "school123" },
        { gradeNumber: 5, school: "school123" },
      ]);

      expect(result).toEqual({
        created: [3, 4, 5],
        skipped: [1, 2],
        total: 3,
      });
    });

    it("should throw error when count is invalid", async () => {
      await expect(
        gradeService.createGrades("school123", 0)
      ).rejects.toThrow("Grade number must be between 1 and 13");
    });

    it("should throw error when all grades already exist", async () => {

      const query = mockGrade.find();
      query._resolvedValue = [
        { gradeNumber: 1 },
        { gradeNumber: 2 },
        { gradeNumber: 3 },
      ];

      await expect(
        gradeService.createGrades("school123", 3)
      ).rejects.toThrow(
        "All requested grades (1 to 3) already exist for this school"
      );
    });

  });
});