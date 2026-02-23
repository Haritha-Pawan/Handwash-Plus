import express  from "express";
const router = express.Router();

//Insert model
import {addStudent, getAllStudents,} from "./student.controller.js";

router.get("/",getAllStudents);
router.post("/",addStudent);

export default router;