// validations/order-items.validation.js
const Joi = require('joi');

const createOrderItemSchema = Joi.object({
  order_id: Joi.string().required(),
  product_id: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
  price: Joi.number().positive().required(),
});

const updateOrderItemSchema = Joi.object({
  quantity: Joi.number().integer().min(1).optional(),
  price: Joi.number().positive().optional(),
});

module.exports = {
  createOrderItemSchema,
  updateOrderItemSchema,
};
