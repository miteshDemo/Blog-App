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
  AppBar,
  Toolbar,
  IconButton,
  Container,
  Paper,
  alpha,
  useTheme,
  Chip,
  CardMedia,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";
import ImageIcon from "@mui/icons-material/Image";
import PostAddIcon from "@mui/icons-material/PostAdd";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";

const CreateBlog = () => {
  const [form, setForm] = useState({
    title: "",
    content: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });

      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setForm({ ...form, image: null });
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first");
      navigate("/login");
      return;
    }

    // Validation
    if (!form.title.trim() || !form.content.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title.trim());
    formData.append("content", form.content.trim());
    if (form.image) formData.append("image", form.image);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/blogs",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        pb: 4,
      }}
    >
      {/* ✅ AppBar */}
      <AppBar
        position="sticky"
        sx={{
          background: "linear-gradient(45deg, #1976d2, #00bcd4)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          mb: 4,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Left Side - Navigation */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              color="inherit"
              onClick={() => navigate("/my-blogs")}
              sx={{
                bgcolor: "rgba(255,255,255,0.1)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
              }}
              title="Back to My Blogs"
            >
              <ArrowBackIcon />
            </IconButton>
            <IconButton
              color="inherit"
              onClick={() => navigate("/")}
              sx={{
                bgcolor: "rgba(255,255,255,0.1)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
              }}
              title="Home"
            >
              <HomeIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md">
        <Paper
          elevation={8}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
            mb: 4,
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              background: "linear-gradient(45deg, #1976d2, #00bcd4)",
              color: "white",
              textAlign: "center",
              py: 4,
              px: 2,
            }}
          >
            <PostAddIcon sx={{ fontSize: 60, mb: 2, opacity: 0.9 }} />
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Create New Blog
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Share your thoughts and stories with the world
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              {/* Title Field */}
              <TextField
                fullWidth
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <DescriptionIcon color="primary" />
                    <span>Blog Title</span>
                  </Box>
                }
                name="title"
                value={form.title}
                onChange={handleChange}
                margin="normal"
                required
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    fontSize: "1.1rem",
                    "&:hover fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
                placeholder="Enter a captivating title for your blog..."
              />

              {/* Content Field */}
              <TextField
                fullWidth
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <DescriptionIcon color="primary" />
                    <span>Blog Content</span>
                  </Box>
                }
                name="content"
                multiline
                rows={8}
                value={form.content}
                onChange={handleChange}
                margin="normal"
                required
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
                placeholder="Write your amazing story here... You can use multiple paragraphs to make it engaging."
              />

              {/* Image Upload Section */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <ImageIcon color="primary" />
                  Blog Image (Optional)
                </Typography>

                {!imagePreview ? (
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    startIcon={<CloudUploadIcon />}
                    sx={{
                      py: 2,
                      borderRadius: 2,
                      borderStyle: "dashed",
                      borderWidth: 2,
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                      "&:hover": {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: alpha(
                          theme.palette.primary.main,
                          0.04
                        ),
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Click to Upload Image
                    <input
                      type="file"
                      hidden
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </Button>
                ) : (
                  <Box sx={{ textAlign: "center" }}>
                    <CardMedia
                      component="img"
                      image={imagePreview}
                      alt="Preview"
                      sx={{
                        maxHeight: 300,
                        borderRadius: 2,
                        mb: 2,
                        mx: "auto",
                      }}
                    />
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={removeImage}
                      startIcon={<ImageIcon />}
                    >
                      Remove Image
                    </Button>
                  </Box>
                )}

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1, textAlign: "center" }}
                >
                  Supported formats: JPG, PNG, GIF • Max size: 5MB
                </Typography>
              </Box>

              {/* Character Count */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Chip
                  label={`${form.content.length} characters`}
                  color={form.content.length > 100 ? "success" : "default"}
                  variant="outlined"
                />
                <Chip
                  label={`${form.title ? "Title ✓" : "Title required"}`}
                  color={form.title ? "success" : "default"}
                  variant="outlined"
                />
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={
                    loading || !form.title.trim() || !form.content.trim()
                  }
                  startIcon={
                    loading ? <CircularProgress size={20} /> : <PostAddIcon />
                  }
                  sx={{
                    flex: 1,
                    minWidth: 200,
                    py: 1.5,
                    borderRadius: 3,
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    boxShadow: "0 4px 15px rgba(25, 118, 210, 0.3)",
                    "&:hover": {
                      boxShadow: "0 6px 20px rgba(25, 118, 210, 0.4)",
                      transform: "translateY(-2px)",
                    },
                    "&:disabled": {
                      transform: "none",
                      boxShadow: "none",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {loading ? "Creating..." : "Publish Blog"}
                </Button>

                <Button
                  variant="outlined"
                  color="secondary"
                  size="large"
                  onClick={() => navigate("/my-blogs")}
                  sx={{
                    flex: 1,
                    minWidth: 150,
                    py: 1.5,
                    borderRadius: 3,
                    fontSize: "1rem",
                    fontWeight: "600",
                    borderWidth: 2,
                    "&:hover": {
                      borderWidth: 2,
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </form>
          </CardContent>
        </Paper>

        {/* Quick Tips */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 3,
            background: alpha(theme.palette.primary.main, 0.05),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            color="primary"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            💡 Writing Tips
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Write a compelling title to attract readers
            <br />
            • Use paragraphs to make your content readable
            <br />
            • Add images to make your blog visually appealing
            <br />• Proofread before publishing
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default CreateBlog;
