const Joi = require('joi');

const asoleExpressSchema = Joi.object({
  phone: Joi.string().trim().min(6).max(20).required(),

  items_type: Joi.string().trim().min(2).max(100).required(),

  destination: Joi.string().trim().min(2).max(255).required(),

  driver_phone_no: Joi.string().trim().min(6).max(20).required(),

  vehicle_no: Joi.string().trim().min(2).max(50).required(),

  driver_name: Joi.string().trim().min(2).max(100).required(),

  status: Joi.string()
    .valid('pending', 'assigned', 'picked', 'delivered', 'cancelled')
    .default('pending'),
});

module.exports = { asoleExpressSchema };
