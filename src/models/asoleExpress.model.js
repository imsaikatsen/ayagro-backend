const mongoose = require('mongoose');

const asoleExpressSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, trim: true, index: true },
    items_type: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    driver_phone_no: { type: String, required: true, trim: true },
    vehicle_no: { type: String, required: true, trim: true },
    driver_name: { type: String, required: true, trim: true },

    status: {
      type: String,
      enum: ['pending', 'assigned', 'picked', 'delivered', 'cancelled'],
      default: 'pending',
      index: true,
    },

    // OTP verification fields
    otp: { type: String, trim: true },
    otpExpiresAt: { type: Date },
    isVerified: { type: Boolean, default: false },

    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    history: [
      {
        at: { type: Date, default: Date.now },
        by: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          default: null,
        },
        changes: { type: Object },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('AsoleExpress', asoleExpressSchema);
