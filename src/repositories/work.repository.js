// repositories/work.repository.js
const Work = require('../models/work.model');

class WorkRepository {
  async create(data) {
    return await Work.create(data);
  }

  async findById(id) {
    return await Work.findById(id);
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const works = await Work.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Work.countDocuments();
    return { works, total, page, pages: Math.ceil(total / limit) };
  }

  async updateById(id, updateData) {
    return await Work.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      context: 'query',
    });
  }

  async deleteById(id) {
    return await Work.findByIdAndDelete(id);
  }
}

module.exports = new WorkRepository();
