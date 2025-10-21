import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Button,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "../api/axiosConfig";

const ViewBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/blogs/${id}`);
        console.log("Blog data:", res.data); // Debug log
        console.log("Image path:", res.data.image); // Debug log
        setBlog(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError(err.response?.data?.message || "Failed to load blog");
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      console.log("No image path provided");
      return null;
    }
    
    console.log("Original image path:", imagePath); // Debug log
    
    // Handle different image path formats
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      console.log("Full URL detected:", imagePath);
      return imagePath;
    }
    
    // Handle local file paths
    let cleanPath = imagePath;
    if (imagePath.startsWith('/')) {
      cleanPath = imagePath.substring(1);
    }
    
    // Check if it already includes 'uploads'
    if (!cleanPath.includes('uploads/')) {
      cleanPath = `uploads/${cleanPath}`;
    }
    
    const finalUrl = `http://localhost:5000/${cleanPath}`;
    console.log("Final image URL:", finalUrl); 
    return finalUrl;
  };

  const handleImageError = (e) => {
    console.error("Image failed to load:", e.target.src);
    setImageError(true);
    e.target.style.display = 'none';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{ mt: 2, textTransform: "none" }}
        >
          <ArrowBackIcon sx={{ mr: 1 }} /> Go Back
        </Button>
      </Box>
    );
  }

  if (!blog) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography variant="h6">Blog not found</Typography>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{ mt: 2, textTransform: "none" }}
        >
          <ArrowBackIcon sx={{ mr: 1 }} /> Go Back
        </Button>
      </Box>
    );
  }

  const imageUrl = getImageUrl(blog.image);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" p={2} minHeight="90vh">
      <Card sx={{ maxWidth: 700, width: "100%", p: 2, borderRadius: 3, boxShadow: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2, textTransform: "none" }}
        >
          Back
        </Button>

        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Image URL: {imageUrl || 'No image'}
          </Alert>
        )}

        {imageUrl && !imageError ? (
          <CardMedia
            component="img"
            height="350"
            image={imageUrl}
            alt={blog.title}
            sx={{ 
              borderRadius: 2, 
              objectFit: "cover", 
              mb: 2,
              width: '100%'
            }}
            onError={handleImageError}
          />
        ) : (
          <Box 
            sx={{ 
              height: 200, 
              bgcolor: 'grey.100', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              borderRadius: 2,
              mb: 2
            }}
          >
            <Typography color="text.secondary">
              No image available
            </Typography>
          </Box>
        )}

        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            {blog.title}
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 2, color: "text.secondary" }}>
            ✍️ By {blog.user?.name || blog.author || "Unknown Author"} •{" "}
            {new Date(blog.createdAt).toLocaleDateString()}
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}>
            {blog.content}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ViewBlog;