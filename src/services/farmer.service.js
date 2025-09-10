const farmerRepository = require('../repositories/farmer.repository');
const ApiError = require('../utils/apiError');

class FarmerService {
  async createFarmer(data) {
    return await farmerRepository.create(data);
  }

  async getAllFarmers(page, limit) {
    return await farmerRepository.findAll(page, limit);
  }

  async getFarmerById(id) {
    const farmer = await farmerRepository.findById(id);
    if (!farmer) throw new ApiError(404, 'Farmer not found');
    return farmer;
  }

  async updateFarmerById(id, data) {
    const updated = await farmerRepository.updateById(id, data);
    if (!updated) throw new ApiError(500, 'Failed to update farmer');
    return updated;
  }

  async deleteFarmerById(id) {
    const deleted = await farmerRepository.deleteById(id);
    if (!deleted) throw new ApiError(500, 'Failed to delete farmer');
    return;
  }
}

module.exports = new FarmerService();
