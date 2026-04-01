import express  from "express";
import { Quiz } from "./quiz.model.js";
import authMiddleware from "../../@core/middleware/auth.middleware.js";
import  roleMiddleware  from "../../@core/middleware/role.middlewere.js";
import { createQuiz, deleteQuiz, getQuizzesByClassroom, UpdateQuiz } from "./quiz.controller.js";

const router = express.Router();

router.post("/",/*authMiddleware,roleMiddleware("teacher"),*/createQuiz);
router.get("/classroom/:classroomId",/*authMiddleware,roleMiddleware("teacher","admin"),*/getQuizzesByClassroom);
router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate("classroomId", "name");
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.put('/:id',/*authMiddleware,roleMiddleware("teacher")*/UpdateQuiz);
router.delete('/:id',/*authMiddleware,roleMiddleware("teacher"),*/deleteQuiz);

export default router;