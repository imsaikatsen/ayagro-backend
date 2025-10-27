const jobService = require('../services/job.service');

class JobController {
  async create(req, res, next) {
    try {
      const job = await jobService.createJob(req.body);
      res.status(201).json({ message: 'Job created', data: job });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const jobs = await jobService.getAllJobs(page, limit);
      // res.status(200).json({ message: 'Jobs fetched', data: jobs });
      res.status(200).json({
        message: 'Jobs fetched',
        data: {
          jobs: jobs.jobs,
          total: jobs.total,
          page: jobs.page,
          limit: jobs.limit,
          totalPages: jobs.totalPages,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const job = await jobService.getJobById(req.params.id);
      res.status(200).json({ message: 'Job fetched', data: job });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const updated = await jobService.updateJobById(req.params.id, req.body);
      res.status(200).json({ message: 'Job updated', data: updated });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await jobService.deleteJobById(req.params.id);
      res.status(200).json({ message: 'Job deleted' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new JobController();
