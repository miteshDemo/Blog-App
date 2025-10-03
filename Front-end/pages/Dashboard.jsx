import React, { useContext, useEffect, useState } from "react";
import {
  AuthContext
} from "../context/AuthContext";
import {
  Container,
  Paper,
  Typography,
  Button,
  CircularProgress,
  AppBar,
  Toolbar,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Alert,
  Grid,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import {
  Logout,
  Person,
  Edit
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", profilePicture: "" });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // Load profile picture from localStorage on component mount
  useEffect(() => {
    const savedProfilePicture = localStorage.getItem('userProfilePicture');
    if (savedProfilePicture) {
      setEditForm(prev => ({ ...prev, profilePicture: savedProfilePicture }));
    }
  }, []);

  // Fetch user info
  useEffect(() => {
    if (!user?.token) {
      setError("You must be logged in to access the dashboard.");
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const { data } = await API.get("/auth/me");
        
        // Check if we have a saved profile picture in localStorage
        const savedProfilePicture = localStorage.getItem('userProfilePicture');
        
        const userDataWithPicture = {
          ...data,
          profilePicture: savedProfilePicture || data.profilePicture || ""
        };

        setUserData(userDataWithPicture);
        setEditForm({ 
          name: data.name, 
          email: data.email,
          profilePicture: savedProfilePicture || data.profilePicture || "" 
        });

        // If backend doesn't support profile picture, save to localStorage
        if (!data.profilePicture && savedProfilePicture) {
          localStorage.setItem('userProfilePicture', savedProfilePicture);
        }

      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(err.response?.data?.message || err.message || "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    window.location.href = "/login";
  };

  const handleEditOpen = () => {
    setEditForm({ 
      name: userData?.name || "", 
      email: userData?.email || "",
      profilePicture: userData?.profilePicture || "" 
    });
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      // Save profile picture to localStorage immediately
      if (editForm.profilePicture) {
        localStorage.setItem('userProfilePicture', editForm.profilePicture);
      } else {
        localStorage.removeItem('userProfilePicture');
      }

      // Try different endpoints - adjust based on your backend API
      const endpoints = ["/auth/profile", "/user/profile", "/api/profile"];
      
      let response;
      for (const endpoint of endpoints) {
        try {
          response = await API.put(endpoint, editForm);
          break;
        } catch (err) {
          console.log(`Endpoint ${endpoint} failed, trying next...`);
        }
      }

      // Update user data with the new information
      const updatedUserData = {
        ...userData,
        name: editForm.name,
        email: editForm.email,
        profilePicture: editForm.profilePicture
      };

      setUserData(updatedUserData);
      
      // If backend API doesn't exist, we still have the data in localStorage
      if (!response) {
        console.log("Using localStorage for profile data");
      } else {
        const { data } = response;
        setUserData(data);
      }

      handleEditClose();
    } catch (err) {
      console.error("Profile update error:", err);
      
      // Even if API fails, update locally and save to localStorage
      const updatedUserData = {
        ...userData,
        name: editForm.name,
        email: editForm.email,
        profilePicture: editForm.profilePicture
      };
      
      setUserData(updatedUserData);
      
      if (editForm.profilePicture) {
        localStorage.setItem('userProfilePicture', editForm.profilePicture);
      }
      
      handleEditClose();
    } finally {
      setSaving(false);
    }
  };

  // Clear profile picture
  const handleClearProfilePicture = () => {
    setEditForm(prev => ({ ...prev, profilePicture: "" }));
    localStorage.removeItem('userProfilePicture');
    setUserData(prev => ({ ...prev, profilePicture: "" }));
  };

  // Go to home page
  const handleGoHome = () => {
    navigate("/");
  };

  // Loading state
  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );

  // Error state
  if (error)
    return (
      <Container maxWidth="sm">
        <Paper sx={{ p: 4, mt: 8, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button variant="contained" onClick={handleLogout}>
            Go to Login
          </Button>
        </Paper>
      </Container>
    );

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* AppBar with User Info */}
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Dashboard
          </Typography>
          
          {/* User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
              Hello, {userData?.name}
            </Typography>
            <IconButton
              onClick={handleMenuOpen}
              sx={{ 
                p: 0.5,
                border: '2px solid rgba(255,255,255,0.3)',
                '&:hover': {
                  border: '2px solid rgba(255,255,255,0.6)'
                }
              }}
            >
              <Avatar 
                src={userData?.profilePicture}
                sx={{ 
                  width: 32, 
                  height: 32,
                  bgcolor: userData?.profilePicture ? 'transparent' : 'secondary.main',
                  fontSize: '0.9rem'
                }}
              >
                {userData?.profilePicture ? '' : userData?.name?.charAt(0)?.toUpperCase()}
              </Avatar>
            </IconButton>
          </Box>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1.5,
                minWidth: 200,
                borderRadius: 2
              }
            }}
          >
            <MenuItem disabled>
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  {userData?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {userData?.email}
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={handleEditOpen}>
              <Edit sx={{ mr: 1, fontSize: 20 }} />
              Edit Profile
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <Logout sx={{ mr: 1, fontSize: 20 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Dashboard Content */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Welcome Section */}
        <Paper
          elevation={2}
          sx={{
            p: 4,
            mb: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 3
          }}
        >
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Welcome back, {userData?.name}! 👋
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Great to see you again. Here's your dashboard overview.
          </Typography>
        </Paper>

        {/* User Info Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card elevation={3} sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Person color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Personal Information
                    </Typography>
                  </Box>
                  <Button 
                    variant="outlined" 
                    startIcon={<Edit />}
                    onClick={handleEditOpen}
                    sx={{ borderRadius: 2 }}
                  >
                    Edit Profile
                  </Button>
                </Box>
                
                <Box sx={{ pl: 2 }}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Full Name:</strong> {userData?.name}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Email:</strong> {userData?.email}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Member Since:</strong> {new Date().toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Avatar 
                  src={userData?.profilePicture}
                  sx={{ 
                    width: 120, 
                    height: 120,
                    bgcolor: userData?.profilePicture ? 'transparent' : 'primary.main',
                    fontSize: '2.5rem',
                    mb: 2,
                    mx: 'auto',
                    border: '3px solid',
                    borderColor: 'primary.main'
                  }}
                >
                  {userData?.profilePicture ? '' : userData?.name?.charAt(0)?.toUpperCase()}
                </Avatar>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Profile Picture
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {userData?.profilePicture ? 'Custom image set' : 'No profile picture set'}
                </Typography>
                {userData?.profilePicture && (
                  <Button 
                    variant="outlined" 
                    color="error" 
                    size="small"
                    onClick={handleClearProfilePicture}
                  >
                    Remove Picture
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" component="div" fontWeight="bold">
            Edit Profile
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={editForm.name}
              onChange={handleEditChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={editForm.email}
              onChange={handleEditChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Profile Picture URL"
              name="profilePicture"
              value={editForm.profilePicture}
              onChange={handleEditChange}
              margin="normal"
              placeholder="https://example.com/your-image.jpg"
              helperText="Enter the direct image URL from the web"
            />
            {editForm.profilePicture && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Preview:
                </Typography>
                <Avatar 
                  src={editForm.profilePicture}
                  sx={{ 
                    width: 80, 
                    height: 80,
                    mx: 'auto',
                    bgcolor: 'transparent'
                  }}
                />
                <Button 
                  variant="outlined" 
                  color="error" 
                  size="small"
                  onClick={handleClearProfilePicture}
                  sx={{ mt: 1 }}
                >
                  Clear Picture
                </Button>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleEditClose} disabled={saving}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveProfile} 
            variant="contained" 
            disabled={saving}
          >
            {saving ? <CircularProgress size={20} /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;