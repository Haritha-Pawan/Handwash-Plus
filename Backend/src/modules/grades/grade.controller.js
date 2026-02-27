import gradeService from "./grade.service.js";

const catchAsync = (fn) => (req, res, next) => fn(req, res, next).catch(next);

const ok = (res, data, message = "Success") =>
  res.status(200).json({ success: true, message, data });

const created = (res, data, message = "Created") =>
  res.status(201).json({ success: true, message, data });


const resolveSchool = (req) => {
  if (req.user.role === "superAdmin") {
    if (!req.query.schoolId) {
      const err = new Error("superAdmin must provide ?schoolId= as a query param");
      err.status = 400;
      throw err;
    }
    return req.query.schoolId;
  }

  return req.user.school;
};

class GradeController {
  createGrades = catchAsync(async (req, res) => {
    const schoolId = resolveSchool(req);
    const { count } = req.body;
    const result = await gradeService.createGrades(schoolId, count);

    const createdList = result.created.map((n) => `Grade ${n}`).join(", ");
    const message = `Created ${result.total} grade(s): ${createdList}`;
    created(res, result, message);
  });

  getGrades = catchAsync(async (req, res) => {
    const schoolId = resolveSchool(req);
    const grades = await gradeService.getGrades(schoolId);
    ok(res, grades, "Grades retrieved successfully");
  });

  getGrade = catchAsync(async (req, res) => {
    const schoolId = resolveSchool(req);
    const grade = await gradeService.getGradeById(schoolId, req.params.gradeId);
    ok(res, grade, "Grade retrieved successfully");
  });

  updateGrade = catchAsync(async (req, res) => {
    const schoolId = resolveSchool(req);
    const grade = await gradeService.updateGrade(schoolId, req.params.gradeId, req.body);
    ok(res, grade, "Grade updated successfully");
  });

  deactivateGrade = catchAsync(async (req, res) => {
    const schoolId = resolveSchool(req);
    const grade = await gradeService.deactivateGrade(schoolId, req.params.gradeId);
    ok(res, grade, `Grade ${grade.gradeNumber} deactivated successfully`);
  });

  checkSanitizerAndAlert = catchAsync(async (req, res) => {
    const report = await gradeService.checkSanitizerAndAlert(req.user.school);

    // Build response message based on whether SMS was sent
    const message = report.summary.alertSentViaSMS
      ? `Sanitizer report generated — SMS alert sent for ${report.summary.critical + report.summary.empty} critical grade(s)`
      : `Sanitizer report generated — all grades adequate`;

    ok(res, report, message);
  });
}

export default new GradeController();
