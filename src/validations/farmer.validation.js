const Joi = require('joi');

const farmerSchema = Joi.object({
  // Personal Info
  name: Joi.string().trim().min(3).max(255).required(),
  address: Joi.object({
    village: Joi.string().required(),
    // post: Joi.string().required(),
    police_station: Joi.string().required(),
    district: Joi.string().required(),
  }).required(),
  nid: Joi.string()
    .pattern(/^[0-9]+$/) // only digits allowed
    .min(10) // minimum 10 digits
    .max(17) // maximum 17 digits
    .required(),
  // phone: Joi.string()
  //   .pattern(/^[0-9]{10,15}$/)
  //   .required(),

  // Farm Details
  // landSize: Joi.number().positive().required(),
  // crops: Joi.string().trim().required(),

  // Loan Info
  // loanAmount: Joi.number().positive().required(),
  // loanDuration: Joi.number().positive().required(),
  // interestRate: Joi.number().positive().required(),
});

module.exports = { farmerSchema };
