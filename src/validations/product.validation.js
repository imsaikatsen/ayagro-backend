const Joi = require('joi');

// RegEx for a 24-hex-char MongoDB ObjectId
const objectIdPattern = /^[0-9a-fA-F]{24}$/;

// RegEx for duration strings like "3 days", "2 hours"
const durationPattern = /^\d+\s*(hour|hours|day|days|month|months)$/i;

const allowedStatuses = ['active', 'inactive', 'live'];

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

  shortDescription: Joi.string().trim().max(1000).allow('', null).messages({
    'string.max': 'Short description cannot exceed 500 characters',
  }),

  price: Joi.number().positive().required().messages({
    'number.base': 'Price must be a number',
    'number.positive': 'Price must be a positive number',
  }),

  // stock: Joi.number().integer().min(0).optional().messages({
  //   'number.base': 'Stock must be a number',
  //   'number.integer': 'Stock must be an integer',
  //   'number.min': 'Stock cannot be negative',
  // }),

  isActive: Joi.boolean().optional(),

  duration: Joi.string().trim().pattern(durationPattern).required().messages({
    'string.pattern.base':
      'Duration must be in a valid format (e.g., "3 days", "2 hours")',
    'any.required': 'Duration is required',
  }),

  location: Joi.string().trim().max(100).optional().messages({
    'string.max': 'Location cannot exceed 100 characters',
  }),

  status: Joi.string()
    .valid(...allowedStatuses)
    .optional()
    .messages({
      'any.only': `Status must be one of: ${allowedStatuses.join(', ')}`,
    }),
}).unknown(true);

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
  earningRate: Joi.number().positive().optional().messages({
    'number.base': 'Earning rate must be a number',
    'number.positive': 'Earning rate must be a positive number',
  }),

  duration: Joi.string().trim().pattern(durationPattern).optional().messages({
    'string.pattern.base':
      'Duration must be in a valid format (e.g., "3 days", "2 hours")',
  }),

  location: Joi.string().trim().max(100).optional().messages({
    'string.max': 'Location cannot exceed 100 characters',
  }),

  status: Joi.string()
    .valid(...allowedStatuses)
    .optional()
    .messages({
      'any.only': `Status must be one of: ${allowedStatuses.join(', ')}`,
    }),
}).unknown(true);

module.exports = {
  createProductSchema,
  updateProductSchema,
};
