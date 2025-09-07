const express = require('express');
const {
  getAllProgress,
  getProgress,
  markProgress,
  getProgressStats,
  getIncompleteHabitsToday,
} = require('../controllers/progressController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// @route   GET /api/progress
// @desc    Get all progress for user
// @access  Private
router.get('/', getAllProgress);

// @route   GET /api/progress/:habitId
// @desc    Get progress for a habit
// @access  Private
router.get('/:habitId', getProgress);

// @route   POST /api/progress/:habitId
// @desc    Mark progress for a habit
// @access  Private
router.post('/:habitId', markProgress);

// @route   GET /api/progress/stats/:habitId
// @desc    Get progress statistics for a habit
// @access  Private
router.get('/stats/:habitId', getProgressStats);

// @route   GET /api/progress/incomplete/today
// @desc    Get incomplete habits for today
// @access  Private
router.get('/incomplete/today', getIncompleteHabitsToday);

module.exports = router;
