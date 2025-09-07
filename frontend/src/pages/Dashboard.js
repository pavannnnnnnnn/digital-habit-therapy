import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  Paper,
  Divider,
  Button
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  FitnessCenter as FitnessIcon,
  Timeline as TimelineIcon,
  Lightbulb as LightbulbIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const [habits, setHabits] = useState([]);
  const [progress, setProgress] = useState({});
  const [incompleteHabits, setIncompleteHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [greeting, setGreeting] = useState('');
  const [thought, setThought] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please login to view your dashboard');
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const habitsRes = await axios.get('http://localhost:5000/api/habits', config);
        setHabits(habitsRes.data.data || []);

        const progressRes = await axios.get('http://localhost:5000/api/progress', config);
        setProgress(progressRes.data.data || {});

        // Fetch incomplete habits for today
        const incompleteRes = await axios.get('http://localhost:5000/api/progress/incomplete/today', config);
        setIncompleteHabits(incompleteRes.data.data || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        if (err.response?.status === 401) {
          setError('Please login to view your dashboard');
        } else if (err.response?.status === 404) {
          setError('Dashboard data not found. Please try again later.');
        } else {
          setError('Failed to load dashboard data');
        }
        setHabits([]);
        setProgress({});
        setIncompleteHabits([]);
      } finally {
        setLoading(false);
      }
    };

    // Set greeting and thought based on time
    const now = new Date();
    const hour = now.getHours();
    let greet = '';
    if (hour < 12) {
      greet = 'Good morning';
    } else if (hour < 18) {
      greet = 'Good afternoon';
    } else {
      greet = 'Good evening';
    }
    setGreeting(greet);

    // Thought related to habit - changes daily
    const thoughts = [
      "Small daily improvements lead to stunning results.",
      "Consistency is the key to success.",
      "Your habits shape your future.",
      "Every step counts, no matter how small.",
      "Discipline is choosing between what you want now and what you want most.",
      "Success is the sum of small efforts repeated day in and day out.",
      "Motivation gets you started, habit keeps you going.",
      "The secret of your future is hidden in your daily routine.",
      "Make your habits work for you, not against you.",
      "Change your habits, change your life."
    ];
    // Use current date to select thought - changes daily
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    const thoughtIndex = dayOfYear % thoughts.length;
    setThought(thoughts[thoughtIndex]);

    if (user) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading your dashboard...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Dashboard
      </Typography>

      {/* Greeting and Thought */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, backgroundColor: 'primary.light', color: 'white' }}>
        <Typography variant="h4" component="h2" gutterBottom>
          {greeting}, {user?.name}!
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LightbulbIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ fontStyle: 'italic' }}>
            "{thought}"
          </Typography>
        </Box>
      </Paper>

      {/* Incomplete Habits Notification */}
      {incompleteHabits.length > 0 && (
        <Alert severity="warning" sx={{ mb: 4 }}>
          <AlertTitle>
            <WarningIcon sx={{ mr: 1 }} />
            Don't forget your habits today!
          </AlertTitle>
          <Typography variant="body2" sx={{ mb: 2 }}>
            You have {incompleteHabits.length} habit{incompleteHabits.length > 1 ? 's' : ''} that haven't been completed yet:
          </Typography>
          <List dense>
            {incompleteHabits.map(habit => (
              <ListItem key={habit._id}>
                <ListItemText
                  primary={habit.name}
                  secondary={habit.currentStreak > 0 ? `Current streak: ${habit.currentStreak} day${habit.currentStreak > 1 ? 's' : ''}` : null}
                />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <Button
            component={Link}
            to="/habits"
            variant="outlined"
            color="warning"
            size="small"
          >
            Go to Habits page
          </Button>
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FitnessIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5" component="h2">
                  Your Habits
                </Typography>
              </Box>
              {habits.length === 0 ? (
                <Alert severity="info">
                  <Typography variant="body2">
                    No habits found.{' '}
                    <Button component={Link} to="/habits" size="small">
                      Create your first habit
                    </Button>
                  </Typography>
                </Alert>
              ) : (
                <List>
                  {habits.map(habit => (
                    <ListItem key={habit._id} divider>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {habit.name}
                            </Typography>
                            <Chip
                              label={habit.frequency}
                              color="primary"
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={habit.description}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TimelineIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5" component="h2">
                  Progress Summary
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">
                    <strong>Total Habits:</strong>
                  </Typography>
                  <Chip
                    label={habits.length}
                    color="primary"
                    size="small"
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">
                    <strong>Completed Today:</strong>
                  </Typography>
                  <Chip
                    label={habits.length - incompleteHabits.length}
                    color="success"
                    size="small"
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">
                    <strong>Active Habits:</strong>
                  </Typography>
                  <Chip
                    label={habits.filter(h => h.isActive !== false).length}
                    color="secondary"
                    size="small"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
