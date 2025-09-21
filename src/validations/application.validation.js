const Joi = require('joi');

const applicationSchema = Joi.object({
  jobId: Joi.string().required(), // candidate must apply to a specific job
  name: Joi.string().trim().min(3).max(100).required(),
  email: Joi.string().email().required(),
  coverLetter: Joi.string().min(10).required(),
  // CV will be validated by multer (PDF check), so not in Joi
});

module.exports = { applicationSchema };
