import { Router } from "express";

import gradeController                        from "./grade.controller.js";
import { createGradesSchema, updateGradeSchema } from "./grade.validation.js";
import { validate }                            from "../../@core/middleware/validate.middleware.js";
import { protect, restrictTo }                 from "../../@core/middleware/auth.middleware.js";

const router = Router();

router.use(protect);
router.use(restrictTo("admin"));

router.post(
  "/",
  validate(createGradesSchema),
  gradeController.createGrades
);

router.get(
  "/",
  gradeController.getGrades
);

router.get(
  "/:gradeId",
  gradeController.getGrade
);

router.patch(
  "/:gradeId",
  validate(updateGradeSchema),
  gradeController.updateGrade
);

router.patch(
  "/:gradeId/deactivate",
  gradeController.deactivateGrade
);

export default router;