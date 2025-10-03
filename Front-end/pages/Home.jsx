import React, { useContext } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Paper,
  AppBar,
  Toolbar,
  Chip,
  alpha,
  styled,
  Avatar,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  RocketLaunch,
  TrendingUp,
  Groups,
  Article,
  Star,
  ArrowForward,
  Dashboard,
  Logout
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Adjust path as needed

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: theme.spacing(15, 0),
  textAlign: 'center',
  borderRadius: '0 0 40px 40px',
  marginBottom: theme.spacing(8),
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: 16,
  boxShadow: '0 8px 32px 0 rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 16px 48px 0 rgba(0,0,0,0.15)',
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  border: 0,
  borderRadius: 25,
  color: 'white',
  padding: '12px 32px',
  fontWeight: 'bold',
  textTransform: 'none',
  fontSize: '1.1rem',
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  '&:hover': {
    boxShadow: '0 6px 10px 2px rgba(255, 105, 135, .4)',
  },
}));

const OutlineButton = styled(Button)(({ theme }) => ({
  border: '2px solid',
  borderColor: theme.palette.primary.main,
  borderRadius: 25,
  padding: '10px 30px',
  fontWeight: 'bold',
  textTransform: 'none',
  fontSize: '1.1rem',
  '&:hover': {
    borderWidth: '2px',
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
}));

const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDashboard = () => {
    handleMenuClose();
    navigate('/dashboard');
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  const features = [
    {
      icon: <Article sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Write Beautiful Blogs',
      description: 'Create engaging content with our rich text editor and share your thoughts with the world.',
      color: '#2196F3'
    },
    {
      icon: <Groups sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'Join Communities',
      description: 'Connect with like-minded people and join communities around your interests.',
      color: '#4CAF50'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: 'Trending Content',
      description: 'Discover trending topics and stay updated with what\'s happening in your areas of interest.',
      color: '#FF9800'
    },
    {
      icon: <Star sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'Personalized Feed',
      description: 'Get content recommendations based on your interests and reading behavior.',
      color: '#9C27B0'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Writers' },
    { number: '50K+', label: 'Blog Posts' },
    { number: '1M+', label: 'Monthly Readers' },
    { number: '95%', label: 'User Satisfaction' }
  ];

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#fafafa' }}>
      {/* Navigation Bar */}
      <AppBar position="fixed" sx={{ bgcolor: 'white', color: 'black', boxShadow: 'none', borderBottom: '1px solid #e0e0e0' }}>
        <Container maxWidth="lg">
          <Toolbar>
            <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              BlogSpace
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {user ? (
                // User is logged in - Show profile and dashboard
                <>
                  <Button 
                    variant="outlined"
                    startIcon={<Dashboard />}
                    onClick={handleDashboard}
                    sx={{ 
                      textTransform: 'none', 
                      fontWeight: '600',
                      borderRadius: 2
                    }}
                  >
                    Dashboard
                  </Button>
                  <IconButton
                    onClick={handleMenuOpen}
                    sx={{ 
                      p: 0.5,
                      border: '2px solid',
                      borderColor: 'primary.main',
                      '&:hover': {
                        borderColor: 'primary.dark'
                      }
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32,
                        bgcolor: 'primary.main',
                        fontSize: '0.9rem'
                      }}
                    >
                      {user.name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  </IconButton>

                  {/* User Menu */}
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
                          {user.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user.email}
                        </Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem onClick={handleDashboard}>
                      <Dashboard sx={{ mr: 1, fontSize: 20 }} />
                      Dashboard
                    </MenuItem>
                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                      <Logout sx={{ mr: 1, fontSize: 20 }} />
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                // User is not logged in - Show sign in and get started
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                  <Button 
                    color="inherit" 
                    sx={{ textTransform: 'none', fontWeight: '600' }}
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </Button>
                  <GradientButton 
                    onClick={() => navigate('/register')}
                    size="small"
                  >
                    Get Started
                  </GradientButton>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <Toolbar /> {/* Spacer for fixed app bar */}
          <Chip 
            label={user ? "🎉 Welcome back!" : "🚀 Join thousands of writers"} 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)', 
              color: 'white', 
              mb: 3,
              fontSize: '0.9rem',
              fontWeight: 'bold'
            }} 
          />
          <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 2, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
            {user ? `Welcome back, ${user.name}!` : 'Share Your Story with'}
            {!user && (
              <Box component="span" sx={{ background: 'linear-gradient(45deg, #FFD700 30%, #FF8E53 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'block' }}>
                The World
              </Box>
            )}
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, maxWidth: 600, mx: 'auto', fontSize: { xs: '1rem', md: '1.25rem' } }}>
            {user 
              ? 'Continue your blogging journey. Write new stories, connect with your audience, and discover amazing content.'
              : 'Join our community of writers and readers. Create beautiful blogs, connect with audiences, and discover amazing content.'
            }
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            {user ? (
              // Logged in user actions
              <>
                <GradientButton 
                  endIcon={<Article />}
                  onClick={() => navigate('/dashboard')}
                >
                  Write New Blog
                </GradientButton>
                <OutlineButton 
                  endIcon={<TrendingUp />}
                  onClick={() => navigate('/dashboard')}
                >
                  Explore Feed
                </OutlineButton>
              </>
            ) : (
              // Guest user actions
              <>
                <GradientButton 
                  endIcon={<RocketLaunch />}
                  onClick={() => navigate('/register')}
                >
                  Start Writing Now
                </GradientButton>
                <OutlineButton 
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/login')}
                >
                  Explore Blogs
                </OutlineButton>
              </>
            )}
          </Box>
        </Container>
      </HeroSection>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={3} sx={{ textAlign: 'center' }}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Paper sx={{ p: 3, borderRadius: 3, bgcolor: 'white' }}>
                <Typography variant="h3" component="div" fontWeight="bold" color="primary" gutterBottom>
                  {stat.number}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 12 }}>
        <Typography variant="h3" component="h2" textAlign="center" fontWeight="bold" gutterBottom>
          {user ? 'Continue Your Journey' : 'Why Choose BlogSpace?'}
        </Typography>
        <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}>
          {user 
            ? 'Everything you need to grow your audience and share your stories'
            : 'Everything you need to create, share, and discover amazing content'
          }
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <FeatureCard>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button 
                    endIcon={<ArrowForward />}
                    sx={{ textTransform: 'none', fontWeight: 'bold' }}
                    onClick={() => user ? navigate('/dashboard') : navigate('/register')}
                  >
                    {user ? 'Get Started' : 'Learn More'}
                  </Button>
                </CardActions>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" component="h2" fontWeight="bold" gutterBottom>
            {user ? 'Ready to Write Your Next Story?' : 'Ready to Start Your Blogging Journey?'}
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            {user 
              ? 'Share your thoughts with the world and grow your audience'
              : 'Join thousands of writers who are already sharing their stories on BlogSpace'
            }
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            {user ? (
              // Logged in user CTA
              <>
                <Button 
                  variant="contained" 
                  size="large"
                  sx={{ 
                    bgcolor: 'white', 
                    color: 'primary.main',
                    borderRadius: 25,
                    px: 4,
                    py: 1.5,
                    fontWeight: 'bold',
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    '&:hover': {
                      bgcolor: 'grey.100'
                    }
                  }}
                  onClick={() => navigate('/dashboard')}
                >
                  Go to Dashboard
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  sx={{ 
                    borderColor: 'white',
                    color: 'white',
                    borderRadius: 25,
                    px: 4,
                    py: 1.5,
                    fontWeight: 'bold',
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                  onClick={() => navigate('/dashboard')}
                >
                  Explore Content
                </Button>
              </>
            ) : (
              // Guest user CTA
              <>
                <Button 
                  variant="contained" 
                  size="large"
                  sx={{ 
                    bgcolor: 'white', 
                    color: 'primary.main',
                    borderRadius: 25,
                    px: 4,
                    py: 1.5,
                    fontWeight: 'bold',
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    '&:hover': {
                      bgcolor: 'grey.100'
                    }
                  }}
                  onClick={() => navigate('/register')}
                >
                  Create Account
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  sx={{ 
                    borderColor: 'white',
                    color: 'white',
                    borderRadius: 25,
                    px: 4,
                    py: 1.5,
                    fontWeight: 'bold',
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
              </>
            )}
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" textAlign="center" sx={{ opacity: 0.7 }}>
            © 2025 BlogSpace. All rights reserved. Made with ❤️ for writers and readers.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;