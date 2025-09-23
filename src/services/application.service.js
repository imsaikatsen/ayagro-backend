const applicationRepository = require('../repositories/application.repository');

class ApplicationService {
  async applyForJob(data) {
    return await applicationRepository.create(data);
  }

  async getApplicationsByJob(jobId) {
    return await applicationRepository.findByJobId(jobId);
  }

  async getAllApplications() {
    // populate job info (title, department) if needed
    return await applicationRepository.findAll();
  }
}

module.exports = new ApplicationService();
