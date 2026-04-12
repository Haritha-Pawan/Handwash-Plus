import express from "express";
import authMiddleware from "../../@core/middleware/auth.middleware.js";
import {
  createPost,
  getAllPosts,
  updatePost,
  deletePost,
  getMyPosts,
  votePost,
  getTopPosts
  
} from "./post.controller.js";
import multer from "multer";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/create", authMiddleware,upload.single("image"), createPost);
router.get("/my-posts", authMiddleware, getMyPosts);
router.get("/", getAllPosts);
router.put("/:id", authMiddleware, upload.single("image"), updatePost);
router.delete("/:id", authMiddleware, deletePost);
router.post("/:id/vote", authMiddleware, votePost);
router.get("/top-posts", getTopPosts);

export default router;