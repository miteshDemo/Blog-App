import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  Fade,
  useTheme,
  alpha
} from "@mui/material";
import {
  Person,
  Email,
  Lock,
  HowToReg,
  ArrowForward
} from "@mui/icons-material";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 50%, #90caf9 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4
      }}
    >
      <Container 
        component="main" 
        maxWidth="sm"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh"
        }}
      >
        <Fade in timeout={800}>
          <Paper
            elevation={8}
            sx={{
              p: 4,
              borderRadius: 3,
              background: theme.palette.background.paper,
              width: "100%",
              maxWidth: 400,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              margin: "auto"
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 0.5
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                    color: "white",
                    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                  }}
                >
                  <HowToReg fontSize="medium" />
                </Box>
                <Box>
                  <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
                    Create Account
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontSize="0.85rem">
                    Join our community
                  </Typography>
                </Box>
              </Box>

              {/* Error Alert */}
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    width: "100%", 
                    borderRadius: 2,
                    fontSize: "0.85rem",
                    py: 0.5
                  }}
                >
                  {error}
                </Alert>
              )}

              {/* Form */}
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ mt: 0.5, width: "100%" }}
              >
                <TextField
                  margin="dense"
                  required
                  fullWidth
                  id="name"
                  label="Full Name"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  size="small"
                  value={form.name}
                  onChange={handleChange("name")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person 
                          fontSize="small"
                          sx={{ 
                            color: theme.palette.primary.main,
                          }} 
                        />
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      fontSize: '0.9rem',
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                      '&.Mui-focused fieldset': {
                        borderWidth: 2,
                        borderColor: theme.palette.primary.main,
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.9rem'
                    }
                  }}
                />
                
                <TextField
                  margin="dense"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  size="small"
                  value={form.email}
                  onChange={handleChange("email")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email 
                          fontSize="small"
                          sx={{ 
                            color: theme.palette.primary.main,
                          }} 
                        />
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      fontSize: '0.9rem',
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                      '&.Mui-focused fieldset': {
                        borderWidth: 2,
                        borderColor: theme.palette.primary.main,
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.9rem'
                    }
                  }}
                />
                
                <TextField
                  margin="dense"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  size="small"
                  value={form.password}
                  onChange={handleChange("password")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock 
                          fontSize="small"
                          sx={{ 
                            color: theme.palette.primary.main,
                          }} 
                        />
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      fontSize: '0.9rem',
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                      '&.Mui-focused fieldset': {
                        borderWidth: 2,
                        borderColor: theme.palette.primary.main,
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.9rem'
                    }
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  endIcon={<ArrowForward fontSize="small" />}
                  sx={{
                    py: 1,
                    borderRadius: 2,
                    fontSize: "0.95rem",
                    fontWeight: "bold",
                    textTransform: "none",
                    background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px rgba(25, 118, 210, 0.4)",
                      background: "linear-gradient(135deg, #1565c0, #1976d2)",
                    },
                    "&:active": {
                      transform: "translateY(0)",
                    },
                    "&:disabled": {
                      background: theme.palette.action.disabled,
                      transform: "none"
                    }
                  }}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>

                {/* Footer */}
                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" fontSize="0.85rem">
                    Already have an account?{" "}
                    <Button
                      variant="text"
                      onClick={() => navigate("/login")}
                      sx={{
                        textTransform: "none",
                        fontWeight: "bold",
                        fontSize: "0.85rem",
                        color: "#1976d2",
                        minWidth: 'auto',
                        p: 0.5,
                        "&:hover": {
                          background: alpha("#1976d2", 0.08),
                          transform: "translateY(-1px)"
                        }
                      }}
                    >
                      Sign In
                    </Button>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Register;