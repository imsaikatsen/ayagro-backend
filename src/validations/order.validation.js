const Joi = require('joi');

// MongoDB ObjectId pattern
const objectIdPattern = /^[0-9a-fA-F]{24}$/;

const shippingAddressSchema = Joi.object({
  fullname: Joi.string().trim().min(3).max(100).required().messages({
    'string.empty': 'Full name is required',
    'string.min': 'Full name must be at least 3 characters',
    'string.max': 'Full name cannot exceed 100 characters',
  }),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be valid (10-15 digits)',
      'string.empty': 'Phone number is required',
    }),
  street: Joi.string().trim().required().messages({
    'string.empty': 'Street address is required',
  }),
  city: Joi.string().trim().required().messages({
    'string.empty': 'City is required',
  }),
  state: Joi.string().trim().required().messages({
    'string.empty': 'State is required',
  }),
  zip: Joi.string().trim().required().messages({
    'string.empty': 'ZIP code is required',
  }),
  country: Joi.string().trim().required().messages({
    'string.empty': 'Country is required',
  }),
});

const createOrderSchema = Joi.object({
  user_id: Joi.string().pattern(objectIdPattern).optional().messages({
    'string.pattern.base': 'User ID must be a valid MongoDB ObjectId',
  }),
  totalAmount: Joi.number().positive().required().messages({
    'number.base': 'Total amount must be a number',
    'number.positive': 'Total amount must be a positive number',
    'any.required': 'Total amount is required',
  }),
  paymentStatus: Joi.string().valid('Unpaid', 'Paid', 'Refunded').optional(),
  orderStatus: Joi.string()
    .valid('pending', 'processing', 'shipped', 'delivered')
    .optional(),
  shippingAddress: shippingAddressSchema.required().messages({
    'any.required': 'Shipping address is required',
  }),
}).unknown(true); // allow other optional fields if any

module.exports = {
  createOrderSchema,
};
