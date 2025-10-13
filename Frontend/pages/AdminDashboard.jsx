import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
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
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleIcon from "@mui/icons-material/People";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem("userName");
  const [totalUsers, setTotalUsers] = useState(0);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ✅ Fetch total users count
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/users/count");
        setTotalUsers(res.data.totalUsers);
      } catch (error) {
        console.error("Error fetching total users:", error);
      }
    };
    fetchCount();
  }, []);

  // ✅ Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users");
      setUsers(res.data);
      setOpen(true);
    } catch (error) {
      console.error("Error fetching users:", error);
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
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
      setTotalUsers(totalUsers - 1);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
        p: 4,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 3,
          borderRadius: 4,
          backgroundColor: "white",
          textAlign: "center",
        }}
      >
        <Avatar
          sx={{
            bgcolor: "#5563DE",
            width: 80,
            height: 80,
            mx: "auto",
            mb: 2,
            fontSize: 32,
          }}
        >
          {name?.[0]?.toUpperCase() || "A"}
        </Avatar>

        <Typography variant="h4" fontWeight="bold" color="#5563DE">
          Welcome, Admin {name || ""}
        </Typography>
        <Typography variant="body1" color="textSecondary" mb={3}>
          Manage users from this dashboard
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Card
              elevation={3}
              onClick={fetchUsers}
              sx={{
                p: 2,
                borderRadius: 3,
                textAlign: "center",
                transition: "0.3s",
                cursor: "pointer",
                "&:hover": { transform: "translateY(-5px)" },
              }}
            >
              <CardContent>
                <Box sx={{ color: "#5563DE", fontSize: 40 }}>
                  <PeopleIcon />
                </Box>
                <Typography variant="h6" mt={1}>
                  Total Users
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="#5563DE">
                  {totalUsers}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ mt: 4, borderRadius: 2 }}
        >
          Logout
        </Button>
      </Paper>

      {/* ✅ Users Table Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>All Registered Users</DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>Email</b></TableCell>
                <TableCell><b>Role</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u._id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell>
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
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* ✅ Edit User Dialog */}
      <Dialog open={!!editUser} onClose={() => setEditUser(null)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Name"
            value={editUser?.name || ""}
            onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
          />
          <TextField
            label="Email"
            value={editUser?.email || ""}
            onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
          />
          <TextField
            label="Role"
            value={editUser?.role || ""}
            onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
          />
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
