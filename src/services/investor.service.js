const investorRepository = require('../repositories/investor.repository');
const ApiError = require('../utils/apiError');
const Investment = require('../models/investment.model');

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

    const investments = await Investment.find({
      investorId: investor._id,
    }).lean();

    return {
      _id: investor._id,
      name: investor.name,
      email: investor.email,
      phone: investor.phone,
      profession: investor.profession,
      userId: investor.userId,
      investments,
    };
  }
}

module.exports = new InvestorService();
