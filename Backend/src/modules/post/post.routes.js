import express from "express";
import authMiddleware from "../../@core/middleware/auth.middleware.js";
import {
  createPost,
  getAllPosts,
  updatePost,
  deletePost,
  getMyPosts,
} from "./post.controller.js";
import multer from "multer";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/create", authMiddleware,upload.single("image"), createPost);
router.get("/my-posts", authMiddleware, getMyPosts);
router.get("/", getAllPosts);
router.put("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);

export default router;