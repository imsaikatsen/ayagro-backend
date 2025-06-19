const Joi = require('joi');

const profileSchema = Joi.object({
  personalInfo: Joi.object({
    firstName: Joi.string().required().messages({
      'string.base': 'First name must be a string',
      'any.required': 'First name is required',
    }),
    lastName: Joi.string().required().messages({
      'string.base': 'Last name must be a string',
      'any.required': 'Last name is required',
    }),
    dateOfBirth: Joi.date().required().messages({
      'date.base': 'Date of birth must be a valid date',
      'any.required': 'Date of birth is required',
    }),
    gender: Joi.string().valid('Male', 'Female', 'Other').required().messages({
      'any.only': 'Gender must be Male, Female, or Other',
      'any.required': 'Gender is required',
    }),
    nidNumber: Joi.string()
      .pattern(/^[0-9]{10,17}$/)
      .required()
      .messages({
        'string.pattern.base': 'NID must be 10–17 digits',
        'any.required': 'NID number is required',
      }),
  }).required(),

  bankingInfo: Joi.object({
    bankName: Joi.string().required().messages({
      'string.base': 'Bank name must be a string',
      'any.required': 'Bank name is required',
    }),
    accountNumber: Joi.string()
      .pattern(/^[0-9]{6,20}$/)
      .required()
      .messages({
        'string.pattern.base': 'Account number must be 6–20 digits',
        'any.required': 'Bank account number is required',
      }),
    branch: Joi.string().required().messages({
      'string.base': 'Branch must be a string',
      'any.required': 'Branch is required',
    }),
  }).required(),

  nomineeInfo: Joi.object({
    name: Joi.string().required().messages({
      'string.base': 'Nominee name must be a string',
      'any.required': 'Nominee name is required',
    }),
    relation: Joi.string().required().messages({
      'string.base': 'Nominee relation must be a string',
      'any.required': 'Nominee relation is required',
    }),
    nidNumber: Joi.string()
      .pattern(/^[0-9]{10,17}$/)
      .required()
      .messages({
        'string.pattern.base': 'Nominee NID must be 10–17 digits',
        'any.required': 'Nominee NID is required',
      }),
  }).required(),
});
module.exports = {
  profileSchema,
};
