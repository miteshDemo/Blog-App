// src/pages/EditBlog.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, CircularProgress } from "@mui/material";

const EditBlog = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/blogs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTitle(res.data.title);
        setContent(res.data.content);
      } catch (err) {
        console.error(err);
        navigate("/my-blogs");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/blogs/${id}`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Blog updated successfully!");
      navigate("/my-blogs");
    } catch (err) {
      console.error(err);
      alert("Failed to update blog");
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 5 }}>
      <Typography variant="h5" mb={2} fontWeight="bold">
        ✏️ Edit Blog
      </Typography>
      <form onSubmit={handleUpdate}>
        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          margin="normal"
          multiline
          rows={6}
          required
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Update Blog
        </Button>
      </form>
    </Box>
  );
};

export default EditBlog;
