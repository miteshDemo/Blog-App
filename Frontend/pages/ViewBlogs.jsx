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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "../api/axiosConfig"; // your axios instance with token

const ViewBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/blogs/${id}`);
        setBlog(res.data); // store fetched blog
        setLoading(false);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError(err.response?.data?.message || "Failed to load blog");
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

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

        {blog.image && (
          <CardMedia
            component="img"
            height="350"
            image={`http://localhost:5000/${blog.image}`}
            alt={blog.title}
            sx={{ borderRadius: 2, objectFit: "cover", mb: 2 }}
          />
        )}

        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            {blog.title}
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 2, color: "text.secondary" }}>
            ✍️ By {blog.user?.name || "Unknown Author"} •{" "}
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
