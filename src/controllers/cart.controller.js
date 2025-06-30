const cartService = require('../services/cart.service');

const { v4: uuidv4 } = require('uuid');

class CartController {
  async create(req, res, next) {
    try {
      const identifier = req.user
        ? { user_id: req.user.id }
        : { cart_token: req.headers['x-cart-token'] || uuidv4() };

      const data = {
        ...identifier,
        product_id: req.body.product_id,
        quantity: req.body.quantity,
      };

      const cart = await cartService.createCartItem(data);
      res.status(201).json({
        message: 'Cart item added',
        data: cart,
        cart_token: identifier.cart_token,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const identifier = req.user
        ? { user_id: req.user.id }
        : { cart_token: req.headers['x-cart-token'] };

      const { items, totalQty, subtotal } = await cartService.getCartItems(
        identifier
      );
      res
        .status(200)
        .json({ message: 'Cart items fetched', items, totalQty, subtotal });
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
