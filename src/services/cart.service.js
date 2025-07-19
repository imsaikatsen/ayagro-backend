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
    const formattedItems = cartItems.map((item) => {
      const { product_id, ...rest } = item._doc || item;
      return {
        ...rest,
        product: product_id, // rename populated field
      };
    });

    const totalQty = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.quantity * item.product_id.price,
      0
    );
    return { items: formattedItems, totalQty, subtotal };
  }

  async getCartItemById(id) {
    const cart = await cartRepository.findById(id);
    if (!cart) throw new ApiError(404, 'Cart item not found');
    return cart;
  }

  async updateCartItem(id, data, token) {
    const updated = await cartRepository.updateById(id, data, token);
    if (!updated) throw new ApiError(500, 'Failed to update cart item');
    return updated;
  }

  async deleteCartItem(id, token) {
    const deleted = await cartRepository.deleteById(id, token);
    if (!deleted) throw new ApiError(500, 'Failed to delete cart item');
  }

  async clearCart(userId) {
    return await cartRepository.deleteAllByUser(userId);
  }
}

module.exports = new CartService();
