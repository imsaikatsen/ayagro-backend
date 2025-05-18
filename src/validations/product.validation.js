const Joi = require('joi');

// RegEx for a 24-hex-char MongoDB ObjectId
const objectIdPattern = /^[0-9a-fA-F]{24}$/;

const createProductSchema = Joi.object({
  category: Joi.string().pattern(objectIdPattern).required().messages({
    'string.empty': 'Category ID is required',
    'string.pattern.base': 'Category must be a valid MongoDB ObjectId',
  }),

  name: Joi.string().trim().min(3).max(100).required().messages({
    'string.empty': 'Product name is required',
    'string.min': 'Product name must be at least 3 characters',
    'string.max': 'Product name cannot exceed 100 characters',
  }),

  shortDescription: Joi.string().trim().max(500).allow('', null).messages({
    'string.max': 'Short description cannot exceed 500 characters',
  }),

  price: Joi.number().positive().required().messages({
    'number.base': 'Price must be a number',
    'number.positive': 'Price must be a positive number',
  }),

  stock: Joi.number().integer().min(0).optional().messages({
    'number.base': 'Stock must be a number',
    'number.integer': 'Stock must be an integer',
    'number.min': 'Stock cannot be negative',
  }),

  isActive: Joi.boolean().optional(),
}).unknown(true); // allow other keys (like productImage)

const updateProductSchema = Joi.object({
  category: Joi.string().pattern(objectIdPattern).messages({
    'string.pattern.base': 'Category must be a valid MongoDB ObjectId',
  }),
  name: Joi.string().trim().min(3).max(100).optional(),
  shortDescription: Joi.string().trim().max(500).allow('', null).optional(),
  price: Joi.number().positive().optional().messages({
    'number.base': 'Price must be a number',
    'number.positive': 'Price must be a positive number',
  }),
  stock: Joi.number().integer().min(0).optional(),
  isActive: Joi.boolean().optional(),
}).unknown(true);

module.exports = {
  createProductSchema,
  updateProductSchema,
};
