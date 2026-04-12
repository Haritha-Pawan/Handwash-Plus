import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "./user.controller.js";

import authMiddleware from "../../@core/middleware/auth.middleware.js";
import  authorizeRoles  from "../../@core/middleware/role.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/", authMiddleware, authorizeRoles("superAdmin", "admin"), getAllUsers);
router.get("/:id", authMiddleware, getUserById);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, authorizeRoles("superAdmin"), deleteUser);

export default router;