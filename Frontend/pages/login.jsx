import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Avatar,
  Link,
  MenuItem,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "", role: "user" });
  const navigate = useNavigate();

  // 🧑‍💼 Default admin credentials (for demo or testing)
  const ADMIN_EMAIL = "admin123@gmail.com";
  const ADMIN_PASSWORD = "admin@123";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ Handle Admin login manually
      if (
        form.role === "admin" &&
        form.email === ADMIN_EMAIL &&
        form.password === ADMIN_PASSWORD
      ) {
        // Save admin session data
        localStorage.setItem("token", "admin-demo-token");
        localStorage.setItem("role", "admin");
        localStorage.setItem("user", JSON.stringify({ name: "Admin" }));
        navigate("/admin");
        return;
      }

      // ✅ Otherwise, regular user login via backend
      const res = await axios.post("http://localhost:5000/api/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/profile");
    } catch (err) {
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #74ABE2 0%, #5563DE 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 4,
            textAlign: "center",
            backdropFilter: "blur(12px)",
            backgroundColor: "rgba(255,255,255,0.9)",
            position: "relative",
          }}
        >
          {/* 🔙 Back Button */}
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/")}
            sx={{
              position: "absolute",
              top: 16,
              left: 16,
              color: "#5563DE",
              fontWeight: "bold",
              textTransform: "none",
              fontSize: "0.85rem",
              "&:hover": {
                backgroundColor: "rgba(85, 99, 222, 0.08)",
                transform: "translateX(-2px)",
              },
              transition: "all 0.2s ease",
            }}
          >
            Back to Home
          </Button>

          {/* Header Avatar */}
          <Avatar
            sx={{
              bgcolor: form.role === "admin" ? "#FF2E63" : "#5563DE",
              mx: "auto",
              mb: 2,
              width: 60,
              height: 60,
              mt: 3,
            }}
          >
            {form.role === "admin" ? (
              <AdminPanelSettingsIcon fontSize="large" />
            ) : (
              <LockOutlinedIcon fontSize="large" />
            )}
          </Avatar>

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {form.role === "admin" ? "Admin Login" : "Welcome Back"}
          </Typography>
          <Typography variant="body2" color="textSecondary" mb={3}>
            {form.role === "admin"
              ? "Sign in with your admin credentials"
              : "Please sign in to continue"}
          </Typography>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            {/* Role Selection */}
            <TextField
              select
              fullWidth
              label="Login as"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              margin="normal"
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>

            {/* Email */}
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            {/* Password */}
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              margin="normal"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            {/* Submit */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                py: 1.2,
                background:
                  form.role === "admin"
                    ? "linear-gradient(90deg, #FF2E63 0%, #FF8C00 100%)"
                    : "linear-gradient(90deg, #5563DE 0%, #74ABE2 100%)",
                fontWeight: "bold",
                borderRadius: 2,
                textTransform: "none",
                "&:hover": {
                  background:
                    form.role === "admin"
                      ? "linear-gradient(90deg, #e52657 0%, #e67a00 100%)"
                      : "linear-gradient(90deg, #4952c4 0%, #689ed6 100%)",
                },
              }}
            >
              {form.role === "admin" ? "Login as Admin" : "Login"}
            </Button>
          </form>

          {/* Register Link for Users only */}
          {form.role === "user" && (
            <Typography variant="body2" sx={{ mt: 3 }}>
              Don’t have an account?{" "}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate("/register")}
                sx={{
                  color: "#5563DE",
                  fontWeight: "bold",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Register
              </Link>
            </Typography>
          )}

          {/* ℹ️ Admin Hint */}
          {form.role === "admin" && (
            <Typography
              variant="caption"
              display="block"
              sx={{ mt: 2, color: "gray", fontStyle: "italic" }}
            >
            </Typography>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
