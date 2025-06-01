const Joi = require('joi');

const registerSchema = Joi.object({
  firstName: Joi.string().required().messages({
    'string.base': 'First name must be a string',
    'any.required': 'First name is required',
  }),

  lastName: Joi.string().required().messages({
    'string.base': 'Last name must be a string',
    'any.required': 'Last name is required',
  }),

  email: Joi.string().email().required().messages({
    'string.email': 'Email must be valid',
    'any.required': 'Email is required',
  }),

  phone: Joi.string()
    .pattern(/^[0-9]{11}$/)
    .required()
    .messages({
      'string.pattern.base':
        'Phone number must contain only digits 11 characters',
      'any.required': 'Phone number is required',
    }),

  password: Joi.string()
    .min(10)
    .pattern(/[!@#$%^&*(),.?":{}|<>]/)
    .required()
    .messages({
      'string.min': 'Password must be at least 10 characters',
      'string.pattern.base':
        'Password must contain at least one special character',
      'any.required': 'Password is required',
    }),

  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Confirm password must match password',
    'any.required': 'Confirm password is required',
  }),
});
module.exports = {
  registerSchema,
};
