const cartRepository = require('../repositories/cart.repository');
const ApiError = require('../utils/apiError');

class CartService {
  async createCartItem(data) {
    const { user_id, cart_token, product_id, quantity } = data;
    const query = user_id
      ? { user_id, product_id }
      : { cart_token, product_id };

    const existing = await cartRepository.findOneByQuery(query);
    if (existing) {
      return await cartRepository.updateById(existing._id, {
        quantity: existing.quantity + quantity,
      });
    }

    return await cartRepository.create(data);
  }

  async getCartItems(identifier) {
    const cartItems = await cartRepository.findAllByIdentifier(identifier);
    const totalQty = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.quantity * item.product_id.price,
      0
    );
    return { items: cartItems, totalQty, subtotal };
  }

  async getCartItemById(id) {
    const cart = await cartRepository.findById(id);
    if (!cart) throw new ApiError(404, 'Cart item not found');
    return cart;
  }

  async updateCartItem(id, data) {
    const updated = await cartRepository.updateById(id, data);
    if (!updated) throw new ApiError(500, 'Failed to update cart item');
    return updated;
  }

  async deleteCartItem(id) {
    const deleted = await cartRepository.deleteById(id);
    if (!deleted) throw new ApiError(500, 'Failed to delete cart item');
  }

  async clearCart(userId) {
    return await cartRepository.deleteAllByUser(userId);
  }
}

module.exports = new CartService();
