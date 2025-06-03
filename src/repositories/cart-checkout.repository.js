const Cart = require('../models/cart.model');

class CartCheckoutRepository {
  async addToCart(data) {
    return await Cart.create(data);
  }

  async getAll() {
    return await Cart.find().populate('product_id');
  }

  async findByUser(userId) {
    return await Cart.find({ user_id: userId }).populate('product_id');
  }

  async deleteAllByUser(userId) {
    return await Cart.deleteMany({ user_id: userId });
  }

  async deleteItem(cartItemId) {
    return await Cart.findByIdAndDelete(cartItemId);
  }
}

module.exports = new CartCheckoutRepository();
