// controllers/product.controller.js
const productService = require('../services/product.service');

class ProductController {
  async create(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Product image is required' });
      }

      const productData = req.body;
      if (req.file) {
        productData.productImage = req.file.filename;
      }
      const product = await productService.createProduct(productData);
      res
        .status(201)
        .json({ message: 'Product created successfully', data: product });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const products = await productService.getAllProducts();
      res
        .status(200)
        .json({ message: 'Products fetched successfully', data: products });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const product = await productService.getProductById(req.params.id);
      res
        .status(200)
        .json({ message: 'Product fetched successfully', data: product });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const updateData = req.body;
      if (req.file) {
        updateData.productImage = req.file.filename;
      }
      const updated = await productService.updateProductById(
        req.params.id,
        updateData
      );
      res
        .status(200)
        .json({ message: 'Product updated successfully', data: updated });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await productService.deleteProductById(req.params.id);
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();
