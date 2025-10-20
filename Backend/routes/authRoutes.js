// routes/authRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  registerUser,
  loginUser,
  getProfile,
  adminDashboard,
} from "../controller/authController.js";
import authMiddleware, { adminMiddleware } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ Create "uploads/avatars" folder if not exists
const avatarUploadDir = path.join(process.cwd(), "uploads", "avatars");
if (!fs.existsSync(avatarUploadDir)) {
  fs.mkdirSync(avatarUploadDir, { recursive: true });
}

// ✅ Multer setup for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, avatarUploadDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ Serve uploaded files statically
router.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// 🔹 Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// 🔹 Protected Routes
router.get("/profile", authMiddleware, getProfile);

// ✅ PUT: Update user profile (with optional avatar upload)
router.put("/profile", authMiddleware, upload.single("avatar"), async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Update text fields
    if (name) user.name = name;
    if (email) user.email = email;

    // ✅ Update avatar if new image uploaded
    if (req.file) {
      user.avatar = `http://localhost:5000/api/auth/uploads/avatars/${req.file.filename}`;
    }

    await user.save();

    res.json({
      msg: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// 🔹 Admin-only route
router.get("/admin/dashboard", authMiddleware, adminMiddleware, adminDashboard);

export default router;
