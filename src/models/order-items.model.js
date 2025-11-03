const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Unpaid', 'Paid', 'Partially Paid'],
      default: 'Unpaid',
    },
    orderStatus: {
      type: String,
      enum: ['booked', 'active', 'completed', 'cancelled'],
      default: 'booked',
    },
    transactionId: { type: String, default: null },
    activationDate: { type: Date, default: null },
    maturityDate: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('OrderItem', orderItemSchema);
