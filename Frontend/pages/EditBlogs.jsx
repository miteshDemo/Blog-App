import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Snackbar,
  Paper,
} from "@mui/material";
import { ArrowBack, Image } from "@mui/icons-material";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null,
  });
  const [currentImage, setCurrentImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      if (!token) {
        showSnackbar("Please login first", "error");
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching blog with ID:", id);
        
        const res = await axios.get(`http://localhost:5000/api/blogs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const blog = res.data;
        console.log("Blog data received:", blog);
        
        setFormData({
          title: blog.title,
          content: blog.content,
          image: null,
        });
        
        if (blog.image) {
          setCurrentImage(`http://localhost:5000/uploads/${blog.image}`);
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        const errorMessage = err.response?.data?.msg || "Failed to load blog";
        showSnackbar(errorMessage, "error");
        
        // Redirect after showing error
        setTimeout(() => {
          navigate("/my-blogs");
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    } else {
      showSnackbar("No blog ID provided", "error");
      navigate("/my-blogs");
    }
  }, [id, token, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        showSnackbar("Please select a valid image file", "error");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        showSnackbar("Image size should be less than 5MB", "error");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      
      // Preview new image
      const reader = new FileReader();
      reader.onload = (e) => {
        setCurrentImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      showSnackbar("Title and content are required", "error");
      return;
    }

    try {
      setSubmitting(true);
      
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("content", formData.content);
      if (formData.image) {
        submitData.append("image", formData.image);
      }

      const response = await axios.put(
        `http://localhost:5000/api/blogs/${id}`, 
        submitData, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Update response:", response.data);
      showSnackbar("Blog updated successfully!", "success");
      
      // Redirect to my-blogs after a short delay
      setTimeout(() => {
        navigate("/my-blogs");
      }, 1500);
    } catch (err) {
      console.error("Error updating blog:", err);
      const errorMessage = err.response?.data?.msg || "Failed to update blog";
      showSnackbar(errorMessage, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body1">Loading blog...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f6f8", p: 3 }}>
      <Paper elevation={0} sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate("/my-blogs")}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              background: "linear-gradient(45deg, #1976d2, #42a5f5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ✏️ Edit Blog
          </Typography>
        </Box>

        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {/* Title Field */}
              <TextField
                fullWidth
                label="Blog Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                margin="normal"
                required
                variant="outlined"
                sx={{ mb: 2 }}
              />

              {/* Content Field */}
              <TextField
                fullWidth
                label="Blog Content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                margin="normal"
                required
                multiline
                rows={8}
                variant="outlined"
                sx={{ mb: 2 }}
              />

              {/* Image Upload Section */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Blog Image
                </Typography>

                {/* Current Image */}
                {currentImage && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Current Image:
                    </Typography>
                    <img
                      src={currentImage}
                      alt="Current blog"
                      style={{
                        maxWidth: "100%",
                        maxHeight: 300,
                        borderRadius: 8,
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                )}

                {/* New Image Upload */}
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<Image />}
                  sx={{ mb: 1 }}
                >
                  Upload New Image
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />
                </Button>

                {formData.image && (
                  <Typography variant="body2" color="primary" sx={{ ml: 1 }}>
                    New image selected: {formData.image.name}
                  </Typography>
                )}

                <Typography variant="caption" color="text.secondary" display="block">
                  Optional. Leave empty to keep current image. Max size: 5MB
                </Typography>
              </Box>

              {/* Submit Buttons */}
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/my-blogs")}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting}
                  sx={{ minWidth: 120 }}
                >
                  {submitting ? <CircularProgress size={24} /> : "Update Blog"}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditBlog;