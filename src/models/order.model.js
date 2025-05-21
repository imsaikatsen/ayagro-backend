const mongoose = require('mongoose');

const shippingSchema = new mongoose.Schema({
  fullname: String,
  phone: String,
  street: String,
  city: String,
  state: String,
  zip: String,
  country: String,
});

const orderSchema = new mongoose.Schema(
  {
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
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    shippingAddress: shippingSchema,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
