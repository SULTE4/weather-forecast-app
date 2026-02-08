const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    city: {
      type: String,
      required: [true, 'City name is required'],
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    nickname: {
      type: String,
      trim: true,
      maxlength: [50, 'Nickname cannot exceed 50 characters'],
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for faster user-specific queries
locationSchema.index({ userId: 1, city: 1 });

module.exports = mongoose.model('Location', locationSchema);