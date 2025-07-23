const Joi = require('joi');

const blogSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255).required(),
  description: Joi.string().trim().min(10).required(),
});

module.exports = { blogSchema };
