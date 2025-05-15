const Joi = require('joi');

const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required(),
  description: Joi.string().trim().max(255).optional(),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(3).max(50),
  description: Joi.string().trim().max(255),
});

module.exports = {
  createCategorySchema,
  updateCategorySchema,
};
