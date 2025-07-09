// services/category.service.js
const categoryRepository = require('../repositories/category.repository');
const ApiError = require('../utils/apiError');
const fs = require('fs');
const path = require('path');

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
    const existing = await categoryRepository.findById(id);
    if (!existing) throw new ApiError(404, 'Category not found');

    if (updateData.categoryImage && existing.categoryImage) {
      const imagePath = path.join(
        __dirname,
        '..',
        'uploads',
        'categories',
        existing.categoryImage
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    const updated = await categoryRepository.updateById(id, updateData);
    if (!updated) throw new ApiError(500, 'Failed to update category');
    return updated;
  }
  async deleteCategoryById(id) {
    const existing = await categoryRepository.findById(id);
    if (!existing) throw new ApiError(404, 'Category not found');

    if (existing.categoryImage) {
      const imagePath = path.join(
        __dirname,
        '..',
        'uploads',
        'categories',
        existing.categoryImage
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    const deleted = await categoryRepository.deleteById(id);
    if (!deleted) throw new ApiError(500, 'Failed to delete category');
    return;
  }
}

module.exports = new CategoryService();
