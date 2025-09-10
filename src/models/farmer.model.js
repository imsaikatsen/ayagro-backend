const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema(
  {
    // Personal Info
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },

    // Farm Details
    landSize: { type: Number },
    crops: { type: String },

    // Loan Info
    loanAmount: { type: Number },
    loanDuration: { type: Number }, // months
    interestRate: { type: Number },

    // Documents
    idProof: { type: String },
    landDeed: { type: String },

    // Track who added this farmer
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Farmer', farmerSchema);
