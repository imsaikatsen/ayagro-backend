// models/investment.model.js
const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema(
  {
    investorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Investor',
      required: true,
    },
    projectName: { type: String, required: true },
    duration: { type: String, required: true },
    investedAmount: { type: Number, required: true },
    expectedEarning: { type: Number, required: true },
    maturityDate: { type: Date, required: true },
    bookedDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ['BOOKED', 'ACTIVE', 'MATURED', 'CANCELLED'],
      default: 'BOOKED',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Investment', investmentSchema);
