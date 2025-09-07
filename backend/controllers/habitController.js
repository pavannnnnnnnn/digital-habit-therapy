const Habit = require('../models/Habit');
const Progress = require('../models/Progress');

// @desc    Get all habits for a user
// @route   GET /api/habits
// @access  Private
const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: habits.length,
      data: habits,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get single habit
// @route   GET /api/habits/:id
// @access  Private
const getHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    // Check if habit belongs to user
    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    res.json({
      success: true,
      data: habit,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Create new habit
// @route   POST /api/habits
// @access  Private
const createHabit = async (req, res) => {
  try {
    const { name, description, frequency, target } = req.body;

    const habit = await Habit.create({
      user: req.user._id,
      name,
      description,
      frequency,
      target,
    });

    res.status(201).json({
      success: true,
      data: habit,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Update habit
// @route   PUT /api/habits/:id
// @access  Private
const updateHabit = async (req, res) => {
  try {
    let habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    // Check if habit belongs to user
    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    habit = await Habit.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: habit,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Delete habit
// @route   DELETE /api/habits/:id
// @access  Private
const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    // Check if habit belongs to user
    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    // Delete associated progress records
    await Progress.deleteMany({ habit: req.params.id });

    await Habit.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Mark habit as completed for today
// @route   POST /api/habits/:id/complete
// @access  Private
const completeHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    // Check if habit belongs to user
    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    // Get today's date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if progress already exists for today
    const existingProgress = await Progress.findOne({
      user: req.user._id,
      habit: req.params.id,
      date: today,
    });

    if (existingProgress) {
      return res.status(400).json({ error: 'Habit already completed today' });
    }

    // Calculate streak logic
    let newStreak = 1; // Default to 1 for first completion
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (habit.lastCompletedDate) {
      const lastCompleted = new Date(habit.lastCompletedDate);
      lastCompleted.setHours(0, 0, 0, 0);

      // Check if completed yesterday (consecutive day)
      if (lastCompleted.getTime() === yesterday.getTime()) {
        newStreak = habit.currentStreak + 1;
      } else if (lastCompleted.getTime() !== today.getTime()) {
        // If not completed yesterday and not today, reset streak
        newStreak = 1;
      }
    }

    // Update habit with new streak and completion date
    const updatedHabit = await Habit.findByIdAndUpdate(
      req.params.id,
      {
        currentStreak: newStreak,
        longestStreak: Math.max(habit.longestStreak, newStreak),
        lastCompletedDate: today,
      },
      { new: true }
    );

    // Create new progress record
    const progress = await Progress.create({
      user: req.user._id,
      habit: req.params.id,
      date: today,
      completed: true,
    });

    res.json({
      success: true,
      data: {
        progress,
        habit: updatedHabit,
      },
      message: 'Habit completed successfully!',
    });
  } catch (err) {
    console.error('Error completing habit:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getHabits,
  getHabit,
  createHabit,
  updateHabit,
  deleteHabit,
  completeHabit,
};
