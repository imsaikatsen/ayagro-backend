const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema(
  {
    projectIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    // Personal Info
    name: { type: String, required: true },
    address: {
      village: { type: String, required: true },
      post: { type: String, required: false },
      police_station: { type: String, required: true },
      district: { type: String, required: true },
    },
    phone: { type: String, required: false },

    // Farm Details
    landSize: { type: Number, required: false },
    crops: { type: String },

    // Loan Info
    loanAmount: { type: Number },
    loanDuration: { type: Number },
    interestRate: { type: Number },

    nid: { type: String, required: true },

    // Documents
    idProof: { type: String, required: false },
    landDeed: { type: String, required: false },

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
