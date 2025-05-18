const productRepository = require('../repositories/product.repository');
const ApiError = require('../utils/apiError');
const fs = require('fs');
const path = require('path');

class ProductService {
  async createProduct(data) {
    return await productRepository.create(data);
  }

  async getAllProducts() {
    return await productRepository.findAll();
  }

  async getProductById(productId) {
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
    return product;
  }

  async updateProductById(productId, updateData) {
    const existing = await productRepository.findById(productId);
    if (!existing) {
      throw new ApiError(404, 'Product not found');
    }

    //  Delete old image if new image is uploaded
    if (updateData.productImage && existing.productImage) {
      const imagePath = path.join(
        __dirname,
        '..',
        '..',
        'uploads',
        'products',
        existing.productImage
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    const updated = await productRepository.updateById(productId, updateData);
    if (!updated) {
      throw new ApiError(500, 'Failed to update product');
    }

    return updated;
  }

  async deleteProductById(productId) {
    const existing = await productRepository.findById(productId);
    if (!existing) {
      throw new ApiError(404, 'Product not found');
    }

    // Delete associated image
    if (existing.productImage) {
      const imagePath = path.join(
        __dirname,
        '..',
        '..',
        'uploads',
        'products',
        existing.productImage
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    const deleted = await productRepository.deleteById(productId);
    if (!deleted) {
      throw new ApiError(500, 'Failed to delete product');
    }

    return;
  }
}

module.exports = new ProductService();
