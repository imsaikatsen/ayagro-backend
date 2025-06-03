const cartService = require('../services/cart.service');

class CartController {
  async create(req, res, next) {
    try {
      const data = {
        user_id: req.user.id,
        product_id: req.body.product_id,
        quantity: req.body.quantity,
      };
      const cart = await cartService.createCartItem(data);
      res.status(201).json({ message: 'Cart item added', data: cart });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const cartItems = await cartService.getCartItemsByUser(req.user.id);
      res.status(200).json({ message: 'Cart items fetched', data: cartItems });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const item = await cartService.getCartItemById(req.params.id);
      res.status(200).json({ message: 'Cart item fetched', data: item });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const updated = await cartService.updateCartItem(req.params.id, req.body);
      res.status(200).json({ message: 'Cart item updated', data: updated });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await cartService.deleteCartItem(req.params.id);
      res.status(200).json({ message: 'Cart item deleted' });
    } catch (error) {
      next(error);
    }
  }

  async clear(req, res, next) {
    try {
      await cartService.clearCart(req.user.id);
      res.status(200).json({ message: 'Cart cleared' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CartController();
