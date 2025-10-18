import express from "express";
import multer from "multer";
import path from "path";
import Blog from "../models/Blog.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ✅ CREATE BLOG - FIXED: Use 'user' instead of 'userId'
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { title, content } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!title || !content)
      return res.status(400).json({ msg: "All fields are required" });

    const blog = new Blog({
      title,
      content,
      image,
      author: req.user.name,
      user: req.user._id, // ✅ FIXED: Changed from userId to user
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ GET ALL BLOGS OF LOGGED-IN USER - FIXED: Use 'user' instead of 'userId'
router.get("/my-blogs", authMiddleware, async (req, res) => {
  try {
    const blogs = await Blog.find({ user: req.user._id }).sort({ // ✅ FIXED: Changed from userId to user
      createdAt: -1,
    });
    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ UPDATE BLOG - FIXED: Use 'user' instead of 'userId'
router.put("/:id", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    if (blog.user.toString() !== req.user._id.toString()) // ✅ FIXED: Changed from userId to user
      return res.status(403).json({ msg: "Not authorized" });

    const { title, content } = req.body;
    if (title) blog.title = title;
    if (content) blog.content = content;
    if (req.file) blog.image = req.file.filename;

    await blog.save();
    res.json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ DELETE BLOG - FIXED: Use 'user' instead of 'userId'
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    if (blog.user.toString() !== req.user._id.toString()) // ✅ FIXED: Changed from userId to user
      return res.status(403).json({ msg: "Not authorized" });

    await blog.deleteOne();
    res.json({ msg: "Blog deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;