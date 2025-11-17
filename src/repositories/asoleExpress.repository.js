const AsoleExpress = require('../models/asoleExpress.model');

class AsoleExpressRepository {
  async create(data) {
    return await AsoleExpress.create(data);
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const items = await AsoleExpress.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await AsoleExpress.countDocuments();
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id) {
    return await AsoleExpress.findById(id);
  }

  async updateById(id, updateData) {
    return await AsoleExpress.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id) {
    return await AsoleExpress.findByIdAndDelete(id);
  }
}

module.exports = new AsoleExpressRepository();
