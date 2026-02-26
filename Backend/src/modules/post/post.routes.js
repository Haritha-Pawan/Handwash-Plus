import express from "express";
import authMiddleware from "../../@core/middleware/auth.middleware.js";
import {
  createPost,
  getAllPosts,
  updatePost,
  deletePost,
} from "./post.controller.js";


const router = express.Router();

router.post("/", authMiddleware, createPost);
router.get("/", getAllPosts);
router.put("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);

export default router;