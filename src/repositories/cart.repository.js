const Cart = require('../models/cart.model');

class CartRepository {
  async create(data) {
    return await Cart.create(data);
  }

  async findOneByQuery(query) {
    return await Cart.findOne(query);
  }

  async findAllByIdentifier(identifier) {
    return await Cart.find(identifier).populate('product_id');
  }

  // async findOne(userId, productId) {
  //   return await Cart.findOne({ user_id: userId, product_id: productId });
  // }

  // async findAllByUser(userId) {
  //   return await Cart.find({ user_id: userId }).populate('product_id');
  // }

  async findById(id) {
    return await Cart.findById(id).populate('product_id');
  }

  async updateById(id, data) {
    return await Cart.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id) {
    return await Cart.findByIdAndDelete(id);
  }

  async deleteAllByUser(userId) {
    return await Cart.deleteMany({ user_id: userId });
  }
}

module.exports = new CartRepository();
