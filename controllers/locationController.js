const Location = require('../models/Location');

// Create new location
exports.createLocation = async (req, res, next) => {
  try {
    const { city, country, latitude, longitude, nickname, isFavorite } = req.body;
    const userId = req.user.userId;

    const location = await Location.create({
      userId,
      city,
      country,
      latitude,
      longitude,
      nickname,
      isFavorite,
    });

    res.status(201).json({
      message: 'Location added successfully',
      location,
    });
  } catch (error) {
    next(error);
  }
};

// Get all user locations
exports.getAllLocations = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const locations = await Location.find({ userId }).sort({ createdAt: -1 });

    res.json({
      count: locations.length,
      locations,
    });
  } catch (error) {
    next(error);
  }
};

// Get single location
exports.getLocation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const location = await Location.findOne({ _id: id, userId });
    
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }

    res.json(location);
  } catch (error) {
    next(error);
  }
};

// Update location
exports.updateLocation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const updates = req.body;

    const location = await Location.findOneAndUpdate(
      { _id: id, userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }

    res.json({
      message: 'Location updated successfully',
      location,
    });
  } catch (error) {
    next(error);
  }
};

// Delete location
exports.deleteLocation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const location = await Location.findOneAndDelete({ _id: id, userId });

    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }

    res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    next(error);
  }
};