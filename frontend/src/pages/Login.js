import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Paper,
  Avatar,
  InputAdornment,
  IconButton,
  Fade,
  Zoom
} from '@mui/material';
import {
  LockOutlined as LockOutlinedIcon,
  Email as EmailIcon,
  Visibility,
  VisibilityOff,
  FitnessCenter as FitnessIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `
          radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(120, 219, 226, 0.3) 0%, transparent 50%),
          linear-gradient(135deg, #667eea 0%, #764ba2 100%)
        `,
        position: 'relative',
        overflow: 'hidden',
        padding: { xs: 1, sm: 2, md: 3 }
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          animation: 'float 6s ease-in-out infinite'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '60%',
          right: '15%',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          animation: 'float 8s ease-in-out infinite reverse'
        }}
      />

      <Container maxWidth="sm" sx={{ height: '100%', display: 'flex', alignItems: 'center', py: 2 }}>
        <Zoom in={true} timeout={1000}>
          <Paper
            elevation={24}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
              width: '100%',
              maxHeight: '95vh',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Header Section */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
                padding: 4,
                textAlign: 'center',
                position: 'relative'
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                  opacity: 0.3
                }}
              />

              <Fade in={true} timeout={1500}>
                <Avatar
                  sx={{
                    mx: 'auto',
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    width: 80,
                    height: 80,
                    mb: 3,
                    border: '3px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <FitnessIcon sx={{ fontSize: 40 }} />
                </Avatar>
              </Fade>

              <Typography
                variant="h3"
                component="h1"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  mb: 2,
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                }}
              >
                Digital Habit Therapy
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: 400
                }}
              >
                Welcome back to your journey
              </Typography>
            </Box>

            {/* Form Section */}
            <Box sx={{ p: 4 }}>
              <Fade in={true} timeout={2000}>
                <Box>
                  {error && (
                    <Alert
                      severity="error"
                      sx={{
                        mb: 3,
                        borderRadius: 2,
                        border: '1px solid rgba(239, 68, 68, 0.3)'
                      }}
                    >
                      {error}
                    </Alert>
                  )}

                  <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Box sx={{ maxWidth: 400, mx: 'auto' }}>
                      <TextField
                        label="Email Address"
                        type="email"
                        fullWidth
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        variant="outlined"
                        sx={{
                          mb: 3,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            },
                            '&.Mui-focused': {
                              backgroundColor: 'white',
                              boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)'
                            }
                          }
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon sx={{ color: 'action.active' }} />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <TextField
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        variant="outlined"
                        sx={{
                          mb: 3,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            },
                            '&.Mui-focused': {
                              backgroundColor: 'white',
                              boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)'
                            }
                          }
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockOutlinedIcon sx={{ color: 'action.active' }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />

                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        sx={{
                          height: 56,
                          borderRadius: 3,
                          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
                          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5855eb 0%, #7c3aed 50%, #db2777 100%)',
                            boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
                            transform: 'translateY(-2px)'
                          },
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          textTransform: 'none',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {loading ? 'Signing In...' : 'Sign In to Your Account'}
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Fade>

              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                  Don't have an account yet?
                </Typography>
                <Button
                  component={Link}
                  to="/register"
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    borderColor: '#6366f1',
                    color: '#6366f1',
                    '&:hover': {
                      borderColor: '#8b5cf6',
                      backgroundColor: 'rgba(139, 92, 246, 0.1)',
                      transform: 'translateY(-1px)'
                    },
                    textTransform: 'none',
                    fontWeight: 600,
                    transition: 'all 0.3s ease'
                  }}
                >
                  Create New Account
                </Button>
              </Box>
            </Box>
          </Paper>
        </Zoom>
      </Container>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </Box>
  );
};

export default Login;
