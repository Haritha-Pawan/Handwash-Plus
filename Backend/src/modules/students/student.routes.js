import express  from "express";
const router = express.Router();

//Insert model
import {addStudent, getAllStudents,getById,updateStudent} from "./student.controller.js";

router.get("/",getAllStudents);
router.post("/",addStudent);
router.get("/:id",getById);
router.put("/:id",updateStudent);

export default router;