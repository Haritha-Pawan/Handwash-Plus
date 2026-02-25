import express from "express";
import { updateClassroomBottles } from "./classroomBottles.controller.js";

const router = express.Router();

//all routes require authentification
//router.use(authMiddleware);

router.put("/update",updateClassroomBottles);

export default router;