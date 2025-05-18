const ApiError = require('../utils/apiError');

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    convert: true,
    allowUnknown: true,
  });

  if (error) {
    return next(new ApiError(400, error.details[0].message));
  }

  req.body = value;
  next();
};

module.exports = validate;
