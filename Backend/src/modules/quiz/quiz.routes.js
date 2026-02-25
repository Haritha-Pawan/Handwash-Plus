import express  from "express";
import { createQuiz, deleteQuiz, getQuizzesByClassroom, UpdateQuiz } from "./quiz.controller.js";
const router = express.Router();

router.post("/",createQuiz);
router.get("/classroom/:classroomId",getQuizzesByClassroom);
router.put('/:id',UpdateQuiz);
router.delete('/:id',deleteQuiz);

export default router;