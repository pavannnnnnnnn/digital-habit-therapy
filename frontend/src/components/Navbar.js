import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  FitnessCenter as HabitsIcon,
  Timeline as ProgressIcon,
  SmartToy as AIRecommendationsIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = user ? [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Habits', icon: <HabitsIcon />, path: '/habits' },
    { text: 'Progress', icon: <ProgressIcon />, path: '/progress' },
    { text: 'AI Recommendations', icon: <AIRecommendationsIcon />, path: '/ai-recommendations' },
    ...(user.role === 'admin' ? [{ text: 'Admin Panel', icon: <AdminIcon />, path: '/admin' }] : [])
  ] : [];

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold'
          }}
        >
          Digital Habit Therapy
        </Typography>

        {user ? (
          <>
            {isMobile ? (
              <>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleMenu}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  {menuItems.map((item) => (
                    <MenuItem
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        handleClose();
                      }}
                    >
                      {item.icon}
                      <Typography sx={{ ml: 1 }}>{item.text}</Typography>
                    </MenuItem>
                  ))}
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon />
                    <Typography sx={{ ml: 1 }}>Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.path}
                    color="inherit"
                    component={Link}
                    to={item.path}
                    startIcon={item.icon}
                    sx={{ mx: 1 }}
                  >
                    {item.text}
                  </Button>
                ))}
                <Button
                  color="inherit"
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                  sx={{ ml: 2 }}
                >
                  Logout
                </Button>
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ display: 'flex' }}>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
