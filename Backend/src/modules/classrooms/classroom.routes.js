import express from "express";
const router = express.Router();

//Insert model
import {addClassroom, getAllClassrooms} from "./classroom.controller.js";

router.get("/",getAllClassrooms);
router.post("/",addClassroom);

//export
//module.exports=router;
export default router;