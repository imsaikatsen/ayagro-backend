// repositories/product.repository.js
const Product = require('../models/product.model');

class ProductRepository {
  async create(productData) {
    return await Product.create(productData);
  }

  async findPaginated(filter = {}, skip = 0, limit = 10) {
    return await Product.find(filter)
      .populate('category')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  async count(filter = {}) {
    return await Product.countDocuments(filter);
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
