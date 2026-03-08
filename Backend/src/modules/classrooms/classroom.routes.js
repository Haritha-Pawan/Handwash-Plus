import express from "express";
const router = express.Router();

//Insert model
import {addClassroom, getAllClassrooms, getById, updateClassroom} from "./classroom.controller.js";

router.get("/",getAllClassrooms);
router.post("/",addClassroom);
router.get("/:id",getById);
router.put("/:id",updateClassroom);


//export
//module.exports=router;
export default router;