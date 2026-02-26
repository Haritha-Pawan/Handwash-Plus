import gradeService from "./grade.service.js";

const catchAsync = (fn) => (req, res, next) => fn(req, res, next).catch(next);

const ok      = (res, data, message = "Success") =>
  res.status(200).json({ success: true, message, data });

const created = (res, data, message = "Created") =>
  res.status(201).json({ success: true, message, data });

class GradeController {
 createGrades = catchAsync(async (req, res) => {
    const { count } = req.body;

    const result = await gradeService.createGrades(req.user.school, count);

    // Build a helpful message telling the admin exactly what happened
    // Example: "Created 3 grade(s): Grade 3, Grade 4, Grade 5"
    const createdList = result.created.map((n) => `Grade ${n}`).join(", ");
    const message = `Created ${result.total} grade(s): ${createdList}`;

    created(res, result, message);
  });

  getGrades = catchAsync(async (req, res) => {
    const grades = await gradeService.getGrades(req.user.school);
    ok(res, grades, "Grades retrieved successfully");
  });

   getGrade = catchAsync(async (req, res) => {
    const grade = await gradeService.getGradeById(
      req.user.school,
      req.params.gradeId
    );
    ok(res, grade, "Grade retrieved successfully");
  });

  updateGrade = catchAsync(async (req, res) => {
    const grade = await gradeService.updateGrade(
      req.user.school,
      req.params.gradeId,
      req.body
    );
    ok(res, grade, "Grade updated successfully");
  });

  deactivateGrade = catchAsync(async (req, res) => {
    const grade = await gradeService.deactivateGrade(
      req.user.school,
      req.params.gradeId
    );
    ok(res, grade, `Grade ${grade.gradeNumber} deactivated successfully`);
  });

}

export default new GradeController();
