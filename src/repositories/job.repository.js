const Job = require('../models/job.model');

class JobRepository {
  async create(data) {
    return await Job.create(data);
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Job.countDocuments();
    return { jobs, total, page, pages: Math.ceil(total / limit) };
  }

  async findById(id) {
    return await Job.findById(id);
  }

  async updateById(id, updateData) {
    return await Job.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      context: 'query',
    });
  }

  async deleteById(id) {
    return await Job.findByIdAndDelete(id);
  }
}

module.exports = new JobRepository();
