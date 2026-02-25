import express from "express";
import { updateClassroomBottles,getClassroomBottlesByClassroomId } from "./classroomBottles.controller.js";

const router = express.Router();

//all routes require authentification
//router.use(authMiddleware);

router.put("/update",updateClassroomBottles);
router.get("/:classroomId",getClassroomBottlesByClassroomId);

export default router;