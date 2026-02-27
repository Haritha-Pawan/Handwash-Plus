import express from "express";
import { registerUser } from "./auth.controller.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", registerUser);


export default router;