const Cart = require('../models/cart.model');
const Profile = require('../models/profile.model');
const Product = require('../models/product.model');

class CheckoutRepository {
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

  async findCartItemsByUser(userId) {
    return await Cart.find({ user_id: userId }).populate('product_id');
  }

  async findProfileByUserId(userId) {
    return await Profile.findOne({ user_id: userId });
  }

  async findAllByCartToken(cart_token) {
    return await Cart.find({ cart_token }).populate('product_id');
  }

  async findByUserAndProduct(user_id, product_id) {
    return await Cart.findOne({ user_id, product_id });
  }
}

module.exports = new CheckoutRepository();
