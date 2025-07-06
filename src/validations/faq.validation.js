const Joi = require('joi');

const createFaqSchema = Joi.object({
  question: Joi.string().required(),
  answer: Joi.string().optional(),
});

const updateFaqSchema = Joi.object({
  question: Joi.string().optional(),
  answer: Joi.string().optional(),
});

module.exports = { createFaqSchema, updateFaqSchema };
