import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // ✅ Fetch logged-in user's blogs
  const fetchBlogs = async () => {
    if (!token) return navigate("/login");
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/blogs/my-blogs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // ✅ Delete blog
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBlogs();
    } catch (err) {
      console.error(err);
      alert("Failed to delete blog");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f6f8", p: 3 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
        textAlign="center"
        sx={{
          background: "linear-gradient(45deg, #1976d2, #42a5f5)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        📚 My Blogs
      </Typography>

      <Box textAlign="center" mb={3}>
        <Button
          variant="contained"
          color="success"
          onClick={() => navigate("/create-blog")}
        >
          ✍️ Create New Blog
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : blogs.length === 0 ? (
        <Typography textAlign="center">No blogs yet.</Typography>
      ) : (
        <Grid container spacing={2}>
          {blogs.map((blog) => (
            <Grid item xs={12} sm={6} md={4} key={blog._id}>
              <Card sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}>
                {blog.image && (
                  <img
                    src={`http://localhost:5000/uploads/${blog.image}`}
                    alt={blog.title}
                    style={{
                      width: "100%",
                      borderRadius: 8,
                      marginBottom: 8,
                      height: 180,
                      objectFit: "cover",
                    }}
                  />
                )}

                <CardContent sx={{ flexGrow: 1, p: 0 }}>
                  <Typography variant="h6">{blog.title}</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {blog.content.slice(0, 100)}...
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Author: {blog.author}
                  </Typography>
                </CardContent>

                <CardActions sx={{ mt: 1, justifyContent: "space-between", p: 0 }}>
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/edit-blog/${blog._id}`)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(blog._id)}>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MyBlogs;
