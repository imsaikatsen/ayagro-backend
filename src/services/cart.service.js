const cartRepository = require('../repositories/cart.repository');
const ApiError = require('../utils/apiError');

class CartService {
  async createCartItem(data) {
    // Check if already exists
    const existing = await cartRepository.findOne(
      data.user_id,
      data.product_id
    );
    if (existing) {
      const updatedQty = existing.quantity + data.quantity;
      return await cartRepository.updateById(existing._id, {
        quantity: updatedQty,
      });
    }

    return await cartRepository.create(data);
  }

  async getCartItemsByUser(userId) {
    const cartItems = await cartRepository.findAllByUser(userId);
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
