const express = require('express');
const { getRecommendations } = require('../controllers/recommendationsController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// @route   GET /api/recommendations
// @desc    Get AI recommendations
// @access  Private
router.get('/', getRecommendations);

module.exports = router;
