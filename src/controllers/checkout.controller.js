const checkoutService = require('../services/checkout.service');

class checkoutController {
  async checkout(req, res, next) {
    try {
      const { paymentMethod, isInterested } = req.body;
      const userId = req.user.id;
      const cart_token = req.headers['x-cart-token'];

      if (cart_token) {
        await checkoutService.transferGuestCartToUser(cart_token, userId);
      }

      const result = await checkoutService.checkout(
        userId,
        paymentMethod,
        isInterested
      );
      res.status(201).json({
        message: 'Checkout successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPreview(req, res, next) {
    try {
      const userId = req.user.id;
      const data = await checkoutService.getCheckoutPreview(userId);
      res.status(200).json({
        message: 'Checkout preview fetched successfully',
        data,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new checkoutController();
