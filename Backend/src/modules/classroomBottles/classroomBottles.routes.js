import express from "express";
import authMiddleware from "../../@core/middleware/auth.middleware.js";
import  roleMiddleware  from "../../@core/middleware/role.middlewere.js";
import { updateClassroomBottles,getClassroomBottlesByClassroomId } from "./classroomBottles.controller.js";

const router = express.Router();



router.put("/update",/*authMiddleware,roleMiddleware("teacher"),*/updateClassroomBottles);
router.get("/:classroomId",/*authMiddleware,roleMiddleware("teacher"),*/getClassroomBottlesByClassroomId);

export default router;