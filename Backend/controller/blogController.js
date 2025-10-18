import Blog from "../models/Blog.js";

// ✅ Create Blog
export const createBlog = async (req, res) => {
  try {
    const { title, content, image } = req.body;
    const newBlog = new Blog({
      title,
      content,
      image,
      author: req.user.name,
      user: req.user.id, // ✅ attach logged-in user
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(500).json({ msg: "Server error while creating blog", error });
  }
};

// ✅ Get all blogs of logged-in user
export const getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching user blogs", error });
  }
};

// ✅ Delete blog
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    if (blog.user.toString() !== req.user.id)
      return res.status(403).json({ msg: "Not authorized to delete this blog" });

    await blog.deleteOne();
    res.json({ msg: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error while deleting", error });
  }
};
