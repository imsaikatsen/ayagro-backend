// repositories/category.repository.js
const Category = require('../models/category.model');

class CategoryRepository {
  async create(data) {
    return await Category.create(data);
  }

  async findById(id) {
    return await Category.findById(id);
  }

  async findByName(name) {
    return await Category.findOne({ name });
  }

  async findAll() {
    return await Category.find();
  }

  async updateById(id, updateData) {
    return await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      context: 'query',
    });
  }

  async deleteById(id) {
    return await Category.findByIdAndDelete(id);
  }
}

module.exports = new CategoryRepository();
