// repositories/product.repository.js
const Product = require('../models/product.model');

class ProductRepository {
  async create(productData) {
    return await Product.create(productData);
  }

  async findAll(filter = {}) {
    return await Product.find(filter).populate('category');
  }

  async findById(productId) {
    return await Product.findById(productId).populate('category');
  }

  async updateById(productId, updateData) {
    return await Product.findByIdAndUpdate(productId, updateData, {
      new: true,
      runValidators: true,
      context: 'query',
    });
  }

  async deleteById(productId) {
    return await Product.findByIdAndDelete(productId);
  }
}

module.exports = new ProductRepository();
