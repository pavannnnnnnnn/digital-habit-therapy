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
  Zoom,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Visibility,
  VisibilityOff,
  CheckCircle as CheckCircleIcon,
  FitnessCenter as FitnessIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const steps = ['Account Details', 'Personal Info', 'Complete'];

const Register = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleNext = () => {
    if (activeStep === 0) {
      if (!email || !password || !confirmPassword) {
        setError('Please fill in all fields');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }
    setError('');
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      alert('Registration successful! Please login with your new account.');
      navigate('/login');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
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
                    <LockIcon sx={{ color: 'action.active' }} />
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

            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              fullWidth
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                    <CheckCircleIcon sx={{ color: 'action.active' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleClickShowConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ maxWidth: 400, mx: 'auto' }}>
            <TextField
              label="Full Name"
              type="text"
              fullWidth
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
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
                    <PersonIcon sx={{ color: 'action.active' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        );
      case 2:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircleIcon sx={{ fontSize: 80, color: '#10b981', mb: 3 }} />
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              Ready to Complete Registration
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
              Click the button below to create your account and start your habit therapy journey!
            </Typography>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

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
          top: '15%',
          right: '10%',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          animation: 'float 7s ease-in-out infinite'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '15%',
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          animation: 'float 9s ease-in-out infinite reverse'
        }}
      />

      <Container maxWidth="md" sx={{ height: '100%', display: 'flex', alignItems: 'center', py: 2 }}>
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
                Join Digital Habit Therapy
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: 400
                }}
              >
                Start your journey to better habits
              </Typography>
            </Box>

            {/* Stepper */}
            <Box sx={{ px: 4, pt: 3 }}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel
                      sx={{
                        '& .MuiStepLabel-label': {
                          fontWeight: 600,
                          color: activeStep >= steps.indexOf(label) ? '#6366f1' : 'text.secondary'
                        }
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
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

                  <Box component="form" onSubmit={activeStep === 2 ? handleSubmit : (e) => e.preventDefault()}>
                    {getStepContent(activeStep)}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                      <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        variant="outlined"
                        sx={{
                          borderRadius: 3,
                          px: 4,
                          py: 1.5,
                          borderColor: '#6366f1',
                          color: '#6366f1',
                          '&:hover': {
                            borderColor: '#8b5cf6',
                            backgroundColor: 'rgba(139, 92, 246, 0.1)'
                          },
                          textTransform: 'none',
                          fontWeight: 600
                        }}
                      >
                        Back
                      </Button>

                      {activeStep === steps.length - 1 ? (
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={loading}
                          sx={{
                            borderRadius: 3,
                            px: 4,
                            py: 1.5,
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
                          {loading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                      ) : (
                        <Button
                          onClick={handleNext}
                          variant="contained"
                          sx={{
                            borderRadius: 3,
                            px: 4,
                            py: 1.5,
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
                          Next
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Fade>

              <Box sx={{ textAlign: 'center', mt: 4, pb: 2 }}>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                  Already have an account?
                </Typography>
                <Button
                  component={Link}
                  to="/login"
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
                  Sign In Instead
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

export default Register;
