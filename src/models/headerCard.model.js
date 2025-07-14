const mongoose = require('mongoose');

const headerCardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    value: { type: String, required: true },
    icon: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HeaderCard', headerCardSchema);
