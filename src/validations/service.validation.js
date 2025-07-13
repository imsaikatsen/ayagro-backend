const Joi = require('joi');

const createServiceSchema = Joi.object({
  name: Joi.string().trim().required(),
});

const updateServiceSchema = Joi.object({
  name: Joi.string().trim().optional(),
});

module.exports = { createServiceSchema, updateServiceSchema };
