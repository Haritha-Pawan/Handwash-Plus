import express  from "express";
import authMiddleware from "../../@core/middleware/auth.middleware.js";
import  roleMiddleware  from "../../@core/middleware/role.middlewere.js";
import { createQuiz, deleteQuiz, getQuizzesByClassroom, UpdateQuiz } from "./quiz.controller.js";

const router = express.Router();

router.post("/",/*authMiddleware,roleMiddleware("teacher"),*/createQuiz);
router.get("/classroom/:classroomId",/*authMiddleware,roleMiddleware("teacher","admin"),*/getQuizzesByClassroom);
router.put('/:id',/*authMiddleware,roleMiddleware("teacher")*/UpdateQuiz);
router.delete('/:id',/*authMiddleware,roleMiddleware("teacher"),*/deleteQuiz);

export default router;