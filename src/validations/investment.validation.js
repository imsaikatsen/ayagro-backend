const Joi = require('joi');

const createInvestmentSchema = Joi.object({
  projectName: Joi.string().trim().min(3).max(255).required(),

  duration: Joi.string().trim().min(3).max(100).required(),

  investedAmount: Joi.number().positive().required(),

  expectedEarning: Joi.number().positive().required(),

  bookedDate: Joi.date().required(),

  maturityDate: Joi.date().greater(Joi.ref('bookedDate')).required(),

  status: Joi.string()
    .valid('BOOKED', 'ACTIVE', 'MATURED', 'CANCELLED')
    .optional(),
});

const updateInvestmentSchema = Joi.object({
  projectName: Joi.string().trim().min(3).max(255).optional(),

  duration: Joi.string().trim().min(3).max(100).optional(),

  investedAmount: Joi.number().positive().optional(),

  expectedEarning: Joi.number().positive().optional(),

  bookedDate: Joi.date().optional(),

  maturityDate: Joi.date().optional(),

  status: Joi.string()
    .valid('BOOKED', 'ACTIVE', 'MATURED', 'CANCELLED')
    .optional(),
}).min(1); // 👈 must update at least one field

module.exports = {
  createInvestmentSchema,
  updateInvestmentSchema,
};
