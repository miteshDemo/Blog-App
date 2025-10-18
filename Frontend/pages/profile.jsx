import { useEffect, useState } from "react";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  IconButton,
  Card,
  CardContent,
  Button,
  Box,
  CircularProgress,
  Fade,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [openCard, setOpenCard] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch logged-in user profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error("Profile fetch error:", err.response?.data || err.message);
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  // ✅ Auto close popup after 3s
  useEffect(() => {
    if (!openCard) return;
    const timer = setTimeout(() => setOpenCard(false), 3000);
    return () => clearTimeout(timer);
  }, [openCard]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f6f8" }}>
      {/* AppBar */}
      <AppBar position="static" sx={{ bgcolor: "#1976d2" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            MyBlogApp
          </Typography>
          {user && (
            <IconButton onClick={() => setOpenCard(!openCard)}>
              <Avatar sx={{ bgcolor: "#fff", color: "#1976d2" }} alt={user.name}>
                {user.name?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Profile Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 6,
          px: 2,
        }}
      >
        {!user ? (
          <CircularProgress sx={{ mt: 10 }} />
        ) : (
          <>
            <Typography
              variant="h4"
              sx={{
                mb: 3,
                fontWeight: 700,
                background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textAlign: "center",
              }}
            >
              Welcome back, {user.name.split(" ")[0]}! 🌟
            </Typography>

            <Card
              sx={{
                p: 3,
                width: 340,
                textAlign: "center",
                boxShadow: 4,
                borderRadius: 4,
                bgcolor: "#fff",
              }}
            >
              {/* ✅ Removed avatar and user details from this card */}

              {/* My Blogs */}
              <Button
                variant="contained"
                color="info"
                fullWidth
                sx={{ mb: 2 }}
                onClick={() => navigate("/my-blogs")}
              >
                📚 My Blogs
              </Button>

              {/* Logout */}
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleLogout}
              >
                Logout
              </Button>

              {/* Back to Home */}
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => navigate("/")}
              >
                Back to Home
              </Button>
            </Card>
          </>
        )}
      </Box>

      {/* Avatar Popup (with user's details) */}
      {openCard && user && (
        <Fade in={openCard}>
          <Card
            sx={{
              position: "absolute",
              top: 70,
              right: 20,
              width: 250,
              boxShadow: 5,
              borderRadius: 3,
              p: 2,
              zIndex: 10,
              backgroundColor: "#fff",
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Avatar sx={{ bgcolor: "#1976d2", mx: "auto", mb: 1 }}>
                {user.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  fullWidth
                  onClick={handleLogout}
                >
                  Logout
                </Button>
                <Button
                  variant="text"
                  color="error"
                  size="small"
                  fullWidth
                  sx={{ mt: 1 }}
                  onClick={() => setOpenCard(false)}
                >
                  Close
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Fade>
      )}
    </Box>
  );
};

export default Profile;
