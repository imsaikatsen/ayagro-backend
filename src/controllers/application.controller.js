const applicationService = require('../services/application.service');

class ApplicationController {
  async apply(req, res, next) {
    try {
      const appData = req.body;
      if (req.file) appData.cv = req.file.filename;
      const application = await applicationService.applyForJob(appData);
      res
        .status(201)
        .json({ message: 'Application submitted', data: application });
    } catch (err) {
      next(err);
    }
  }

  async getByJob(req, res, next) {
    try {
      const applications = await applicationService.getApplicationsByJob(
        req.params.jobId
      );
      res
        .status(200)
        .json({ message: 'Applications fetched', data: applications });
    } catch (err) {
      next(err);
    }
  }

  async getAllApplications(req, res, next) {
    try {
      const applications = await applicationService.getAllApplications();
      res
        .status(200)
        .json({ message: 'Applications fetched', data: applications });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ApplicationController();
