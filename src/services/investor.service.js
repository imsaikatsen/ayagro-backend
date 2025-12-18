const investorRepository = require('../repositories/investor.repository');
const ApiError = require('../utils/apiError');

class InvestorService {
  async createInvestor(data) {
    return await investorRepository.create(data);
  }

  async getAllInvestors(page, limit) {
    return await investorRepository.findAll(page, limit);
  }

  async getInvestorById(id) {
    const investor = await investorRepository.findById(id);
    if (!investor) throw new ApiError(404, 'Investor not found');
    return investor;
  }

  async deleteInvestorById(id) {
    const deleted = await investorRepository.deleteById(id);
    if (!deleted) throw new ApiError(500, 'Failed to delete investor');
    return;
  }

  async getMyProfile(userId) {
    const investor = await investorRepository.findByUserId(userId);

    if (!investor) {
      throw new ApiError(404, 'Investor profile not found');
    }

    return investor;
  }
}

module.exports = new InvestorService();
