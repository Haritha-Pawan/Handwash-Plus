import express  from "express";
import { createQuiz, getQuizzesByClassroom } from "./quiz.controller.js";
const router = express.Router();

router.post("/",createQuiz);
router.get("/classroom/:classroomId",getQuizzesByClassroom);

export default router;