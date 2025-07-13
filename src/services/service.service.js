const serviceRepository = require('../repositories/service.repository');
const ApiError = require('../utils/apiError');
const fs = require('fs');
const path = require('path');

class ServiceService {
  async createService(data) {
    const exists = await serviceRepository.findByName(data.name);
    if (exists) throw new ApiError(400, 'Service already exists');
    return await serviceRepository.create(data);
  }

  async getAllServices() {
    return await serviceRepository.findAll();
  }

  async getServiceById(id) {
    const service = await serviceRepository.findById(id);
    if (!service) throw new ApiError(404, 'Service not found');
    return service;
  }

  async updateServiceById(id, updateData) {
    const existing = await serviceRepository.findById(id);
    if (!existing) throw new ApiError(404, 'Service not found');

    if (updateData.serviceImage && existing.serviceImage) {
      const imagePath = path.join(
        __dirname,
        '..',
        'uploads',
        'services',
        existing.serviceImage
      );
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    const updated = await serviceRepository.updateById(id, updateData);
    if (!updated) throw new ApiError(500, 'Failed to update service');
    return updated;
  }

  async deleteServiceById(id) {
    const existing = await serviceRepository.findById(id);
    if (!existing) throw new ApiError(404, 'Service not found');

    if (existing.serviceImage) {
      const imagePath = path.join(
        __dirname,
        '..',
        'uploads',
        'services',
        existing.serviceImage
      );
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    const deleted = await serviceRepository.deleteById(id);
    if (!deleted) throw new ApiError(500, 'Failed to delete service');
  }
}

module.exports = new ServiceService();
