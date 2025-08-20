const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: Number,
      unique: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Unpaid', 'Paid'],
      default: 'Unpaid',
    },
    orderStatus: {
      type: String,
      enum: ['booked', 'active', 'completed', 'cancelled'],
      default: 'booked',
    },
    proofOfPayment: {
      type: String,
      default: null,
    },

    activationDate: { type: Date, default: null },

    profitDisbursed: {
      type: Boolean,
      default: false,
    },
    profitDisbursedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
