const Joi = require('joi');

const investorSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().required(),
  profession: Joi.string().required(),
});

module.exports = { investorSchema };
