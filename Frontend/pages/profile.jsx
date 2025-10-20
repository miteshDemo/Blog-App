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
  Container,
  Grid,
  alpha,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  EditRounded,
  ArticleRounded,
  LogoutRounded,
  HomeRounded,
  CameraAltRounded,
  SaveRounded,
  CancelRounded,
} from "@mui/icons-material";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [openCard, setOpenCard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    avatar: "",
  });
  const [avatarPreview, setAvatarPreview] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  // ✅ Fetch logged-in user profile
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    axios
      .get("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
        setEditForm({
          name: res.data.name,
          email: res.data.email,
          avatar: res.data.avatar || "",
        });
        setAvatarPreview(res.data.avatar || "");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Profile fetch error:", err.response?.data || err.message);
        localStorage.removeItem("token");
        navigate("/login");
        setLoading(false);
      });
  };

  // Auto close avatar popup
  useEffect(() => {
    if (!openCard) return;
    const timer = setTimeout(() => setOpenCard(false), 3000);
    return () => clearTimeout(timer);
  }, [openCard]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setEditForm({
      name: user.name,
      email: user.email,
      avatar: user.avatar || "",
    });
    setAvatarPreview(user.avatar || "");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "avatar") {
      setAvatarPreview(value);
    }
  };

  // ✅ Upload avatar file
  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
      setEditForm((prev) => ({
        ...prev,
        avatar: file, // store file for FormData
      }));

      setSnackbar({
        open: true,
        message: "Avatar image selected",
        severity: "info",
      });
    }
  };

  // ✅ Save profile changes to backend
  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", editForm.name);
      formData.append("email", editForm.email);
      if (editForm.avatar instanceof File) {
        formData.append("avatar", editForm.avatar);
      }

      const response = await axios.put(
        "http://localhost:5000/api/auth/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser(response.data.user);
      setEditForm(response.data.user);
      setAvatarPreview(response.data.user.avatar || "");
      setEditDialogOpen(false);

      setSnackbar({
        open: true,
        message: response.data.msg || "Profile updated successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
      setSnackbar({
        open: true,
        message: error.response?.data?.msg || "Failed to update profile",
        severity: "error",
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={60} sx={{ color: "white", mb: 2 }} />
          <Typography variant="h6" sx={{ color: "white", fontWeight: 500 }}>
            Loading your profile...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        pb: 8,
      }}
    >
      {/* AppBar */}
      <AppBar
        position="sticky"
        sx={{
          background: `linear-gradient(45deg, ${alpha(
            theme.palette.primary.main,
            0.9
          )}, ${alpha(theme.palette.primary.dark, 0.9)})`,
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        }}
      >
        <Toolbar>
          <Box
            sx={{ display: "flex", alignItems: "center", flexGrow: 1, cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                background: "linear-gradient(45deg, #fff, #e3f2fd)",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                ✍️
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "white" }}>
              BlogApp
            </Typography>
          </Box>

          {user && (
            <IconButton
              onClick={() => setOpenCard(!openCard)}
              sx={{
                border: "2px solid rgba(255,255,255,0.3)",
                "&:hover": {
                  border: "2px solid rgba(255,255,255,0.8)",
                  transform: "scale(1.05)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "white",
                  color: theme.palette.primary.main,
                  fontWeight: "bold",
                  width: 40,
                  height: 40,
                }}
                alt={user.name}
                src={user.avatar}
              >
                {user.avatar ? "" : user.name?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Main Profile Card */}
      <Container maxWidth="md" sx={{ mt: 8 }}>
        {user && (
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: "0 16px 48px rgba(0,0,0,0.2)",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.8))",
              backdropFilter: "blur(10px)",
              overflow: "visible",
              position: "relative",
            }}
          >
            <Box
              sx={{
                height: 120,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                borderRadius: "16px 16px 0 0",
                position: "relative",
              }}
            >
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    border: "4px solid white",
                    bgcolor: theme.palette.primary.main,
                    position: "absolute",
                    bottom: -50,
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "2rem",
                    fontWeight: "bold",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                  }}
                  src={user.avatar}
                  alt={user.name}
                >
                  {user.avatar ? "" : user.name?.charAt(0).toUpperCase()}
                </Avatar>
                <IconButton
                  onClick={handleEditClick}
                  sx={{
                    position: "absolute",
                    bottom: -30,
                    left: "calc(50% + 30px)",
                    bgcolor: theme.palette.primary.main,
                    color: "white",
                    "&:hover": { bgcolor: theme.palette.primary.dark, transform: "scale(1.1)" },
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  }}
                >
                  <EditRounded />
                </IconButton>
              </Box>
            </Box>

            <CardContent sx={{ pt: 8, pb: 4, textAlign: "center" }}>
              <Typography
                variant="h3"
                sx={{
                  mb: 1,
                  fontWeight: "bold",
                  background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                Welcome Back, {user.name}
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 6 }}>
                Ready to create your next amazing blog post?
              </Typography>

              {/* Action Buttons */}
              <Grid container spacing={3} sx={{ maxWidth: 500, margin: "0 auto" }}>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="contained"
                    startIcon={<ArticleRounded />}
                    fullWidth
                    onClick={() => navigate("/my-blogs")}
                    sx={{
                      py: 2.5,
                      borderRadius: 3,
                      background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      textTransform: "none",
                      boxShadow: "0 8px 25px rgba(25, 118, 210, 0.3)",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 12px 35px rgba(25, 118, 210, 0.4)",
                        background: "linear-gradient(45deg, #1565c0, #1976d2)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    📚 My Blogs
                  </Button>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Button
                    variant="contained"
                    startIcon={<EditRounded />}
                    fullWidth
                    onClick={() => navigate("/create-blog")}
                    sx={{
                      py: 2.5,
                      borderRadius: 3,
                      background: "linear-gradient(45deg, #ed6c02, #ff9800)",
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      textTransform: "none",
                      boxShadow: "0 8px 25px rgba(237, 108, 2, 0.3)",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 12px 35px rgba(237, 108, 2, 0.4)",
                        background: "linear-gradient(45deg, #e65100, #ed6c02)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    ✍️ Write New Blog
                  </Button>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    startIcon={<HomeRounded />}
                    fullWidth
                    onClick={() => navigate("/")}
                    sx={{
                      py: 2,
                      borderRadius: 3,
                      borderWidth: 2,
                      fontSize: "1rem",
                      fontWeight: "bold",
                      textTransform: "none",
                      color: "primary.main",
                      borderColor: "primary.main",
                      "&:hover": {
                        borderWidth: 2,
                        transform: "translateY(-2px)",
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    🏠 Back to Home
                  </Button>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    startIcon={<LogoutRounded />}
                    fullWidth
                    onClick={handleLogout}
                    color="error"
                    sx={{
                      py: 2,
                      borderRadius: 3,
                      borderWidth: 2,
                      fontSize: "1rem",
                      fontWeight: "bold",
                      textTransform: "none",
                      "&:hover": {
                        borderWidth: 2,
                        transform: "translateY(-2px)",
                        bgcolor: alpha(theme.palette.error.main, 0.04),
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    🚪 Logout
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Container>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            color: "white",
            textAlign: "center",
          }}
        >
          Edit Profile
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  border: `4px solid ${theme.palette.primary.main}`,
                  fontSize: "2rem",
                  mb: 2,
                }}
                src={avatarPreview}
                alt={editForm.name}
              >
                {avatarPreview ? "" : editForm.name?.charAt(0).toUpperCase()}
              </Avatar>
              <IconButton
                component="label"
                sx={{
                  position: "absolute",
                  bottom: 5,
                  right: -5,
                  bgcolor: theme.palette.primary.main,
                  color: "white",
                  "&:hover": { bgcolor: theme.palette.primary.dark },
                }}
              >
                <CameraAltRounded />
                <input type="file" hidden accept="image/*" onChange={handleAvatarUpload} />
              </IconButton>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Click camera icon to upload avatar
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={editForm.name}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={editForm.email}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Avatar URL (Optional)"
            name="avatar"
            value={editForm.avatar instanceof File ? "" : editForm.avatar}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
            placeholder="Paste image URL for avatar"
            helperText="Or use the camera icon to upload from your device"
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={handleEditClose}
            startIcon={<CancelRounded />}
            variant="outlined"
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveChanges}
            startIcon={<SaveRounded />}
            variant="contained"
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Avatar Popup */}
      {openCard && user && (
        <Fade in={openCard}>
          <Card
            sx={{
              position: "fixed",
              top: 80,
              right: 20,
              width: 280,
              boxShadow: "0 16px 48px rgba(0,0,0,0.3)",
              borderRadius: 3,
              overflow: "visible",
              zIndex: 9999,
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.9))",
              backdropFilter: "blur(10px)",
              "&::before": {
                content: '""',
                position: "absolute",
                top: -8,
                right: 20,
                width: 16,
                height: 16,
                background: "inherit",
                transform: "rotate(45deg)",
                zIndex: -1,
              },
            }}
          >
            <CardContent sx={{ textAlign: "center", p: 3 }}>
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.main,
                  mx: "auto",
                  mb: 2,
                  width: 60,
                  height: 60,
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                }}
                src={user.avatar}
              >
                {user.avatar ? "" : user.name?.charAt(0).toUpperCase()}
              </Avatar>

              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {user.email}
              </Typography>

              <Button
                variant="outlined"
                color="error"
                size="small"
                fullWidth
                startIcon={<LogoutRounded />}
                onClick={handleLogout}
                sx={{ borderRadius: 2, textTransform: "none" }}
              >
                Logout
              </Button>
            </CardContent>
          </Card>
        </Fade>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
