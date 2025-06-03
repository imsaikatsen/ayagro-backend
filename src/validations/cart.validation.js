const Joi = require('joi');

const createCartSchema = Joi.object({
  product_id: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
});

const updateCartSchema = Joi.object({
  quantity: Joi.number().integer().min(1).required(),
});

module.exports = {
  createCartSchema,
  updateCartSchema,
};
