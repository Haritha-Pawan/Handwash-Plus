import express  from "express";
import { createQuiz, getQuizzesByClassroom, UpdateQuiz } from "./quiz.controller.js";
const router = express.Router();

router.post("/",createQuiz);
router.get("/classroom/:classroomId",getQuizzesByClassroom);
router.put('/:id',UpdateQuiz);

export default router;