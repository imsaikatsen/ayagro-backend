const jobRepository = require('../repositories/job.repository');
const ApiError = require('../utils/apiError');

class JobService {
  async createJob(data) {
    return await jobRepository.create(data);
  }

  async getAllJobs(page, limit) {
    return await jobRepository.findAll(page, limit);
  }

  async getJobById(id) {
    const job = await jobRepository.findById(id);
    if (!job) throw new ApiError(404, 'Job not found');
    return job;
  }

  async updateJobById(id, data) {
    const updated = await jobRepository.updateById(id, data);
    if (!updated) throw new ApiError(500, 'Failed to update job');
    return updated;
  }

  async deleteJobById(id) {
    const deleted = await jobRepository.deleteById(id);
    if (!deleted) throw new ApiError(500, 'Failed to delete job');
    return;
  }
}

module.exports = new JobService();
