// services/work.service.js
const workRepository = require('../repositories/work.repository');
const ApiError = require('../utils/apiError');

class WorkService {
  async createWork(data) {
    return await workRepository.create(data);
  }

  async getAllWorks(page, limit) {
    return await workRepository.findAll(page, limit);
  }

  async getWorkById(id) {
    const work = await workRepository.findById(id);
    if (!work) throw new ApiError(404, 'Work not found');
    return work;
  }

  async updateWorkById(id, data) {
    const updated = await workRepository.updateById(id, data);
    if (!updated) throw new ApiError(500, 'Failed to update work');
    return updated;
  }

  async deleteWorkById(id) {
    const deleted = await workRepository.deleteById(id);
    if (!deleted) throw new ApiError(500, 'Failed to delete work');
    return;
  }
}

module.exports = new WorkService();
