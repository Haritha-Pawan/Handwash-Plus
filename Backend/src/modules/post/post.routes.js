import express from "express";
import authMiddleware from "../../@core/middleware/auth.middleware.js";
import {
  createPost,
  getAllPosts,
  updatePost,
  deletePost,
  getMyPosts,
} from "./post.controller.js";
const router = express.Router();

router.post("/create", authMiddleware, createPost);
router.get("/my-posts", authMiddleware, getMyPosts);
router.get("/", getAllPosts);
router.put("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);

export default router;