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
      const userId = req.user?.id;
      const cart_token = req.headers['x-cart-token'];

      if (!userId) {
        throw new ApiError(401, 'Login required for checkout preview');
      }

      // Transfer guest cart to user if token exists
      if (cart_token) {
        await checkoutService.transferGuestCartToUser(cart_token, userId);
      }

      const data = await checkoutService.getCheckoutPreview(userId);
      res.status(200).json({
        message: 'Checkout preview fetched successfully',
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  // async getMyOrders(req, res, next) {
  //   try {
  //     const userId = req.user.id;
  //     const page = parseInt(req.query.page) || 1;
  //     const limit = parseInt(req.query.limit) || 10;

  //     const result = await checkoutService.getUserOrders(userId, page, limit);

  //     res.status(200).json({
  //       message: 'Orders fetched successfully',
  //       ...result,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  async getMyOrders(req, res, next) {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const status = req.query.status || null;

      const result = await checkoutService.getUserOrders(
        userId,
        page,
        limit,
        status
      );

      res.status(200).json({
        message: 'My farms fetched successfully',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new checkoutController();
