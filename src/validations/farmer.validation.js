const Joi = require('joi');

const farmerSchema = Joi.object({
  // Personal Info
  name: Joi.string().trim().min(3).max(255).required(),
  address: Joi.string().trim().required(),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required(),

  // Farm Details
  landSize: Joi.number().positive().required(),
  crops: Joi.string().trim().required(),

  // Loan Info
  loanAmount: Joi.number().positive().required(),
  loanDuration: Joi.number().positive().required(),
  interestRate: Joi.number().positive().required(),
});

module.exports = { farmerSchema };
