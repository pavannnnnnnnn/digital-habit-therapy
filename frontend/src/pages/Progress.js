import React, { useEffect, useState } from 'react';
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
  CircularProgress,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon
} from '@mui/icons-material';

const Progress = () => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please login to view progress');
          setLoading(false);
          return;
        }

        const res = await axios.get('http://localhost:5000/api/progress', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.data.success) {
          setProgress(res.data.data || []);
        } else {
          setError('Failed to load progress data');
        }
      } catch (err) {
        console.error('Error fetching progress:', err);
        setError(err.response?.data?.error || 'Failed to load progress');
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading progress...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          <AlertTitle>Error Loading Progress</AlertTitle>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Progress Dashboard
      </Typography>

      {progress.length === 0 ? (
        <Alert severity="info">
          <AlertTitle>No Progress Data</AlertTitle>
          You haven't created any habits yet. Start by adding some habits to track your progress!
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {progress.map(item => (
            <Grid key={item.habitId || item._id} item xs={12} md={6}>
              <Card elevation={3}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TimelineIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h5" component="h2">
                      {item.habitName}
                    </Typography>
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Total Days
                        </Typography>
                        <Typography variant="h6" color="primary">
                          {item.totalDays}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Completed
                        </Typography>
                        <Typography variant="h6" color="success.main">
                          {item.completedDays}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Completion Rate
                        </Typography>
                        <Typography variant="h6" color="secondary">
                          {item.completionRate}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={item.completionRate}
                          sx={{ mt: 0.5, height: 6, borderRadius: 3 }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Current Streak
                        </Typography>
                        <Chip
                          label={`${item.currentStreak} days`}
                          color="success"
                          variant="outlined"
                          size="small"
                        />
                      </Box>
                    </Grid>
                  </Grid>

                  <Typography variant="h6" gutterBottom>
                    Recent Progress (Last 7 days)
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {(item.recentProgress || []).slice(0, 7).map((day, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: day.completed ? 'success.main' : 'grey.300',
                          color: day.completed ? 'white' : 'text.secondary'
                        }}
                      >
                        {day.completed ? <CheckCircleIcon fontSize="small" /> : <UncheckedIcon fontSize="small" />}
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Progress;
