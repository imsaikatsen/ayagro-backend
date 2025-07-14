const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    personalInfo: {
      firstName: String,
      lastName: String,
      dateOfBirth: Date,
      gender: String,
      nidNumber: String,
      phone: String,
    },
    bankingInfo: {
      bankName: String,
      accountNumber: String,
      branch: String,
    },
    nomineeInfo: {
      name: String,
      relation: String,
      nidNumber: String,
      phone: String,
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);
