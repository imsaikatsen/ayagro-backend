// models/product.model.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    productImage: {
      type: String,
    },
    // stock: {
    //   type: Number,
    //   default: 0,
    // },
    isActive: {
      type: Boolean,
      default: true,
    },
    duration: {
      type: String, // e.g., "3 months", "1 year", etc.
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'live'],
    },
    location: {
      type: String,
      trim: true,
    },
    earningRateMin: { type: Number },
    earningRateMax: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
