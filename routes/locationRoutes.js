const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const authMiddleware = require('../middleware/auth');
const { validateLocation } = require('../middleware/validation');

// @route   POST /api/locations
// @desc    Create a new location
// @access  Private
router.post('/', authMiddleware, validateLocation, locationController.createLocation);

// @route   GET /api/locations
// @desc    Get all user locations
// @access  Private
router.get('/', authMiddleware, locationController.getAllLocations);

// @route   GET /api/locations/:id
// @desc    Get a specific location
// @access  Private
router.get('/:id', authMiddleware, locationController.getLocation);

// @route   PUT /api/locations/:id
// @desc    Update a location
// @access  Private
router.put('/:id', authMiddleware, locationController.updateLocation);

// @route   DELETE /api/locations/:id
// @desc    Delete a location
// @access  Private
router.delete('/:id', authMiddleware, locationController.deleteLocation);

module.exports = router;