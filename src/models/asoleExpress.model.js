const mongoose = require('mongoose');

const asoleExpressSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, trim: true },
    items_type: { type: String, required: true },
    destination: { type: String, required: true },
    driver_phone_no: { type: String, required: true },
    vehicle_no: { type: String, required: true },
    driver_name: { type: String, required: true },

    status: {
      type: String,
      enum: ['pending', 'assigned', 'picked', 'delivered', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AsoleExpress', asoleExpressSchema);
