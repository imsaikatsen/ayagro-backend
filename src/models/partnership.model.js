const mongoose = require('mongoose');

const partnershipSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },

    // Cascading Dropdown Fields
    division: { type: String, required: true },
    district: { type: String, required: true },
    upazila: { type: String, required: true },
    union: { type: String, required: true },

    // Other dropdown-based fields
    receivedBenefits: { type: String, required: true },
    receivedServices: { type: String, required: true },
    expectedCooperation: { type: String, required: true },
    landSizeHundreds: { type: String, required: true },
    projectAssistance: { type: String, required: true },
    projectType: { type: String, required: true },
    yearsOfExperience: { type: String, required: true },
    productBuyers: { type: String, required: true },

    // Text input
    reasonToJoin: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Partnership', partnershipSchema);
