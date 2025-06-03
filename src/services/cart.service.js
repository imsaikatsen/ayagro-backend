const cartRepository = require('../repositories/cart.repository');
const ApiError = require('../utils/apiError');

class CartService {
  async createCartItem(data) {
    return await cartRepository.create(data);
  }

  async getCartItemsByUser(userId) {
    return await cartRepository.findAllByUser(userId);
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
