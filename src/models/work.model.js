// models/work.model.js
const mongoose = require('mongoose');

const workSchema = new mongoose.Schema(
  {
    region: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    mediaType: {
      type: String,
      enum: ['image', 'video'],
      required: true,
    },
    mediaUrl: {
      type: String, // For image path or YouTube videoId
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    customDate: {
      type: Date,
      default: null, // if not provided, stays null
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Work', workSchema);
