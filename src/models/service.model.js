const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    serviceImage: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
