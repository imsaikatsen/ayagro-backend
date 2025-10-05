const Joi = require('joi');

const partnershipSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  phone: Joi.string().trim().min(10).max(15).required(),

  division: Joi.string().required(),
  district: Joi.string().required(),
  upazila: Joi.string().required(),
  union: Joi.string().required(),

  receivedBenefits: Joi.string().required(),
  receivedServices: Joi.string().required(),
  expectedCooperation: Joi.string().required(),
  landSizeHundreds: Joi.string().required(),
  projectAssistance: Joi.string().required(),
  projectType: Joi.string().required(),
  yearsOfExperience: Joi.string().required(),
  productBuyers: Joi.string().required(),

  reasonToJoin: Joi.string().min(10).required(),
});

module.exports = { partnershipSchema };
