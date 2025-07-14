const Joi = require('joi');

const createHeaderCardSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    'string.empty': 'Title is required',
  }),
  value: Joi.string().trim().required().messages({
    'string.empty': 'Value is required',
  }),
  // icon is handled by multer (file), not Joi
});

const updateHeaderCardSchema = Joi.object({
  title: Joi.string().trim().optional(),
  value: Joi.string().trim().optional(),
});

module.exports = {
  createHeaderCardSchema,
  updateHeaderCardSchema,
};
