// services/category.service.js
const categoryRepository = require('../repositories/category.repository');
const ApiError = require('../utils/apiError');

class CategoryService {
  async createCategory(data) {
    const exists = await categoryRepository.findByName(data.name);
    if (exists) {
      throw new ApiError(400, 'Category already exists with this name');
    }
    return await categoryRepository.create(data);
  }

  async getAllCategories() {
    return await categoryRepository.findAll();
  }

  async getCategoryById(id) {
    const category = await categoryRepository.findById(id);
    if (!category) throw new ApiError(404, 'Category not found');
    return category;
  }

  async updateCategoryById(id, updateData) {
    const updated = await categoryRepository.updateById(id, updateData);
    if (!updated) throw new ApiError(404, 'Category not found');
    return updated;
  }

  async deleteCategoryById(id) {
    const deleted = await categoryRepository.deleteById(id);
    if (!deleted) throw new ApiError(404, 'Category not found');
    return;
  }
}

module.exports = new CategoryService();
