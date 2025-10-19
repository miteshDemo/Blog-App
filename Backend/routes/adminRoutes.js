import express from "express";
import User from "../models/User.js";
import Blog from "../models/Blog.js";

const router = express.Router();

/**
 * ✅ Get all users with total posts count
 */
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");

    // Loop through all users and count blogs per user
    const usersWithPosts = await Promise.all(
      users.map(async (user) => {
        // check both user and userId (depending on your schema)
        const postCount = await Blog.countDocuments({
          $or: [{ user: user._id }, { userId: user._id }],
        });

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          totalPosts: postCount,
        };
      })
    );

    res.json(usersWithPosts);
  } catch (error) {
    console.error("❌ Error fetching users with total posts:", error);
    res.status(500).json({ message: "Error fetching users with total posts", error });
  }
});

/**
 * ✅ User count
 */
router.get("/users/count", async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ totalUsers: count });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user count", error });
  }
});

/**
 * ✅ Update user
 */
router.put("/users/:id", async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
});

/**
 * ✅ Delete user (and their blogs)
 */
router.delete("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    await Blog.deleteMany({
      $or: [{ user: userId }, { userId: userId }],
    });

    await User.findByIdAndDelete(userId);
    res.json({ message: "User and their blogs deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
});

export default router;
