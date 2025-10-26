// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    password: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    role: {
      type: String,
      enum: ['customer', 'manager', 'admin', 'super_admin', 'premium_investor'],
      default: 'customer',
    },
    modules: [{ type: String }],
    isVerified: {
      type: Boolean,
      default: false,
    },
    deviceToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.virtual('profile', {
  ref: 'Profile',
  localField: '_id',
  foreignField: 'user_id',
  justOne: true,
});

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
