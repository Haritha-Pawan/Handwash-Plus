import express  from "express";
const router = express.Router();

//Insert model
import {addStudent, getAllStudents,getById} from "./student.controller.js";

router.get("/",getAllStudents);
router.post("/",addStudent);
router.get("/:id",getById);

export default router;