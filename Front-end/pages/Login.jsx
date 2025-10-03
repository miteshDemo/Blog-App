// Login.jsx
import React, { useState, useContext } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Paper,
  Alert,
  Divider,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axiosConfig";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await API.post("/auth/login", form);

      // ✅ store user in AuthContext
      login({
        token: data.token,
        name: data.name,
        email: data.email,
      });

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            p: 3,
            width: "90%",
            maxWidth: 400,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "grey.200",
          }}
        >
          {/* Header Section */}
          <Box textAlign="center" mb={2}>
            <Typography
              variant="h5"
              component="h1"
              fontWeight="bold"
              color="primary"
              gutterBottom
            >
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to your account to continue
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              size="small"
              margin="normal"
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <TextField
              fullWidth
              size="small"
              margin="normal"
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2, borderRadius: 1, py: 0.5 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                mt: 2,
                py: 1,
                borderRadius: 1,
                fontSize: "0.9rem",
                fontWeight: "bold",
                textTransform: "none",
                boxShadow: 1,
                '&:hover': {
                  boxShadow: 2,
                  transform: 'translateY(-1px)',
                  transition: 'all 0.2s ease-in-out'
                },
              }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : "Sign In"}
            </Button>
          </form>

          {/* Divider */}
          <Divider sx={{ my: 2 }}>
            <Typography variant="caption" color="text.secondary">
              OR
            </Typography>
          </Divider>

          {/* Register Redirect */}
          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{
                  textDecoration: "none",
                  color: "#1976d2",
                  fontWeight: "600",
                }}
                onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
                onMouseLeave={(e) => e.target.style.textDecoration = "none"}
              >
                Create Account
              </Link>
            </Typography>
          </Box>

          {/* Additional Features */}
          <Box mt={2} textAlign="center">
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
              Secure login with encrypted credentials
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;