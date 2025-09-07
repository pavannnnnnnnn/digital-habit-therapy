const Progress = require('../models/Progress');
const Habit = require('../models/Habit');

// @desc    Get all progress for user
// @route   GET /api/progress
// @access  Private
const getAllProgress = async (req, res) => {
  try {
    // Get all habits for the user
    const habits = await Habit.find({ user: req.user._id });

    const progressData = [];

    for (const habit of habits) {
      // Get progress for this habit
      const progress = await Progress.find({
        user: req.user._id,
        habit: habit._id,
      }).sort({ date: -1 });

      // Calculate stats
      const totalDays = progress.length;
      const completedDays = progress.filter(p => p.completed).length;
      const completionRate = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;

      // Calculate current streak
      const currentStreak = await calculateCurrentStreak(req.user._id, habit._id);

      progressData.push({
        habitId: habit._id,
        habitName: habit.name,
        frequency: habit.frequency,
        target: habit.target,
        totalDays,
        completedDays,
        completionRate: Math.round(completionRate),
        currentStreak,
        recentProgress: progress.slice(0, 7), // Last 7 days
      });
    }

    res.json({
      success: true,
      count: progressData.length,
      data: progressData,
    });
  } catch (err) {
    console.error('Error fetching all progress:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get progress for a habit
// @route   GET /api/progress/:habitId
// @access  Private
const getProgress = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.habitId);

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    // Check if habit belongs to user
    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    const progress = await Progress.find({
      user: req.user._id,
      habit: req.params.habitId,
    }).sort({ date: -1 });

    res.json({
      success: true,
      count: progress.length,
      data: progress,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Mark habit as completed for a date
// @route   POST /api/progress/:habitId
// @access  Private
const markProgress = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.habitId);

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    // Check if habit belongs to user
    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    const { date, completed, notes } = req.body;
    const progressDate = date ? new Date(date) : new Date();

    // Normalize date to start of day
    progressDate.setHours(0, 0, 0, 0);

    let progress = await Progress.findOne({
      user: req.user._id,
      habit: req.params.habitId,
      date: progressDate,
    });

    if (progress) {
      // Update existing progress
      progress.completed = completed;
      progress.notes = notes;
      await progress.save();
    } else {
      // Create new progress
      progress = await Progress.create({
        user: req.user._id,
        habit: req.params.habitId,
        date: progressDate,
        completed,
        notes,
      });
    }

    res.json({
      success: true,
      data: progress,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Progress already exists for this date' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get incomplete habits for today
// @route   GET /api/progress/incomplete/today
// @access  Private
const getIncompleteHabitsToday = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all habits for the user
    const habits = await Habit.find({ user: req.user._id });

    const incompleteHabits = [];

    for (const habit of habits) {
      // Check if habit was completed today
      const todayProgress = await Progress.findOne({
        user: req.user._id,
        habit: habit._id,
        date: today,
        completed: true,
      });

      // If not completed today, add to incomplete list
      if (!todayProgress) {
        incompleteHabits.push({
          _id: habit._id,
          name: habit.name,
          description: habit.description,
          frequency: habit.frequency,
          target: habit.target,
          currentStreak: habit.currentStreak || 0,
          lastCompletedDate: habit.lastCompletedDate,
        });
      }
    }

    res.json({
      success: true,
      count: incompleteHabits.length,
      data: incompleteHabits,
    });
  } catch (err) {
    console.error('Error fetching incomplete habits:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get progress statistics
// @route   GET /api/progress/stats/:habitId
// @access  Private
const getProgressStats = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.habitId);

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    // Check if habit belongs to user
    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    const totalDays = await Progress.countDocuments({
      user: req.user._id,
      habit: req.params.habitId,
    });

    const completedDays = await Progress.countDocuments({
      user: req.user._id,
      habit: req.params.habitId,
      completed: true,
    });

    const currentStreak = await calculateCurrentStreak(req.user._id, req.params.habitId);

    res.json({
      success: true,
      data: {
        totalDays,
        completedDays,
        completionRate: totalDays > 0 ? (completedDays / totalDays) * 100 : 0,
        currentStreak,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Helper function to calculate current streak
const calculateCurrentStreak = async (userId, habitId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let checkDate = new Date(today);

  while (true) {
    const progress = await Progress.findOne({
      user: userId,
      habit: habitId,
      date: checkDate,
      completed: true,
    });

    if (!progress) break;

    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return streak;
};

module.exports = {
  getAllProgress,
  getProgress,
  markProgress,
  getProgressStats,
  getIncompleteHabitsToday,
};
