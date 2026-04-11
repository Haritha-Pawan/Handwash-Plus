import express  from "express";
const router = express.Router();
import authMiddleware from "../../@core/middleware/auth.middleware.js";
import  roleMiddleware  from "../../@core/middleware/role.middlewere.js";


import {addStudent, deleteStudent, getAllStudents,getById,updateStudent,getActiveQuizForStudent,getStudentsByClassroom} from "./student.controller.js";

router.get("/",authMiddleware,roleMiddleware("teacher", "admin"),getAllStudents);
router.post("/",authMiddleware,roleMiddleware("teacher"),addStudent);
router.post("/active",getActiveQuizForStudent);
router.get("/:id",authMiddleware,roleMiddleware("teacher"),getById);
router.put("/:id",authMiddleware,roleMiddleware("teacher"),updateStudent);
router.delete("/:id",authMiddleware,roleMiddleware("teacher"),deleteStudent);
router.get("/by-classroom/:classroomId", authMiddleware, roleMiddleware("teacher"), getStudentsByClassroom);


export default router;