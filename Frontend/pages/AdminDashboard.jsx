import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Paper,
  Grid,
  Avatar,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Chip,
  Card as MuiCard,
  CardHeader,
  CardActions,
  CardMedia,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleIcon from "@mui/icons-material/People";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PostAddIcon from "@mui/icons-material/PostAdd";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem("userName");
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [openUsers, setOpenUsers] = useState(false);
  const [openBlogs, setOpenBlogs] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleBack = () => {
    navigate("/");
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

  // ✅ Fetch total counts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const usersRes = await axios.get("http://localhost:5000/api/admin/users/count");
        const blogsRes = await axios.get("http://localhost:5000/api/admin/blogs/count");
        setTotalUsers(usersRes.data.totalUsers);
        setTotalBlogs(blogsRes.data.totalBlogs);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };
    fetchCounts();
  }, []);

  // ✅ Fetch all users (with totalBlogs)
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users");
      setUsers(res.data);
      setOpenUsers(true);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // ✅ Fetch all blogs
  const fetchBlogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/blogs");
      setBlogs(res.data);
      setOpenBlogs(true);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  // ✅ Fetch blogs by user
  const fetchUserBlogs = async (user) => {
    try {
      setSelectedUser(user);
      const res = await axios.get(`http://localhost:5000/api/admin/users/${user._id}/blogs`);
      setBlogs(res.data);
      setOpenBlogs(true);
    } catch (error) {
      console.error("Error fetching user blogs:", error);
    }
  };

  // ✅ Edit user
  const handleEditUser = async () => {
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${editUser._id}`, editUser);
      setUsers(users.map((u) => (u._id === editUser._id ? editUser : u)));
      setEditUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // ✅ Delete user
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user and all their blogs?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
      setTotalUsers(totalUsers - 1);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // ✅ Delete blog
  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/blogs/${blogId}`);
      setBlogs(blogs.filter((b) => b._id !== blogId));
      setTotalBlogs(totalBlogs - 1);
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "#f4f6fb" }}>
      {/* ✅ AppBar */}
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(90deg, #3f51b5, #5c6bc0)",
          boxShadow: 3,
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button color="inherit" startIcon={<ArrowBackIcon />} onClick={handleBack}>
            Back to Home
          </Button>
          <Typography variant="h6" sx={{ fontWeight: "bold", letterSpacing: 1 }}>
            Admin Dashboard
          </Typography>
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              backgroundColor: "rgba(255,255,255,0.1)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.25)" },
              borderRadius: 2,
              px: 2,
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* ✅ Dashboard Body */}
      <Box sx={{ p: 4 }}>
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 4,
            backgroundColor: "white",
            textAlign: "center",
            maxWidth: 1000,
            mx: "auto",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "#3f51b5",
              width: 80,
              height: 80,
              mx: "auto",
              mb: 2,
              fontSize: 32,
              boxShadow: 3,
            }}
          >
            {name?.[0]?.toUpperCase() || "A"}
          </Avatar>

          <Typography variant="h4" fontWeight="bold" color="#3f51b5">
            Welcome, Admin {name || ""}
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Manage users and their blogs
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            {/* Total Users Card */}
            <Grid item xs={12} sm={6} md={4}>
              <Card
                elevation={4}
                onClick={fetchUsers}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 8px 20px rgba(63,81,181,0.2)",
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ color: "#3f51b5", fontSize: 50 }}>
                    <PeopleIcon fontSize="inherit" />
                  </Box>
                  <Typography variant="h6" mt={1}>
                    Total Users
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="#3f51b5">
                    {totalUsers}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Manage Blogs Card */}
            <Grid item xs={12} sm={6} md={4}>
              <Card
                elevation={4}
                onClick={fetchBlogs}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 8px 20px rgba(63,81,181,0.2)",
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ color: "#ff5722", fontSize: 50 }}>
                    <PostAddIcon fontSize="inherit" />
                  </Box>
                  <Typography variant="h6" mt={1}>
                    Total Blogs
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="#ff5722">
                    {totalBlogs}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* ✅ Users Table Modal */}
      <Dialog open={openUsers} onClose={() => setOpenUsers(false)} fullWidth maxWidth="lg">
        <DialogTitle sx={{ fontWeight: "bold", color: "#3f51b5" }}>
          All Registered Users ({users.length})
        </DialogTitle>
        <DialogContent>
          <Table>
            <TableHead sx={{ backgroundColor: "#e8eaf6" }}>
              <TableRow>
                <TableCell><b>Profile</b></TableCell>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>Email</b></TableCell>
                <TableCell><b>Role</b></TableCell>
                <TableCell><b>Total Blogs</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u._id} hover>
                  <TableCell>
                    <Avatar 
                      src={u.profileImage} 
                      sx={{ width: 40, height: 40 }}
                    >
                      {u.name?.[0]?.toUpperCase()}
                    </Avatar>
                  </TableCell>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={u.role} 
                      color={u.role === 'admin' ? 'secondary' : 'primary'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={u.totalPosts || 0} 
                      variant="outlined" 
                      size="small" 
                      color={u.totalPosts > 0 ? "success" : "default"}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      onClick={() => fetchUserBlogs(u)} 
                      color="info"
                      title="View Blogs"
                      disabled={!u.totalPosts}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => setEditUser(u)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteUser(u._id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUsers(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* ✅ Blogs Management Modal - Compact Cards */}
      <Dialog open={openBlogs} onClose={() => setOpenBlogs(false)} fullWidth maxWidth="lg">
        <DialogTitle sx={{ fontWeight: "bold", color: "#ff5722" }}>
          {selectedUser ? `Blogs by ${selectedUser.name} (${blogs.length})` : `All Blogs Management (${blogs.length})`}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
            {blogs.length === 0 ? (
              <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
                No blogs found.
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {blogs.map((blog) => {
                  const imageUrl = getImageUrl(blog.image);
                  
                  return (
                    <Grid item xs={12} sm={6} md={4} key={blog._id}>
                      <MuiCard 
                        sx={{ 
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: 3,
                          }
                        }}
                      >
                        {/* Blog Image - Smaller */}
                        {imageUrl && (
                          <CardMedia
                            component="img"
                            height="120"
                            image={imageUrl}
                            alt={blog.title}
                            sx={{ 
                              objectFit: 'cover',
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        
                        <CardContent sx={{ flexGrow: 1, p: 2, pb: 1 }}>
                          {/* Blog Title */}
                          <Typography 
                            variant="subtitle1" 
                            fontWeight="600" 
                            gutterBottom
                            sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              lineHeight: 1.3,
                              fontSize: '0.9rem'
                            }}
                          >
                            {blog.title}
                          </Typography>

                          {/* Blog Content Preview - Smaller */}
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              mb: 1,
                              lineHeight: 1.4,
                              fontSize: '0.8rem'
                            }}
                          >
                            {blog.content}
                          </Typography>

                          {/* Metadata - Compact */}
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(blog.createdAt).toLocaleDateString()}
                            </Typography>
                            <Chip 
                              label={blog.user?.name || "Unknown"} 
                              size="small" 
                              variant="outlined"
                              color="primary"
                              sx={{ fontSize: '0.7rem', height: 24 }}
                            />
                          </Box>
                        </CardContent>

                        {/* Delete Action - Prominent */}
                        <CardActions sx={{ p: 1, justifyContent: 'center', borderTop: 1, borderColor: 'divider' }}>
                          <IconButton 
                            onClick={() => handleDeleteBlog(blog._id)} 
                            color="error"
                            size="small"
                            sx={{
                              bgcolor: 'error.light',
                              color: 'white',
                              '&:hover': {
                                bgcolor: 'error.dark',
                                transform: 'scale(1.1)'
                              },
                              transition: 'all 0.2s ease'
                            }}
                            title="Delete Blog"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </CardActions>
                      </MuiCard>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          {selectedUser && (
            <Button onClick={() => {
              setSelectedUser(null);
              fetchBlogs();
            }}>
              View All Blogs
            </Button>
          )}
          <Button onClick={() => {
            setOpenBlogs(false);
            setSelectedUser(null);
          }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✅ Edit User Dialog */}
      <Dialog open={!!editUser} onClose={() => setEditUser(null)}>
        <DialogTitle sx={{ fontWeight: "bold", color: "#3f51b5" }}>
          Edit User
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1, minWidth: 400 }}>
          <TextField
            label="Name"
            value={editUser?.name || ""}
            onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
            fullWidth
          />
          <TextField
            label="Email"
            type="email"
            value={editUser?.email || ""}
            onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
            fullWidth
          />
          <TextField
            label="Role"
            select
            value={editUser?.role || ""}
            onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
            fullWidth
            SelectProps={{
              native: true,
            }}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditUser(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditUser}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;