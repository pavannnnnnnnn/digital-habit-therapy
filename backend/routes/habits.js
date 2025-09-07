const express = require('express');
const {
  getHabits,
  getHabit,
  createHabit,
  updateHabit,
  deleteHabit,
  completeHabit,
} = require('../controllers/habitController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// @route   GET /api/habits
// @desc    Get all habits
// @access  Private
router.get('/', getHabits);

// @route   GET /api/habits/:id
// @desc    Get single habit
// @access  Private
router.get('/:id', getHabit);

// @route   POST /api/habits
// @desc    Create new habit
// @access  Private
router.post('/', createHabit);

// @route   PUT /api/habits/:id
// @desc    Update habit
// @access  Private
router.put('/:id', updateHabit);

// @route   DELETE /api/habits/:id
// @desc    Delete habit
// @access  Private
router.delete('/:id', deleteHabit);

// @route   POST /api/habits/:id/complete
// @desc    Mark habit as completed for today
// @access  Private
router.post('/:id/complete', completeHabit);

module.exports = router;
