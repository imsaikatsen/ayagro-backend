const headerCardRepo = require('../repositories/headerCard.repository');
const ApiError = require('../utils/apiError');
const fs = require('fs');
const path = require('path');

class HeaderCardService {
  async createHeaderCard(data) {
    return await headerCardRepo.create(data);
  }

  async getAllHeaderCards() {
    return await headerCardRepo.findAll();
  }

  async getHeaderCardById(id) {
    const card = await headerCardRepo.findById(id);
    if (!card) throw new ApiError(404, 'HeaderCard not found');
    return card;
  }

  async updateHeaderCardById(id, updateData) {
    const existing = await headerCardRepo.findById(id);
    if (!existing) throw new ApiError(404, 'HeaderCard not found');

    if (updateData.icon && existing.icon) {
      const imagePath = path.join(
        __dirname,
        '..',
        'uploads',
        'header-cards',
        existing.icon
      );
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    const updated = await headerCardRepo.updateById(id, updateData);
    if (!updated) throw new ApiError(500, 'Failed to update headerCard');
    return updated;
  }

  async deleteHeaderCardById(id) {
    const existing = await headerCardRepo.findById(id);
    if (!existing) throw new ApiError(404, 'HeaderCard not found');

    if (existing.icon) {
      const imagePath = path.join(
        __dirname,
        '..',
        'uploads',
        'header-cards',
        existing.icon
      );
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    const deleted = await headerCardRepo.deleteById(id);
    if (!deleted) throw new ApiError(500, 'Failed to delete headerCard');
  }
}

module.exports = new HeaderCardService();
