const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    linkedin: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    order: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Team', teamSchema);
