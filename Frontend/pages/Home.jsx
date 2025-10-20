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
  alpha,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  ArticleRounded,
  PeopleRounded,
  TrendingUpRounded,
  BookmarkRounded,
  ChevronRightRounded,
} from "@mui/icons-material";

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  const isLoggedIn = !!localStorage.getItem("token");

  const blogs = [
    { 
      id: 1, 
      title: "Getting Started with React", 
      desc: "Learn the basics of React and component structure.",
      icon: "⚛️",
      category: "Development"
    },
    { 
      id: 2, 
      title: "MUI Styling Tips", 
      desc: "Improve your app design with Material UI components.",
      icon: "🎨",
      category: "Design"
    },
    { 
      id: 3, 
      title: "What's New in JavaScript (ES2025)?", 
      desc: "Discover the latest JS features for modern web apps.",
      icon: "🚀",
      category: "Technology"
    },
  ];

  const features = [
    { icon: <ArticleRounded sx={{ fontSize: 40 }} />, title: "Write Blogs", desc: "Share your thoughts with the world" },
    { icon: <PeopleRounded sx={{ fontSize: 40 }} />, title: "Join Community", desc: "Connect with like-minded writers" },
    { icon: <TrendingUpRounded sx={{ fontSize: 40 }} />, title: "Trending Topics", desc: "Discover what's popular" },
    { icon: <BookmarkRounded sx={{ fontSize: 40 }} />, title: "Save Favorites", desc: "Bookmark your preferred content" },
  ];

  return (
    <Box sx={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
      {/* ✅ Enhanced Navigation Bar */}
      <AppBar 
        position="sticky" 
        sx={{ 
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.dark, 0.8)})`,
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar>
          {/* Logo */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              flexGrow: 1,
              cursor: 'pointer'
            }}
            onClick={() => navigate("/")}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                background: 'linear-gradient(45deg, #fff, #e3f2fd)',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent'
                }}
              >
                ✍️
              </Typography>
            </Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #fff, #e3f2fd)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}
            >
              BlogApp
            </Typography>
          </Box>

          {!isLoggedIn && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                color="inherit" 
                onClick={() => navigate("/register")}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  border: '1px solid rgba(255,255,255,0.3)',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Register
              </Button>
              <Button 
                color="inherit" 
                onClick={() => navigate("/login")}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  background: 'rgba(255,255,255,0.2)',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.3)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Login
              </Button>
            </Box>
          )}

          {isLoggedIn && (
            <Button 
              color="inherit" 
              onClick={() => navigate("/profile")}
              sx={{
                borderRadius: 3,
                px: 3,
                border: '1px solid rgba(255,255,255,0.3)',
                '&:hover': {
                  background: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Profile
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* ✅ Hero Section */}
      <Box sx={{ 
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: 'white',
        py: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 'bold',
                mb: 2,
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}
            >
              Welcome to <span style={{ background: 'linear-gradient(45deg, #fff, #e3f2fd)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>BlogApp</span> ✍️
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 4, 
                opacity: 0.9,
                fontSize: { xs: '1.2rem', md: '1.5rem' }
              }}
            >
              Explore the latest articles, tutorials, and insights shared by our community
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => isLoggedIn ? navigate("/my-blogs") : navigate("/register")}
              sx={{
                background: 'linear-gradient(45deg, #fff, #e3f2fd)',
                color: theme.palette.primary.main,
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                  background: 'linear-gradient(45deg, #e3f2fd, #fff)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              Start Reading Now
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ✅ Features Section */}
      <Container sx={{ py: 8 }}>
        <Typography 
          variant="h3" 
          align="center" 
          sx={{ 
            mb: 6, 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}
        >
          Why Choose BlogApp?
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box 
                sx={{ 
                  textAlign: 'center',
                  p: 3,
                  borderRadius: 4,
                  background: 'white',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
                  }
                }}
              >
                <Box 
                  sx={{ 
                    color: theme.palette.primary.main,
                    mb: 2
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ✅ Blog Posts Section */}
      <Container sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}
          >
            Featured Blogs
          </Typography>
          <Button 
            endIcon={<ChevronRightRounded />}
            sx={{ 
              borderRadius: 3,
              px: 3,
              textTransform: 'none',
              fontSize: '1rem'
            }}
          >
            View All
          </Button>
        </Box>
        
        <Grid container spacing={3}>
          {blogs.map((blog) => (
            <Grid item xs={12} sm={6} md={4} key={blog.id}>
              <Card 
                sx={{ 
                  height: "100%", 
                  borderRadius: 4, 
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography 
                      sx={{ 
                        fontSize: '2rem', 
                        mr: 2 
                      }}
                    >
                      {blog.icon}
                    </Typography>
                    <Box>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          background: theme.palette.primary.light,
                          color: 'white',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 2,
                          fontSize: '0.7rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {blog.category}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    {blog.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {blog.desc}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button 
                    size="small" 
                    endIcon={<ChevronRightRounded />}
                    onClick={() => alert(`Read more about: ${blog.title}`)}
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 'bold'
                    }}
                  >
                    Read More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ✅ Enhanced Footer */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
          color: 'white',
          py: 6,
          mt: 8
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    background: 'linear-gradient(45deg, #fff, #e3f2fd)',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 'bold',
                      background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent'
                    }}
                  >
                    ✍️
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  BlogApp
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ opacity: 0.8, mb: 2 }}>
                Your platform for sharing thoughts, ideas, and knowledge with the world. 
                Join our community of passionate writers and readers.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Connect With Us
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {['Twitter', 'Facebook', 'Instagram', 'LinkedIn'].map((social) => (
                  <Button
                    key={social}
                    variant="outlined"
                    size="small"
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255,255,255,0.3)',
                      borderRadius: 2,
                      '&:hover': {
                        borderColor: 'white',
                        background: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    {social}
                  </Button>
                ))}
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.2)', mt: 4, pt: 3, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              © {new Date().getFullYear()} BlogApp — All Rights Reserved. Made with ❤️ for writers and readers.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;