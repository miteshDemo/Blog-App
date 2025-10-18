// routes/authRoutes.js
import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  adminDashboard,
} from "../controller/authController.js";
import authMiddleware, { adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Routes
router.get("/profile", authMiddleware, getProfile);

// Admin Routes
router.get("/admin/dashboard", authMiddleware, adminMiddleware, adminDashboard);

export default router;
