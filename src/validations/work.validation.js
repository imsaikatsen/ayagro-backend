// validations/work.validation.js
const Joi = require('joi');

const workSchema = Joi.object({
  region: Joi.string().trim().min(2).required(),
  title: Joi.string().trim().min(3).max(255).required(),
  subtitle: Joi.string().trim().min(2).required(),
  description: Joi.string().allow(''),
  mediaType: Joi.string().valid('image', 'video').required(),
  //   mediaUrl: Joi.string().required(), // if video → YouTube ID, if image → filename
});

module.exports = { workSchema };
