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
  Chip
} from '@mui/material';
import {
  SmartToy as SmartToyIcon,
  Lightbulb as LightbulbIcon,
  PriorityHigh as PriorityHighIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please login to view AI recommendations');
          setLoading(false);
          return;
        }

        const res = await axios.get('http://localhost:5000/api/recommendations', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.data.success) {
          setRecommendations(res.data.data || []);
        } else {
          setError('Failed to load recommendations');
        }
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError(err.response?.data?.error || 'Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <PriorityHighIcon />;
      case 'medium':
        return <WarningIcon />;
      case 'low':
        return <CheckCircleIcon />;
      default:
        return <LightbulbIcon />;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading AI recommendations...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          <AlertTitle>Error Loading Recommendations</AlertTitle>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <SmartToyIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            AI Recommendations
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Personalized suggestions to help you build better habits
          </Typography>
        </Box>
      </Box>

      {recommendations.length === 0 ? (
        <Alert severity="info">
          <AlertTitle>No Recommendations Yet</AlertTitle>
          Create some habits and track your progress to get personalized AI recommendations!
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {recommendations.map((rec, index) => (
            <Grid key={index} item xs={12} md={6}>
              <Card
                elevation={3}
                sx={{
                  borderLeft: 4,
                  borderColor: `${getPriorityColor(rec.priority)}.main`,
                  height: '100%'
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h5" component="h2" sx={{ flexGrow: 1, mr: 2 }}>
                      {rec.title}
                    </Typography>
                    <Chip
                      icon={getPriorityIcon(rec.priority)}
                      label={rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)}
                      color={getPriorityColor(rec.priority)}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {rec.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LightbulbIcon color="primary" sx={{ mr: 1, fontSize: 18 }} />
                    <Typography variant="body2" color="text.secondary">
                      {rec.type.charAt(0).toUpperCase() + rec.type.slice(1)} Tip
                    </Typography>
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

export default AIRecommendations;
