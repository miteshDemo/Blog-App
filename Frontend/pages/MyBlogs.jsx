// src/pages/MyBlogs.jsx
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
  Chip,
  Container,
  Fab,
  Alert,
  CardMedia,
  alpha,
  useTheme,
  AppBar,
  Toolbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddIcon from "@mui/icons-material/Add";
import PostAddIcon from "@mui/icons-material/PostAdd";
import RefreshIcon from "@mui/icons-material/Refresh";
import HomeIcon from "@mui/icons-material/Home";

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");
  const theme = useTheme();

  // ✅ Fetch logged-in user's blogs
  const fetchBlogs = async (isRefresh = false) => {
    if (!token) return navigate("/login");
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError("");
      const res = await axios.get("http://localhost:5000/api/blogs/my-blogs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load your blogs. Please try again.");
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
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
      setBlogs(blogs.filter(blog => blog._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete blog");
    }
  };

  // ✅ Handle refresh
  const handleRefresh = () => {
    fetchBlogs(true);
  };

  // ✅ Get correct image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    let cleanPath = imagePath;
    if (imagePath.startsWith('/')) {
      cleanPath = imagePath.substring(1);
    }
    
    if (!cleanPath.includes('uploads/')) {
      cleanPath = `uploads/${cleanPath}`;
    }
    
    return `http://localhost:5000/${cleanPath}`;
  };

  // ✅ Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          minHeight: "100vh", 
          bgcolor: "background.default",
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        }}
      >
        <Box textAlign="center">
          <CircularProgress 
            size={60} 
            thickness={4}
            sx={{ 
              color: "white",
              mb: 2
            }} 
          />
          <Typography variant="h6" color="white" fontWeight="500">
            Loading your blogs...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        minHeight: "100vh", 
        bgcolor: "background.default",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        pb: 4
      }}
    >
      {/* ✅ AppBar with Icons */}
      <AppBar 
        position="sticky" 
        sx={{ 
          background: "linear-gradient(45deg, #1976d2, #00bcd4)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          mb: 4
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Left Side - Brand & Home */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton 
              color="inherit" 
              onClick={() => navigate("/")}
              sx={{ 
                bgcolor: "rgba(255,255,255,0.1)",
                '&:hover': { bgcolor: "rgba(255,255,255,0.2)" }
              }}
              title="Home"
            >
              <HomeIcon />
            </IconButton>
            <Typography 
              variant="h6" 
              sx={{ 
                display: { xs: 'none', sm: 'block' },
                fontWeight: "600"
              }}
            >
              My Blog Space
            </Typography>
          </Box>
          
          {/* Right Side - Action Icons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Create Blog Button */}
            <IconButton 
              color="inherit" 
              onClick={() => navigate("/create-blog")}
              sx={{ 
                bgcolor: "rgba(255,255,255,0.1)",
                '&:hover': { bgcolor: "rgba(255,255,255,0.2)" }
              }}
              title="Create New Blog"
            >
              <AddIcon />
            </IconButton>

            {/* Profile Button */}
            <IconButton 
              color="inherit" 
              onClick={() => navigate("/profile")}
              sx={{ 
                bgcolor: "rgba(255,255,255,0.1)",
                '&:hover': { bgcolor: "rgba(255,255,255,0.2)" }
              }}
              title="My Profile"
            >
              <AccountCircleIcon />
            </IconButton>

            {/* Refresh Button */}
            <IconButton 
              color="inherit" 
              onClick={handleRefresh}
              disabled={refreshing}
              sx={{ 
                bgcolor: "rgba(255,255,255,0.1)",
                '&:hover': { bgcolor: "rgba(255,255,255,0.2)" },
                '&:disabled': { opacity: 0.6 }
              }}
              title="Refresh Blogs"
            >
              {refreshing ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <RefreshIcon />
              )}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl">
        {/* ✅ Header Section - Clean & Minimal */}
        <Box 
          sx={{ 
            textAlign: "center", 
            mb: 6,
            px: 2,
            mt: 2
          }}
        >
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              background: "linear-gradient(45deg, #1976d2, #00bcd4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            📚 My Blogs
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ mb: 3 }}
          >
            Your personal writing space
          </Typography>
        </Box>

        {/* ✅ Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              mx: { xs: 2, sm: 0 }
            }}
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={handleRefresh}
              >
                RETRY
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* ✅ Blog Display Section */}
        {blogs.length === 0 ? (
          <Box 
            sx={{ 
              textAlign: "center", 
              py: 10,
              px: 2
            }}
          >
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3
              }}
            >
              <PostAddIcon 
                sx={{ 
                  fontSize: 60, 
                  color: 'primary.main' 
                }} 
              />
            </Box>
            <Typography 
              variant="h5" 
              color="text.secondary" 
              gutterBottom
              sx={{ mb: 2 }}
            >
              No blogs yet
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}
            >
              Start your blogging journey by creating your first post.
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              startIcon={<AddIcon />}
              onClick={() => navigate("/create-blog")}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              Create Your First Blog
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3} sx={{ px: { xs: 2, sm: 0 } }}>
            {blogs.map((blog) => {
              const imageUrl = getImageUrl(blog.image);
              
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={blog._id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 3,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 35px rgba(0,0,0,0.15)',
                      },
                      overflow: 'hidden',
                      background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
                    }}
                  >
                    {/* Blog Image */}
                    {imageUrl ? (
                      <CardMedia
                        component="img"
                        height="200"
                        image={imageUrl}
                        alt={blog.title}
                        sx={{
                          objectFit: "cover",
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.05)'
                          }
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: 200,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'primary.main'
                        }}
                      >
                        <PostAddIcon sx={{ fontSize: 60, opacity: 0.5 }} />
                      </Box>
                    )}

                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      {/* Blog Title */}
                      <Typography 
                        variant="h6" 
                        fontWeight="600" 
                        gutterBottom
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          minHeight: '3rem',
                          lineHeight: 1.3
                        }}
                      >
                        {blog.title}
                      </Typography>

                      {/* Blog Content Preview */}
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          mb: 2,
                          lineHeight: 1.5
                        }}
                      >
                        {blog.content}
                      </Typography>

                      {/* Metadata */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(blog.createdAt)}
                        </Typography>
                        <Chip 
                          label={blog.author || "You"} 
                          size="small" 
                          variant="outlined"
                          color="primary"
                        />
                      </Box>
                    </CardContent>

                    {/* Action Buttons */}
                    <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                      <IconButton 
                        color="info" 
                        onClick={() => navigate(`/view-blog/${blog._id}`)}
                        sx={{
                          bgcolor: alpha(theme.palette.info.main, 0.1),
                          '&:hover': {
                            bgcolor: alpha(theme.palette.info.main, 0.2),
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.2s ease'
                        }}
                        title="View Blog"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      
                      <IconButton 
                        color="primary" 
                        onClick={() => navigate(`/edit-blog/${blog._id}`)}
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.2),
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.2s ease'
                        }}
                        title="Edit Blog"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      
                      <IconButton 
                        color="error" 
                        onClick={() => handleDelete(blog._id)}
                        sx={{
                          bgcolor: alpha(theme.palette.error.main, 0.1),
                          '&:hover': {
                            bgcolor: alpha(theme.palette.error.main, 0.2),
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.2s ease'
                        }}
                        title="Delete Blog"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* ✅ Floating Action Button for Mobile */}
        <Fab
          color="primary"
          aria-label="add blog"
          onClick={() => navigate("/create-blog")}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            display: { xs: 'flex', md: 'none' },
            boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)',
            '&:hover': {
              boxShadow: '0 6px 25px rgba(25, 118, 210, 0.4)',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          <AddIcon />
        </Fab>
      </Container>
    </Box>
  );
};

export default MyBlogs;