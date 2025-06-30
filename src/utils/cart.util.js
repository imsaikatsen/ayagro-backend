const ApiError = require('./apiError');

const getCartIdentifier = (req) => {
  if (req.user) return { user_id: req.user.id };
  if (req.headers['x-cart-token'])
    return { cart_token: req.headers['x-cart-token'] };
  throw new ApiError(400, 'Cart token or authentication required');
};

module.exports = { getCartIdentifier };
