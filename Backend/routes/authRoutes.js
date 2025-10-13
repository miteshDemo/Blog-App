  // routes/authRoutes.js
  import express from "express";
  import bcrypt from "bcryptjs";
  import jwt from "jsonwebtoken";
  import User from "../models/User.js";
  import dotenv from "dotenv";
  import authMiddleware, { adminMiddleware } from "../middleware/authMiddleware.js";

  dotenv.config();
  const router = express.Router();


  // ✅ Register User or Admin
  router.post("/register", async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res.status(400).json({ msg: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);

      // role: optional, defaults to "user"
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role: role === "admin" ? "admin" : "user",
      });

      await newUser.save();
      res.json({ msg: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  });


  // ✅ Login
  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: "User not found" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  });


  // ✅ Protected route: User profile
  router.get("/profile", authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  });


  // ✅ Admin Dashboard (only admin can access)
  router.get("/admin/dashboard", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.json({
        msg: "Welcome Admin! Here are all registered users:",
        totalUsers: users.length,
        users,
      });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  });

  export default router;
