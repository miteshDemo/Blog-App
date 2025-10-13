import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  
  // Check if user is logged in (token in localStorage)
  const isLoggedIn = !!localStorage.getItem("token");

  const blogs = [
    { id: 1, title: "Getting Started with React", desc: "Learn the basics of React and component structure." },
    { id: 2, title: "MUI Styling Tips", desc: "Improve your app design with Material UI components." },
    { id: 3, title: "What’s New in JavaScript (ES2025)?", desc: "Discover the latest JS features for modern web apps." },
  ];

  return (
    <Box>
      {/* ✅ Navigation Bar */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            MyBlogApp
          </Typography>

          {/* Show buttons only if user is NOT logged in */}
          {!isLoggedIn && (
            <>
              <Button color="inherit" onClick={() => navigate("/register")}>Register</Button>
              <Button color="inherit" onClick={() => navigate("/login")}>Login</Button>
            </>
          )}

          {/* Profile button is visible only if logged in */}
          {isLoggedIn && (
            <Button color="inherit" onClick={() => navigate("/profile")}>Profile</Button>
          )}
        </Toolbar>
      </AppBar>

      {/* ✅ Home Content */}
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Welcome to My Blog Platform ✍️
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Explore the latest articles, tutorials, and insights shared by our users.
        </Typography>

        <Grid container spacing={3}>
          {blogs.map((blog) => (
            <Grid item xs={12} sm={6} md={4} key={blog.id}>
              <Card sx={{ height: "100%", borderRadius: 2, boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6">{blog.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {blog.desc}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => alert(`Read more about: ${blog.title}`)}>
                    Read More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ✅ Footer */}
      <Box sx={{ bgcolor: "#f5f5f5", py: 3, mt: 4, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} MyBlogApp — All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;
