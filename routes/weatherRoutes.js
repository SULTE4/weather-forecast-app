const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const authMiddleware = require('../middleware/auth');

// @route   GET /api/weather/current
// @desc    Get current weather for a city
// @access  Private
router.get('/current', authMiddleware, weatherController.getCurrentWeather);

// @route   GET /api/weather/forecast
// @desc    Get 5-day forecast for a city
// @access  Private
router.get('/forecast', authMiddleware, weatherController.getForecast);

module.exports = router;