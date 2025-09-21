const Joi = require('joi');

const jobSchema = Joi.object({
  department: Joi.string().trim().min(2).max(100).required(),
  title: Joi.string().trim().min(3).max(255).required(),
  type: Joi.string().valid('Full-time', 'Part-time', 'Contract').required(),
  location: Joi.string().trim().allow('', null), // optional
  salary: Joi.string().trim().allow('', null), // optional
  deadline: Joi.date().required(),
  vacancy: Joi.number().integer().min(1).required(),
  description: Joi.string().min(20).required(), // rich text (HTML allowed)
});

module.exports = { jobSchema };
