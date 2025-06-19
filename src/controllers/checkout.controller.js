const cartService = require('../services/cart-checkout.service');

class checkoutController {
  async checkout(req, res, next) {
    try {
      const userId = req.user.id;
      console.log(req.body);
      const shippingAddress = req.body.shippingAddress; // Optional: add validation
      const result = await cartService.checkout(userId, shippingAddress);
      res.status(201).json({
        message: 'Checkout successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new checkoutController();
