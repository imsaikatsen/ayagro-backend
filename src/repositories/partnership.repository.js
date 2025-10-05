const Partnership = require('../models/partnership.model');

class PartnershipRepository {
  async create(data) {
    return await Partnership.create(data);
  }
  async findById(id) {
    return await Partnership.findById(id);
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const partnerships = await Partnership.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Partnership.countDocuments();
    return { partnerships, total, page, pages: Math.ceil(total / limit) };
  }

  async deleteById(id) {
    return await Partnership.findByIdAndDelete(id);
  }
}

module.exports = new PartnershipRepository();
