// controllers/work.controller.js
const workService = require('../services/work.service');

class WorkController {
  async create(req, res, next) {
    try {
      const workData = req.body;
      if (req.file) workData.mediaUrl = req.file.filename;
      const work = await workService.createWork(workData);
      res.status(201).json({ message: 'Work created', data: work });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const region = req.query.region || null;
      const works = await workService.getAllWorks(page, limit, region);
      res.status(200).json({ message: 'Works fetched', data: works });
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const work = await workService.getWorkById(req.params.id);
      res.status(200).json({ message: 'Work fetched', data: work });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const updateData = req.body;
      if (req.file) updateData.mediaUrl = req.file.filename;
      const updated = await workService.updateWorkById(
        req.params.id,
        updateData
      );
      res.status(200).json({ message: 'Work updated', data: updated });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await workService.deleteWorkById(req.params.id);
      res.status(200).json({ message: 'Work deleted' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new WorkController();
