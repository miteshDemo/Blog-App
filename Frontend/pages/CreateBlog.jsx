import { useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const CreateBlog = () => {
  const [form, setForm] = useState({
    title: "",
    content: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first");
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    if (form.image) formData.append("image", form.image);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/blogs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // ✅ Fixed
        },
      });

      if (res.status === 201) {
        alert("✅ Blog created successfully!");
        navigate("/my-blogs");
      }
    } catch (err) {
      console.error("❌ Error creating blog:", err);
      alert(err.response?.data?.message || "Failed to create blog.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f4f6f8",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Card sx={{ width: 400, p: 3, boxShadow: 4, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" mb={2} textAlign="center">
            ✍️ Create New Blog
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Content"
              name="content"
              multiline
              rows={4}
              value={form.content}
              onChange={handleChange}
              margin="normal"
              required
            />
            <Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }}>
              Upload Image
              <input type="file" hidden onChange={handleFileChange} />
            </Button>

            {form.image && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected: {form.image.name}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Create Blog"}
            </Button>
          </form>

          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => navigate("/my-blogs")}
          >
            Go to My Blogs
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateBlog;
