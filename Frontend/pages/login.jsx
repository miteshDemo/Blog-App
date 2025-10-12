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
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
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
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 4,
            textAlign: "center",
            backdropFilter: "blur(12px)",
            backgroundColor: "rgba(255,255,255,0.9)",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "#5563DE",
              mx: "auto",
              mb: 2,
              width: 56,
              height: 56,
            }}
          >
            <LockOutlinedIcon fontSize="large" />
          </Avatar>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="textSecondary" mb={3}>
            Please sign in to continue
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              type="email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              margin="normal"
              type="password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                py: 1.2,
                background:
                  "linear-gradient(90deg, #5563DE 0%, #74ABE2 100%)",
                fontWeight: "bold",
                borderRadius: 2,
                textTransform: "none",
                "&:hover": {
                  background:
                    "linear-gradient(90deg, #4952c4 0%, #689ed6 100%)",
                },
              }}
            >
              Login
            </Button>
          </form>

          {/* Register Link */}
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
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
