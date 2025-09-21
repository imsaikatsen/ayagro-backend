const Application = require('../models/application.model');

class ApplicationRepository {
  async create(data) {
    return await Application.create(data);
  }

  async findByJobId(jobId) {
    return await Application.find({ jobId }).sort({ createdAt: -1 });
  }
}

module.exports = new ApplicationRepository();
