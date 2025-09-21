const applicationRepository = require('../repositories/application.repository');

class ApplicationService {
  async applyForJob(data) {
    return await applicationRepository.create(data);
  }

  async getApplicationsByJob(jobId) {
    return await applicationRepository.findByJobId(jobId);
  }
}

module.exports = new ApplicationService();
