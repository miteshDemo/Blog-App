import Blog from "../models/Blog.js";

// Get all user posts (Admin view)
export const getAllUserPosts = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("user", "name email");
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Delete any user post
export const deleteUserPost = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Post not found" });

    await blog.remove();
    res.status(200).json({ msg: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update any user post
export const updateUserPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Post not found" });

    blog.title = title || blog.title;
    blog.content = content || blog.content;

    await blog.save();
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
