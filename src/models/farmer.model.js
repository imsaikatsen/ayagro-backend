const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    phone: String,
    address: String,
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Farmer', farmerSchema);
