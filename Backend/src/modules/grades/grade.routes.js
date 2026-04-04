import { Router } from "express";

import gradeController from "./grade.controller.js";
import {
  createGradesSchema,
  updateGradeSchema,
  distributeBottlesSchema,
} from "./grade.validation.js";
import { validate } from "../../@core/middleware/validate.middleware.js";
import authMiddleware from "../../@core/middleware/auth.middleware.js";
import authorizeRoles from "../../@core/middleware/role.middlewere.js";

const router = Router();

router.use(authMiddleware, authorizeRoles("superAdmin", "admin", "teacher"));

router.post(
  "/",
  validate(createGradesSchema),
  gradeController.createGrades
);

router.post(
  "/:gradeId/distribute-bottles",
  validate(distributeBottlesSchema),
  gradeController.distributeBottles
);

router.get(
  "/sanitizer-check",
  gradeController.checkSanitizerAndAlert
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