const partnershipRepository = require('../repositories/partnership.repository');

class PartnershipService {
  async createPartnership(data) {
    return await partnershipRepository.create(data);
  }
  async getAllPartnerships(page, limit) {
    return await partnershipRepository.findAll(page, limit);
  }

  async getPartnershipById(id) {
    const partnership = await partnershipRepository.findById(id);
    if (!partnership) throw new ApiError(404, 'Partnership not found');
    return partnership;
  }

  async deletePartnershipById(id) {
    const deleted = await partnershipRepository.deleteById(id);
    if (!deleted) throw new ApiError(500, 'Failed to delete partnership');
    return;
  }
}

module.exports = new PartnershipService();
