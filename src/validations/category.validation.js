const Joi = require('joi');

const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required().messages({
    'any.required': 'Category name is required',
    'string.empty': 'Category name cannot be empty',
    'string.min': 'Category name must be at least 3 characters',
    'string.max': 'Category name cannot exceed 50 characters',
  }),
  description: Joi.string()
    .trim()
    .max(255)
    .allow(null, '')
    .optional()
    .messages({
      'string.max': 'Description cannot exceed 255 characters',
    }),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).optional().messages({
    'string.min': 'Category name must be at least 3 characters',
    'string.max': 'Category name cannot exceed 50 characters',
  }),
  description: Joi.string()
    .trim()
    .max(255)
    .allow(null, '')
    .optional()
    .messages({
      'string.max': 'Description cannot exceed 255 characters',
    }),
});

module.exports = {
  createCategorySchema,
  updateCategorySchema,
};
