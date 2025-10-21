// src/pages/AdminPosts.jsx
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from "@mui/material";

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [editPost, setEditPost] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch all posts
  const fetchPosts = async () => {
    if (!token) {
      setErrorMsg("You must be logged in as admin.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get("http://localhost:5000/api/admin/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err.response) {
        if (err.response.status === 401) setErrorMsg("Unauthorized: Invalid or expired token.");
        else if (err.response.status === 403) setErrorMsg("Access denied. Admins only.");
        else setErrorMsg(err.response.data.msg || "Failed to fetch posts.");
      } else {
        setErrorMsg(err.message);
      }
      console.error(err);
    }
  };

  // Delete a post
  const deletePost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((post) => post._id !== id));
    } catch (err) {
      if (err.response) setErrorMsg(err.response.data.msg || "Failed to delete post.");
      else setErrorMsg(err.message);
      console.error(err);
    }
  };

  // Update a post
  const handleEditPost = async () => {
    try {
      const { _id, title, content } = editPost;
      const { data } = await axios.put(
        `http://localhost:5000/api/admin/posts/${_id}`,
        { title, content },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPosts(posts.map((p) => (p._id === _id ? data : p)));
      setEditPost(null);
    } catch (err) {
      if (err.response) setErrorMsg(err.response.data.msg || "Failed to update post.");
      else setErrorMsg(err.message);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box p={2}>
      <Typography variant="h4" mb={2}>
        All User Posts
      </Typography>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMsg}
        </Alert>
      )}

      <Grid container spacing={2}>
        {posts.map((post) => (
          <Grid item xs={12} md={6} key={post._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{post.title}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {post.content}
                </Typography>
                <Typography variant="caption">
                  Author: {post.user.name} ({post.user.email})
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => setEditPost(post)}>
                  Edit
                </Button>
                <Button size="small" color="error" onClick={() => deletePost(post._id)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Edit Post Dialog */}
      <Dialog open={!!editPost} onClose={() => setEditPost(null)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Title"
            value={editPost?.title || ""}
            onChange={(e) => setEditPost({ ...editPost, title: e.target.value })}
          />
          <TextField
            label="Content"
            multiline
            minRows={4}
            value={editPost?.content || ""}
            onChange={(e) => setEditPost({ ...editPost, content: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditPost(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditPost}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPosts;
