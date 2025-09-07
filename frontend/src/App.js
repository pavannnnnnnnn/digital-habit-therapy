import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Habits from './pages/Habits';
import Progress from './pages/Progress';
import AIRecommendations from './pages/AIRecommendations';
import AdminPanel from './pages/AdminPanel';

// Create a custom theme without any blue colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#7c3aed', // Purple instead of indigo
      light: '#a78bfa',
      dark: '#6d28d9',
    },
    secondary: {
      main: '#ec4899', // Pink (keeping this)
      light: '#f472b6',
      dark: '#db2777',
    },
    background: {
      default: '#f8fafc', // Light gray
      paper: '#ffffff',
    },
    success: {
      main: '#10b981', // Emerald
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: '#f59e0b', // Amber
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444', // Red
      light: '#f87171',
      dark: '#dc2626',
    },
    info: {
      main: '#6b7280', // Gray instead of blue
      light: '#9ca3af',
      dark: '#4b5563',
    },
    text: {
      primary: '#1e293b', // Slate
      secondary: '#64748b',
    },
    grey: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 600,
          padding: '12px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#ffffff',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#7c3aed', // Purple instead of indigo
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#7c3aed', // Purple instead of indigo
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#1e293b',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 2px 4px rgba(0, 0, 0, 0.05)',
    '0 4px 8px rgba(0, 0, 0, 0.06)',
    '0 6px 12px rgba(0, 0, 0, 0.07)',
    '0 8px 16px rgba(0, 0, 0, 0.08)',
    '0 10px 20px rgba(0, 0, 0, 0.09)',
    '0 12px 24px rgba(0, 0, 0, 0.1)',
    '0 14px 28px rgba(0, 0, 0, 0.11)',
    '0 16px 32px rgba(0, 0, 0, 0.12)',
    '0 18px 36px rgba(0, 0, 0, 0.13)',
    '0 20px 40px rgba(0, 0, 0, 0.14)',
    '0 22px 44px rgba(0, 0, 0, 0.15)',
    '0 24px 48px rgba(0, 0, 0, 0.16)',
    '0 26px 52px rgba(0, 0, 0, 0.17)',
    '0 28px 56px rgba(0, 0, 0, 0.18)',
    '0 30px 60px rgba(0, 0, 0, 0.19)',
    '0 32px 64px rgba(0, 0, 0, 0.2)',
    '0 34px 68px rgba(0, 0, 0, 0.21)',
    '0 36px 72px rgba(0, 0, 0, 0.22)',
    '0 38px 76px rgba(0, 0, 0, 0.23)',
    '0 40px 80px rgba(0, 0, 0, 0.24)',
    '0 42px 84px rgba(0, 0, 0, 0.25)',
    '0 44px 88px rgba(0, 0, 0, 0.26)',
    '0 46px 92px rgba(0, 0, 0, 0.27)',
    '0 48px 96px rgba(0, 0, 0, 0.28)',
  ],
});

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div>Loading...</div>
    </div>
  );
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div>Loading...</div>
    </div>
  );
  return user ? <Navigate to="/dashboard" /> : children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/habits" element={<PrivateRoute><Habits /></PrivateRoute>} />
            <Route path="/progress" element={<PrivateRoute><Progress /></PrivateRoute>} />
            <Route path="/ai-recommendations" element={<PrivateRoute><AIRecommendations /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
