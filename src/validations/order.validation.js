const Joi = require('joi');

// MongoDB ObjectId pattern
const objectIdPattern = /^[0-9a-fA-F]{24}$/;

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
    .valid('booked', 'completed', 'cancelled')
    .optional(),
}).unknown(true);

module.exports = {
  createOrderSchema,
};
