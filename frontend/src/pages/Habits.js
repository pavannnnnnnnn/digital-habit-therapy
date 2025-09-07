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
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  FitnessCenter as FitnessIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [completedHabits, setCompletedHabits] = useState(new Set());
  const [newHabit, setNewHabit] = useState({ name: '', description: '', frequency: 'daily', target: '' });
  const [editingHabit, setEditingHabit] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', frequency: 'daily', target: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [completing, setCompleting] = useState(null);
  const [updating, setUpdating] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchHabits();
    } else {
      setLoading(false);
    }
  }, [user]);

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchHabits = async () => {
    try {
      setLoading(true);
      setError('');
      const config = getAuthConfig();
      const res = await axios.get('http://localhost:5000/api/habits', config);
      setHabits(res.data.data || []);
    } catch (err) {
      console.error('Error fetching habits:', err);
      if (err.response?.status === 401) {
        setError('Please login to view your habits');
      } else {
        setError('Failed to load habits');
      }
      setHabits([]);
    } finally {
      setLoading(false);
    }
  };

  const addHabit = async () => {
    if (!newHabit.name.trim()) {
      setError('Please enter a habit name');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const config = getAuthConfig();
      await axios.post('http://localhost:5000/api/habits', newHabit, config);
      setNewHabit({ name: '', description: '', frequency: 'daily', target: '' });
      fetchHabits();
    } catch (err) {
      console.error('Error adding habit:', err);
      if (err.response?.status === 401) {
        setError('Please login to add habits');
      } else {
        setError('Failed to add habit');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const updateHabit = async (habitId, updatedData) => {
    try {
      setUpdating(true);
      setError('');
      const config = getAuthConfig();
      const res = await axios.put(`http://localhost:5000/api/habits/${habitId}`, updatedData, config);
      if (res.data.success) {
        fetchHabits();
        setEditingHabit(null);
        setEditForm({ name: '', description: '', frequency: 'daily', target: '' });
      }
    } catch (err) {
      console.error('Error updating habit:', err);
      if (err.response?.status === 401) {
        setError('Please login to update habits');
      } else {
        setError('Failed to update habit');
      }
    } finally {
      setUpdating(false);
    }
  };

  const openEditModal = (habit) => {
    setEditingHabit(habit._id);
    setEditForm({
      name: habit.name,
      description: habit.description || '',
      frequency: habit.frequency,
      target: habit.target,
    });
  };

  const closeEditModal = () => {
    setEditingHabit(null);
    setEditForm({ name: '', description: '', frequency: 'daily', target: '' });
  };

  const saveEdit = () => {
    if (!editForm.name.trim()) {
      setError('Please enter a habit name');
      return;
    }
    updateHabit(editingHabit, editForm);
  };

  const deleteHabit = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this habit? This action cannot be undone.');
    if (!confirmDelete) return;

    try {
      const config = getAuthConfig();
      await axios.delete(`http://localhost:5000/api/habits/${id}`, config);
      fetchHabits();
      alert('Habit deleted successfully!');
    } catch (err) {
      console.error('Error deleting habit:', err);
      setError('Failed to delete habit');
    }
  };

  const completeHabit = async (habitId) => {
    try {
      setCompleting(habitId);
      setError('');
      const config = getAuthConfig();
      const res = await axios.post(`http://localhost:5000/api/habits/${habitId}/complete`, {}, config);

      if (res.data.success) {
        setCompletedHabits(prev => new Set([...prev, habitId]));
        fetchHabits();
        const updatedHabit = res.data.data.habit;
        const streakMessage = updatedHabit.currentStreak > 1
          ? `🔥 ${updatedHabit.currentStreak} day streak! Keep it up!`
          : 'Great start! Complete it again tomorrow to build your streak!';
        alert(`Habit completed successfully! ${streakMessage} 🎉`);
      }
    } catch (err) {
      console.error('Error completing habit:', err);
      if (err.response?.status === 400) {
        setError('Habit already completed today');
      } else if (err.response?.status === 401) {
        setError('Please login to complete habits');
      } else {
        setError('Failed to complete habit');
      }
    } finally {
      setCompleting(null);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading your habits...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        My Habits
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
            Add New Habit
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* First Row: Habit Name and Frequency */}
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
              <TextField
                label="Habit Name"
                fullWidth
                value={newHabit.name}
                onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                required
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: 56
                  }
                }}
              />
              <FormControl
                variant="outlined"
                sx={{
                  minWidth: 200,
                  '& .MuiOutlinedInput-root': {
                    height: 56
                  }
                }}
              >
                <InputLabel id="frequency-label">Frequency</InputLabel>
                <Select
                  labelId="frequency-label"
                  value={newHabit.frequency}
                  label="Frequency"
                  onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value })}
                >
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Second Row: Description */}
            <TextField
              label="Description"
              multiline
              rows={3}
              fullWidth
              value={newHabit.description}
              onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
              variant="outlined"
              placeholder="Optional description for your habit"
            />

            {/* Third Row: Target and Button */}
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
              <TextField
                label="Target (minutes per period)"
                type="number"
                value={newHabit.target}
                onChange={(e) => setNewHabit({ ...newHabit, target: e.target.value })}
                inputProps={{ min: 1 }}
                variant="outlined"
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    height: 56
                  }
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={addHabit}
                disabled={submitting}
                sx={{
                  height: 56,
                  px: 4,
                  fontSize: '1rem',
                  fontWeight: 600,
                  minWidth: 160,
                  borderRadius: 2
                }}
              >
                {submitting ? 'Adding...' : 'Add Habit'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="h5" component="h2" gutterBottom>
        Your Habits ({habits.length})
      </Typography>

      {habits.length === 0 ? (
        <Alert severity="info">No habits yet. Create your first habit above!</Alert>
      ) : (
        <Grid container spacing={3}>
          {habits.map(habit => (
            <Grid key={habit._id} item xs={12} md={6} lg={4}>
              <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {habit.name}
                  </Typography>
                  {habit.description && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {habit.description}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.primary">
                      Frequency: {habit.frequency}
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      Target: {habit.target} minutes
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="success.main" fontWeight="bold">
                      🔥 {habit.currentStreak || 0} day streak
                    </Typography>
                    {habit.longestStreak > 0 && (
                      <Typography variant="body2" color="text.secondary">
                        Best: {habit.longestStreak} days
                      </Typography>
                    )}
                  </Box>
                </CardContent>
                <Box sx={{ display: 'flex', gap: 1, p: 2 }}>
                  <Button
                    variant={completedHabits.has(habit._id) ? 'contained' : 'outlined'}
                    color="success"
                    onClick={() => completeHabit(habit._id)}
                    disabled={completing === habit._id || completedHabits.has(habit._id)}
                    fullWidth
                  >
                    {completing === habit._id ? 'Completing...' : completedHabits.has(habit._id) ? '✓ Completed' : 'Complete'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="warning"
                    onClick={() => openEditModal(habit)}
                    fullWidth
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => deleteHabit(habit._id)}
                    fullWidth
                  >
                    <DeleteIcon />
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={Boolean(editingHabit)} onClose={closeEditModal}>
        <DialogTitle>Edit Habit</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <TextField
              label="Habit Name"
              fullWidth
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              required
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="edit-frequency-label">Frequency</InputLabel>
              <Select
                labelId="edit-frequency-label"
                value={editForm.frequency}
                label="Frequency"
                onChange={(e) => setEditForm({ ...editForm, frequency: e.target.value })}
              >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Description"
              multiline
              rows={2}
              fullWidth
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              margin="normal"
            />
            <TextField
              label="Target (minutes per period)"
              type="number"
              fullWidth
              value={editForm.target}
              onChange={(e) => setEditForm({ ...editForm, target: e.target.value })}
              inputProps={{ min: 1 }}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditModal} color="inherit">
            Cancel
          </Button>
          <Button onClick={saveEdit} color="primary" disabled={updating}>
            {updating ? 'Updating...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Habits;
