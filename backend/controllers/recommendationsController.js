const Habit = require('../models/Habit');
const Progress = require('../models/Progress');

// @desc    Get AI recommendations for user
// @route   GET /api/recommendations
// @access  Private
const getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's habits
    const habits = await Habit.find({ user: userId });

    // Get recent progress (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentProgress = await Progress.find({
      user: userId,
      date: { $gte: sevenDaysAgo },
    }).populate('habit');

    // Analyze habits and generate recommendations
    const recommendations = await generateRecommendations(habits, recentProgress);

    res.json({
      success: true,
      data: recommendations,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Helper function to generate recommendations based on habits and progress
const generateRecommendations = async (habits, recentProgress) => {
  const recommendations = [];

  // Analyze each habit
  for (const habit of habits) {
    const habitProgress = recentProgress.filter(p => p.habit._id.toString() === habit._id.toString());

    // Calculate completion rate for this habit
    const totalDays = habitProgress.length;
    const completedDays = habitProgress.filter(p => p.completed).length;
    const completionRate = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;

    // Generate recommendations based on habit type and completion rate
    const habitRecommendations = generateHabitRecommendations(habit, completionRate);
    recommendations.push(...habitRecommendations);
  }

  // Add general recommendations if user has few habits
  if (habits.length < 3) {
    recommendations.push({
      type: 'general',
      title: 'Start Small',
      description: 'Begin with 2-3 habits to build consistency before adding more.',
      priority: 'high',
    });
  }

  // Sort recommendations by priority
  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
};

// Generate specific recommendations based on habit type
const generateHabitRecommendations = (habit, completionRate) => {
  const recommendations = [];

  switch (habit.name.toLowerCase()) {
    case 'meditation':
    case 'mindfulness':
      if (completionRate < 50) {
        recommendations.push({
          type: 'mindfulness',
          title: 'Start with 2-minute sessions',
          description: 'Begin with short meditation sessions to build the habit gradually.',
          priority: 'high',
        });
      } else {
        recommendations.push({
          type: 'mindfulness',
          title: 'Try guided meditation',
          description: 'Use meditation apps for guided sessions to maintain engagement.',
          priority: 'medium',
        });
      }
      break;

    case 'exercise':
    case 'workout':
      if (completionRate < 50) {
        recommendations.push({
          type: 'fitness',
          title: 'Take a 5-minute walk',
          description: 'Start with a short walk to get moving and build momentum.',
          priority: 'high',
        });
      } else {
        recommendations.push({
          type: 'fitness',
          title: 'Add variety to workouts',
          description: 'Mix different types of exercise to prevent boredom and maintain motivation.',
          priority: 'medium',
        });
      }
      break;

    case 'reading':
      if (completionRate < 50) {
        recommendations.push({
          type: 'learning',
          title: 'Read for 10 minutes before bed',
          description: 'Establish a consistent reading routine with a fixed time slot.',
          priority: 'high',
        });
      } else {
        recommendations.push({
          type: 'learning',
          title: 'Join a book club',
          description: 'Connect with others who share your reading interests for accountability.',
          priority: 'medium',
        });
      }
      break;

    default:
      // Generic recommendations for other habits
      if (completionRate < 50) {
        recommendations.push({
          type: 'general',
          title: 'Set a specific time',
          description: `Schedule ${habit.name} at the same time each day to build consistency.`,
          priority: 'high',
        });
      } else {
        recommendations.push({
          type: 'general',
          title: 'Track your progress',
          description: 'Keep a journal of your experiences to stay motivated and see improvement.',
          priority: 'medium',
        });
      }
  }

  return recommendations;
};

module.exports = {
  getRecommendations,
};
