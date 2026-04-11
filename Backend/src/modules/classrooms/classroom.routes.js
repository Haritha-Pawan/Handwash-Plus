
import authMiddleware from "../../@core/middleware/auth.middleware.js";
import  roleMiddleware  from "../../@core/middleware/role.middlewere.js";
import express from "express";
const router = express.Router();

//Insert model
import {addClassroom, getAllClassrooms, getById, updateClassroom,getMyClassrooms} from "./classroom.controller.js";

router.get("/",getAllClassrooms);
router.post("/",addClassroom);
router.get(
  "/my",
  authMiddleware,
  roleMiddleware("teacher"),
  getMyClassrooms);
router.get("/:id",getById);
router.put("/:id",updateClassroom);

//export
//module.exports=router;
export default router;