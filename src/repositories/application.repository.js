const Application = require('../models/application.model');

class ApplicationRepository {
  async create(data) {
    return await Application.create(data);
  }

  async findByJobId(jobId) {
    return await Application.find({ jobId }).sort({ createdAt: -1 });
  }

  async findAll() {
    return await Application.find()
      .sort({ createdAt: -1 })
      .populate('jobId', 'title department'); // optional: job info
  }
}

module.exports = new ApplicationRepository();
