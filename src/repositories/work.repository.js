// repositories/work.repository.js
const Work = require('../models/work.model');

class WorkRepository {
  async create(data) {
    return await Work.create(data);
  }

  async findById(id) {
    return await Work.findById(id);
  }

  async findAll(page = 1, limit = 10, region = null) {
    const skip = (page - 1) * limit;
    const query = region ? { region } : {};

    const works = await Work.find(query)
      .sort({ order: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Work.countDocuments();
    const totalPages = Math.ceil(total / limit);

    return {
      message: 'Works fetched successfully',
      total,
      page,
      limit,
      totalPages,
      data: { works },
    };
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

  async findLastOrder(region) {
    return await Work.findOne({ region }).sort({ order: -1 });
  }
}

module.exports = new WorkRepository();
