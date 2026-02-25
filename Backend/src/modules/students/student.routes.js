import express  from "express";
const router = express.Router();

//Insert model
import {addStudent, deleteStudent, getAllStudents,getById,updateStudent,getActiveQuizForStudent} from "./student.controller.js";

router.get("/",getAllStudents);
router.post("/",addStudent);
router.get("/active" ,getActiveQuizForStudent);
router.get("/:id",getById);
router.put("/:id",updateStudent);
router.delete("/:id",deleteStudent);


export default router;