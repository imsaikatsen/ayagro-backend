const asoleExpressRepository = require('../repositories/asoleExpress.repository');
const ApiError = require('../utils/apiError');

class AsoleExpressService {
  async create(data) {
    return await asoleExpressRepository.create(data);
  }

  async getAll(page, limit) {
    return await asoleExpressRepository.findAll(page, limit);
  }

  async getById(id) {
    const item = await asoleExpressRepository.findById(id);
    if (!item) throw new ApiError(404, 'Record not found');
    return item;
  }

  async updateById(id, data) {
    const updated = await asoleExpressRepository.updateById(id, data);
    if (!updated) throw new ApiError(500, 'Failed to update');
    return updated;
  }

  async deleteById(id) {
    const deleted = await asoleExpressRepository.deleteById(id);
    if (!deleted) throw new ApiError(500, 'Failed to delete');
    return;
  }
}

module.exports = new AsoleExpressService();
