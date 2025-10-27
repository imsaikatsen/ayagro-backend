const Application = require('../models/application.model');

class ApplicationRepository {
  async create(data) {
    return await Application.create(data);
  }

  async findByJobId(jobId) {
    return await Application.find({ jobId }).sort({ createdAt: -1 });
  }

  // async findAll() {
  //   return await Application.find()
  //     .sort({ createdAt: -1 })
  //     .populate('jobId', 'title department'); // optional: job info
  // }
  async findAll(page, limit) {
    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      Application.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('jobId', 'title department'),
      Application.countDocuments(),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      applications,
    };
  }
}

module.exports = new ApplicationRepository();
