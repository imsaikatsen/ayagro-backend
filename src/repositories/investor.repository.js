const Investor = require('../models/investor.model');
const mongoose = require('mongoose');

class InvestorRepository {
  async create(data) {
    return await Investor.create(data);
  }

  async findById(id) {
    return await Investor.findById(id);
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const investors = await Investor.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Investor.countDocuments();
    return { investors, total, page, pages: Math.ceil(total / limit) };
  }

  async deleteById(id) {
    return await Investor.findByIdAndDelete(id);
  }
  async findByUserId(userId) {
    return await Investor.findOne({ userId }).populate(
      'userId',
      'firstName lastName email phone'
    );
  }
}

module.exports = new InvestorRepository();
