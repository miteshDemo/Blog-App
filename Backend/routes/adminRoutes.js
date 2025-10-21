import express from "express";
import User from "../models/User.js";
import Blog from "../models/Blog.js";

const router = express.Router();

/**
 * ✅ Get all users with total blogs count - FIXED
 */
router.get("/users", async (req, res) => {
  try {
    // Method 1: Using aggregation (more efficient)
    const usersWithBlogCount = await User.aggregate([
      {
        $lookup: {
          from: "blogs", // collection name in MongoDB
          localField: "_id",
          foreignField: "user",
          as: "blogs"
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          role: 1,
          profileImage: 1,
          totalPosts: { $size: "$blogs" },
          createdAt: 1
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    // Method 2: Alternative approach if aggregation doesn't work
    // const users = await User.find().select("-password");
    // const usersWithBlogCount = await Promise.all(
    //   users.map(async (user) => {
    //     const blogCount = await Blog.countDocuments({ user: user._id });
    //     return {
    //       _id: user._id,
    //       name: user.name,
    //       email: user.email,
    //       role: user.role,
    //       profileImage: user.profileImage,
    //       totalPosts: blogCount,
    //     };
    //   })
    // );

    console.log("Users with blog counts:", usersWithBlogCount); // Debug log
    res.json(usersWithBlogCount);
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
    console.log("Total users count:", count); // Debug log
    res.json({ totalUsers: count });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user count", error });
  }
});

/**
 * ✅ Blog count
 */
router.get("/blogs/count", async (req, res) => {
  try {
    const count = await Blog.countDocuments();
    console.log("Total blogs count:", count); // Debug log
    res.json({ totalBlogs: count });
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog count", error });
  }
});

/**
 * ✅ Get all blogs with author information
 */
router.get("/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("user", "name email profileImage")
      .sort({ createdAt: -1 });

    console.log("Total blogs found:", blogs.length); // Debug log
    res.json(blogs);
  } catch (error) {
    console.error("❌ Error fetching blogs:", error);
    res.status(500).json({ message: "Error fetching blogs", error });
  }
});

/**
 * ✅ Get blogs by specific user
 */
router.get("/users/:userId/blogs", async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validate if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const blogs = await Blog.find({ user: userId })
      .populate("user", "name email profileImage")
      .sort({ createdAt: -1 });

    console.log(`Blogs for user ${userId}:`, blogs.length); // Debug log
    res.json(blogs);
  } catch (error) {
    console.error("❌ Error fetching user blogs:", error);
    res.status(500).json({ message: "Error fetching user blogs", error });
  }
});

/**
 * ✅ Test route to check blog-user relationships
 */
router.get("/debug/user-blogs", async (req, res) => {
  try {
    const allUsers = await User.find().select("name email _id");
    const allBlogs = await Blog.find().select("title user");
    
    const userBlogRelations = await Promise.all(
      allUsers.map(async (user) => {
        const userBlogs = await Blog.find({ user: user._id });
        return {
          user: user.name,
          userId: user._id,
          blogCount: userBlogs.length,
          blogs: userBlogs.map(blog => blog.title)
        };
      })
    );

    res.json({
      totalUsers: allUsers.length,
      totalBlogs: allBlogs.length,
      relationships: userBlogRelations
    });
  } catch (error) {
    console.error("❌ Debug error:", error);
    res.status(500).json({ message: "Debug error", error });
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
    ).select("-password");
    
    res.json(updatedUser);
  } catch (error) {
    console.error("❌ Error updating user:", error);
    res.status(500).json({ message: "Error updating user", error });
  }
});

/**
 * ✅ Delete user (and their blogs)
 */
router.delete("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete user's blogs
    const deleteResult = await Blog.deleteMany({ user: userId });
    console.log(`Deleted ${deleteResult.deletedCount} blogs for user ${userId}`);

    // Delete user
    await User.findByIdAndDelete(userId);
    
    res.json({ 
      message: "User and their blogs deleted successfully",
      deletedBlogs: deleteResult.deletedCount
    });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user", error });
  }
});

/**
 * ✅ Delete blog
 */
router.delete("/blogs/:id", async (req, res) => {
  try {
    const blogId = req.params.id;
    
    const deletedBlog = await Blog.findByIdAndDelete(blogId);
    
    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting blog:", error);
    res.status(500).json({ message: "Error deleting blog", error });
  }
});

export default router;