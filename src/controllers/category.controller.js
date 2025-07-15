// controllers/category.controller.js
const categoryService = require('../services/category.service');

class CategoryController {
  async create(req, res, next) {
    try {
      const categoryData = req.body;
      if (req.file) {
        categoryData.categoryImage = req.file.filename;
      }

      const category = await categoryService.createCategory(categoryData);
      res.status(201).json({ message: 'Category created', data: category });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const categories = await categoryService.getAllCategories();
      if (!categories || categories.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No categories found',
        });
      }
      res.status(200).json({ message: 'Categories fetched', data: categories });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const category = await categoryService.getCategoryById(req.params.id);
      res.status(200).json({ message: 'Category fetched', data: category });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const updateData = req.body;
      if (req.file) {
        updateData.categoryImage = req.file.filename;
      }

      const updated = await categoryService.updateCategoryById(
        req.params.id,
        updateData
      );
      res.status(200).json({ message: 'Category updated', data: updated });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await categoryService.deleteCategoryById(req.params.id);
      res.status(200).json({ message: 'Category deleted' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CategoryController();
