const Joi = require('joi');

const teamSchema = Joi.object({
  name: Joi.string().trim().min(2).max(255).required(),
  designation: Joi.string().trim().min(2).max(255).required(),
  description: Joi.string().trim().allow('', null),
  linkedin: Joi.string().uri().allow('', null),
  order: Joi.number().integer().min(1),
});

module.exports = { teamSchema };
